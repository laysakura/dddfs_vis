exports.replicaConnDb = '/home/nakatani/dddfs_db/replica.sqlite'
var mdDirPath = '/home/nakatani/dddfs_md_mvmnt'
exports.tracedFiles = [
    'traceA',
    'traceB',
    'traceC',
].map(function(elem) {
    return mdDirPath + '/' + elem;
});
