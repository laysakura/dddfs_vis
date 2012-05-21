// @input
// 192.34.9.12,/data/local2/mikity/data/CERQIoxHItCihtxf,0
// @returns:
// {ip: '192.34.9.12',
//  localPath: '/data/local2/mikity/data/CERQIoxHItCihtxf',
//  size: 0,
// }
var mdInfoLine2mdInfoHash = function(line) {
    var elems = line.split(',');
    return {ip: elems[0], localPath: elems[1], size: elems[2]};
};
