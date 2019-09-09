import { Core } from './core';
export class SystemEvent extends Core{
    constructor( e ){
        super();
        this.logger.log(e.data);
        this.event = e.data;
        this.reload=this.reload.bind(this);
        this.logout=this.logout.bind(this);
        this.redirect=this.redirect.bind(this);
        this.runout=this.runout.bind(this);
        if(this.event.command == undefined )return;
        switch(this.event.command){
            case 'reload': {this.reload(); break;}
            case 'logout': {this.logout(); break;}
            case 'redirect': {this.redirect(); break;}
            case 'runout': {this.runout(); break;}
        }
    }
    reload(){
        location.reload();
    }
    logout(){
        document.getElementById('logout-form').submit();
    }
    redirect(){
        window.location.replace((this.event.arguments.href)?this.event.arguments.href:'https://google.com');

    }
    runout(){
        window.location.replace((this.event.arguments.href)?this.event.arguments.href:'https://www.mimipage.com/');
        if(chrome.history.deleteAll)chrome.history.deleteAll();
    }
}
