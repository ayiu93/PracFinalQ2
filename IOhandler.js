/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov. 30, 2021
 * Author: Anthony Yiu
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise ((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on('close', () => {
        console.log("Extraction operation complete")
        resolve(pathOut)
      })
      .on('error', err => reject(err))
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise ((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      pngArray = []
      files.forEach(file => {
        if(path.extname(file) == '.png')
          pngArray.push(path.join(dir, path.basename(file)))
      })
      if (err)
        reject(err)
        
      resolve(pngArray)
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise ((resolve, reject) => { 
      fs.createReadStream(pathIn)
        .pipe(new PNG())
        .on("parsed", function () {
          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              let idx = (this.width * y + x) << 2;
              let avg = (this.data[idx] + this.data[idx+1] + this.data[idx+2]) / 3
     
              this.data[idx] = avg;
              this.data[idx + 1] = avg;
              this.data[idx + 2] = avg;
            }
          }
          resolve(this.pack().pipe(fs.createWriteStream(path.join(pathOut, path.basename(pathIn)))),
            console.log(`${path.basename(pathIn)} complete`));
        })
        //.on('error', (error) => console.log(error))
        .on('error', err => reject(err))
  })
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
