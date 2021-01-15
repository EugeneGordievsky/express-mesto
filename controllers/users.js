const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongooseError') {
        res.status(500).send({ message: 'Ошибка сервера' });
      } else {
        const regex = /[\W_]/gi;
        if (regex.test(req.params._id)) {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(404).send({ message: 'Пользователь не найден' });
        }
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Ошибка валидации' });
      if (err.name === 'MongooseError') res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Ошибка валидации' });
      if (err.name === 'MongooseError') res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Ошибка валидации' });
      if (err.name === 'MongooseError') res.status(500).send({ message: 'Ошибка сервера' });
    });
};
