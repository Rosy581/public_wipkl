class Logger{
    constructor(logg){
        this.fs = require("node:fs")
        if(this.fs.existsSync(logg)){
            this._log = logg;
        } else {
            console.log("File not found...")
            console.log("Creaing file...")
            this.fs.writeFile(`${logg}`, '', (err)=>{
                if(err){
                    console.error(err)
                }
            });
            this._log = logg
        }
    }
    setLog(str){
        if(this.fs.existsSync(`str`)){
            this._log = str
            console.log(str)
        } else {
            console.log("File not found...")
            console.log("Creaing file...")
            fs.writeFile(`${str}`, '', (err)=>{
                if(err){
                    console.error(err)
                }
            });
            this._log = `${str}`
        }
    }
    log(inp){
        let a = new Date(Date.now());
        this.fs.appendFile(this._log,`${inp} --- ${a.getHours()}:${a.getMinutes()} ${a.getSeconds()}.${a.getMilliseconds()}\n`, (er)=>{
            if(er){
                console.error(er)
            }   
        }
    )};   
}
module.exports = Logger