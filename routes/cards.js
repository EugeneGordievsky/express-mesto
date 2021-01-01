const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const cardsSrc = path.join(__dirname, '../data/cards.json');

function readFile(file) {
  return fs.readFile(file).then((text) => JSON.parse(text));
}

router.get('/', (req, res) => {
  readFile(cardsSrc)
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
