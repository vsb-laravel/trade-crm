export class Defer{
    constructor(data,model,callback,need=false){
        this.data=data;
        this.model=model;
        this.callback=callback;
        this.need=need;
        this.load=this.load.bind(this);
        this.load();
    }
    load(){
        const that = this;
        const {data,model,need,callback} = that;
        if(!data.id)return;
        if(data[need]){
            callback(data);
            return;
        }
        $.ajax({
            url: `/${model}/${data.id}`,
            success:(d)=>{
                $.extend(data,d);
                callback(data);
            }
        });
    }
}
