<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import FAB from './FAB.svelte';
	import NoteCard from './NoteCard.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import FolderModal from './FolderModal.svelte';
	import type { Note, Folder } from '#lib/types/note';

	interface Props {
		notes: Note[];
		folders: Folder[];
		currentView: 'all' | 'favorites' | 'trash';
		selectedFolderId: string | null;
		searchQuery: string;
		onSelectView: (view: 'all' | 'favorites' | 'trash') => void;
		onSelectFolder: (folderId: string | null) => void;
		onSearch: (query: string) => void;
		onOpenNote: (note: Note) => void;
		onCreateNote: () => void;
		onToggleFavorite: (note: Note) => void;
		onDeleteNote: (note: Note) => void;
		onRestoreNote: (note: Note) => void;
		onCreateFolder: (name: string, color: string) => void;
	}

	let {
		notes,
		folders,
		currentView,
		selectedFolderId,
		searchQuery,
		onSelectView,
		onSelectFolder,
		onSearch,
		onOpenNote,
		onCreateNote,
		onToggleFavorite,
		onDeleteNote,
		onRestoreNote,
		onCreateFolder
	}: Props = $props();

	let viewMode = $state<'grid' | 'list'>('grid');
	let isMobileSidebarOpen = $state(false);
	let isSettingsOpen = $state(false);
	let isFolderModalOpen = $state(false);

	const activeFolder = $derived(
		selectedFolderId ? folders.find((f) => f.id === selectedFolderId) : null
	);

	const viewTitle = $derived(
		currentView === 'favorites'
			? 'Catatan Favorit'
			: currentView === 'trash'
				? 'Sampah'
				: activeFolder
					? `Folder: ${activeFolder.name}`
					: 'Semua Catatan'
	);
</script>

<div class="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
	<!-- Sidebar -->
	<Sidebar
		{currentView}
		{selectedFolderId}
		{folders}
		notesCount={notes.length}
		isMobileOpen={isMobileSidebarOpen}
		onSelectView={(v) => {
			onSelectView(v);
			isMobileSidebarOpen = false;
		}}
		onSelectFolder={(id) => {
			onSelectFolder(id);
			isMobileSidebarOpen = false;
		}}
		onCreateFolder={() => (isFolderModalOpen = true)}
		onOpenSettings={() => (isSettingsOpen = true)}
		onCloseMobile={() => (isMobileSidebarOpen = false)}
	/>

	<!-- Main Content Area -->
	<div class="flex-1 flex flex-col h-full overflow-hidden">
		<!-- Top Dashboard Navbar -->
		<header class="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 z-10">
			<div class="flex items-center gap-3">
				<!-- Mobile Menu Button -->
				<button
					type="button"
					class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
					onclick={() => (isMobileSidebarOpen = true)}
					aria-label="Buka menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>

				<div class="flex items-center gap-2">
					<div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
						Aw
					</div>
					<span class="font-bold text-base tracking-tight hidden sm:inline">AwNotes</span>
				</div>
			</div>

			<!-- Search Bar -->
			<div class="flex-1 max-w-md">
				<div class="relative">
					<svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						value={searchQuery}
						oninput={(e) => onSearch((e.target as HTMLInputElement).value)}
						placeholder="Cari catatan berdasarkan judul atau tag..."
						class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
					/>
				</div>
			</div>

			<!-- Backup Status & View Toggles -->
			<div class="flex items-center gap-3">
				<!-- Backup Status -->
				<span class="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
					<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
					Lokal (100% Offline)
				</span>

				<!-- View Mode Toggle (Grid vs List) -->
				<div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
					<button
						type="button"
						class="p-1.5 rounded-lg transition-colors {viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}"
						onclick={() => (viewMode = 'grid')}
						title="Tampilan Grid"
						aria-label="Tampilan Grid"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					</button>
					<button
						type="button"
						class="p-1.5 rounded-lg transition-colors {viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}"
						onclick={() => (viewMode = 'list')}
						title="Tampilan List"
						aria-label="Tampilan List"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
		</header>

		<!-- Subheader & Notes Content -->
		<div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
			<div class="max-w-7xl mx-auto">
				<!-- Section Title -->
				<div class="flex items-center justify-between mb-6">
					<div>
						<h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
							<span>{viewTitle}</span>
							<span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
								{notes.length}
							</span>
						</h2>
					</div>
				</div>

				<!-- Notes Listing -->
				{#if notes.length > 0}
					<div
						class={viewMode === 'grid'
							? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
							: 'space-y-2.5 max-w-4xl'}
					>
						{#each notes as note (note.id)}
							<NoteCard
								{note}
								folder={folders.find((f) => f.id === note.folderId)}
								{viewMode}
								onOpen={onOpenNote}
								onToggleFavorite={onToggleFavorite}
								onDelete={onDeleteNote}
								onRestore={onRestoreNote}
							/>
						{/each}
					</div>
				{:else}
					<!-- Empty State -->
					<div class="flex flex-col items-center justify-center py-20 text-center">
						<div class="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 mb-4">
							<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</div>
						<h3 class="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">
							Belum ada catatan di sini
						</h3>
						<p class="text-xs text-slate-500 max-w-sm mb-6">
							Mulai torehkan ide, coretan, atau tulisan tangan alami Anda dengan menekan tombol (+) di sebelah kiri bawah.
						</p>
						<button
							type="button"
							class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-sm transition-colors"
							onclick={onCreateNote}
						>
							+ Buat Catatan Pertama
						</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- FAB at Bottom-Left (56x56 px) -->
		<FAB onClick={onCreateNote} />
	</div>

	<!-- Modals -->
	<SettingsModal isOpen={isSettingsOpen} onClose={() => (isSettingsOpen = false)} />
	<FolderModal
		isOpen={isFolderModalOpen}
		onClose={() => (isFolderModalOpen = false)}
		onCreate={onCreateFolder}
	/>
</div>
