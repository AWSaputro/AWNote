<script lang="ts">
	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
		<div
			class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
		>
			<!-- Header -->
			<div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
				<h2 class="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span>Pengaturan AwNotes</span>
				</h2>
				<button
					type="button"
					class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
					onclick={onClose}
					aria-label="Tutup pengaturan"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Body -->
			<div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
				<!-- Storage Info -->
				<div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60">
					<p class="font-semibold text-xs text-slate-600 dark:text-slate-300">Penyimpanan Utama</p>
					<p class="text-xs text-slate-500 mt-1">
						Data disimpan secara aman di peramban lokal perangkat menggunakan <strong>IndexedDB (Dexie.js)</strong> dengan latensi 0ms.
					</p>
				</div>

				<!-- Keyboard Shortcuts -->
				<div>
					<p class="font-semibold text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
						Pintasan Keyboard
					</p>
					<div class="space-y-1.5 text-xs">
						<div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/40">
							<span class="text-slate-600 dark:text-slate-400">Batalkan Goresan (Undo)</span>
							<kbd class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">Ctrl + Z</kbd>
						</div>
						<div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/40">
							<span class="text-slate-600 dark:text-slate-400">Ulangi Goresan (Redo)</span>
							<kbd class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">Ctrl + Y</kbd>
						</div>
					</div>
				</div>

				<!-- About -->
				<div class="pt-2 text-[11px] text-slate-400 text-center">
					AwNotes v0.2.0 • Web-Based Samsung Notes Alternative
				</div>
			</div>

			<!-- Footer -->
			<div class="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
				<button
					type="button"
					class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
					onclick={onClose}
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
