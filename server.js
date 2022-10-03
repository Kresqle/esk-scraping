const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const scraping = require('./scraping.js');
const { buildTree } = require('./tree.js');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/static', express.static('static'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/scraping')
});
app.get('/:id', (req, res) => {
    const tree = buildTree("static");
    res.render('index', { tree: tree, active: req.params.id });
});

app.post('/scraping', async (req, res) => {
    scraping.run({
        "emoji": req.body.emoji,
        "folder_name": req.body.folder
    });
    res.status(200).redirect('/scraping')
});

app.listen(3000, () => {
    console.log("Server running");
});