/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const tcpdumpLineDecoder = require('./tcpdumplinedecoder');
const TcpdumpLineQueue = require('./tcpdumplinequeue');


/**
 * TcpdumpDecoder Class
 * Decodes data streams from one or more tcpdump streams and forwards the
 * packets to the given TcpdumpManager instance.
 */
class TcpdumpDecoder {

  /**
   * TcpdumpDecoder constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.tcpdumpManager = options.tcpdumpManager;
    this.queuesByOrigin = {};
  }

  /**
   * Handle data from a tcpdump stream, specified by the origin
   * @param {String} data The tcpdump data.
   * @param {String} origin The unique origin identifier of the source.
   * @param {Number} time The time of the data capture.
   */
  handleTcpdumpData(data, origin, time) {
    let self = this;
    let isNewOrigin = (!this.queuesByOrigin.hasOwnProperty(origin));
    if(isNewOrigin) {
      this.queuesByOrigin[origin] = new TcpdumpLineQueue(data);
    }
    else {
      this.queuesByOrigin[origin].addData(data);
    }
    let lines = tcpdumpLineDecoder.decode(this.queuesByOrigin[origin],
                                          origin, time);
    lines.forEach(function(line) {
      self.tcpdumpManager.handleTcpdumpLine(line);
    });
  }
}


module.exports = TcpdumpDecoder;
