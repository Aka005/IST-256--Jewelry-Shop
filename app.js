var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jewelry = require('./public/data/chain.json');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

dbClientPromise = MongoClient.connect('mongodb://localhost:27017/');

async function getClient() {
  return await MongoClient.connect('mongodb://localhost:27017/');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/updateCart', async function(req, res) {
    const dbClient = await getClient();
    const dbObject = dbClient.db('newJewelryDatabase');
    const cartCollection = dbObject.collection('carts');
    const updatedData = req.body.data;

    
    await cartCollection.deleteMany({});

    
    await cartCollection.insertMany(updatedData.filter(item => item.inCart));

    res.json({ message: 'Cart updated successfully' });
});


app.get('/cart', async function(req, res) {
    const dbClient = await getClient();
    const dbObject = dbClient.db('newJewelryDatabase');
    const cartCollection = dbObject.collection('carts');

    const cartItems = await cartCollection.find({}).toArray();
    res.json(cartItems);
});

app.get('/getList', async function(request, response) {
    const dbClient = await getClient();
    const dbObject = dbClient.db('newJewelryDatabase');
    const collection = dbObject.collection('jewelry');
    const allJewelry = await collection.find({}).toArray();

    response.setHeader('Content-Type', 'application/json');
    response.json(allJewelry);
});


// Route to clear the cart
app.post('/clearCart', async function(req, res) {
  const dbClient = await getClient();
  const dbObject = dbClient.db('newJewelryDatabase');
  const cartCollection = dbObject.collection('carts');

  // Clear all cart items in the database
  await cartCollection.deleteMany({});

  res.json({ message: 'Cart cleared successfully' });
});



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
