<script lang="ts">
	import Canvas from './Canvas.svelte';
	import Toolbar from './Toolbar.svelte';
	import type { ToolType, PencilGrade, PaperTemplate } from '#lib/types/canvas';
	import type { Note, Folder, SyncStatus } from '#lib/types/note';
	import { updateNote } from '#lib/db/notes';

	interface Props {
		note: Note;
		folders: Folder[];
		onBackToDashboard: () => void;
	}

	let { note, folders, onBackToDashboard }: Props = $props();

	let canvasRef: Canvas | null = null;

	let currentTitle = $state('');
	let currentTool = $state<ToolType>('pen');
	let currentColor = $state<string>('#1e293b');
	let currentSize = $state<number>(4);
	let currentPencilGrade = $state<PencilGrade>('2B');
	let eraserMode = $state<'stroke' | 'pixel'>('stroke');
	let eraserRadius = $state<number>(18);
	let paperTemplate = $state<PaperTemplate>('ruled');
	let isDarkPaper = $state<boolean>(false);
	let selectedFolderId = $state<string | null>(null);

	let syncStatus = $state<SyncStatus>('local_only');
	let canUndo = $state(false);
	let canRedo = $state(false);
	let isBottomBarCollapsed = $state(false);

	$effect(() => {
		currentTitle = note.title;
		paperTemplate = note.paperTemplate || 'ruled';
		isDarkPaper = note.isDarkPaper || false;
		selectedFolderId = note.folderId;
		syncStatus = note.syncStatus || 'local_only';
	});

	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	async function persistNoteChanges(updates: Partial<Note>) {
		syncStatus = 'modified';
		try {
			await updateNote(note.id, updates);
			syncStatus = 'local_only';
		} catch (err) {
			console.error('Error saving note to Dexie:', err);
		}
	}

	function handleTitleChange(newTitle: string) {
		currentTitle = newTitle;
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			persistNoteChanges({ title: newTitle });
		}, 300);
	}

	function handleFolderChange(folderId: string | null) {
		selectedFolderId = folderId;
		persistNoteChanges({ folderId });
	}

	function handleStrokesChange(strokes: typeof note.strokes) {
		persistNoteChanges({
			strokes,
			paperTemplate,
			isDarkPaper
		});
	}

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

	function handlePaperTemplateChange(template: PaperTemplate) {
		paperTemplate = template;
		persistNoteChanges({ paperTemplate: template });
	}

	function handleDarkPaperToggle() {
		isDarkPaper = !isDarkPaper;
		persistNoteChanges({ isDarkPaper });
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
			e.preventDefault();
			canvasRef?.undo();
		} else if (
			((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
			((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
		) {
			e.preventDefault();
			canvasRef?.redo();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
	<!-- Workspace Top Bar -->
	<header class="h-14 px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3 z-20">
		<div class="flex items-center gap-3 min-w-0">
			<!-- Back to Dashboard -->
			<button
				type="button"
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0"
				onclick={onBackToDashboard}
				title="Kembali ke Dashboard"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span class="hidden sm:inline">Dashboard</span>
			</button>

			<div class="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 shrink-0"></div>

			<!-- Title Input -->
			<input
				type="text"
				value={currentTitle}
				oninput={(e) => handleTitleChange((e.target as HTMLInputElement).value)}
				placeholder="Judul Catatan..."
				class="font-semibold text-sm sm:text-base bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 truncate max-w-[180px] sm:max-w-xs md:max-w-md"
			/>
		</div>

		<!-- Right Side Status & Folder Selector -->
		<div class="flex items-center gap-2 text-xs shrink-0">
			<!-- Folder Selector -->
			<select
				class="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 cursor-pointer hidden md:inline-block"
				value={selectedFolderId || ''}
				onchange={(e) => handleFolderChange((e.target as HTMLSelectElement).value || null)}
				title="Pilih Folder"
			>
				<option value="">Tanpa Folder</option>
				{#each folders as f}
					<option value={f.id}>{f.name}</option>
				{/each}
			</select>

			<!-- Sync Status Indicator -->
			{#if syncStatus === 'modified'}
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-medium">
					<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
					<span class="hidden sm:inline">Menyimpan...</span>
				</span>
			{:else}
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
					<span class="hidden sm:inline">Tersimpan (0ms)</span>
				</span>
			{/if}
		</div>
	</header>

	<!-- Main Workspace Area -->
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
				onPaperTemplateSelect={handlePaperTemplateChange}
				onDarkPaperToggle={handleDarkPaperToggle}
				onUndo={() => canvasRef?.undo()}
				onRedo={() => canvasRef?.redo()}
				onClear={() => canvasRef?.clearCanvas()}
			/>
		</div>

		<!-- Interactive Canvas Component -->
		<div class="w-full h-full max-w-6xl max-h-[92vh] rounded-2xl shadow-xl overflow-hidden border border-slate-300/80 dark:border-slate-800">
			<Canvas
				bind:this={canvasRef}
				initialStrokes={note.strokes}
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
				onStrokesChange={handleStrokesChange}
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
</div>
