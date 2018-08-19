/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const EventEmitter = require('events').EventEmitter;
const TestListener = require('./testlistener.js');
const TcpdumpDecoder = require('./tcpdumpdecoder.js');
const TcpdumpManager = require('./tcpdumpmanager.js');


/**
 * BarnowlTcpdump Class
 * Converts tcpdump output into standard raddec events.
 * @param {Object} options The options as a JSON object.
 * @constructor
 */
class BarnowlTcpdump extends EventEmitter {

  /**
   * BarnowlTcpdump constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    super();
    options = options || {};

    this.listeners = [];
    this.tcpdumpManager = new TcpdumpManager({ barnowl: this });
    this.tcpdumpDecoder = new TcpdumpDecoder({
        tcpdumpManager: this.tcpdumpManager
    });
  }

  /**
   * Add a listener to the given hardware interface.
   * @param {Class} ListenerClass The (uninstantiated) listener class.
   * @param {Object} options The options as a JSON object.
   */
  addListener(ListenerClass, options) {
    options = options || {};
    options.decoder = this.tcpdumpDecoder;

    let listener = new ListenerClass(options);
    this.listeners.push(listener);
  }

  /**
   * Handle and emit the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  handleRaddec(raddec) {
    // TODO: observe options to normalise raddec
    this.emit("raddec", raddec);
  }

  /**
   * Handle and emit the given infrastructure message.
   * @param {Object} message The given infrastructure message.
   */
  handleInfrastructureMessage(message) {
    this.emit("infrastructureMessage", message);
  }
}


module.exports = BarnowlTcpdump;
module.exports.TestListener = TestListener;
