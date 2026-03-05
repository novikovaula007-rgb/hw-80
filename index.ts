import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const run = async () => {
    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

