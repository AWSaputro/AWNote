import { db, AwNotesDatabase } from './index';
import type { Note, Folder, SyncStatus } from '#lib/types/note';
import type { Stroke, PaperTemplate } from '#lib/types/canvas';
import { getStrokeOptions, getSvgPathFromStroke } from '#lib/engine/inking';
import getStroke from 'perfect-freehand';

export function generateThumbnailSvg(strokes: Stroke[], isDarkPaper = false, width = 240, height = 320): string {
	if (!strokes || strokes.length === 0) {
		const bg = isDarkPaper ? '#0f172a' : '#ffffff';
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/></svg>`;
	}

	const bg = isDarkPaper ? '#0f172a' : '#ffffff';
	let paths = '';

	// Render preview with downscaled scale factor
	for (const stroke of strokes) {
		if (!stroke.points.length) continue;
		const options = getStrokeOptions(stroke);
		// Scale size for thumbnail
		const thumbOptions = {
			...options,
			size: Math.max(1, (options.size || 4) * 0.4)
		};
		// Scale point coordinates (assuming canvas 1200x1600 -> thumbnail 240x320, scale = 0.2)
		const scale = width / 1200;
		const scaledPoints = stroke.points.map((p) => [p.x * scale, p.y * scale, p.pressure]);
		const outline = getStroke(scaledPoints, thumbOptions);
		if (!outline.length) continue;

		const d = getSvgPathFromStroke(outline);
		const opacity = stroke.tool === 'highlighter' ? 0.4 : stroke.tool === 'pencil' ? 0.8 : 1;
		paths += `<path d="${d}" fill="${stroke.color}" opacity="${opacity}" />`;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}"/>${paths}</svg>`;
}

export async function createNote(
	customDb: AwNotesDatabase = db,
	data: Partial<Note> = {}
): Promise<Note> {
	const now = Date.now();
	const newNote: Note = {
		id: data.id || `note-${now}-${Math.random().toString(36).slice(2, 7)}`,
		title: data.title || 'Catatan Baru',
		folderId: data.folderId ?? null,
		tags: data.tags || [],
		isFavorite: data.isFavorite ?? false,
		isTrash: false,
		thumbnail: data.thumbnail || generateThumbnailSvg([], data.isDarkPaper ?? false),
		paperTemplate: data.paperTemplate || 'ruled',
		isDarkPaper: data.isDarkPaper ?? false,
		strokes: data.strokes || [],
		syncStatus: 'local_only',
		createdAt: now,
		updatedAt: now
	};

	await customDb.notes.add(newNote);
	return newNote;
}

export async function updateNote(
	id: string,
	updates: Partial<Note>,
	customDb: AwNotesDatabase = db
): Promise<void> {
	const now = Date.now();
	const noteUpdates: Partial<Note> = {
		...updates,
		updatedAt: now,
		syncStatus: updates.syncStatus || 'modified'
	};

	if (updates.strokes) {
		noteUpdates.thumbnail = generateThumbnailSvg(updates.strokes, updates.isDarkPaper ?? false);
	}

	await customDb.notes.update(id, noteUpdates);
}

export async function getNoteById(
	id: string,
	customDb: AwNotesDatabase = db
): Promise<Note | undefined> {
	return await customDb.notes.get(id);
}

export async function deleteNote(
	id: string,
	permanent = false,
	customDb: AwNotesDatabase = db
): Promise<void> {
	if (permanent) {
		await customDb.notes.delete(id);
	} else {
		await customDb.notes.update(id, {
			isTrash: true,
			updatedAt: Date.now(),
			syncStatus: 'modified'
		});
	}
}

export async function restoreNote(
	id: string,
	customDb: AwNotesDatabase = db
): Promise<void> {
	await customDb.notes.update(id, {
		isTrash: false,
		updatedAt: Date.now(),
		syncStatus: 'modified'
	});
}

export async function getNotes(
	filters: {
		folderId?: string | null;
		isFavorite?: boolean;
		isTrash?: boolean;
		search?: string;
	} = {},
	customDb: AwNotesDatabase = db
): Promise<Note[]> {
	let notes = await customDb.notes.orderBy('updatedAt').reverse().toArray();

	if (filters.isTrash !== undefined) {
		notes = notes.filter((n) => n.isTrash === filters.isTrash);
	} else {
		// By default show active notes (not in trash)
		notes = notes.filter((n) => !n.isTrash);
	}

	if (filters.isFavorite) {
		notes = notes.filter((n) => n.isFavorite);
	}

	if (filters.folderId !== undefined) {
		notes = notes.filter((n) => n.folderId === filters.folderId);
	}

	if (filters.search && filters.search.trim() !== '') {
		const q = filters.search.toLowerCase();
		notes = notes.filter(
			(n) =>
				n.title.toLowerCase().includes(q) ||
				n.tags.some((t) => t.toLowerCase().includes(q))
		);
	}

	return notes;
}

export async function createFolder(
	name: string,
	color = '#6366f1',
	customDb: AwNotesDatabase = db
): Promise<Folder> {
	const folder: Folder = {
		id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		name,
		color,
		createdAt: Date.now()
	};
	await customDb.folders.add(folder);
	return folder;
}

export async function getFolders(customDb: AwNotesDatabase = db): Promise<Folder[]> {
	return await customDb.folders.orderBy('createdAt').toArray();
}

export async function deleteFolder(
	id: string,
	customDb: AwNotesDatabase = db
): Promise<void> {
	// Reassign notes in folder to root
	await customDb.notes.where('folderId').equals(id).modify({ folderId: null });
	await customDb.folders.delete(id);
}
