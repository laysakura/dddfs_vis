/*
@input
192.34.9.12,/data/local2/mikity/data/CERQIoxHItCihtxf,0

@returns
  When input is valid:
  {
    ip: '192.34.9.12',
    localPath: '/data/local2/mikity/data/CERQIoxHItCihtxf',
    size: 0,
  }

  When input is invalid:
  undefined
*/
var mdInfoLine2mdInfoHash = function(line) {
    var elems = line.split(',');
    if (elems.length != 4) {
        return undefined;
    }
    return {ip: elems[0], localPath: elems[1], size: elems[2], replSrcIp: elems[3]};
};
