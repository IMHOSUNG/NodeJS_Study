 
module.exports  = class TaskQueue {
    constructor (concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask (task) {
        this.queue.push(task);
        this.next();
    }

    next() {
        while (this.running < this.concurrency 
            && this.queue.length){
            
            //shift 배열의 첫 아이템 제거
            const task = this.queue.shift();
            task( ()=> {
                console.log("in task")
                this.running--;
                this.next();
            })
            console.log("out task")
            this.running++;
        }
    }
}







