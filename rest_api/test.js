// make sure curl is installed

var shell = require('shelljs');
var getKey = JSON.parse(shell.exec("curl http://127.0.0.1:3030/k", { silent: true }).stdout)

file = "/home/studio/Pictures/Vrydy-Supernova-3840x2160.jpg"

var getIPFSHash = shell.exec("curl -F file=@" + file + " -F key=" + getKey.key + "  http://127.0.0.1:3030/f", { silent: true }).stdout

console.log(getIPFSHash)