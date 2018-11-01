/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;


const DEFAULT_EXIT_ON_CLOSE = false;


/**
 * SpawnListener Class
 * Spawns tcpdump and listens for data from stdout.
 */
class SpawnListener {

  /**
   * SpawnListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    options = options || {};

    this.decoder = options.decoder;
    this.exitOnClose = options.exitOnClose || DEFAULT_EXIT_ON_CLOSE;

    enableMonitor(function(address) {
      self.origin = address;
      initiateTcpdump(self);
    });
  }
}


/**
 * Synchronously spawn iw and ifconfig to get the monitor running, and query
 * the MAC of the monitor as origin.
 * @param {function} callback The function to callback on completion.
 */
function enableMonitor(callback) {
  let origin;

  let iw = spawnSync('iw', ['phy', 'phy0', 'interface', 'add', 'mon0', 'type',
                            'monitor']);
  if(iw.stderr.length > 0) {
    console.log('barnowl-tcpdump: iw', iw.stderr.toString());
  }

  let ifconfig = spawnSync('ifconfig', ['mon0', 'up']);
  if(ifconfig.stderr.length > 0) {
    console.log('barnowl-tcpdump: ifconfig', ifconfig.stderr.toString());
  }

  let cat = spawnSync('cat', ['/sys/class/net/mon0/address']);
  let address = cat.stdout.toString();
  console.log('barnowl-tcpdump: SpawnListener on address', address);

  return callback(address);
}


/**
 * Spawn tcpdump and handle the resulting data on stdout.
 * @param {SpawnListener} instance The SpawnListener instance.
 */
function initiateTcpdump(instance) {
  let tcpdump = spawn('tcpdump', ['-i', 'mon0', '-elt', '-s', '0', 'type',
                                  'mgt', 'subtype', 'probe-req']);

  tcpdump.stdout.setEncoding('utf8');
  tcpdump.stdout.on('data', function(data) {
    let time = new Date().getTime();
    instance.decoder.handleTcpdumpData(data, instance.origin, time);
  });
  tcpdump.on('close', function() {
    console.log('barnowl-tcpdump: tcpdump closed in SpawnListener');
    if(instance.exitOnClose) {
      process.exit(-1);
    }
  });
}

module.exports = SpawnListener;
