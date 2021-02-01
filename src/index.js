const { program, Option } = require('commander');
const path = require('path');
const NeDownload = require('./download');

const main = async() => {
  program
      .version('0.0.1')
      .description('It is a CLI tool which can download shapefile from Natural Earth')
      .addOption(new Option('-o, --output [value]', 'output directory path'))
      .addOption(new Option('-d, --definition [value]', 'definition json file path'));
  program.parse(process.argv);
  const options = program.opts();
  const outputDir = options.output
  if (!outputDir){
    console.error("Please specify output directory path");
    return;
  }
  const definition = options.definition;
  if (!definition){
    console.error("Please specify output definition JSON file path");
    return;
  }
  const define = require(definition)
  const downloader = new NeDownload(outputDir, define);
  const files = await downloader.download();
  return files;
}

module.exports = main();