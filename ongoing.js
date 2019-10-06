var forever = require('forever-monitor');

var child = new (forever.Monitor)('./silence.js', {
  silent: false
});

child.on('exit', function () {
  console.log('your-filename.js has exited after 3 restarts');
});

child.start();

