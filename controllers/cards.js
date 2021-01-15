const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Ошибка валидации' });
      if (err.name === 'MongooseError') res.status(500).send({message: 'Ошибка сервера'});
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'MongooseError') {
        res.status(500).send({ message: 'Ошибка сервера' });
      } else {
        const regex = /[\W_]/gi;
        if (regex.test(req.params._id)) {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Карточка не найдена' });
        }
      }
    });
};

module.exports.putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'MongooseError') {
        res.status(500).send({ message: 'Ошибка сервера' });
      } else {
        const regex = /[\W_]/gi;
        if (regex.test(req.params._id)) {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Карточка не найдена' });
        }
      }
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'MongooseError') {
        res.status(500).send({ message: 'Ошибка сервера' });
      } else {
        const regex = /[\W_]/gi;
        if (regex.test(req.params._id)) {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Карточка не найдена' });
        }
      }
    });
};
