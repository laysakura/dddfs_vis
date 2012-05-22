
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
var md = require('./public/javascripts/metadata.server.js');
var fs = require('fs');


// Startup logging
log ('[Traced Files]');
log(md.tracedFiles);


// Polling for metadata
var mdInfo = {}; // This assosiative array is sent to clients
var mdInfoPolling = setInterval(function() {
    md.tracedFiles.map(function(tracedFile) {
        fs.readFile(tracedFile, 'utf8', function(err, data) {
            // TODO: deal with the situation where trace[ABC] is not exsits
            if (err) throw err;
            mdInfo[tracedFile] = data;
        });
    });
}, 1000);


// Create socket listening to app
var socketIO = require('socket.io');
var io = socketIO.listen(app);


// When a client connets to me:
io.sockets.on('connection', function(socket) {
    log("[connection]");

    // Process initial request for md info
    socket.on('req md info init', function(client) {
        log('[MD info Request from ' + client.sessionId + ']');
        socket.emit('md info init', mdInfo);
    });

    // Process request for iptable
    socket.on('req iptable', function(client) {
        log('[Iptable Request from ' + client.sessionId + ']');
        fs.readFile('./public/json/iptable.json', 'utf8', function(err, data) {
            if (err) throw err;
            socket.emit('iptable', eval(JSON.parse(data)));
        });
    });

    // Process request for cluster geometoric info
    socket.on('req cluster geo', function(client) {
        log('[Cluster Geometoric info Request from ' + client.sessionId + ']');
        fs.readFile('./public/json/cluster.geometory.json', 'utf8', function(err, data) {
            if (err) throw err;
            socket.emit('cluster geo', eval(JSON.parse(data)));
        });
    });

    // Process request for md info
    socket.on('req md info', function(client) {
        log('[MD info Request from ' + client.sessionId + ']');
        socket.emit('md info', mdInfo);
    });

    // When the client disconnects from me:
    socket.on('disconnect', function(){
        log("[disconnect]");
    });
});
