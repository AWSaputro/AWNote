<script lang="ts">
	import type { Note, Folder } from '#lib/types/note';

	interface Props {
		note: Note;
		folder?: Folder;
		viewMode: 'grid' | 'list';
		onOpen: (note: Note) => void;
		onToggleFavorite: (note: Note) => void;
		onDelete: (note: Note) => void;
		onRestore?: (note: Note) => void;
	}

	let {
		note,
		folder,
		viewMode = 'grid',
		onOpen,
		onToggleFavorite,
		onDelete,
		onRestore
	}: Props = $props();

	function formatDate(timestamp: number): string {
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'Baru saja';
		if (minutes < 60) return `${minutes} mnt lalu`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} jam lalu`;
		const days = Math.floor(hours / 24);
		if (days < 7) return `${days} hari lalu`;
		return new Date(timestamp).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short'
		});
	}
</script>

{#if viewMode === 'grid'}
	<div
		role="button"
		tabindex="0"
		class="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-150 overflow-hidden text-left cursor-pointer"
		onclick={() => onOpen(note)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onOpen(note);
			}
		}}
	>
		<!-- Visual Thumbnail Preview -->
		<div class="w-full h-44 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
			{#if note.thumbnail}
				<div class="w-full h-full flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-200">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html note.thumbnail}
				</div>
			{:else}
				<div class="text-xs text-slate-400 font-mono italic">Kosong</div>
			{/if}
		</div>

		<!-- Card Content -->
		<div class="p-3 flex flex-col justify-between flex-1">
			<div class="flex items-start justify-between gap-2">
				<h3 class="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate flex-1">
					{note.title || 'Catatan Tanpa Judul'}
				</h3>
				
				<!-- Favorite Star Button -->
				{#if !note.isTrash}
					<button
						type="button"
						class="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
						onclick={(e) => {
							e.stopPropagation();
							onToggleFavorite(note);
						}}
						title={note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
						aria-label={note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
					>
						<svg class="w-4 h-4 {note.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</button>
				{/if}
			</div>

			<div class="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
				<div class="flex items-center gap-1.5 truncate">
					{#if folder}
						<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 truncate max-w-[90px]">
							<span class="w-1.5 h-1.5 rounded-full" style="background-color: {folder.color};"></span>
							<span class="truncate">{folder.name}</span>
						</span>
					{/if}
					<span class="text-[11px] font-mono">{formatDate(note.updatedAt)}</span>
				</div>

				<!-- Action Menu -->
				<div>
					{#if note.isTrash}
						<button
							type="button"
							class="text-[11px] font-medium text-emerald-600 hover:underline"
							onclick={(e) => {
								e.stopPropagation();
								onRestore?.(note);
							}}
						>
							Pulihkan
						</button>
					{:else}
						<button
							type="button"
							class="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700"
							onclick={(e) => {
								e.stopPropagation();
								onDelete(note);
							}}
							title="Pindahkan ke Sampah"
							aria-label="Pindahkan ke Sampah"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- List Mode -->
	<div
		role="button"
		tabindex="0"
		class="group flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-sm transition-all cursor-pointer"
		onclick={() => onOpen(note)}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onOpen(note);
			}
		}}
	>
		<div class="flex items-center gap-3.5 min-w-0">
			<!-- Mini Thumbnail -->
			<div class="w-12 h-14 min-w-[48px] rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-1">
				{#if note.thumbnail}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html note.thumbnail}
				{:else}
					<span class="text-[9px] text-slate-400">Kosong</span>
				{/if}
			</div>

			<div class="min-w-0">
				<h3 class="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
					{note.title || 'Catatan Tanpa Judul'}
				</h3>
				<div class="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
					{#if folder}
						<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
							<span class="w-1.5 h-1.5 rounded-full" style="background-color: {folder.color};"></span>
							<span>{folder.name}</span>
						</span>
					{/if}
					<span class="font-mono text-[11px]">{formatDate(note.updatedAt)}</span>
					<span class="text-slate-300 dark:text-slate-600">•</span>
					<span class="text-[11px]">{note.strokes.length} goresan</span>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-1">
			{#if !note.isTrash}
				<button
					type="button"
					class="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700"
					onclick={(e) => {
						e.stopPropagation();
						onToggleFavorite(note);
					}}
					title={note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
					aria-label={note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}
				>
					<svg class="w-4 h-4 {note.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				</button>
				<button
					type="button"
					class="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700"
					onclick={(e) => {
						e.stopPropagation();
						onDelete(note);
					}}
					title="Pindahkan ke Sampah"
					aria-label="Pindahkan ke Sampah"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
			{:else}
				<button
					type="button"
					class="px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100"
					onclick={(e) => {
						e.stopPropagation();
						onRestore?.(note);
					}}
				>
					Pulihkan
				</button>
			{/if}
		</div>
	</div>
{/if}
