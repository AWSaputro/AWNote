<script lang="ts">
	import { onMount } from 'svelte';
	import Dashboard from '#lib/components/dashboard/Dashboard.svelte';
	import Editor from '#lib/components/editor/Editor.svelte';
	import type { Note, Folder } from '#lib/types/note';
	import {
		getNotes,
		getFolders,
		createNote,
		updateNote,
		deleteNote,
		restoreNote,
		createFolder
	} from '#lib/db/notes';

	let activeNote = $state<Note | null>(null);
	let notes = $state<Note[]>([]);
	let folders = $state<Folder[]>([]);

	let currentView = $state<'all' | 'favorites' | 'trash'>('all');
	let selectedFolderId = $state<string | null>(null);
	let searchQuery = $state('');

	async function loadData() {
		try {
			folders = await getFolders();
			notes = await getNotes({
				folderId: selectedFolderId,
				isFavorite: currentView === 'favorites' ? true : undefined,
				isTrash: currentView === 'trash',
				search: searchQuery
			});
		} catch (err) {
			console.error('Failed to load notes from Dexie:', err);
		}
	}

	async function handleCreateNote() {
		try {
			const newNote = await createNote(undefined, {
				title: 'Catatan Baru',
				folderId: selectedFolderId
			});
			await loadData();
			activeNote = newNote;
		} catch (err) {
			console.error('Failed to create note:', err);
		}
	}

	function handleOpenNote(note: Note) {
		activeNote = note;
	}

	async function handleBackToDashboard() {
		activeNote = null;
		await loadData();
	}

	async function handleToggleFavorite(note: Note) {
		await updateNote(note.id, { isFavorite: !note.isFavorite });
		await loadData();
	}

	async function handleDeleteNote(note: Note) {
		const isPermanent = note.isTrash;
		await deleteNote(note.id, isPermanent);
		await loadData();
	}

	async function handleRestoreNote(note: Note) {
		await restoreNote(note.id);
		await loadData();
	}

	async function handleCreateFolder(name: string, color: string) {
		await createFolder(name, color);
		await loadData();
	}

	function handleSearch(q: string) {
		searchQuery = q;
		loadData();
	}

	function handleSelectView(v: 'all' | 'favorites' | 'trash') {
		currentView = v;
		selectedFolderId = null;
		loadData();
	}

	function handleSelectFolder(id: string | null) {
		selectedFolderId = id;
		loadData();
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>{activeNote ? `${activeNote.title} - AwNotes` : 'AwNotes - Digital Notebook'}</title>
</svelte:head>

{#if activeNote}
	<Editor
		note={activeNote}
		{folders}
		onBackToDashboard={handleBackToDashboard}
	/>
{:else}
	<Dashboard
		{notes}
		{folders}
		{currentView}
		{selectedFolderId}
		{searchQuery}
		onSelectView={handleSelectView}
		onSelectFolder={handleSelectFolder}
		onSearch={handleSearch}
		onOpenNote={handleOpenNote}
		onCreateNote={handleCreateNote}
		onToggleFavorite={handleToggleFavorite}
		onDeleteNote={handleDeleteNote}
		onRestoreNote={handleRestoreNote}
		onCreateFolder={handleCreateFolder}
	/>
{/if}
