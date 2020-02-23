```
index.js <file> [arg]

display file's byte representation

Positionals:
  file  file to display                                                 [string]

Options:
  -s, --start    file position to start reading            [number] [default: 0]
  -r, --read     number of bytes to read (null for all) [number] [default: null]
  -c, --columns  columns to display                       [number] [default: 10]
  -b, --base     number base to display bytes in (2-36)   [number] [default: 16]
  -p, --sep      bytes separator                         [string] [default: " "]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

Usage example: 

`node index.js package.json`

```
7b 0a 20 20 22 6e 61 6d 65 22
3a 20 22 5f 64 69 73 70 6c 61
79 5f 62 79 74 65 73 22 2c 0a
20 20 22 76 65 72 73 69 6f 6e
22 3a 20 22 31 2e 30 2e 30 22
2c 0a 20 20 22 64 65 73 63 72
...
```
`node index.js package.json -s 10 -r 8 -c 4 -b 2 -p '   '`
```
00111010   00100000   00100010   01011111
01100100   01101001   01110011   01110000
```
