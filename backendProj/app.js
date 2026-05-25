// mongodb://localhost:27017/MyTestDB24032026

require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
const MyCon = require('./DBConnection/MyDBConnect');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var areaRouter = require('./routes/area');
var cityRouter = require('./routes/city');
var categoryRouter = require('./routes/category');
var farmerRouter = require('./routes/farmer');
var orderRouter = require('./routes/order');
var orderDetailRouter = require('./routes/orderDetail');
var paymentRouter = require('./routes/payment');
var productRouter = require('./routes/product');
var shippingRouter = require('./routes/shipping');
var subCategoryRouter = require('./routes/subCategory');
var thirdCategoryRouter = require('./routes/thirdCategory');
var feedbackRouter = require('./routes/feedback');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())


// Routing Setup
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use("/api/area", areaRouter);
app.use("/api/category", categoryRouter);
app.use("/api/city", cityRouter);
app.use("/api/farmer", farmerRouter);
app.use("/api/order", orderRouter);
app.use("/api/orderDetail", orderDetailRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/products", productRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/subCategory", subCategoryRouter);
app.use("/api/thirdCategory", thirdCategoryRouter);
app.use("/api/feedback", feedbackRouter);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// DataBase Connection
MyCon();

module.exports = app;
