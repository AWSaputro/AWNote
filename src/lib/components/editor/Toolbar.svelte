<script lang="ts">
	import type { ToolType, PencilGrade, PaperTemplate } from '#lib/types/canvas';

	interface Props {
		currentTool: ToolType;
		currentColor: string;
		currentSize: number;
		currentPencilGrade: PencilGrade;
		eraserMode: 'stroke' | 'pixel';
		eraserRadius: number;
		paperTemplate: PaperTemplate;
		isDarkPaper: boolean;
		canUndo: boolean;
		canRedo: boolean;
		onToolSelect: (tool: ToolType) => void;
		onColorSelect: (color: string) => void;
		onSizeSelect: (size: number) => void;
		onPencilGradeSelect: (grade: PencilGrade) => void;
		onEraserModeToggle: () => void;
		onPaperTemplateSelect: (template: PaperTemplate) => void;
		onDarkPaperToggle: () => void;
		onUndo: () => void;
		onRedo: () => void;
		onClear: () => void;
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
		canUndo = false,
		canRedo = false,
		onToolSelect,
		onColorSelect,
		onSizeSelect,
		onPencilGradeSelect,
		onEraserModeToggle,
		onPaperTemplateSelect,
		onDarkPaperToggle,
		onUndo,
		onRedo,
		onClear
	}: Props = $props();

	let showToolOptions = $state(false);

	const pencilGrades: PencilGrade[] = ['2H', 'H', 'HB', 'B', '2B', '4B', '6B'];

	const penColors = [
		'#0f172a', // Black/Slate
		'#2563eb', // Blue
		'#dc2626', // Red
		'#16a34a', // Green
		'#9333ea', // Purple
		'#f59e0b'  // Amber
	];

	const highlighterColors = [
		'#facc15', // Neon Yellow
		'#4ade80', // Neon Green
		'#38bdf8', // Sky Blue
		'#f472b6', // Pink
		'#fb923c'  // Orange
	];
</script>

<div class="flex flex-col items-center gap-2 select-none">
	<!-- Sleek Island Floating Toolbar -->
	<nav class="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 transition-all">
		
		<!-- Pen Tool -->
		<button
			type="button"
			class="p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-medium {currentTool === 'pen' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}"
			onclick={() => {
				onToolSelect('pen');
				showToolOptions = !showToolOptions || currentTool !== 'pen';
			}}
			title="Pen (Stylus / Solid Ink)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
			</svg>
			<span class="hidden md:inline">Pen</span>
		</button>

		<!-- Pencil Tool -->
		<button
			type="button"
			class="p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-medium {currentTool === 'pencil' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}"
			onclick={() => {
				onToolSelect('pencil');
				showToolOptions = !showToolOptions || currentTool !== 'pencil';
			}}
			title="Pencil (2H - 6B Grades)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
			</svg>
			<span class="hidden md:inline">Pensil ({currentPencilGrade})</span>
		</button>

		<!-- Highlighter Tool -->
		<button
			type="button"
			class="p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-medium {currentTool === 'highlighter' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}"
			onclick={() => {
				onToolSelect('highlighter');
				showToolOptions = !showToolOptions || currentTool !== 'highlighter';
			}}
			title="Highlighter / Stabilo (Multiply Blend)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
			</svg>
			<span class="hidden md:inline">Stabilo</span>
		</button>

		<!-- Eraser Tool -->
		<button
			type="button"
			class="p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all text-sm font-medium {currentTool === 'eraser' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}"
			onclick={() => {
				onToolSelect('eraser');
				showToolOptions = !showToolOptions || currentTool !== 'eraser';
			}}
			title="Penghapus ({eraserMode === 'stroke' ? 'Stroke' : 'Pixel'})"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
			</svg>
			<span class="hidden md:inline">Penghapus</span>
		</button>

		<div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

		<!-- Undo Button -->
		<button
			type="button"
			class="p-2 rounded-xl transition-all disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:hover:bg-transparent"
			disabled={!canUndo}
			onclick={onUndo}
			title="Undo (Ctrl+Z)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4" />
			</svg>
		</button>

		<!-- Redo Button -->
		<button
			type="button"
			class="p-2 rounded-xl transition-all disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:hover:bg-transparent"
			disabled={!canRedo}
			onclick={onRedo}
			title="Redo (Ctrl+Y)"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
			</svg>
		</button>

		<div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

		<!-- Paper Template Selector -->
		<select
			class="text-xs bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-1 focus:ring-indigo-500"
			value={paperTemplate}
			onchange={(e) => onPaperTemplateSelect((e.target as HTMLSelectElement).value as PaperTemplate)}
			title="Template Kertas"
		>
			<option value="ruled">Bergaris</option>
			<option value="grid">Kotak (Grid)</option>
			<option value="blank">Polos</option>
		</select>

		<!-- Dark Paper Toggle -->
		<button
			type="button"
			class="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
			onclick={onDarkPaperToggle}
			title={isDarkPaper ? 'Ganti ke Kertas Terang' : 'Ganti ke Kertas Gelap'}
		>
			{#if isDarkPaper}
				<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
				</svg>
			{:else}
				<svg class="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			{/if}
		</button>

		<!-- Clear Canvas -->
		<button
			type="button"
			class="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
			onclick={onClear}
			title="Bersihkan Semua Coretan"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
			</svg>
		</button>
	</nav>

	<!-- Sub-options Bar (Colors, Grade, or Size Slider) -->
	{#if showToolOptions}
		<div class="flex items-center gap-3 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300">
			{#if currentTool === 'pen'}
				<div class="flex items-center gap-1.5">
					<span class="font-medium text-slate-500">Warna:</span>
					{#each penColors as color}
						<button
							type="button"
							aria-label="Pilih warna {color}"
							class="w-5 h-5 rounded-full border-2 transition-transform {currentColor === color ? 'scale-125 border-indigo-600 ring-2 ring-indigo-300' : 'border-white dark:border-slate-700'}"
							style="background-color: {color};"
							onclick={() => onColorSelect(color)}
						></button>
					{/each}
				</div>

				<div class="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

				<div class="flex items-center gap-2">
					<span class="font-medium text-slate-500">Ukuran:</span>
					<input
						type="range"
						min="1"
						max="20"
						value={currentSize}
						oninput={(e) => onSizeSelect(Number((e.target as HTMLInputElement).value))}
						class="w-24 accent-indigo-600 cursor-pointer"
					/>
					<span class="w-4 font-mono">{currentSize}px</span>
				</div>

			{:else if currentTool === 'pencil'}
				<div class="flex items-center gap-1">
					<span class="font-medium text-slate-500 mr-1">Grade:</span>
					{#each pencilGrades as grade}
						<button
							type="button"
							class="px-2 py-0.5 rounded font-mono font-bold transition-all {currentPencilGrade === grade ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}"
							onclick={() => onPencilGradeSelect(grade)}
						>
							{grade}
						</button>
					{/each}
				</div>

			{:else if currentTool === 'highlighter'}
				<div class="flex items-center gap-1.5">
					<span class="font-medium text-slate-500">Warna Stabilo:</span>
					{#each highlighterColors as color}
						<button
							type="button"
							aria-label="Pilih warna stabilo {color}"
							class="w-6 h-6 rounded-full border-2 transition-transform opacity-80 {currentColor === color ? 'scale-125 border-indigo-600 ring-2 ring-indigo-300' : 'border-white dark:border-slate-700'}"
							style="background-color: {color};"
							onclick={() => onColorSelect(color)}
						></button>
					{/each}
				</div>

				<div class="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

				<div class="flex items-center gap-2">
					<span class="font-medium text-slate-500">Tebal:</span>
					<input
						type="range"
						min="10"
						max="48"
						value={currentSize}
						oninput={(e) => onSizeSelect(Number((e.target as HTMLInputElement).value))}
						class="w-24 accent-indigo-600 cursor-pointer"
					/>
					<span class="w-6 font-mono">{currentSize}px</span>
				</div>

			{:else if currentTool === 'eraser'}
				<div class="flex items-center gap-2">
					<span class="font-medium text-slate-500">Mode:</span>
					<button
						type="button"
						class="px-2.5 py-1 rounded font-medium transition-all {eraserMode === 'stroke' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}"
						onclick={() => onEraserModeToggle()}
					>
						Stroke Eraser (Hapus Satu Garis)
					</button>
					<button
						type="button"
						class="px-2.5 py-1 rounded font-medium transition-all {eraserMode === 'pixel' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}"
						onclick={() => onEraserModeToggle()}
					>
						Pixel Eraser (Hapus Sebagian)
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
