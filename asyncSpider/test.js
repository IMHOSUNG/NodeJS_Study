const urlParse = require('url').parse;
const urlResolve = require('url').resolve;
const slug = require('slug');
const path = require('path');
// html dom 을 읽기 위해 필요한 모듈
const cheerio = require('cheerio');

function urlToFilename(url) {
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

console.log(urlToFilename("https://www.naver.com/test/node"))