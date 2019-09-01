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

