// yargs magic :)
// need to think about arg names
module.exports = require('yargs')
  .parserConfiguration({
    'duplicate-arguments-array': false
  })
  .command('$0 <file> [arg]',
    'Display file\'s byte representation.',
    yargs => {
      yargs.positional('file', {
        describe: 'file to display',
        type: 'string'
      })
    })
  .option('s', {
    alias: 'start',
    demandOption: false,
    default: 0,
    describe: 'file position to start reading',
    type: 'number'
  })
  .option('r', {
    alias: 'read',
    demandOption: false,
    default: null,
    describe: 'number of bytes to read (null for all)',
    type: 'number'
  })
  .option('c', {
    alias: 'columns',
    demandOption: false,
    default: 10,
    describe: 'columns to display',
    type: 'number'
  })
  .option('b', {
    alias: 'base',
    demandOption: false,
    default: 16,
    describe: 'number base to display bytes in (2-36)',
    type: 'number'
  })
  .option('t', {
    alias: 'type',
    demandOption: false,
    default: 'uint',
    describe: 'type of values',
    type: 'string',
    choices: ['uint', 'int', 'double', 'float']
  })
  .option('o', {
    alias: 'bitSize',
    demandOption: false,
    default: 8,
    describe: 'bit size of values to display',
    type: 'number',
    choices: [8, 16, 32, 64]
  })
  .option('e', {
    alias: 'endianness',
    demandOption: false,
    default: 'be',
    describe: 'endianness for >8 bit values',
    type: 'string',
    choices: ['le', 'be']
  })
  .option('p', {
    alias: 'separator',
    demandOption: false,
    default: ' ',
    describe: 'bytes separator',
    type: 'string',
  })
  .option('a', {
    alias: 'align',
    demandOption: false,
    default: 'right',
    describe: 'how to align numbers in a column',
    type: 'string',
    choices: ['left', 'right', 'center']
  })
  .option('f', {
    alias: 'fill',
    demandOption: false,
    default: '0',
    describe: 'fill to be applied to align numbers',
    type: 'string',
  })
  .check((argv) => {
    if (argv.columns <= 0 || !Number.isInteger(argv.columns))
      throw new Error('columns option should be an integer bigger than 0')
    if (argv.base < 2 || argv.base > 36 || !Number.isInteger(argv.base))
      throw new Error('base option should be an integer between 2 and 36')
    if (argv.start < 0 || !Number.isInteger(argv.start))
      throw new Error('start option should be an integer bigger than 0')
    if (argv.read !== null && (argv.read < 1 || !Number.isInteger(argv.read)))
      throw new Error('read option should be an integer bigger than 0')
    if (argv.type === 'float') argv.bitSize = 32;
    if (argv.type === 'double') argv.bitSize = 64;
    return true;
  })
  .help('help')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv