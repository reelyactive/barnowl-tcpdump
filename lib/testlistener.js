/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const DEFAULT_RADIO_DECODINGS_PERIOD_MILLISECONDS = 1000;
const DEFAULT_RSSI = -70;
const MIN_RSSI = -90;
const MAX_RSSI = -50;
const RSSI_RANDOM_DELTA = 5;
const TEST_ORIGIN = 'test';


/**
 * TestListener Class
 * Provides a consistent stream of artificially generated tcpdump data.
 */
class TestListener {

  /**
   * TestListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;
    this.radioDecodingPeriod = options.radioDecodingPeriod ||
                               DEFAULT_RADIO_DECODINGS_PERIOD_MILLISECONDS;
    this.rssi = [ DEFAULT_RSSI, DEFAULT_RSSI ];

    setInterval(emitRadioDecodings, this.radioDecodingPeriod, this);
  }

}


/**
 * Emit simulated radio decoding packets
 * @param {TestListener} instance The given instance.
 */
function emitRadioDecodings(instance) {
  let time = new Date().getTime();
  let simulatedTcpdumpData = '1.0 Mb/s 2412 MHz 11b ' + instance.rssi[0] +
                             'dB signal antenna 1 BSSID:Broadcast DA:Broadcast SA:11:22:33:44:55:66 (oui Unknown) Probe Request (reelyActive) [1.0 2.0 5.5 11.0 Mbit]\n' +
                             '1.0 Mb/s 2412 MHz 11b ' + instance.rssi[1] +
                             'dB signal antenna 1 BSSID:Broadcast DA:Broadcast SA:aa:bb:cc:dd:ee:ff (oui Unknown) Probe Request () [1.0 2.0 5.5 11.0 Mbit]\n'; 
  updateSimulatedRssi(instance);
  instance.decoder.handleTcpdumpData(simulatedTcpdumpData, TEST_ORIGIN, time);
}


/**
 * Update the simulated RSSI values
 * @param {TestListener} instance The given instance.
 */
function updateSimulatedRssi(instance) {
  for(let index = 0; index < instance.rssi.length; index++) {
    instance.rssi[index] += Math.floor((Math.random() * RSSI_RANDOM_DELTA) -
                                       (RSSI_RANDOM_DELTA / 2));
    if(instance.rssi[index] > MAX_RSSI) {
      instance.rssi[index] = MAX_RSSI;
    }
    else if(instance.rssi[index] < MIN_RSSI) {
      instance.rssi[index] = MIN_RSSI;
    }
  }
}


module.exports = TestListener;
