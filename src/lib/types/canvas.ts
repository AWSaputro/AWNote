export type ToolType = 'pen' | 'pencil' | 'highlighter' | 'eraser';
export type PencilGrade = '2H' | 'H' | 'HB' | 'B' | '2B' | '4B' | '6B';
export type PaperTemplate = 'blank' | 'ruled' | 'grid';

export interface Point {
	x: number;
	y: number;
	pressure: number;
}

export interface Stroke {
	id: string;
	tool: ToolType;
	color: string;
	size: number;
	pencilGrade?: PencilGrade;
	points: Point[];
}

export interface CanvasState {
	currentTool: ToolType;
	currentColor: string;
	currentSize: number;
	currentPencilGrade: PencilGrade;
	eraserMode: 'stroke' | 'pixel';
	eraserRadius: number;
	paperTemplate: PaperTemplate;
	isDarkPaper: boolean;
}
