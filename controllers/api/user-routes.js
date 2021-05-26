const router = require('express').Router();

const { User, Post, Comment }  = require('../../models');


// GET /api/users
router.get('/', (req, res) => {
  // Access our User model and run .findAll() method)
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { excludes: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['title', 'bootcampName', 'deliverFormat', 'length',
          'status', 'price', 'quality', 'standardsMet', 'repeat', 'overallRating', 'review_comments', 'user_id'],
      },
      {
        model: Comment,
        attributes: ['comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST api/users
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;