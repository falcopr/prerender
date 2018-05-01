var argv = require('yargs').argv;

var Service = require('node-windows').Service;

var svc = new Service({
    name: 'Prerender.io Server',
    description: 'Prerender.io Server.',
    script: `./server.js`
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists:', svc.exists);
});
  
if (argv.install) {
    svc.install();
} else if (argv.uninstall) {
    svc.uninstall();
}