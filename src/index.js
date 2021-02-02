const { program, Option } = require('commander');
const path = require('path');
const NeDownload = require('./download');

const download = async(output, definition) => {
  if (!output){
    console.error("Please specify output directory path");
    return;
  }
  if (!definition){
    console.error("Please specify output definition JSON file path");
    return;
  }
  const define = require(definition)
  const downloader = new NeDownload(output, define);
  const files = await downloader.download();
  process.stdout.write(files.join(' '));
}

// see about commander.js
// https://github.com/tj/commander.js/
const main = async() => {
  program
    .version('0.0.1')
    .command('download [output] [definition]')
    .description('It is a CLI tool which can download shapefile from Natural Earth')
    .action(async (output, definition, options) => {
      await download(output, definition)
    })
  program.parse(process.argv);
}

module.exports = main();