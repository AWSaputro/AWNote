<script lang="ts">
	import type { Folder } from '#lib/types/note';

	interface Props {
		currentView: 'all' | 'favorites' | 'trash';
		selectedFolderId: string | null;
		folders: Folder[];
		notesCount: number;
		isMobileOpen: boolean;
		onSelectView: (view: 'all' | 'favorites' | 'trash') => void;
		onSelectFolder: (folderId: string | null) => void;
		onCreateFolder: () => void;
		onOpenSettings: () => void;
		onCloseMobile: () => void;
	}

	let {
		currentView,
		selectedFolderId,
		folders,
		notesCount,
		isMobileOpen,
		onSelectView,
		onSelectFolder,
		onCreateFolder,
		onOpenSettings,
		onCloseMobile
	}: Props = $props();
</script>

<!-- Backdrop on mobile -->
{#if isMobileOpen}
	<button
		type="button"
		class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden w-full h-full border-none cursor-default"
		onclick={onCloseMobile}
		aria-label="Tutup menu sidebar"
	></button>
{/if}

<aside
	class="fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out {isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
>
	<!-- User Profile Section at the very top -->
	<div class="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
				AW
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
					Pengguna Tamu
				</p>
				<p class="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
					<span>Offline-First (0ms)</span>
				</p>
			</div>
		</div>
		<div class="mt-3">
			<button
				type="button"
				class="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
				onclick={() => alert('Fitur Login Google Drive (Member) akan dihubungkan di Sprint 5')}
			>
				<svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
				</svg>
				<span>Login Akun Google</span>
			</button>
		</div>
	</div>

	<!-- Navigation Menu -->
	<div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
		<div>
			<div class="px-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
				Catatan
			</div>
			<div class="space-y-1">
				<button
					type="button"
					class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors {currentView === 'all' && selectedFolderId === null ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
					onclick={() => {
						onSelectView('all');
						onSelectFolder(null);
					}}
				>
					<span class="flex items-center gap-2.5">
						<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
						<span>Semua Catatan</span>
					</span>
					<span class="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
						{notesCount}
					</span>
				</button>

				<button
					type="button"
					class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors {currentView === 'favorites' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
					onclick={() => onSelectView('favorites')}
				>
					<span class="flex items-center gap-2.5">
						<svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span>Favorit</span>
					</span>
				</button>

				<button
					type="button"
					class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors {currentView === 'trash' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
					onclick={() => onSelectView('trash')}
				>
					<span class="flex items-center gap-2.5">
						<svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						<span>Sampah</span>
					</span>
				</button>
			</div>
		</div>

		<!-- Folder Hierarchy -->
		<div>
			<div class="flex items-center justify-between px-2 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
				<span>Folder</span>
				<button
					type="button"
					class="text-indigo-600 dark:text-indigo-400 hover:underline capitalize text-xs"
					onclick={onCreateFolder}
				>
					+ Folder
				</button>
			</div>
			<div class="space-y-1">
				{#each folders as folder}
					<button
						type="button"
						class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-sm font-medium transition-colors {selectedFolderId === folder.id ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}"
						onclick={() => {
							onSelectView('all');
							onSelectFolder(folder.id);
						}}
					>
						<span class="flex items-center gap-2.5 truncate">
							<span class="w-2.5 h-2.5 rounded-full" style="background-color: {folder.color};"></span>
							<span class="truncate">{folder.name}</span>
						</span>
					</button>
				{/each}
				{#if folders.length === 0}
					<p class="px-2 py-1 text-xs text-slate-400 italic">Belum ada folder</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Sticky Bottom Settings -->
	<div class="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
		<button
			type="button"
			class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
			onclick={onOpenSettings}
		>
			<svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
			<span>Pengaturan</span>
		</button>
	</div>
</aside>
