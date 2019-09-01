// 비동기로 일어날 때 정상 작동
// 동기로 일어나면 비정상 작동
// 만들 때 꼭 고려하면서 만들 것
// 비동기 : 요청과 결과가 동시가 아니다.
// 동기 : 요청과 결과가 한 묶음 (transaction)

const EventEmitter = require('events').EventEmitter
const fs = require('fs')

class FindPattern extends EventEmitter {
    constructor (regex) {
        super();
        this.regex = regex;
        this.files = []
    }

    addFile(files) {
        this.files.push(files);
        return this;
    }

    find() {
        this.files.forEach( file => {
            fs.readFile(file,'utf8', (err,content) => {
                if(err) {
                    return this.emit('error', err);
                }

                this.emit('fileread', file)

                let match = null;
                //string.match(regex) < js api 
                if(match = content.match(this.regex)){
                    match.forEach(elem => this.emit('found', file, elem));
                }
            })
        })
        return this
    }

}

const findPattern = new FindPattern(/hello \w+/);
findPattern
    .addFile('fileA.txt')
    .find()
    .on('found', (file,match) => console.log(`Matched "${match}" in file ${file}`))
    .on('error', err=>console.log(err.message))
    .on('fileread', (file) => console.log(`file ${file}`))