// FLOAT AND DOUBLE TO BE DONE

// returns proper function to align the strings
function getAlignment(alignment, fill, longest) {
  // Math.max should be changed once double and float are dealt with
  switch (alignment) {
    case 'left':
      return str => `${str}${fill.repeat(Math.max(longest - str.length, 0))}`
    case 'right':
      return str => `${fill.repeat(Math.max(longest - str.length, 0))}${str}`
    case 'center':
      return str => {
        const toDistribute = Math.max((longest - str.length) / 2, 0)
        return `${fill.repeat(Math.ceil(toDistribute))}${str}${fill.repeat(Math.floor(toDistribute))}`
      }
  }
}

// returns the longest possible string value for a given structure
function getLongest(type, bitSize, base) {
  // to be changed
  if (['double', 'float'].includes(type))
    return 0;
  
  const longestValues = {
    uint: {
      8: 255,
      16: 65535,
      32: 4294967295,
      64: 18446744073709551615n
    },
    int: {
      8: -128,
      16: -32768,
      32: -2147483648,
      64: -9223372036854775808n
    },
    // double: 0,
    // float: 0
  }
  return longestValues[type][bitSize].toString(base).length;
}
/*
Int8
  127
  -128
Int16
  32767
  -32768
Int32
  2147483647
  -2147483648
BigInt64
  9223372036854775807n
  -9223372036854775808n
*/

/*
UInt8
  255
UInt16
  65535
UInt32
  4294967295
BigUInt64
  18446744073709551615n
*/

module.exports = {
  getAlignment,
  getLongest
};