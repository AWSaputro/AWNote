<script lang="ts">
	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onCreate: (name: string, color: string) => void;
	}

	let { isOpen, onClose, onCreate }: Props = $props();

	let folderName = $state('');
	let selectedColor = $state('#6366f1');

	const colorPresets = [
		'#6366f1', // Indigo
		'#3b82f6', // Blue
		'#10b981', // Emerald
		'#f59e0b', // Amber
		'#ef4444', // Red
		'#8b5cf6', // Purple
		'#ec4899'  // Pink
	];

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (folderName.trim()) {
			onCreate(folderName.trim(), selectedColor);
			folderName = '';
			onClose();
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
		<div
			class="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
		>
			<form onsubmit={handleSubmit}>
				<div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
					<h3 class="font-semibold text-sm text-slate-800 dark:text-slate-100">
						Buat Folder Baru
					</h3>
				</div>

				<div class="p-5 space-y-4">
					<div>
						<label for="folder-name-input" class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
							Nama Folder
						</label>
						<input
							id="folder-name-input"
							type="text"
							bind:value={folderName}
							placeholder="Misal: Kuliah, Catatan Proyek"
							class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
							required
						/>
					</div>

					<div>
						<span class="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
							Pilih Warna Folder
						</span>
						<div class="flex items-center gap-2">
							{#each colorPresets as color}
								<button
									type="button"
									class="w-6 h-6 rounded-full border-2 transition-transform {selectedColor === color ? 'scale-125 border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent'}"
									style="background-color: {color};"
									onclick={() => (selectedColor = color)}
									aria-label="Pilih warna {color}"
								></button>
							{/each}
						</div>
					</div>
				</div>

				<div class="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
					<button
						type="button"
						class="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 rounded-lg transition-colors"
						onclick={onClose}
					>
						Batal
					</button>
					<button
						type="submit"
						class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
					>
						Buat Folder
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
