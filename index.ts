import express from 'express';
import cors from 'cors';
import {categoriesRouter} from "./routes/categories";
import mysqlDb from "./mysqlDb";
import 'dotenv/config';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/categories', categoriesRouter);

const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

