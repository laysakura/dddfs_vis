
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
// Utility functions
var log = console.log;


// Requires
var md = require('./public/javascripts/metadata.js');
var fs = require('fs');


// Startup logging
log ('[Traced Files]');
log(md.tracedFiles);


var mdInfo = {}; // This assosiative array is sent to clients
var mdInfoPolling = setInterval(function() {
    md.tracedFiles.map(function(tracedFile) {
        fs.readFile(tracedFile, function(err, data) {
            if (err) throw err;
            mdInfo[tracedFile] = data.toString();
        });
    });

    // fs.readdir(mdDirPath, function (err, files) {
    //     if (err) throw err;
    //     mdInfo = files;
    // });
}, 1000);


// ソケットを作る
var socketIO = require('socket.io');
// クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
var io = socketIO.listen(app);

// クライアントが接続してきたときの処理
io.sockets.on('connection', function(socket) {
    log("[connection]");

    // socket.on('message', function(data) {
    //     // つながっているクライアント全員に送信
    //     log("message");
    //     io.sockets.emit('message', { value: data.value });
    // });

    // Request for md info
    socket.on('req md info', function(data) {
        log('[MD info Request from ' + data.value + ']');
        log(mdInfo);
        socket.emit('md info', mdInfo);
        // socket.emit('md info',
        //             {
        //                 'traceA': 'mikity-format',
        //                 'traceB': 'mikity-format2',
        //             });
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
        log("[disconnect]");
    });
});
