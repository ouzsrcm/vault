import {Router } from 'express';
import { db } from '../db';
import { Category, CountResult } from '../types';

const r = Router();

// GET /api/categories
r.get('/', (req, res) => {
    const cats= db.prepare('SELECT * FROM categories ORDER BY name ASC').all() as Category[];
    res.json({ items: cats });
});

// POST /api/categories
r.post('/', (req, res) => {
    const name = String(req.body.name ?? '').trim();
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    const newCat = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;
    res.status(201).json({ item: newCat });
});

// GET /api/categories/:id
r.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
    if (!cat) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ item: cat });
});

// DELETE /api/categories/:id
r.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ ok: true });
});

// POST /api/categories/default/:id
r.post('/default/:id', (req, res) => {
     const id = Number(req.params.id);
  const tx = db.transaction((cid: number) => {
    db.prepare('UPDATE categories SET is_default = 0').run();
    db.prepare('UPDATE categories SET is_default = 1 WHERE id = ?').run(cid);
  });
  tx(id);
  res.json({ ok: true });
});

export default r;
