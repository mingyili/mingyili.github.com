/*!
 * Last Update : 2016-02-25 04:04:09
 */
!function(a){var b=function(){this.inited=!1,this.defaultId=""};b.prototype.open=function(b){this.inited?a.popup($plug):this.init(b)},b.prototype.init=function(b){var c=this;b.defaultId&&(c.defaultId=b.defaultId),b.url&&(c.url=b.url),b.callback&&(c.callback=b.callback);var d='<div class="popup"><header class="bar bar-nav"><a class="button button-link button-nav pull-right close-popup"><span class="icon close icon-close"></span></a><h1 class="title">选择加息券</h1></header><div class="content infinite-scroll" data-distance="100" data-toggle="scroller" data-type="js"><div class="content-inner"><div class="list-block media-list list-full select-list"></div></div></div>';$plug=a(a.popup(d,!1)),$plug.one("opened",function(){c.inited||(a.infiniteLoad.load({page:$plug,url:c.url,initScroll:!0,processList:function(a,b){c.addItems(a,b)}}),c.inited=!0)}),$plug.on("click",".label-checkbox",function(){var b=a(this),d=b.data("info");$plug.find(".label-checkbox.checked").removeClass("checked"),b.addClass("checked"),c.defaultId=d.id,c.callback(d),setTimeout(function(){a.closeModal($plug)},100)})},b.prototype.addItems=function(b,c){var d=this,e="";a.each(b,function(b,f){e=f.id===d.defaultId?"checked":"";var g=a('<div class="label-checkbox item-content '+e+'">'),h='<div class="item-inner"><div class="item-title-row"><div class="item-title">'+f.title+'<span class="color-danger">+'+f.rate+'%</span></div></div><div class="item-subtitle color-primary">'+f.info+'</div><div class="item-subtitle color-gray">有效期至'+f.enddate+'</div><div class="item-media"><i class="icon icon-form-checkbox"></i></div>';g.html(h).data("info",f).appendTo(c)})},a.selectCoupon=new b}(Zepto);