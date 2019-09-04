// 프로미스 화
"use strict";
//콜백 기반 함수를 프로미스 화
const utilities = require('./utils');

const request = utilities.promisify(require('request'));
const fs = require('fs');
const mkdirp = utilities.promisify(require('mkdirp'));
const path = require('path');
const readFile = utilities.promisify(fs.readFile)
const writeFile = utilities.promisify(fs.writeFile)

function spiderLinks(currentUrl , body, nesting) {
    let promise = Promise.resolve()
    if(nesting == 0){
        return promise;
    }
    const links = utilities.getPageLinks(currentUrl, body);
    links.forEach(link => {
        promise = promise.then(()=> spider(link, nesting-1))
    })

    return promise
}

function download(url, filename) {
  console.log(`Downloading ${url}`);
  let body;
  return request(url)
    .then(response => {
        body = response.body
        return mkdirp(path.dirname(filename));
    })
    .then(() => {
        writeFile(filename,body)
    })
    .then(() => {
        console.log(`Downloaded and saved : ${url}`)
        return body;
    })
}

function spider (url , nesting) {
    let filename = utilities.urlToFilename(url)
    return readFile(filename, 'utf8')
    .then(
        (body) => (spiderLinks(url,body,nesting)),
        (err) => {
            if(err.code != 'ENOENT'){
                throw err;
            }
            return download(url, filename)
            .then(body => spiderLinks(url, body, nesting))
        }
    )
}
spider(process.argv[2], 3)
    .then(()=>console.log('Download Complete'))
    .catch( err => console.log(err) )

// 사용법 명령어
// node webspider2.js http://www.example.com