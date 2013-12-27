var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	irc = require('irc'),
	request = require('request');

app.listen(80);


function handler (req, res) {
	fs.readFile(__dirname + req['url'],
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('<h3>Error loading ' + __dirname + req['url'] + '</h3>');
		}

		res.writeHead(200);
		res.end(data);
	});
}

io.configure(function() {
	// Restrict log output
	io.set("log level", 2);
});

io.sockets.on('connection', function (socket) {
	socket.on('list', function (data) {
		fs.readdir('./levels/',function (err,files) {
			socket.emit('return list', {files:files});
		});
	});

	socket.on('get level',function (d) {
		fs.readFile('./levels/' + d['name'], function read(err, data) {
			if (err) {
				throw err;
			}
			socket.emit("send level",{level:data.toString('utf8', 0, data.length)});
		});
	});

	socket.on('write level',function(d){
		if (d['pw'] == 'p_p') {
			fs.writeFile("./levels/" + d['name'], d['data']);
			socket.emit('level written',{});
		}
		else {
			socket.emit('bad password',{});
			console.log('bad password');
		}
	});

	socket.on('remove level', function(d){
		var error = 0;
		fs.unlink('./levels/' + d['ltr'], function (err) {
			error = 1;
			console.log('Level could not be deleted:' + err);
		});
		
		if (error === 0) {
			socket.emit('level removed',{});
		}
	});
});