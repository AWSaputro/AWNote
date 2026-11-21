import { describe, it, expect, beforeEach } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { AwNotesDatabase } from './index';
import {
	createNote,
	updateNote,
	getNoteById,
	deleteNote,
	restoreNote,
	getNotes,
	createFolder,
	getFolders,
	generateThumbnailSvg
} from './notes';
import type { Stroke } from '#lib/types/canvas';

describe('AwNotes Database & CRUD Operations', () => {
	let testDb: AwNotesDatabase;

	beforeEach(async () => {
		testDb = new AwNotesDatabase(`TestDB_${Date.now()}_${Math.random()}`, {
			indexedDB,
			IDBKeyRange
		});
	});

	it('should create a new note with default fields and local_only status', async () => {
		const note = await createNote(testDb, { title: 'Catatan Rapat' });
		expect(note.id).toBeDefined();
		expect(note.title).toBe('Catatan Rapat');
		expect(note.syncStatus).toBe('local_only');
		expect(note.isTrash).toBe(false);

		const fetched = await getNoteById(note.id, testDb);
		expect(fetched).toBeDefined();
		expect(fetched?.title).toBe('Catatan Rapat');
	});

	it('should update note title, strokes, and syncStatus to modified', async () => {
		const note = await createNote(testDb, { title: 'Original' });
		const stroke: Stroke = {
			id: 'st-1',
			tool: 'pen',
			color: '#000000',
			size: 4,
			points: [{ x: 10, y: 10, pressure: 0.5 }]
		};

		await updateNote(note.id, { title: 'Updated Title', strokes: [stroke] }, testDb);

		const updated = await getNoteById(note.id, testDb);
		expect(updated?.title).toBe('Updated Title');
		expect(updated?.strokes.length).toBe(1);
		expect(updated?.syncStatus).toBe('modified');
	});

	it('should support soft-delete to trash and restoration', async () => {
		const note = await createNote(testDb, { title: 'Trash Note' });

		// Soft delete
		await deleteNote(note.id, false, testDb);
		const trashed = await getNoteById(note.id, testDb);
		expect(trashed?.isTrash).toBe(true);

		// Restore
		await restoreNote(note.id, testDb);
		const restored = await getNoteById(note.id, testDb);
		expect(restored?.isTrash).toBe(false);
	});

	it('should filter notes by search term and folder', async () => {
		const folder = await createFolder('Kuliah', '#6366f1', testDb);
		await createNote(testDb, { title: 'Fisika Dasar', folderId: folder.id });
		await createNote(testDb, { title: 'Kimia Organik', folderId: folder.id });
		await createNote(testDb, { title: 'Belanja Mingguan', folderId: null });

		const inFolder = await getNotes({ folderId: folder.id, isTrash: false }, testDb);
		expect(inFolder.length).toBe(2);

		const searchResult = await getNotes({ search: 'Fisika', isTrash: false }, testDb);
		expect(searchResult.length).toBe(1);
		expect(searchResult[0].title).toBe('Fisika Dasar');
	});

	it('should generate SVG thumbnail from strokes', () => {
		const stroke: Stroke = {
			id: 'st-1',
			tool: 'pen',
			color: '#2563eb',
			size: 6,
			points: [
				{ x: 10, y: 10, pressure: 0.5 },
				{ x: 50, y: 50, pressure: 0.7 }
			]
		};

		const svg = generateThumbnailSvg([stroke], false, 240, 320);
		expect(svg).toContain('<svg');
		expect(svg).toContain('fill="#2563eb"');
		expect(svg).toContain('</svg>');
	});
});
