const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./config/database');
//Test connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

const app = express();

//Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));

//Index view
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

//House View
app.use('/houses', require('./routes/houses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port 5000`));
