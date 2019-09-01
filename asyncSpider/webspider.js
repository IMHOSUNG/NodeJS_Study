const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilities = require('./utils')

// 비동기 callback 처리
// callback hell 계속 중첩되는 콜백 함수를 조심 할 것
/*
    따라서 
    if(err){
        callback(err)
    }
    else{
        
    }

    구조가 아닌

    if(err){
        return callback(err)
    }
    구조를 사용하여 코드를 줄일 것 
*/

const saveFile = (filename, contents, callback) => {
    mkdirp(path.dirname(filename), err => {
        if(err)
            return callback(err)

        fs.writeFile(filename,contents, callback);
    });
}

const download = (url, filename, callback) => {
    console.log(`Downloading ${url}`)
    request(url, (err, response, body)=> {
        if(err)
            return callback(err);
        saveFile(filename, body, err => {
            if(err)
                return callback(err)

            console.log(`Downloaded and saved : ${url}`)
            callback(null, body)
        })
    })
} 

const spider = (url,callback) => {
    const filename = utilities.urlToFilename(url);
    fs.exists(filename, exists => {
        if(exists)
            return callback(null, filename, false);

        download(url, filename, err => {
            if(err){
                return callback(err);
            }
            callback(null, filename, true);
        })
    })
}

spider(process.argv[2] , (err, filename, download) => {
    if(err) {
        console.log(err)
    }else if(download){
        console.log(`completed ${filename}`);
    }
    else{
        console.log(`already ${filename}`)
    }
})

// 사용법 명령어
// node webspider.js http://www.example.com