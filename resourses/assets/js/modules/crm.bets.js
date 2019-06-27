class Bets {
    constructor(url,login,password,$cont){
        this.url=url;
        this.username=login;
        this.password = password;
        this.$cont = $cont;
        this.timeout = 8000;
        $.ajaxSetup({
            headers: null
        });
    }

    start(){
        const that = this;
        that.log('Started...');
        that.requestSession()
            .then(function(){
                that.login()
                    .then(function(){
                        that.request({
                            "command": "get",
                            "params": {
                                "source": "betting"
                            }
                        },(d)=>{
                            that.log(`get response ${JSON.stringify(d,null,2)}`)
                        });
                    })
                    .catch((x)=>{console.error(x);})
            })
            .catch((x)=>{console.error(x);});

    }
    log(){
        const d = new Date();
        const {$cont} = this;
        for(let i in arguments){
            $cont.append(`[${d.getHours().leftPad()}:${d.getMinutes().leftPad()}:${d.getSeconds().leftPad()}]&nbsp;&nbsp;&nbsp;&nbsp;${arguments[i]}<br/>`);
        }
    }
    requestSession(){
        const that = this;
        that.log('Request session...');
        return that.request({
                "command": 'request_session',
                "params": {
                    "site_id": 1,
                    "language": 'ru'
                }
            }, (d)=>{
                const ses = d.data.sid;
                $.ajaxSetup({
                    headers: {
                        'swarm-session': ses
                    }
                });
                that.log('Session got '+ses)
            }
        );
    }
    login(){
        const that = this;
        that.log('Loging in...');
        return that.request({
                "command": "login",
                "params": {
                    "username": that.username,
                    "password": that.password
                }
            }, (d)=>{
                that.log(`login response ${JSON.stringify(d,null,2)}`)
            }
        );
    }
    request(query,callback){
        const that = this;
        return new Promise((resolve,reject) => {
            $.ajax({
                url:that.url,
                type:"post",
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: true,
                data:JSON.stringify(query),
                beforeSend:(xhr)=>{
                    xhr.setRequestHeader("Access-Control-Request-Headers", "*");
                },
                success:(d,s,x)=>{
                    if(typeof callback == 'function') callback(d);
                    resolve(d);
                },
                error:(x)=>{
                    reject(x);
                },
                complite:(d,x,s)=>{}
            });
        });

    }
};
