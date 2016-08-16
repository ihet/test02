var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express',length:'2'});
  res.render('login', { title: 'index',length:'2'});
});

router.get('/login', function(req, res, next) {
  // res.render('index', { title: 'Express',length:'2'});
  res.render('login', { title: 'login',length:'2'});
});



module.exports = router;

