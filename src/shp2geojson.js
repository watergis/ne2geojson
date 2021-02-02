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
                const features = [];
                geojson.features.forEach(f => {
                    f.file = fileName
                    let _f = modify(f)
                    if (_f){
                        features.push(_f);
                    }
                })
                resolve(features);
            })
            .catch(err => reject);
        })
        
    }
}

module.exports = Shp2GeoJSON;