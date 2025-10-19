import { DatabaseManager } from './DatabaseManager';
import { executeCommand } from './executor';
import * as logger from './logger';
import { LogLevel } from './enums';
import { Command } from './types';
import { DatabaseServices } from './Services';

export class CommandService {

    private static instance: CommandService;
    public static getInstance(): CommandService {
        if (!this.instance) {
            this.instance = new CommandService();
        }
        return this.instance;
    }

    private dbMan: DatabaseManager = null as any;
    constructor() {
        this.dbMan = new DatabaseManager();
    }

    /// Search command history for a specific query
    public Search(query: string): Command[] {

        const rows = this.dbMan.querySQL<Command>(
            `SELECT id, category_id, command, response, created_at
             FROM commands WHERE user_id = ? AND command LIKE ? AND category_id = ?;`,
            [this.getUsername(), `%${query}%`]
        );

        return rows.map((row: any) => new Command(
            row.id,
            row.category_id,
            row.command,
            row.response,
            new Date(row.created_at)
        ));
    }

    /// Get the last executed command for the current user
    public GetLastCommand(): Command | null {
        const rows = this.dbMan.querySQL<Command>(
            `SELECT id, category_id, command, response, created_at
             FROM commands WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
            [this.getUsername()]
        );
        var row = rows.length > 0 ? rows[0] ?? null : null;
        if (row) {
            return new Command(
                row.id,
                row.category_id,
                row.command,
                row.response,
                new Date(row.created_at)
            );
        }
        return null;
    }

    /// Export command history in the specified format
    public ExportHistory(format: string = 'json'): string {
        const history = this.GetHistory(1000);
        if (format === 'json') {
            return JSON.stringify(history, null, 2);
        }
        return '';
    }

    /// Retrieve the current system username
    public getUsername(): string {
        var user = process.env.USER || process.env.USERNAME || 'default_user';
        logger.text(`Retrieved username: ${user}`, LogLevel.INFO);
        return user;
    }

    /// Add a new command and its response to the database
    public Remember(command: string, response: string, categoryId?: number): number {
        const category_id = categoryId ?? DatabaseServices.CategoryService.getDefaultCategoryId();
        var res = this.dbMan.executeSQL(
            `INSERT INTO commands (user_id, command, response, category_id) VALUES (?, ?, ?, ?);`,
            [this.getUsername(), command, response, category_id]
        );
        return res.lastInsertRowid as number;
    }

    /// Retrieve command history filtered by category
    public GetHistoryByCategory(categoryId: number, limit: number = 10): Command[] {
        const rows = this.dbMan.querySQL<Command>(
            `SELECT id, category_id, command, response, created_at
             FROM commands WHERE user_id = ? AND category_id = ? ORDER BY created_at LIMIT ?;`,
            [this.getUsername(), categoryId, limit]
        );
        return rows.map((row: any) => new Command(
            row.id,
            row.category_id,
            row.command,
            row.response,
            new Date(row.created_at)
        ));
    }

    /// Retrieve command history for the current user
    public GetHistory(limit: number = 10): Command[] {
        const rows = this.dbMan.querySQL<Command>(
            `SELECT id, category_id, command, response, created_at
             FROM commands WHERE user_id = ? ORDER BY created_at LIMIT ?;`,
            [this.getUsername(), limit]
        );
        return rows.map((row: any) => new Command(
            row.id,
            row.category_id,
            row.command,
            row.response,
            new Date(row.created_at)
        ));
    }

    /// Re-run a command by its ID and log the new output
    public async ReRun(id: number): Promise<Command> {
        const rows = this.dbMan.querySQL<Command>(
            `SELECT id, category_id, command, response, created_at
                FROM commands WHERE user_id = ? AND id = ?;`,
            [this.getUsername(), id]
        );
        var res = rows.length > 0 ? rows[0] : null;
        if (res) {
            const output = await executeCommand(res.command);
            return new Command(res.id, res.category_id, res.command, output ?? '', new Date());
        }
        throw new Error(`Command with id ${id} not found`);
    }

    public ClearHistoryByCategory(categoryId: number): number {
        var res = this.dbMan.executeSQL(
            `DELETE FROM commands WHERE user_id = ? AND category_id = ?;`,
            [this.getUsername(), categoryId]
        );
        return res.changes;
    }

    /// Clear command history for the current user
    public ClearHistory(): number {

        var res = this.dbMan.executeSQL(
            `DELETE FROM commands WHERE user_id = ?;`,
            [this.getUsername()]
        );
        return res.changes;
    }
}