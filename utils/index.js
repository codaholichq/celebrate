'strict'

export class Util {

  // Get current date
  static #today = new Date()
  // get two days in advance and pad with 0 if it's a single digit
  static #twoDaysAdvance = ('0' + (this.#today.getDate() + 2).toString()).slice(-2)
  // get month and pad with 0 if it's a single digit
  static #month = ('0' + (this.#today.getMonth() + 1).toString()).slice(-2)

  static twoDaysMonth() {
    return this.#twoDaysAdvance + '-' + this.#month
  }

  static getMonthFromString(month) {
    const d = Date.parse(month + '1, 2012')
    if (!isNaN(d)) {
      // get month and pad with 0 if it's a single digit
      return ('0' + (new Date(d).getMonth() + 1)).slice(-2)
    }
    return -1
  }

  static monthName(mon) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][mon - 1]
  }

  static range(start, end) {
    var foo = []
    for (var i = start; i <= end; i++) {
      foo.push(('0' + i).slice(-2))
    }
    return foo
  }

  /**
   *
   * @param {*} str
   * @description capitalizes the first letter in a word
   * @returns string
   */
  static capitalize(str) {
    return str
      .split('')
      .map((c, i) => i ? c.toLowerCase() : c.toUpperCase())
      .join('')
  }

  static days() {
    return Array.from({
      length: 32
    }, (v, i) => i).slice(1)
  }
}


// Gives "TypeError: Cannot read property 'toUpperCase' of undefined"
// static capitalize(input) {
//   const [initial, ...rest] = input
//   const capitalizedInitial = initial.toUpperCase()
//   const loweredBody = rest.join('').toLowerCase()

//   return `${capitalizedInitial}${loweredBody}`
// }
