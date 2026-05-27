const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const currentLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

class Logger {
    private level: number;

    constructor() {
        this.level = logLevels[currentLevel as keyof typeof logLevels] || logLevels.info;
    }

    private shouldLog(level: keyof typeof logLevels): boolean {
        return logLevels[level] <= this.level;
    }

    error(message: string, error?: any) {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, error || '');
        }
    }

    warn(message: string) {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`);
        }
    }

    info(message: string) {
        if (this.shouldLog('info')) {
            console.log(`[INFO] ${message}`);
        }
    }

    debug(message: string) {
        if (this.shouldLog('debug')) {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

export const logger = new Logger();
