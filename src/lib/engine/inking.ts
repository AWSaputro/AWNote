import getStroke from 'perfect-freehand';
import type { Stroke, PencilGrade, Point } from '../types/canvas';

export const PENCIL_PROPERTIES: Record<PencilGrade, { width: number; opacity: number }> = {
	'2H': { width: 1.5, opacity: 0.4 },
	'H': { width: 2.0, opacity: 0.5 },
	'HB': { width: 2.5, opacity: 0.65 },
	'B': { width: 3.0, opacity: 0.75 },
	'2B': { width: 3.8, opacity: 0.85 },
	'4B': { width: 5.0, opacity: 0.95 },
	'6B': { width: 7.0, opacity: 1.0 }
};

export function getStrokeOptions(stroke: Stroke) {
	if (stroke.tool === 'highlighter') {
		return {
			size: stroke.size,
			thinning: 0,
			smoothing: 0.8,
			streamline: 0.7,
			simulatePressure: false
		};
	}

	if (stroke.tool === 'pencil') {
		const grade = stroke.pencilGrade || '2B';
		const spec = PENCIL_PROPERTIES[grade];
		return {
			size: spec.width,
			thinning: 0.2,
			smoothing: 0.4,
			streamline: 0.4,
			simulatePressure: true
		};
	}

	// Pen default
	return {
		size: stroke.size,
		thinning: 0.5,
		smoothing: 0.5,
		streamline: 0.6,
		simulatePressure: true
	};
}

export function getSvgPathFromStroke(strokePoints: number[][]): string {
	if (!strokePoints.length) return '';
	const d = strokePoints.reduce(
		(acc: (string | number)[], [x0, y0], i, arr) => {
			const [x1, y1] = arr[(i + 1) % arr.length];
			acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
			return acc;
		},
		['M', ...strokePoints[0], 'Q']
	);
	d.push('Z');
	return d.join(' ');
}

/**
 * Render a stroke onto a CanvasRenderingContext2D
 */
export function renderStrokeToContext(ctx: CanvasRenderingContext2D, stroke: Stroke) {
	if (!stroke.points.length) return;

	const options = getStrokeOptions(stroke);
	const rawPoints = stroke.points.map((p) => [p.x, p.y, p.pressure]);
	const outline = getStroke(rawPoints, options);
	if (!outline.length) return;

	const pathString = getSvgPathFromStroke(outline);
	const path = new Path2D(pathString);

	ctx.save();
	if (stroke.tool === 'highlighter') {
		ctx.globalCompositeOperation = 'multiply';
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = stroke.color;
	} else if (stroke.tool === 'pencil') {
		const grade = stroke.pencilGrade || '2B';
		const spec = PENCIL_PROPERTIES[grade];
		ctx.globalAlpha = spec.opacity;
		ctx.fillStyle = stroke.color;
	} else {
		// Pen
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = stroke.color;
	}

	ctx.fill(path);
	ctx.restore();
}
