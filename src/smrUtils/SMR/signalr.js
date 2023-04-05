import * as signalR from '@aspnet/signalr'

export class SignalR{
    constructor(url,time){
        console.log(url); 
        this.url = url;
        this.callback = null;
        this.connection_status = false;
        this.auto_reconnect = true;
        this.retry_time = time || 3000;
        this.connection = new signalR.HubConnectionBuilder()
                                    .withUrl(url)
                                    .configureLogging(signalR.LogLevel.Information)
                                    .build();
        let _this = this;
        // 自动重连
        this.connection.onclose( (err)=> {
            if(this.auto_reconnect == false){
                console.log('主动销毁连接，中止重连');
                return ;
            }
            console.log('自动重连');
            _this.connection_status = 'reconnecting';
            _this.star(_this.callback);
        });
    }

    star(callback){
        // console.log(callback);
        let _this = this;
        _this.callback = callback;
        let f = async (resolve) => {
            try{
                await _this.connection.start();
                if(_this.connection_status === 'reconnecting'){
                    setTimeout(()=>{
                        _this.callback();
                    },1000);
                }
                _this.connection_status = true;
                resolve();
            }
            catch(err){
                console.log(err);
                console.log(`retry after ${_this.retry_time} ms`,);
                setTimeout(async ()=>  f(resolve),_this.retry_time);
            }
        };
        const promise = new Promise( (resolve) =>{
            f(resolve);  
        });
        return promise;
    }

    dispose(){
        this.connection.stop();
        this.connection_status = false;
        this.auto_reconnect = false;
        this.connection = null;
    }
}

// export default SignalR;