import Dexie, { type Table, type DexieOptions } from 'dexie';
import type { Note, Folder } from '#lib/types/note';

export class AwNotesDatabase extends Dexie {
	notes!: Table<Note, string>;
	folders!: Table<Folder, string>;

	constructor(dbName = 'AwNotesDB', options?: DexieOptions) {
		super(dbName, options);
		this.version(1).stores({
			notes: 'id, folderId, isFavorite, isTrash, syncStatus, updatedAt, createdAt',
			folders: 'id, name, createdAt'
		});
	}
}

export const db = new AwNotesDatabase();
