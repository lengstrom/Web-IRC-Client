var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	irc = require('irc'),
	url = require('url'),
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

// io.configure(function() {
// 	// Restrict log output
// 	io.set("log level", 2);
// });

io.sockets.on('connection', function (socket) {
	var clients = {};
	//socket.emit('send message', {args:args,cmd:command,server:activeServer,to:activeRoom});
	socket.on('send message',function(d){ //
		switch (d.cmd) {
			case 'say':
				clients[d.server].say(d.to, d.args[0]);
				break;
		}
	});

	socket.on('server connect', function(d) {
		socketHost = d.server.match(/[^\.]*\.[^\.]*$/)[0];
		if (typeof clients[socketHost] === 'undefined') {
			clients[socketHost] = new irc.Client(d.server, d.nick, {
				port: (typeof d.port === 'undefined') ? 6667 : d.port,
				floodProtection: true,
				autoRejoin: false,
				stripColors:true,
				autoConnect: false,
				username: (typeof d.username === 'undefined') ? "placeholderun" : d.username,
				realname: (typeof d.realname === 'undefined') ? "placeholderrn" : d.realname
			});

			clients[socketHost].addListener('error', function(message) {
				socket.emit('client error', {message:message, server:socketHost});
			});

			clients[socketHost].addListener('names', function(channel, nicks) {
				socket.emit('channel joined', {channel:channel, nicks:nicks, server:socketHost});
			});

			clients[socketHost].addListener('motd', function(motd) {
				socket.emit('motd receieved', {motd:motd, server:socketHost});
			});

			// clients[socketHost].addListener('registered', function(message) {
			// 	socket.emit('joined server', {message:message, server:socketHost});
			// });

			clients[socketHost].addListener('topic', function(channel, topic, nick, message) {
				socket.emit('topic received', {channel:channel, topic:topic, nick:nick, message:message, server:socketHost});
			});

			clients[socketHost].addListener('join', function(channel,nick,message) {
				socket.emit('user joined', {channel:channel, nick:nick, message:message, server:socketHost});
			});

			clients[socketHost].addListener('part', function(channel, nick, reason, message) {
				socket.emit('user parted', {channel:channel, nick:nick, reason:reason, message:message, server:socketHost});
			});

			clients[socketHost].addListener('quit', function(channel, nick, reason, message) { //NOT DONE
				socket.emit('user quit', {channel:channel, nick:nick, reason:reason, message:message, server:socketHost});
			});

			clients[socketHost].addListener('message', function (from, to, message) {
				socket.emit('message', {from:from, to:to, message:message, server:socketHost});
			});

			clients[socketHost].addListener('notice', function (nick, to, text, message) {
				socket.emit('noticed received', {nick:nick, to:to, text:text, message:message, server:socketHost});
			});

			clients[socketHost].addListener('ctcp', function (from, to, text, type, message) {
				socket.emit('ctcp notice', {from:from, to:to, text:text, type:type, message:message, server:socketHost});
			});

			clients[socketHost].addListener('nick', function (oldnick, newnick, channels, message) {
				socket.emit('nick changed', {oldnick:oldnick, newnick:newnick, channels:channels, message:message, server:socketHost});
			});
///
			clients[socketHost].addListener('kick', function (channel, nick, by, reason, message) {
				socket.emit('person kicked', {channel:channel, nick:nick, by:by, reason:reason, message:message});
			});

			clients[socketHost].addListener('kill', function (nick, reason, channels, message) {
				socket.emit('person killed', {nick:nick, reason:reason, channels:channels, message:message});
			});

			clients[socketHost].addListener('+mode', function (channel, by, mode, argument, message) {
				socket.emit('mode added', {channel:channel, by:by, mode:mode, argument:argument, message:message});
			});

			clients[socketHost].addListener('-mode', function (channel, by, mode, argument, message) {
				socket.emit('mode removed', {channel:channel, by:by, mode:mode, argument:argument, message:message});
			});
///
			clients[socketHost].addListener('invite', function (channel, from, message) {
				socket.emit('invited', {channel:channel, from:from, message:message, server:socketHost});
			});

			clients[socketHost].addListener('whois', function (info) {
				socket.emit('whois complete', {info:info, server:socketHost});
			});

			clients[socketHost].addListener('channellist', function (channel, from, message) {
				socket.emit('listing complete', {channel:channel, from:from, message:message, server:socketHost});
			});

			clients[socketHost].addListener('error', function (message) {
				socket.emit('server error', {message:message, server:socketHost});
			});

			clients[socketHost].connect(3,function(){
				socket.emit('server connected', {server: socketHost, clientData:clients[socketHost].opt});
				for (var channel = 0; channel < d.channels.length; channel++) {
					clients[socketHost].join(d.channels[channel]);
				}
				// socket.emit();
			});

		}
		else {
			socket.emit('existing server'); //server is already on list, can't connect twice
		}

		socket.on('disconnect', function(){
			for (var i in clients){
				clients[i].disconnect("Quitting");
			}
		});
	});
});