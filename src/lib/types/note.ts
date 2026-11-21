import type { Stroke, PaperTemplate } from './canvas';

export type SyncStatus = 'local_only' | 'synced' | 'modified';

export interface Note {
	id: string;
	title: string;
	folderId: string | null;
	tags: string[];
	isFavorite: boolean;
	isTrash: boolean;
	thumbnail: string;
	paperTemplate: PaperTemplate;
	isDarkPaper: boolean;
	strokes: Stroke[];
	syncStatus: SyncStatus;
	createdAt: number;
	updatedAt: number;
}

export interface Folder {
	id: string;
	name: string;
	color: string;
	createdAt: number;
}

export interface UserProfile {
	name: string;
	email: string | null;
	avatarUrl: string | null;
	isMember: boolean;
}
