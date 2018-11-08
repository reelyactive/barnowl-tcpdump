/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


const TcpdumpLine = require('./tcpdumpline');
const advlib = require('advlib-identifier');


const RSSI_MAC_REGEX = /(-\d+)dB.*SA:((?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2})/;


/**
 * Decode a tcpdump line from the given string.
 * @param {TcpdumpLineQueue} queue The queue of lines as strings.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 */
function decodeTcpdumpLine(queue, origin, time) {
  let type = TcpdumpLine.TYPE_DECODED_RADIO_SIGNAL;
  let found = queue.match(RSSI_MAC_REGEX);
  let isCompleteMatch = found && (found.length >= 3);

  if(isCompleteMatch) {
    let transmitterId = found[2];
    let rssi = Number(found[1]);
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
