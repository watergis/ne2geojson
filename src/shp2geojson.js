const shapefile = require('shapefile');
const modify = require('./modify');
const path = require('path');


class Shp2GeoJSON{
    constructor() { }

    convert(target) {
        return new Promise((resolve, reject) => {
            // console.log(target);
            const fileName = path.basename(target).split('.').slice(0, -1).join('.');
            shapefile.read(target, undefined, {
                encoding: "utf-8"
              })
            .then(geojson => {
                // const features = [];
                geojson.features.forEach(f => {
                    f.file = fileName
                    let _f = modify(f)
                    if (_f){
                        process.stdout.write(`\x1e${JSON.stringify(_f)}\n`);
                        // features.push(_f);
                    }
                })
                // console.log(`\x1e${JSON.stringify(features)}\n`)
                resolve();
            })
            .catch(err => reject);
        })
        
    }
}

module.exports = Shp2GeoJSON;