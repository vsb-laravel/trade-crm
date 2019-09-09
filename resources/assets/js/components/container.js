import { Card } from './card';
export class Container{
    constructor(){
        this.$toggler = $('#cards_container_toggler,#cards_container_closer');
        this.$container = $('#cards_container');
        this.$content = $('#cards_container_content');
        this.$counter = $('#cards_container_count');
        this.$menu = $('#cards_container_menu');
        this.$container.sidebar({
            duration: 0,
            onVisible: ()=>{ console.debug((new Date()).toString(),'sidebar showing'); },
            onShow: ()=>{ console.debug((new Date()).toString(),'sidebar showed'); this.slided = true; if(window.menuBar)window.menuBar.sidebar("hide");},
            onHide: ()=>{ console.debug('sidebar hidding'); },
            onHidden: ()=>{ console.debug('sidebar hidden'); this.slided = false; }
        });
        this.$container.sidebar('attach events', '#cards_container_toggler,#cards_container_closer')
        this.cards = {};
        this.append = this.append.bind(this)
        this.appendOneCard = this.appendOneCard.bind(this)
        this.slice = this.slice.bind(this)
        this.before = this.before.bind(this)
        this.after = this.after.bind(this)
        this.show = this.show.bind(this)
        this.touch = this.touch.bind(this)
        this.slideLeft = this.slideLeft.bind(this)
        this.slideRight = this.slideRight.bind(this)
        this.hide = this.hide.bind(this)
        this.slided = false;
        this.active = false;
        let dims = {
            display: Math.floor($(document).height()),
            header: Math.ceil($(`#crm_header`).height()),
            footer: Math.ceil($(`#crm_footer`).outerHeight()),
        }
        let cheight = this.$container.height-2*dims.header-28;
        this.$container.css({top:dims.header+8})
        // this.$content.css({height:cheight})
        // console.debug('dims',cheight, dims);

        this.after();
    }
    before(){
        // if(Object.keys(this.cards).length==0){
        //     this.slideRight();
        // }else {
        //     this.slideLeft();
        // }
    }
    after(){
        const that = this;
        this.$counter.text(Object.keys(this.cards).length)
        if(Object.keys(this.cards).length==0)this.slideRight();else this.slideLeft();
        this.$menu.find('.item:not(#cards_container_closer)').addClass('remove');
        this.$content.find('.card').addClass('remove');
        for(let uid in this.cards){
            const card = this.cards[uid];
            if(this.$menu.find(`.item[data-uid="${uid}"]`).length==0){
                // card.render().then( (that) => {that.$container.appendTo(this.$content)});
                let adds = (window.onlineUsers && card.getCardName() == 'user' && window.onlineUsers.list[card.user.id])?'online':'';
                let mitem = $(`<a class="ui simple crm ${adds} item" data-uid="${uid}"><i class="ui ${card.getCardName()} icon"></i>${card.getTitle()}</a>`).appendTo(this.$menu);
                mitem.on('click',()=>{that.show(uid)});
                $('<a class="ui grey link"><i class="ui close icon"></i></a>').appendTo(mitem).on('click',()=>{that.slice(card);})
            }else {
                this.$container.find(`[data-uid="${uid}"]`).removeClass('remove');
            }
        }
        this.$menu.find('.item.remove').remove();
        this.$content.find('.card.remove').remove();
        if(this.active!==false)this.show(this.active);
        else if(Object.keys(this.cards).length){
            this.show(this.cards[Object.keys(this.cards)[0]].getUid());
        }
        // $(".ui.tabular .item:not(.tab-assigned)").addClass('tab-assigned').tab();
    }
    show(uid){
        this.cards[uid].render().then( (that) => {
            that.$container.appendTo(this.$content);
            this.$content.find(`.crm.card:not(.crm.card[data-uid="${uid}"])`).hide();
            this.$menu.find(`.item:not(.item[data-uid="${uid}"])`).removeClass('active');
            this.$content.find(`.crm.card[data-uid="${uid}"]`).show();
            this.$menu.find(`.item[data-uid="${uid}"]`).addClass('active').get()[0].scrollIntoView();
            skymechanics.reload();
            this.active = uid;
        });

    }
    append(cards){
        return new Promise( (resolve,reject) => {
            this.before();
            if( !Array.isArray(cards) ) cards = [cards];
            new Promise( (resolve,reject) => {
                cards.map( (card,i)=> {
                    this.appendOneCard(card);
                });
                resolve();
            }).then( ()=>{
                this.after();
            } );
            resolve();
        });
    }
    appendOneCard(card){
        if(card instanceof Card){
            if(this.cards[card.getUid()]==undefined){
                this.cards[card.getUid()] = card;
                this.active = card.getUid();
                // console.log((new Date()).toString(),'container appends '+Object.keys(this.cards).length);
            }else{
                this.show(card.getUid());

            }
        }
    }
    slice(card){
        if(card instanceof Card){
            if(this.active == card.getUid()) this.active=null;
            delete this.cards[card.getUid()];
        }
        this.after();
    }
    touch(cuid){
        // console.debug('container touch',cuid,this.cards[cuid].user,$(`.card[data-uid=${cuid}]`));
        if(this.cards[cuid] && this.cards[cuid].shouldUpdate){
            this.cards[cuid].render().then( (that) => {
                $(`.card[data-uid=${cuid}]`).replaceWith(that.$container.show());
            })
            // if(this.active)this.show(this.active);
        }
    }
    slideLeft(){
        if(this.slided)return;
        console.log((new Date()).toString(),'container showing sidebar');
        this.$container.sidebar('show');
        this.$toggler.fadeIn();
        this.slided = true;
    }
    slideRight(){
        if(!this.slided)return;
        console.log((new Date()).toString(),'container hiding sidebar');
        this.$container.sidebar('hide');
        this.$toggler.hide();
        this.slided = false;
        this.active = false;
    }
    hide(){
        this.$container.sidebar('hide');
        if(Object.keys(this.cards).length) this.$toggler.fadeIn();
    }
}
