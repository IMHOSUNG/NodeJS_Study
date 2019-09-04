"use strict";

const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
// html dom 을 읽기 위해 필요한 모듈
const cheerio = require('cheerio');

module.exports.urlToFilename = function urlToFilename(url) {
  const parsedUrl = urlParse(url);
  console.log("url in urltoFilename " + url +"     " + parsedUrl.path)
  const urlPath = parsedUrl.path.split('/')
    .filter(function(component) {
      return component !== '';
    })
    .map(function(component) {
      return slug(component, { remove: null });
    })
    .join('/');
  console.log("urlPath "+ urlPath.toString())

  let filename = path.join(parsedUrl.hostname, urlPath);
  if(!path.extname(filename).match(/htm/)) {
    filename += '.html';
  }
  return filename;
};

module.exports.getLinkUrl = function getLinkUrl(currentUrl, element) {
  const link = urlResolve(currentUrl, element.attribs.href || "");
  console.log("element.attribs.href "+element.attribs.href + " resolve " + link)
  const parsedLink = urlParse(link);
  const currentParsedUrl = urlParse(currentUrl);
  if(parsedLink.hostname !== currentParsedUrl.hostname
    || !parsedLink.pathname) {
    return null;
  }
  return link;
};

module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(function(element) {
      return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element) {
      console.log("element " + !element + " answer "+ !!element)
      return !!element;
    });
};

//Promise.resolve : thenable이나 값으로 새로운 프라미스를 생성
//Promise.rejcet(err) : 주어진 이유로 거부되는 프라미스 객체를 만든다.
module.exports.promisify = function (callbackBasedApi) {
  return function promisified() {
  
    // Array.prototype.slice.call(arguments)
    // 매개변수로 들어온 값을 array로 변환하겠다.
    // function func(a,b)  >> argument[0], argument[1] 로 접근 가능하다. 
    // arguments 는 Object이다. 
    const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    
    console.log("args "+args +" argument" + arguments)
    
    return new Promise((resolve, reject) => {
      //프라미스 생성자 , 즉시 호출자에게 반환
      args.push((err,result) => {
        // 프라미스의 생성자에 전달된 함수에서 특별한 콜백
        // 콜백이 항상 인자에 마지막 목록에 위치 한다는 것을 알 수 있다.
        if(err){
          return reject(err)
        }
        if(arguments.length <= 2){
          //console.log(result)
          resolve(result)
        }else{
          console.log("slice " + [].slice.call(arguments+1))
          resolve([].slice.call(arguments,1))
        }
      });
      console.log(args);

      callbackBasedApi.apply(null,args)
    })
  }
}

