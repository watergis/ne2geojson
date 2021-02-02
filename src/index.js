const { program, Option } = require('commander');
const path = require('path');
const NeDownload = require('./download');
const Shp2GeoJSON = require('./shp2geojson');


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

const convert = async() => {
  process.stdin.on('data', function (chunk) {
    const data = chunk.toString();
    data.split(' ').forEach(shp => {
      const converter = new Shp2GeoJSON();
      converter.convert(shp).then(features => {
        features.forEach(f => {
          process.stdout.write(`\x1e${JSON.stringify(f)}\n`);
        })
      });
    })
  });
  process.stdin.on('end', ()=>{});
}

// see about commander.js
// https://github.com/tj/commander.js/
const main = async () => {
  
  program
    .version('0.0.1');
  
  program
    .command('download [output] [definition]')
    .description('It is a CLI tool which can download shapefile from Natural Earth')
    .action(async (output, definition, options) => {
      await download(output, definition)
    });
  program
    .command('convert')
    .description('It is a CLI tool which can convert Shapefile to GeoJSON')
    .action(async () => {
      await convert();
    })
  program.parse(process.argv);
}

module.exports = main();