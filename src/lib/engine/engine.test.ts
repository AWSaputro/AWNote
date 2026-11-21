import { describe, it, expect } from 'vitest';
import { simplifyPoints, optimizeStrokePoints, strokeIntersectsCircle } from './rdp';
import { getStrokeOptions, PENCIL_PROPERTIES } from './inking';
import type { Stroke } from '../types/canvas';

describe('Ramer-Douglas-Peucker & Stroke Optimization', () => {
	it('should keep straight line endpoints and reduce redundant points', () => {
		const points = [
			{ x: 0, y: 0, pressure: 0.5 },
			{ x: 10, y: 0.05, pressure: 0.5 },
			{ x: 20, y: 0.02, pressure: 0.5 },
			{ x: 30, y: 0, pressure: 0.5 }
		];

		const simplified = simplifyPoints(points, 0.5);
		expect(simplified.length).toBe(2);
		expect(simplified[0].x).toBe(0);
		expect(simplified[1].x).toBe(30);
	});

	it('should only optimize points when points count exceeds threshold', () => {
		const points = Array.from({ length: 25 }, (_, i) => ({ x: i, y: 0, pressure: 0.5 }));
		expect(optimizeStrokePoints(points, 30).length).toBe(25);

		const largePoints = Array.from({ length: 40 }, (_, i) => ({ x: i, y: 0, pressure: 0.5 }));
		expect(optimizeStrokePoints(largePoints, 30).length).toBe(2);
	});

	it('should accurately detect circle intersection with stroke', () => {
		const stroke = [
			{ x: 0, y: 0, pressure: 0.5 },
			{ x: 100, y: 100, pressure: 0.5 }
		];

		// Center at (50, 50) is directly on the segment
		expect(strokeIntersectsCircle(stroke, { x: 50, y: 50 }, 5)).toBe(true);
		// Center at (0, 100) is far away
		expect(strokeIntersectsCircle(stroke, { x: 0, y: 100 }, 5)).toBe(false);
	});
});

describe('Inking Options & Pencil Grades', () => {
	it('should return correct pencil properties for 2H to 6B', () => {
		expect(PENCIL_PROPERTIES['2H'].width).toBeLessThan(PENCIL_PROPERTIES['6B'].width);
		expect(PENCIL_PROPERTIES['2H'].opacity).toBeLessThan(PENCIL_PROPERTIES['6B'].opacity);
	});

	it('should configure highlighter with simulatePressure: false', () => {
		const stroke: Stroke = {
			id: 'test-1',
			tool: 'highlighter',
			color: '#ffff00',
			size: 24,
			points: []
		};
		const options = getStrokeOptions(stroke);
		expect(options.simulatePressure).toBe(false);
		expect(options.size).toBe(24);
	});
});
