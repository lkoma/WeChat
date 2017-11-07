'use strict'

const fs = require('fs');
const Promise = require('bluebird');

exports.readFileAsync = function(fpath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, (err, content)=> {
            if (err) {
                reject(err);
            }
            else {
                resolve(content.toString());
            }
        });
    });
};
exports.writeFileAsync = function(fpath, content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, err=> {
            if (err) reject(err)
            else resolve()
        });
    });
};
