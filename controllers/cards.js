const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные' });
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') res.status(404).send({ message: 'Данные не найдены' });
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные' });
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') res.status(404).send({ message: 'Данные не найдены' });
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные' });
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') res.status(404).send({ message: 'Данные не найдены' });
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные' });
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};
