const fs = require('fs');


const readJSONCatchError = (filename, callback) => {
    fs.readFile(filename, 'utf8',(err,data)=> {
        let parse;
        if (err)
            return callback(err);
        
        try{
            parse = JSON.parse(data);
        }catch(err){
            //ERR 정보를 return 하지 않으면
            //readJSON에서는 어떠한 에러가 났는지 알 수 없다.
            //내부에서 실행되는 JSON.parse(data)에 대한 에러를 처리할 수 없다.
            return callback(err)
        }
        

        callback(null,parse)
    })
}

const readJSON = (filename, callback) => {
    fs.readFile(filename, 'utf8',(err,data)=> {
        let parse;
        if (err)
            return callback(err);
        
        try{
            parse = JSON.parse(data);
        }catch(err){
            //ERR 정보를 return 하지 않으면
            //readJSON에서는 어떠한 에러가 났는지 알 수 없다.
            //내부에서 실행되는 JSON.parse(data)에 대한 에러를 처리할 수 없다.
            return callback(err)
        }
        

        callback(null,parse)
    })
}

readJSONCatchError('nonJSON.txt', err => console.log(err))
readJSON('nonJSON.txt', err => console.log(err))


