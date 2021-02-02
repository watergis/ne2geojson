const shapefile = require('shapefile');


class Shp2GeoJSON{
    constructor() { }

    convert(target) {
        return new Promise((resolve, reject) => {
            // console.log(target);
            shapefile.read(target)
            .then(geojson => {
                geojson.features.forEach(f => {
                    f.tippecanoe = {
                        minzoom: 15,
                        maxzoom: 15,
                        layer: target
                    }
                })
                resolve(geojson);
            })
            .catch(err => reject);
        })
        
    }
}

module.exports = Shp2GeoJSON;