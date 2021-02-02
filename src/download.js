const axios = require('axios');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const rimraf = require('rimraf');


class NeDownload{
  constructor(outputDir, define){
    this.BASE_URL="https://www.naturalearthdata.com/http//www.naturalearthdata.com/download";
    this.outputDir = outputDir;
    this.DATA_LIST = define;
  }

  async download(){
    if (!fs.existsSync(this.outputDir)){
      fs.mkdirSync(this.outputDir);
    }
    let promises = [];
    this.DATA_LIST.forEach(ne=>{
      let f =`${ne[2]}.zip`
      let url = `${this.BASE_URL}/${ne[0]}/${ne[1]}/${f}`;
      promises.push(this.download_shp(url, this.outputDir));
    })
    const shapefiles = await Promise.all(promises);
    return shapefiles;
  }

  download_shp(url, output){
    return new Promise((resolve, reject)=>{
      axios.get(url, {responseType: 'arraybuffer'}).then(response => {
        const filename = path.basename(url);
        const filepath = path.join(output, filename);
        if (!fs.existsSync(filepath)){
          fs.writeFileSync(filepath, response.data);
        }
        const shp_file = filepath.replace(/.zip/g, '');
        if (fs.existsSync(shp_file)) {
          rimraf.sync(shp_file);
        }
        fs.createReadStream(filepath).pipe(unzipper.Extract({ path: shp_file }));
        resolve(`${shp_file}/${path.basename(shp_file)}.shp`);

      }).catch(err=>{reject(err)});
    })
  }
}

module.exports = NeDownload;