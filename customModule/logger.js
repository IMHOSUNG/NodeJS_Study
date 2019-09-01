//substack Pattern
// Nodejs 모듈은 한가지만 책임을 지는 원칙 , 책임은 모듈에 의해 캡슐화가 되어야 한다.
// arrow function 사용 불가 arrow function은 Callable 한 function 이지만
// new를 사용하는 constructable 한 함수는 아니다.
// 트리 구조로 이루어진 각 파일에서 호출 할 경우 
// Logger 함수 자체가 new로 계속 재 생성되는 문제가 있다.

function Logger (name) {
  if(!new.target){
      return new Logger(name);
  }
  this.name = name;
}

Logger.prototype.log = function (message) {
  console.log(`${this.name} ${message}`);
}

Logger.prototype.info = function(message){
    this.log(`info : ${message}`)
}

Logger.prototype.verbose = function(message){
    this.log(`verbose : ${message}`)
}

module.exports = Logger;
