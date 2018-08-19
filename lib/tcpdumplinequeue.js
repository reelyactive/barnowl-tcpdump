/**
 * Copyright reelyActive 2018
 * We believe in an open Internet of Things
 */


/**
 * TcpdumpLineQueue Class
 * Convenience class for string queue of tcpdump output lines.
 */
class TcpdumpLineQueue {

  /**
   * TcpdumpLineQueue constructor
   * @constructor
   */
  constructor(data) {
    this.data = data || '';
  }

  /**
   * Add data to the queue.
   * @param {String} data The string to add.
   */
  addData(data) {
    this.data += data;
  }

  /**
   * Slice the data at the given index.
   * @param {Number} index The index from which to slice the data.
   */
  sliceAtIndex(index) {
    this.data = this.data.slice(index);
  }

  /**
   * Determine the index of the given string, if present.
   * @param {String} string The string to look for.
   * @return {Number} The index of the given string if present, else -1.
   */
  indexOf(string) {
    return this.data.indexOf(string);
  }
}


module.exports = TcpdumpLineQueue;
