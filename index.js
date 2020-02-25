// get options from yargs
const argv = require("./helpers/parseArgs");
const {
  file: filePath,
  // number of columns
  columns,
  // number base to use
  base,
  // index of the first byte to read
  start,
  // endianness to use for the Buffer
  endianness,
  // type of the structure [int, uint, double, float]
  type,
  // bit size of the structure [8, 16, 32, 64]
  bitSize,
  // specifies how numbers should be aligned in a column
  // [left, center, right]
  align: alignment,
  // fill that should be used for the alignment
  fill,
  // string to be written between bytes
  separator: bytesSeparator
} = argv;
// how many bytes should be read from the file
// null for reading till the end of the file
let bytesToRead = argv.read;

// get the function to align numbers in columns
const { getAlignment, getLongest } = require("./helpers/alignment");
const longestValue = getLongest(type, bitSize, base);
const align = getAlignment(alignment, fill, longestValue);

// get the buffer function to use
const getStrategy = require("./helpers/strategy");
const readFn = getStrategy(type, bitSize, endianness);

// start the main script
main();

async function main() {
  try {
    const { open, stat } = require("fs").promises;

    // ensure the file is actually a file
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) throw new Error(`"${filePath}" is not a file`);

    const fileSize = fileStat.size;

    // if bytesToRead is null, we want to read the file to the end
    // adjust bytesToRead if start offset to read and bytesToRead are higher
    // than the actual file size
    if (bytesToRead === null || fileSize < start + bytesToRead)
      bytesToRead = fileSize - start;

    // get the file handle
    const file = await open(filePath, "r");

    // buffer size in bytes
    const bufferSize = bitSize / 8;

    // bytesToRead must be higher or equal than buffer size
    // to be able to read requested number type
    if (bytesToRead < bufferSize) return;

    const buf = Buffer.alloc(bufferSize);
    let position = start;
    let iterations = 0;

    // loop through the file
    for (
      let i = 0;
      i < bytesToRead;
      i += bufferSize, position += bufferSize, iterations++
    ) {
      // bytes read will be necessary to check if we can try
      // to read the requested number from the buffer without
      // throwing an error
      const { bytesRead } = await file.read(buf, 0, bufferSize, position);

      // if there's not enough bytes to read the requested structure
      // write a line of trailing full stops and exit
      if (bytesRead < bufferSize || i + bufferSize > bytesToRead) {
        process.stdout.write(".".repeat(longestValue) + "\n");
        return;
      }

      // read converted and aligned number to stdout
      process.stdout.write(align(buf[readFn]().toString(base)));

      // if column end, write a newline
      // otherwise, write the bytes separator
      if ((iterations + 1) % columns === 0) {
        process.stdout.write("\n");
      } else {
        process.stdout.write(bytesSeparator);
      }
    }

    // if we didn't end the loop on column end,
    // write additional newline character
    if (iterations % columns !== 0) process.stdout.write("\n");

    // and finally close the file handle
    await file.close();
  } catch (err) {
    console.error(err);
  }
}
