const EventEmitter = require('events').EventEmitter
const fs = require('fs')

const findPattern = (files, regex) => {
    const emitter = new EventEmitter();
    files.forEach((file) => {
        fs.readFile(file,'utf8', (err, content)=> {
            if(err)
                return emitter.emit('error', err);
            
            emitter.emit('fileread', file)
            let match;
            if(match = content.match(regex))
                match.forEach(elem => emitter.emit('found', file, elem))
        });
    });
    return emitter;
}

findPattern(
    ['fileA.txt'],
    /hello \w+/g
).on('fileread', file => console.log(file + ' was read'))
.on('found', (file,match) => console.log(match + ' was founded in ' + file ))
.on('error', err => console.log(err.message))
