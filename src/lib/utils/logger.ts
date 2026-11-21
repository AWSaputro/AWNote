export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class AppLogger {
	private level: LogLevel = 'info';

	setLevel(level: LogLevel) {
		this.level = level;
	}

	debug(message: string, ...args: unknown[]) {
		if (this.level === 'debug') {
			console.debug(`[AwNotes:DEBUG] ${message}`, ...args);
		}
	}

	info(message: string, ...args: unknown[]) {
		if (this.level === 'debug' || this.level === 'info') {
			console.info(`[AwNotes:INFO] ${message}`, ...args);
		}
	}

	warn(message: string, ...args: unknown[]) {
		if (this.level !== 'error') {
			console.warn(`[AwNotes:WARN] ${message}`, ...args);
		}
	}

	error(message: string, ...args: unknown[]) {
		console.error(`[AwNotes:ERROR] ${message}`, ...args);
	}
}

export const logger = new AppLogger();
