<script lang="ts">
	interface Props {
		onClick: () => void;
	}

	let { onClick }: Props = $props();
</script>

<div class="fixed bottom-6 left-6 z-30">
	<button
		type="button"
		class="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
		onclick={onClick}
		title="Tambah Catatan Baru (+)"
		aria-label="Tambah Catatan Baru"
	>
		<svg class="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
		</svg>
	</button>
</div>
