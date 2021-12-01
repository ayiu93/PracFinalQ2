/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date: Nov. 30, 2021
 * Author: Anthony Yiu
 *
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then((dir) => IOhandler.readDir(dir))
  .then((images) => { images.forEach(image => {
    IOhandler.grayScale(image, pathProcessed)
  })})
  .catch((err) => console.log(err));
