import express from 'express';
import cors from 'cors';
import {categoriesRouter} from "./routes/categories";
import mysqlDb from "./mysqlDb";
import 'dotenv/config';
import {placesRouter} from "./routes/places";
import {itemsRouter} from "./routes/items";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);


const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

