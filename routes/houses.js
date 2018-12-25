const express = require('express');
const router = express.Router();
const db = require('../config/database');
const House = require('../model/House');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//Get House list
router.get('/', (req, res) => {
  House.findAll()
    .then(houses => {
      res.render('houses', { houses });
    })
    .catch(err => console.log(err));
});

//Display add listing form
router.get('/add', (req, res) => {
  res.render('add');
});

//Add a house
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ text: 'Please add title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add technologies' });
  }
  if (!budget) {
    errors.push({ text: 'Please add budget' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add contact email' });
  }

  //check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      contact_email
    });
  } else {
    if (!budget) {
      budget = 'Uknown';
    } else {
      budget = `$${budget}`;
    }

    //Make lower case and space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    //Insert into table
    House.create({
      title: title,
      technologies: technologies,
      budget: budget,
      description: description,
      contact_email: contact_email
    })
      .then(house => res.redirect('/houses'))
      .catch(err => console.log(err));
  }
});

router.get('/search', (req, res) => {
  const { term } = req.query;

  //make lowercase
  term = term.toLowerCase();
  console.log(term);

  House.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
    .then(houses => res.render('houses', { houses }))
    .catch(err => console.log(err));
});
module.exports = router;
