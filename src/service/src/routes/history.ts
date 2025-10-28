import { Router } from 'express';
import { db } from '../db';
import { Command, CountResult } from '../types';
import { runCommand } from '../utils/shell';

const r = Router();

// GET /api/history
r.get('/', (req, res) => {
    const search = String(req.query.search ?? '');
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(String(req.query.pageSize ?? '10'), 10)));
    const categoryId = String(req.query.categoryId ?? 'all');

    let where = '1=1';
    const params: any[] = [];
    if (search) { where += ' AND (command LIKE ? OR args LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (categoryId !== 'all') { where += ' AND category_id = ?'; params.push(Number(categoryId)); }

    const total = db.prepare(`SELECT COUNT(1) as Count FROM commands WHERE ${where}`)
                    .get(...params) as CountResult;
    const items = db.prepare(
        `SELECT * FROM commands WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).all(...params, pageSize, (page - 1) * pageSize);

    res.json({ items, total: total.Count });
});

// DELETE /api/history/:id
r.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM commands WHERE id = ?').run(id);
    res.json({ ok: true });
});

// POST /api/history/rerun/:id
r.post('/rerun/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const row = db.prepare('SELECT * FROM commands WHERE id = ?').get(id) as Command | undefined;
        if (!row)
            return res.status(404).json({ ok: false, message: 'Kayıt bulunamadı.' });

        const result = await runCommand(row.command, null);

        res.json({
            ok: true, 
            code: result.code,
            output: result.stdout,
            error: result.stderr
        });
    } catch (e) { next(e); }
});

export default r;
