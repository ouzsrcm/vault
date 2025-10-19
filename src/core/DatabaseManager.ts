import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as logger from './logger';
import { LogLevel } from './enums';

const DB_PATH = path.resolve(__dirname, '../data/app_database.sqlite');

class DatabaseManager {

    private instance: Database.Database = null as any;
    private getInstance(): Database.Database {
        if (!this.instance) {
            this.instance = new Database(DB_PATH);
        }
        return this.instance;
    }

    private commands: string[] = [
        `CREATE TABLE IF NOT EXISTS commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            category_id INTEGER,
            command TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE INDEX IF NOT EXISTS idx_user_id ON commands (user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_command ON commands (command);`,
        `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_default BOOLEAN DEFAULT 0
        );`,
        `CREATE INDEX IF NOT EXISTS idx_category_id ON commands (category_id);`
    ];

    public CategorySeeders: string[] = [
        `INSERT INTO categories (name, is_default) VALUES ('default', 1);`
    ]

    public constructor() {
        this.initDatabasefile();
        this.load();
    }

    public executeSQL(query: string, params: any[] = []): Database.RunResult {
        const stmt = this.getInstance().prepare(query);
        return stmt.run(...params);
    }

    public querySQL<T>(query: string, params: any[] = []): T[] {
        const stmt = this.getInstance().prepare(query);
        return stmt.all(...params) as T[];
    }

    public seed(seeds: string[]): void {
        if (seeds.length === 0) {
            return;
        }
        for (const seed of seeds) {
            this.getInstance().exec(seed);
        }
    }

    private load(): void {
        for (const command of this.commands) {
            this.getInstance().exec(command);
        }
    }

    private initDatabasefile(): boolean {

        const dir = path.dirname(DB_PATH);
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (!fs.existsSync(DB_PATH)) {
                fs.writeFileSync(DB_PATH, '');
            }
            return dir !== '';
        }
        catch (error) {
            logger.text('Error initializing database file:', LogLevel.ERROR);
            return false;
        }
    }

    public closeConnection(): void {
        if (this.instance) {
            this.instance.close();
        }
    }

}

export { DatabaseManager };