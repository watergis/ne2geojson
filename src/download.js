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
    let shapefiles = [];
    for (let i = 0; i<this.DATA_LIST.length; i++){
      let ne = this.DATA_LIST[i];
      let f =`${ne[2]}.zip`
      let url = `${this.BASE_URL}/${ne[0]}/${ne[1]}/${f}`;
      let shp = await this.download_shp(url, this.outputDir);
      shapefiles.push(shp);
    }
    return shapefiles;
  }

  download_shp(url, output){
    return new Promise((resolve, reject)=>{
      const filename = path.basename(url);
      const filepath = path.join(output, filename);
      const shp_dir = filepath.replace(/.zip/g, '');
      const shp_file = `${shp_dir}/${path.basename(shp_dir)}.shp`;
      if (fs.existsSync(filepath)){
        if (!fs.existsSync(shp_dir)){
          fs.createReadStream(filepath).pipe(unzipper.Extract({ path: shp_dir }));
        }
        resolve(shp_file);
      }else{
        axios.get(url, {responseType: 'arraybuffer'}).then(response => {
          fs.writeFileSync(filepath, response.data);
          if (!fs.existsSync(shp_dir)) {
            fs.createReadStream(filepath).pipe(unzipper.Extract({ path: shp_dir }));
          }
          resolve(shp_file);
  
        }).catch(err=>{reject(err)});
      }
    })
  }
}

module.exports = NeDownload;