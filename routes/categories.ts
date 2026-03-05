import express, {Request, Response} from "express";
import {Category} from "../types";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";

export const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req: Request, res: Response) => {
    const connection = await mysqlDb.getConnection();

    const [result] = await connection.query('SELECT * FROM categories');
    const categories = result as Category[];

    if (categories.length > 0) {
        return res.send(categories.map(category => {
            return {id: category.id, title: category.title}
        }));
    } else {
        return res.status(404).send('Not found categories')
    }
});

categoriesRouter.get('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;
    const [results] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);

    const category = (results as Category[])[0];

    if (category) {
        return res.send(category);
    } else {
        return res.status(404).send({error: 'Not found category'});
    }
});

categoriesRouter.post('/', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const {title, description} = req.body;

    if (!title) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO categories (title, description) VALUES (?, ?)',
            [title, description || null]);

        const insertId = result.insertId;

        res.send({
            id: insertId,
            title: title,
            description: description || null
        });

    } catch (e) {
        return res.status(500).send({error: 'Error saving to database'});
    }
});

categoriesRouter.delete('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;

    try {
        const [result] = await connection.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found category'});
        }

        return res.send('The category was successfully deleted')
    } catch (e) {
        return res.status(500).send({error: 'Error deleting from database'});
    }
});

categoriesRouter.put('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;
    const {title, description} = req.body;

    if (!title) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE categories SET title = ?, description = ? WHERE id = ?',
            [title, description || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found category'});
        }

        res.send({
            id: Number(id),
            title: title,
            description: description || null
        });

    } catch (e) {
        return res.status(500).send({error: 'Error updating database'});
    }
});