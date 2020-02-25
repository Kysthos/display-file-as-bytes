module.exports = function (type, bitSize, endianness) {
  typeFormat = () => {
    switch (type) {
      case 'int':
        return `${bitSize === 64 ? 'Big' : ''}Int`
      case 'uint':
        return `${bitSize === 64 ? 'Big' : ''}UInt`
      case 'double':
        return 'Double'
      case 'float':
        return 'Float'
    }
  }
  sizeFormat = () => ['double', 'float'].includes(type) ? '' : bitSize;
  endiannessFormat = () => bitSize === 8 &&
    !['double', 'float'].includes(type) ?
    '' : endianness.toUpperCase()

  return `read${typeFormat()}${sizeFormat()}${endiannessFormat()}`;
}