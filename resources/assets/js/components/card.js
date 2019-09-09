export class Card{
    constructor(name){
        this._name = name;
        this.shouldUpdate = true;
        this.isUpdate = false;
        this.rendered = false;
        this.$container = $(`<div class="ui crm raised card" data-uid="" style="display:none"></div>`)
        this.getUid = this.getUid.bind(this);
        this.getCardName = this.getCardName.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.render = this.render.bind(this);
        this.compare = this.compare.bind(this);
    }
    getUid(){
        return this._uid;
    }
    getCardName(){
        return this._name;
    }
    getTitle(){
        return '';
    }
    render(){
        const that = this;
        return new Promise( (resolve,reject) => {
            if(this.rendered){resolve(that);return;}
            that.$container.attr('data-uid',that._uid);
            if(that.draw) that.draw();
            else {
                console.warn('no draw func',that);
                reject(that);
            }
            resolve(that);
        });
    }
    compare(data){
        return true;
    }
}
