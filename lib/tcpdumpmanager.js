/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const TcpdumpLine = require('./tcpdumpline');
const Raddec = require('raddec');
const advlib = require('advlib-identifier');


/**
 * TcpdumpManager Class
 * Manages the tcpdump interfaces.
 */
class TcpdumpManager {

  /**
   * TcpdumpManager constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    this.barnowl = options.barnowl;
    this.monitorsByOrigin = {};
  }

  /**
   * Handle the given tcpdump line
   * @param {Object} packet The tcpdump line to handle.
   */
  handleTcpdumpLine(line) {
    switch(line.type) {
      case TcpdumpLine.TYPE_DECODED_RADIO_SIGNAL:
        handleDecodedRadioSignal(this, line);
        break;
    }
  }
}


/**
 * Translate and produce the given decoded radio signal as a Raddec.
 * @param {ReelManager} instance The given ReelManager instance.
 * @param {ReelPacket} packet The decoded radio signal packet.
 */
function handleDecodedRadioSignal(instance, line) {
  let isKnownOrigin = instance.monitorsByOrigin.hasOwnProperty(line.origin);

  if(isKnownOrigin) {
    let monitor = instance.monitorsByOrigin[line.origin];
    line.rssiSignature.forEach(function(entry) {
      entry.receiverId = monitor.receiverId;
      entry.receiverIdType = monitor.receiverIdType;
    });
  }
  else {
    line.rssiSignature.forEach(function(entry) {
      entry.receiverId = null;
      entry.receiverIdType = advlib.identifiers.TYPE_UNKNOWN;
    });
  }

  let raddec = new Raddec(line);
  instance.barnowl.handleRaddec(raddec);
}


module.exports = TcpdumpManager;
