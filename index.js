  const argv = require('yargs')
    .command('$0 <file> [arg]',
      'display file\'s byte representation',
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
    .option('p', {
      alias: 'sep',
      demandOption: false,
      default: ' ',
      describe: 'bytes separator',
      type: 'string'
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
      return true;
    })
    .help('help')
    .alias('h', 'help')
    .alias('v', 'version')
    .argv


  const filePath = argv.file;
  const bytesSeparator = argv.sep;
  const {
    columns,
    base,
    start
  } = argv;
  let bytesToRead = argv.read;
  const wrapZero = leadingZero();

  main()

  async function main() {
    try {
      const {
        open,
        stat
      } = require('fs').promises

      const fileStat = await stat(filePath);

      if (!fileStat.isFile())
        throw new Error(`"${filePath}" is not a file`)

      const fileSize = fileStat.size;

      if (
        bytesToRead === null ||
        fileSize < (start + bytesToRead)
      )
        bytesToRead = fileSize - start;

      const file = await open(filePath, 'r');
      const buf = Buffer.alloc(1);

      let position = start;
      for (let i = 0; i < bytesToRead; i++) {
        await file.read(buf, 0, 1, position++);
        process.stdout.write(wrapZero(buf[0].toString(base)));
        if ((i + 1) % columns === 0) {
          process.stdout.write('\n');
        } else {
          process.stdout.write(bytesSeparator);
        }
      }
      if (bytesToRead % columns !== 0)
        process.stdout.write('\n');

      await file.close();

    } catch (err) {
      console.error(err);
    }
  }

  function leadingZero() {
    const maxWidth = 0xff.toString(base).length;
    return num => {
      num = String(num);
      return `${'0'.repeat(maxWidth - num.length)}${num}`
    }
  }