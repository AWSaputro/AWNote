<script lang="ts">
	import Canvas from '#lib/components/editor/Canvas.svelte';
	import Toolbar from '#lib/components/editor/Toolbar.svelte';
	import type { ToolType, PencilGrade, PaperTemplate } from '#lib/types/canvas';

	let canvasRef: Canvas | null = null;

	let currentTool = $state<ToolType>('pen');
	let currentColor = $state<string>('#1e293b');
	let currentSize = $state<number>(4);
	let currentPencilGrade = $state<PencilGrade>('2B');
	let eraserMode = $state<'stroke' | 'pixel'>('stroke');
	let eraserRadius = $state<number>(18);
	let paperTemplate = $state<PaperTemplate>('ruled');
	let isDarkPaper = $state<boolean>(false);

	let canUndo = $state(false);
	let canRedo = $state(false);
	let isBottomBarCollapsed = $state(false);

	function handleToolSelect(tool: ToolType) {
		currentTool = tool;
		if (tool === 'pencil') {
			currentColor = '#475569';
		} else if (tool === 'highlighter') {
			currentColor = '#facc15';
			currentSize = 24;
		} else if (tool === 'pen' && currentColor === '#facc15') {
			currentColor = '#1e293b';
			currentSize = 4;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		// Undo: Ctrl+Z or Cmd+Z (without Shift)
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
			e.preventDefault();
			canvasRef?.undo();
		}
		// Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
		else if (
			((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
			((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
		) {
			e.preventDefault();
			canvasRef?.redo();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
	<!-- Top Bar / App Header -->
	<header class="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-20">
		<div class="flex items-center gap-2">
			<div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
				Aw
			</div>
			<div>
				<h1 class="text-sm font-semibold leading-tight">AwNotes</h1>
				<p class="text-[10px] text-slate-500 font-mono">v0.1.0 • Core Inking Engine</p>
			</div>
		</div>

		<div class="flex items-center gap-2 text-xs">
			<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
				Offline-First (0ms)
			</span>
		</div>
	</header>

	<!-- Main Workspace Area with Sleek Island Toolbar Floating on Top -->
	<div class="relative flex-1 w-full h-full p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
		
		<!-- Floating Island Toolbar -->
		<div class="absolute top-4 sm:top-6 z-30 transition-all">
			<Toolbar
				{currentTool}
				{currentColor}
				{currentSize}
				{currentPencilGrade}
				{eraserMode}
				{eraserRadius}
				{paperTemplate}
				{isDarkPaper}
				{canUndo}
				{canRedo}
				onToolSelect={handleToolSelect}
				onColorSelect={(color: string) => (currentColor = color)}
				onSizeSelect={(size: number) => (currentSize = size)}
				onPencilGradeSelect={(grade: PencilGrade) => (currentPencilGrade = grade)}
				onEraserModeToggle={() => (eraserMode = eraserMode === 'stroke' ? 'pixel' : 'stroke')}
				onPaperTemplateSelect={(tpl: PaperTemplate) => (paperTemplate = tpl)}
				onDarkPaperToggle={() => (isDarkPaper = !isDarkPaper)}
				onUndo={() => canvasRef?.undo()}
				onRedo={() => canvasRef?.redo()}
				onClear={() => canvasRef?.clearCanvas()}
			/>
		</div>

		<!-- Interactive Canvas Component -->
		<div class="w-full h-full max-w-6xl max-h-[92vh] rounded-2xl shadow-xl overflow-hidden border border-slate-300/80 dark:border-slate-800">
			<Canvas
				bind:this={canvasRef}
				{currentTool}
				{currentColor}
				{currentSize}
				{currentPencilGrade}
				{eraserMode}
				{eraserRadius}
				{paperTemplate}
				{isDarkPaper}
				onHistoryChange={(undoable: boolean, redoable: boolean) => {
					canUndo = undoable;
					canRedo = redoable;
				}}
			/>
		</div>

		<!-- Collapsible Bottom Status Bar -->
		<div class="absolute bottom-3 right-4 z-20 flex flex-col items-end">
			{#if !isBottomBarCollapsed}
				<div class="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
					<span class="capitalize">Alat: <strong class="text-indigo-600 dark:text-indigo-400">{currentTool}</strong></span>
					<span class="text-slate-300 dark:text-slate-600">|</span>
					<span>Pintasan: <kbd class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Ctrl+Z</kbd> / <kbd class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Ctrl+Y</kbd></span>
					<button
						type="button"
						class="ml-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600"
						onclick={() => (isBottomBarCollapsed = true)}
						title="Ciutkan Bilah Bawah"
					>
						[ ⌄ ]
					</button>
				</div>
			{:else}
				<button
					type="button"
					class="px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100"
					onclick={() => (isBottomBarCollapsed = false)}
					title="Buka Status"
				>
					[ ⌃ ]
				</button>
			{/if}
		</div>
	</div>
</main>
