import express, {Request, Response} from "express";
import {Item, ItemMutation} from "../types";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";
import {imagesUpload} from "../multer";

export const itemsRouter = express.Router();

itemsRouter.post('/', imagesUpload.single('image'), async (req: Request, res: Response) => {
    const connection = await mysqlDb.getConnection();

    const {title, description, category_id, place_id} = req.body;

    if (!req.body.title || !req.body.category_id || !req.body.place_id) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    const newItem: ItemMutation = {
        title: title,
        description: description || null,
        category_id: Number(category_id),
        place_id: Number(place_id),
        image: req.file ? 'images/' + req.file.filename : null,
    };

    try {
        const [results] = await connection.query<ResultSetHeader>(
            'INSERT INTO items (title, description, category_id, place_id, image) VALUES (?, ?, ?, ?, ?)',
            [newItem.title, newItem.description, newItem.category_id, newItem.place_id, newItem.image]);

        const insertId = results.insertId;

        if (insertId) {
            const [results] = await connection.query('SELECT * FROM items WHERE id = ?', [insertId]);
            const item = (results as Item[])[0];

            if (item) {
                return res.send({
                    ...newItem, id: insertId, created_on: item.created_on
                });
            }
        }

    } catch (e) {
        res.send(e)
        return res.status(500).send('Error saving to database');
    }
});

itemsRouter.get('/', async (_req: Request, res: Response) => {
    const connection = await mysqlDb.getConnection();

    const [result] = await connection.query('SELECT * FROM items');
    const items = result as Item[];

    if (items.length > 0) {
        return res.send(items.map(item => {
            return {id: item.id, title: item.title}
        }));
    } else {
        return res.status(404).send('Not found items')
    }
});

itemsRouter.get('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;
    const [results] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);

    const item = (results as Item[])[0];

    if (item) {
        return res.send(item);
    } else {
        return res.status(404).send({error: 'Not found item'});
    }
});

itemsRouter.delete('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;

    try {
        const [result] = await connection.query<ResultSetHeader>('DELETE FROM items WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found item'});
        }

        return res.send('The item was successfully deleted')
    } catch (e) {
        return res.status(500).send({error: 'Error deleting from database'});
    }
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
    const connection = await mysqlDb.getConnection();
    const {title, description, category_id, place_id} = req.body;
    const id = Number(req.params.id);

    if (!req.body.title || !req.body.category_id || !req.body.place_id) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    const newItem: ItemMutation = {
        title: title,
        description: description || null,
        category_id: Number(category_id),
        place_id: Number(place_id),
        image: req.file ? 'images/' + req.file.filename : null,
    };

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE items SET title = ?, description = ?, category_id = ?, place_id = ?, image = ? WHERE id = ?',
            [newItem.title, newItem.description, newItem.category_id, newItem.place_id, newItem.image, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found item'});
        }

        const [results] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
        const item = (results as Item[])[0];

        if (item) {
            return res.send({
                ...newItem, id: id, created_on: item.created_on
            });
        }
    } catch (e) {
        res.send(e)
        return res.status(500).send({error: 'Error updating database'});
    }
});
