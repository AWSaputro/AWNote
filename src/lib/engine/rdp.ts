import type { Point } from '../types/canvas';

function getPerpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
	const dx = lineEnd.x - lineStart.x;
	const dy = lineEnd.y - lineStart.y;
	const mag = Math.hypot(dx, dy);

	if (mag === 0) {
		return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
	}

	const u = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);
	const clampedU = Math.max(0, Math.min(1, u));
	const projX = lineStart.x + clampedU * dx;
	const projY = lineStart.y + clampedU * dy;

	return Math.hypot(point.x - projX, point.y - projY);
}

/**
 * Ramer-Douglas-Peucker algorithm to simplify strokes while preserving visual fidelity
 */
export function simplifyPoints(points: Point[], tolerance = 0.5): Point[] {
	if (points.length <= 2) return points;

	let maxDistance = 0;
	let maxIndex = 0;
	const lineStart = points[0];
	const lineEnd = points[points.length - 1];

	for (let i = 1; i < points.length - 1; i++) {
		const dist = getPerpendicularDistance(points[i], lineStart, lineEnd);
		if (dist > maxDistance) {
			maxDistance = dist;
			maxIndex = i;
		}
	}

	if (maxDistance > tolerance) {
		const left = simplifyPoints(points.slice(0, maxIndex + 1), tolerance);
		const right = simplifyPoints(points.slice(maxIndex), tolerance);
		return left.slice(0, -1).concat(right);
	}

	return [lineStart, lineEnd];
}

/**
 * Filter points only if length exceeds threshold (guardrail: > 30 points)
 */
export function optimizeStrokePoints(points: Point[], threshold = 30, tolerance = 0.5): Point[] {
	if (points.length <= threshold) return points;
	return simplifyPoints(points, tolerance);
}

/**
 * Check if a point is within radius of a line segment
 */
export function isPointNearSegment(
	p: { x: number; y: number },
	a: Point,
	b: Point,
	radius: number
): boolean {
	const dist = getPerpendicularDistance({ x: p.x, y: p.y, pressure: 0.5 }, a, b);
	return dist <= radius;
}

/**
 * Check if an eraser circle intersects with any segment of a stroke
 */
export function strokeIntersectsCircle(
	strokePoints: Point[],
	center: { x: number; y: number },
	radius: number
): boolean {
	if (strokePoints.length === 0) return false;
	if (strokePoints.length === 1) {
		return Math.hypot(strokePoints[0].x - center.x, strokePoints[0].y - center.y) <= radius;
	}

	for (let i = 0; i < strokePoints.length - 1; i++) {
		if (isPointNearSegment(center, strokePoints[i], strokePoints[i + 1], radius)) {
			return true;
		}
	}
	return false;
}
