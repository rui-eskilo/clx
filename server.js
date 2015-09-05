
var debug = require('debug')('clx');
var app = require('./app');

app.set('port', process.env.PORT || 3435);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  debug(':: CLX ::    Application Ready    :: CLX :: ');
});
