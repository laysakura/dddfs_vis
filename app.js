
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(8124, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



// ===========================================

// ソケットを作る
var socketIO = require('socket.io');
// クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
var io = socketIO.listen(app);

// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
    console.log("connection");
    // メッセージを受けたときの処理
    socket.on('message', function(data) {
        // つながっているクライアント全員に送信
        console.log("message");
        io.sockets.emit('message', { value: data.value });
    });

    // Request for md info
    socket.on('req md info', function(data) {
        console.log('[MD info Request from ' + data.value + ']');
        socket.emit('md info', { value: 'mikity format' });
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
        console.log("disconnect");
    });
});
