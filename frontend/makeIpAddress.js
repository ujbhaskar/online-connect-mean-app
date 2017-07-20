var os = require('os');
var ifaces = os.networkInterfaces();
var ip = '';
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
    ip = iface.address;
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
    ip = iface.address;
      //console.log(ifname, iface.address);
    }
    ++alias;
  });
});
console.log('got ip as : ', ip);


var input =`export class Configurations {
    constructor() {}
    getIpAddress(){
    	return 'ipAddress';
    }
}`;
var fs = require("fs");

// Synchronous read
/*function readFileSync(){
	input = fs.readFileSync('src/app/configurations/configurations.service.ts').toString();
}
readFileSync();*/
input = input.replace("ipAddress", ip);
fs.writeFile('src/app/configurations/configurations.service.ts', input, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});


var input =`import io from 'socket.io-client';
export const socket = io('http://ipAddress:3000');`;
input = input.replace("ipAddress", ip);
fs.writeFile('src/app/auth/provideSocket.ts', input, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

