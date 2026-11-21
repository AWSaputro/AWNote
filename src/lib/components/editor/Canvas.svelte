<script lang="ts">
	import { onMount } from 'svelte';
	import type { Stroke, ToolType, PencilGrade, PaperTemplate, Point } from '#lib/types/canvas';
	import { renderStrokeToContext } from '#lib/engine/inking';
	import { optimizeStrokePoints, strokeIntersectsCircle } from '#lib/engine/rdp';

	interface Props {
		currentTool?: ToolType;
		currentColor?: string;
		currentSize?: number;
		currentPencilGrade?: PencilGrade;
		eraserMode?: 'stroke' | 'pixel';
		eraserRadius?: number;
		paperTemplate?: PaperTemplate;
		isDarkPaper?: boolean;
		onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
	}

	let {
		currentTool = 'pen',
		currentColor = '#1e293b',
		currentSize = 4,
		currentPencilGrade = '2B',
		eraserMode = 'stroke',
		eraserRadius = 16,
		paperTemplate = 'ruled',
		isDarkPaper = false,
		onHistoryChange
	}: Props = $props();

	let containerEl: HTMLDivElement | null = null;
	let baseCanvas: HTMLCanvasElement | null = null;
	let activeCanvas: HTMLCanvasElement | null = null;
	let baseCtx: CanvasRenderingContext2D | null = null;
	let activeCtx: CanvasRenderingContext2D | null = null;

	let width = $state(1200);
	let height = $state(1600);
	let dpr = 1;

	// Vector stroke history
	let strokes = $state<Stroke[]>([]);
	let redoStack = $state<Stroke[][]>([]);
	let historyPast = $state<Stroke[][]>([]);

	let isDrawing = false;
	let currentPoints: Point[] = [];
	let activePointerId: number | null = null;

	export function undo() {
		if (strokes.length === 0 && historyPast.length === 0) return;
		
		redoStack = [...redoStack, [...strokes]];
		if (historyPast.length > 0) {
			strokes = historyPast[historyPast.length - 1];
			historyPast = historyPast.slice(0, -1);
		} else {
			strokes = strokes.slice(0, -1);
		}

		redrawAllStrokes();
		notifyHistory();
	}

	export function redo() {
		if (redoStack.length === 0) return;

		historyPast = [...historyPast, [...strokes]];
		const nextState = redoStack[redoStack.length - 1];
		redoStack = redoStack.slice(0, -1);
		strokes = nextState;

		redrawAllStrokes();
		notifyHistory();
	}

	export function clearCanvas() {
		if (strokes.length === 0) return;
		saveToHistory();
		strokes = [];
		redrawAllStrokes();
		notifyHistory();
	}

	function saveToHistory() {
		historyPast = [...historyPast, [...strokes]];
		redoStack = [];
	}

	function notifyHistory() {
		onHistoryChange?.(
			strokes.length > 0 || historyPast.length > 0,
			redoStack.length > 0
		);
	}

	function setupCanvasSize() {
		if (!containerEl || !baseCanvas || !activeCanvas) return;
		dpr = window.devicePixelRatio || 1;
		const rect = containerEl.getBoundingClientRect();
		width = Math.max(800, Math.floor(rect.width));
		height = Math.max(1000, Math.floor(rect.height));

		[baseCanvas, activeCanvas].forEach((cv) => {
			cv.width = width * dpr;
			cv.height = height * dpr;
			cv.style.width = `${width}px`;
			cv.style.height = `${height}px`;
		});

		baseCtx = baseCanvas.getContext('2d');
		activeCtx = activeCanvas.getContext('2d');

		if (baseCtx) baseCtx.scale(dpr, dpr);
		if (activeCtx) activeCtx.scale(dpr, dpr);

		redrawAllStrokes();
	}

	export function redrawAllStrokes() {
		if (!baseCtx) return;
		baseCtx.clearRect(0, 0, width, height);

		for (const stroke of strokes) {
			renderStrokeToContext(baseCtx, stroke);
		}
	}

	function getPointerPos(e: PointerEvent): Point {
		if (!activeCanvas) return { x: e.offsetX, y: e.offsetY, pressure: e.pressure || 0.5 };
		const rect = activeCanvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// Fallback pressure if pointer doesn't provide pressure (e.g. standard mouse)
		let pressure = e.pressure;
		if (pressure === 0 || pressure === undefined) {
			pressure = 0.5;
		}
		return { x, y, pressure };
	}

	function handlePointerDown(e: PointerEvent) {
		// Only primary button or stylus touch
		if (e.button !== 0) return;

		// Palm rejection: if already drawing with pen, ignore touch
		if (isDrawing && activePointerId !== null && e.pointerId !== activePointerId) {
			return;
		}

		activeCanvas?.setPointerCapture(e.pointerId);
		activePointerId = e.pointerId;
		isDrawing = true;

		const point = getPointerPos(e);

		if (currentTool === 'eraser') {
			saveToHistory();
			handleEraserAtPoint(point.x, point.y);
			return;
		}

		currentPoints = [point];
		if (activeCtx) {
			activeCtx.clearRect(0, 0, width, height);
			const tempStroke: Stroke = {
				id: 'active',
				tool: currentTool,
				color: currentColor,
				size: currentSize,
				pencilGrade: currentPencilGrade,
				points: currentPoints
			};
			renderStrokeToContext(activeCtx, tempStroke);
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDrawing || e.pointerId !== activePointerId) return;

		const point = getPointerPos(e);

		if (currentTool === 'eraser') {
			handleEraserAtPoint(point.x, point.y);
			return;
		}

		currentPoints.push(point);

		// Render active stroke directly to active canvas overlay (no re-renders of base canvas)
		if (activeCtx) {
			activeCtx.clearRect(0, 0, width, height);
			const tempStroke: Stroke = {
				id: 'active',
				tool: currentTool,
				color: currentColor,
				size: currentSize,
				pencilGrade: currentPencilGrade,
				points: currentPoints
			};
			renderStrokeToContext(activeCtx, tempStroke);
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDrawing || e.pointerId !== activePointerId) return;
		isDrawing = false;
		activePointerId = null;

		if (activeCanvas?.hasPointerCapture(e.pointerId)) {
			activeCanvas.releasePointerCapture(e.pointerId);
		}

		if (currentTool === 'eraser') {
			notifyHistory();
			return;
		}

		if (currentPoints.length > 0) {
			saveToHistory();
			// Simplify stroke using RDP algorithm for points > 30 to respect performance budget
			const finalPoints = optimizeStrokePoints(currentPoints, 30, 0.5);

			const newStroke: Stroke = {
				id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				tool: currentTool,
				color: currentColor,
				size: currentSize,
				pencilGrade: currentPencilGrade,
				points: finalPoints
			};

			strokes = [...strokes, newStroke];

			if (baseCtx) {
				renderStrokeToContext(baseCtx, newStroke);
			}

			if (activeCtx) {
				activeCtx.clearRect(0, 0, width, height);
			}

			currentPoints = [];
			notifyHistory();
		}
	}

	function handlePointerCancel(e: PointerEvent) {
		if (e.pointerId === activePointerId) {
			isDrawing = false;
			activePointerId = null;
			currentPoints = [];
			if (activeCtx) {
				activeCtx.clearRect(0, 0, width, height);
			}
		}
	}

	function handleEraserAtPoint(x: number, y: number) {
		let modified = false;

		if (eraserMode === 'stroke') {
			const remainingStrokes = strokes.filter((stroke) => {
				const hit = strokeIntersectsCircle(stroke.points, { x, y }, eraserRadius);
				if (hit) modified = true;
				return !hit;
			});

			if (modified) {
				strokes = remainingStrokes;
				redrawAllStrokes();
			}
		} else {
			// Pixel eraser mode: clear a circular area on base canvas and filter/split
			if (baseCtx) {
				baseCtx.save();
				baseCtx.globalCompositeOperation = 'destination-out';
				baseCtx.beginPath();
				baseCtx.arc(x, y, eraserRadius, 0, Math.PI * 2);
				baseCtx.fill();
				baseCtx.restore();
			}
		}
	}

	onMount(() => {
		setupCanvasSize();
		window.addEventListener('resize', setupCanvasSize);
		return () => {
			window.removeEventListener('resize', setupCanvasSize);
		};
	});

	$effect(() => {
		// When paper template or color mode changes
		paperTemplate;
		isDarkPaper;
	});
</script>

<div
	bind:this={containerEl}
	class="relative w-full h-full min-h-[600px] overflow-hidden select-none touch-none rounded-lg shadow-sm transition-colors duration-200"
	class:bg-white={!isDarkPaper}
	class:bg-slate-900={isDarkPaper}
>
	<!-- Paper Template Background Layer -->
	{#if paperTemplate === 'ruled'}
		<div
			class="absolute inset-0 pointer-events-none"
			style="background-image: linear-gradient({isDarkPaper ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px); background-size: 100% 32px; background-position: 0 40px;"
		></div>
	{:else if paperTemplate === 'grid'}
		<div
			class="absolute inset-0 pointer-events-none"
			style="background-image: 
				linear-gradient({isDarkPaper ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px),
				linear-gradient(90deg, {isDarkPaper ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px);
				background-size: 28px 28px;"
		></div>
	{/if}

	<!-- Base Canvas (Committed Strokes) -->
	<canvas
		bind:this={baseCanvas}
		class="absolute top-0 left-0 w-full h-full pointer-events-none"
	></canvas>

	<!-- Active Canvas (Overlay for Active Drawing & Events) -->
	<canvas
		bind:this={activeCanvas}
		class="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerCancel}
	></canvas>
</div>
