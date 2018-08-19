/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


// Constants (Line suffix)
const LINE_SUFFIX = '\n';

// Constants (Type)
const TYPE_DECODED_RADIO_SIGNAL = 'decodedRadioSignal';
const TYPE_UNDEFINED = 'undefined';

// Constants (Radio decoding line)
const RSSI_SUFFIX = 'dB signal';
const MAC_PREFIX = 'SA:';


/**
 * TcpdumpLine Class
 * Represents a tcpdump packet
 */
class TcpdumpLine {

  /**
   * TcpdumpLine constructor
   * @param {String} type Type of tcpdump line.
   * @param {Object} content Content of the given line type.
   * @param {Object} origin Origin of the data stream.
   * @param {String} time The time of the data capture.
   * @constructor
   */
  constructor(type, content, origin, time) {
    content = content || {};

    // DecodedRadioSignal
    if(type === TYPE_DECODED_RADIO_SIGNAL) {
      this.type = TYPE_DECODED_RADIO_SIGNAL;
      this.transmitterId = content.transmitterId;
      this.transmitterIdType = content.transmitterIdType;
      this.rssiSignature = content.rssiSignature;
    }

    // Undefined
    else {
      this.type = TYPE_UNDEFINED;
    }

    this.origin = origin;
    this.time = time;
  }

}


module.exports = TcpdumpLine;
module.exports.TYPE_DECODED_RADIO_SIGNAL = TYPE_DECODED_RADIO_SIGNAL;
module.exports.TYPE_UNDEFINED = TYPE_UNDEFINED;
module.exports.LINE_SUFFIX = LINE_SUFFIX;
module.exports.RSSI_SUFFIX = RSSI_SUFFIX;
module.exports.MAC_PREFIX = MAC_PREFIX;
