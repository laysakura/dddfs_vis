exports.replicaConnDb = '/home/nakatani/dddfs_db/replica.sqlite'
var mdDirPath = '/data/local2/mikity/meta'
exports.tracedFiles = [
    'traceA',
    'traceB',
    'traceC',
].map(function(elem) {
    return mdDirPath + '/' + elem;
});
