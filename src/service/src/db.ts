

import 'dotenv/config';
import Database from 'better-sqlite3';
import { z } from 'zod';
import path from 'path';

const env = z.object({
    DB_PATH: z.string(),
}).parse(process.env);

const dbPath = path.resolve(__dirname, '..',env.DB_PATH ?? '../data/app_database.sqlite');

console.log("CWD:", process.cwd());
console.log("DB_PATH (raw):", process.env.DB_PATH);
console.log("Resolved:", dbPath);

if (!env.DB_PATH) {
    throw new Error('DB_PATH is not defined');
}

export const db: Database.Database = new Database(dbPath,
    {
        verbose: console.log,
        fileMustExist: true
    });

db.pragma('foreign_keys = ON');