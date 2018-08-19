/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const TcpdumpLine = require('./tcpdumpline');
const advlib = require('advlib-identifier');


/**
 * Decode a tcpdump line from the given string.
 * @param {TcpdumpLineQueue} queue The queue of lines as strings.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 */
function decodeTcpdumpLine(queue, origin, time) {
  let type = TcpdumpLine.TYPE_DECODED_RADIO_SIGNAL;
  let rssiSuffixIndex = queue.indexOf(TcpdumpLine.RSSI_SUFFIX);
  let macPrefixIndex = queue.indexOf(TcpdumpLine.MAC_PREFIX);
  let isRssiPresent = (rssiSuffixIndex >= 0);
  let isMacPresent = (macPrefixIndex >= 0);

  if(isRssiPresent && isMacPresent) {
    let transmitterId = queue.data.substr(macPrefixIndex + 3, 17);
    let rssi = queue.data.substr(rssiSuffixIndex - 3, 3);
    let rssiSignature = [{ rssi: rssi }];
    let radioDecoding = {
        transmitterId: transmitterId,
        transmitterIdType: advlib.identifiers.TYPE_EUI48,
        rssiSignature: rssiSignature
    };
    return new TcpdumpLine(type, radioDecoding, origin, time);
  }

  return new TcpdumpLine(TcpdumpLine.TYPE_UNDEFINED, null, origin, time);
}


/**
 * Decode all the tcpdump lines from the string.
 * @param {TcpdumpLineQueue} queue The queue of lines as strings.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 */
function decode(queue, origin, time) {
  let packets = [];
  let indexOfSuffix = queue.indexOf(TcpdumpLine.LINE_SUFFIX);
  let isSuffixPresent = (indexOfSuffix >= 0);

  while(isSuffixPresent) {
    let packet = decodeTcpdumpLine(queue, origin, time);

    // Recognised packet, add to packets
    if(packet.type !== TcpdumpLine.TYPE_UNDEFINED) {
      packets.push(packet);
    }

    queue.sliceAtIndex(indexOfSuffix + 1);
    indexOfSuffix = queue.indexOf(TcpdumpLine.LINE_SUFFIX);
    isSuffixPresent = (indexOfSuffix >= 0);
  }

  return packets;
}


module.exports.decode = decode;
