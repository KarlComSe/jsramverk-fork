import 'dotenv/config'

const port = process.env.PORT || 3300;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/update", async (req, res) => {
    await documents.updateOne(req.body);
    return res.redirect(`/${req.body.id}`);
});

app.post("/add_new", async (req, res) => {
    const result = await documents.addOne(req.body);
    return res.redirect(`/${result.lastID}`);
});

app.get("/add_new", async (req, res) => {
    return res.render("add_new");
});

app.get('/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id),
            id: req.params.id
         }
    );
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

/* API */

app.get("/api/", async (req, res) => {
    const result = await documents.getAll();
    return res.json(result);
});

app.get("/api/:id", async (req, res) => {
    const result = await documents.getOne(req.params.id);
    return res.json(result);
});

app.post("/api/add_new", async (req, res) => {
    const result = await documents.addOne(req.body);
    return res.json(result);
});

app.post("/api/update", async (req, res) => {
    const result = await documents.updateOne(req.body);
    return res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
