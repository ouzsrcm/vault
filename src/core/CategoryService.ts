import { DatabaseManager } from './DatabaseManager';
import { Category } from './types';

export class CategoryServices {

    private static instance: CategoryServices;
    public static getInstance(): CategoryServices {
        if (!this.instance) {
            this.instance = new CategoryServices();
        }
        return this.instance;
    }

    private dbMan: DatabaseManager = null as any;
    constructor() {
        this.dbMan = new DatabaseManager();
    }

    private checkDefaultCategory(): number {
        const rows = this.dbMan.querySQL<Category>(
            `SELECT id, name FROM categories WHERE is_default = ?;`,
            [1]
        );
        return rows[0]?.id ?? -1;
    }

    /// Set a category as default by id
    public setDefaultCategory(id: number): boolean {
        const resetResult = this.dbMan.executeSQL(
            `UPDATE categories SET is_default = 0 WHERE is_default = 1;`
        );
        const setResult = this.dbMan.executeSQL(
            `UPDATE categories SET is_default = 1 WHERE id = ?;`,
            [id]
        );
        return resetResult.changes > 0 && setResult.changes > 0;
    }

    /// Get the default category ID
    public getDefaultCategoryId(): number {
        var res = this.checkDefaultCategory();
        if (res === -1) {
            this.dbMan.seed(this.dbMan.CategorySeeders);
        }
        return this.checkDefaultCategory();
    }

    /// Get all categories
    public GetAllCategories(): Category[] {
        const rows = this.dbMan.querySQL<Category>(
            `SELECT id, name FROM categories;`
        );
        return rows.map((row: any) => new Category(
            row.id,
            row.name
        ));
    }

    /// Get category by id
    public GetCategoryById(id: number): Category | null {
        const rows = this.dbMan.querySQL<Category>(
            `SELECT id, name FROM categories WHERE id = ?;`,
            [id]
        );
        const row = rows[0] as any;
        if (rows.length > 0 || row !== null) {
            return new Category(
                row.id,
                row.name
            );
        }
        return null;
    }

    /// Create a new category
    public CreateCategory(name: string): Category {
        const result = this.dbMan.executeSQL(
            `INSERT INTO categories (name) VALUES (?);`,
            [name]
        );
        const id = result.lastInsertRowid as number;
        return new Category(id, name);
    }

    /// Update category name by id
    public UpdateCategory(id: number, name: string): boolean {
        const result = this.dbMan.executeSQL(
            `UPDATE categories SET name = ? WHERE id = ?;`,
            [name, id]
        );
        return result.changes > 0;
    }

    /// Delete category by id
    public DeleteCategory(id: number): boolean {
        const result = this.dbMan.executeSQL(
            `DELETE FROM categories WHERE id = ?;`,
            [id]
        );
        return result.changes > 0;
    }

}