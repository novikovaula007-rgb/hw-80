import express, {Request, Response} from "express";
import {Place} from "../types";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";

export const placesRouter = express.Router();

placesRouter.get('/', async (_req: Request, res: Response) => {
    const connection = await mysqlDb.getConnection();

    const [result] = await connection.query('SELECT * FROM places');
    const places = result as Place[];

    if (places.length > 0) {
        return res.send(places.map(place => {
            return {id: place.id, title: place.title}
        }));
    } else {
        return res.status(404).send('Not found places')
    }
});

placesRouter.get('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;
    const [results] = await connection.query('SELECT * FROM places WHERE id = ?', [id]);

    const place = (results as Place[])[0];

    if (place) {
        return res.send(place);
    } else {
        return res.status(404).send({error: 'Not found place'});
    }
});

placesRouter.post('/', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const {title, description} = req.body;

    if (!title) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO places (title, description) VALUES (?, ?)',
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

placesRouter.delete('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;

    try {
        const [result] = await connection.query<ResultSetHeader>('DELETE FROM places WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found place'});
        }

        return res.send('The place was successfully deleted')
    } catch (e) {
        return res.status(500).send({error: 'Error deleting from database'});
    }
});

placesRouter.put('/:id', async (req, res) => {
    const connection = await mysqlDb.getConnection();

    const id = req.params.id;
    const {title, description} = req.body;

    if (!title) {
        return res.status(400).send({error: 'You must fill in all required fields'});
    }

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE places SET title = ?, description = ? WHERE id = ?',
            [title, description || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Not found place'});
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