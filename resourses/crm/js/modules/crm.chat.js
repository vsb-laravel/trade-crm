class Chat {
    constructor(){
        this.user=system.user;
        this.needRender = true;

        this.container = null;
        this.messages = [];
        this.url = '/chat';
        this.selector = '#chat';
        this.container = $(this.selector);
        this.render();
    };
    render(){
        if(!this.needRender)return;
        // console.debug('Chat rendered');
        // this.container = $(``).appendTo('body');
        // this.container.append(``);
        this.needRender = false;
    }
    list(){
        const that = this;
        $.ajax({
            url:this.url,
            type: 'get',
            error:function(x,s){},
            success:function(d,x,s){
                that.messages = d;
            },
            complete:function(x,s){}
        });
    }
};
const chat = new Chat();
