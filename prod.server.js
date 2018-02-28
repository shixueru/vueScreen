var express = require('express');
//  var config = require('.configindex');

var port = '8086';

var app = express();

var router = express.Router();

router.get('', function (req, res, next) {
	req.url = 'index.html';
	next();
});

app.use(router);

app.use(express.static('./vueScreen'));

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at httplocalhost' + port + 'n')
});