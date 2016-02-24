/**/
Function.prototype.curry = function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this ;
    return function () {
        return that.apply(null , args.concat(slice.apply(arguments)));
    };
}; 
/*当循环执行的时候代替setTimeout,性能优化*/
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

/******* $.js code by Li_mingyi main for all activities 2016.01 *******/
/**
 * 动画展开/关闭
 $("Divs").open(anim, time);
 $("Divs").close(anim, time, des);
 anim: 动画包括：
     渐入 fadeAnim,(默认动画)
     弹出 popAnim,
     下滑 slideDAnim,
     上滑 slideUpAnim,
     右滑 slideRightAnim
     左滑 slideRightAnim
 time: 是动画时间
 des: 是否销毁
 */
(function($){
    $.fn.open = function(anim, time){
        var _this = $(this);
        
        if(_this.hasClass("hidden")){ 
            window.requestAnimFrame(_this.open.curry(anim, time));
        }else{
            time && _this.css("-webkit-animation-duration", time + "ms");
            anim = anim || "fadeAnim";
            _this.show().addClass(anim);
            _this.addClass("shown").animationEnd(function () {
                _this.removeClass(anim);
                _this.removeClass("shown");
            });
        }
    };
    $.fn.close = function(anim, time, des){ 
        var _this = $(this);
        if(_this.hasClass("shown")){ //如果显示动画还未执行完毕，过300ms再执行
            window.requestAnimFrame(_this.close.curry(anim, time));
        }else{
            time && _this.css("-webkit-animation-duration", time+"ms");
            anim = anim || "fadeAnim";
            _this.addClass(anim);
            _this.addClass("hidden").animationEnd(function(e){
                _this.hide();
                _this.removeClass(anim).removeClass("hidden");
                des && _this.remove();
            });
        }
    };
})($);

//移动端元素移除时再移回可视区域展示
(function($){
    $.fn.notInView = function(){
        var pos = this[0].getBoundingClientRect(),
            $window = $(window),
            view = {
                height: $window.height(),
                width: $window.width()
            };
        if (pos.top < 0 || pos.top > view.height || pos.left < 0 || pos.left > view.width) {
            pos.viewHeight = view.height;
            pos.viewWidth = view.width;
            return pos;
        }
        return false;
    }
    $.fn.moveToView = function(perc){ //百分比
        this.css({
            'transform': 'translate3d(0, 0, 0)',
            '-webkit-transform': 'translate3d(0, 0, 0)'
        });
        var pos = this.notInView();
        if (pos) {
            perc = perc || 0;
            var y = perc * pos.viewHeight - pos.top;
            this.css({
                'transform': 'translate3d(0, '+ y +'px, 0)',
                '-webkit-transform': 'translate3d(0, '+ y +'px, 0)'
            });
        }
    }
})($);
/**
 //弹窗
 $.showAlert({
        title: "",          //弹窗标题 
        text: "弹窗提示",   //弹窗文字
        yesText: "好的",     //确定按钮文字
        yesStyle: "b_green",       //确定按钮样式
        onYes: null,        //确定按钮的事件
        noText: "",          //取消按钮文字
        noStyle: "b_white",        //取消按钮样式
        onNo: null,         //取消按钮的事件
        animte: "fadeAnim", //弹出动画
        hasMask: true,         //显示遮罩
        clickMaskHide: false    //点击遮罩关闭
    });
 $.hideAlert("Animation"); //关闭弹窗
 $.reshowAlert(); //显示最近关闭的弹窗
 //遮罩
 $.showMask("Animation")
 $.hideMask("Animation")
 $.Mask //抛出创建的mask div, 调用, 绑定事件
 */
(function($){
    var alert;
    $.showAlert = function(option) { //定义弹窗
        $.hideActions(true);
        $.hideAlert(null, true);
        var opt = {
            title: "",          //弹窗标题
            text: "弹窗提示",   //弹窗文字
            yesText: "好的",     //确定按钮文字
            yesStyle: "b_blue",       //确定按钮样式
            onYes: null,        //确定按钮的事件
            noText: "",          //取消按钮文字
            noStyle: "b_white",        //取消按钮样式
            onNo: null,         //取消按钮的事件
            animte: "fadeAnim", //弹出动画
            clickMaskHide: false    //点击遮罩关闭
        };
        $.extend(opt, option);

        alert = initAlert();
        alert.text.html(opt.text);
        alert.btnY.html(opt.yesText);
        alert.btnY[0].className = "btn " + opt.yesStyle;
        alert.btnY.bind('click', function(){
            opt.onYes ? opt.onYes() : $.hideAlert(opt.animte);
        });
        if(opt.noText){ //显示取消按钮
            alert.btnN[0].className = "btn btn_half " + opt.noStyle;
            alert.btnN.css('display','table-cell').html(opt.noText);
            alert.btnN.bind('click', function(){
                opt.onNo ? opt.onNo() : $.hideAlert(opt.animte);
            }); //绑定取消事件
        }else{
            alert.btnN.hide();
        }
        if(opt.title){ //显示标题
            alert.tit.show().html(opt.title);
            alert.textcont.css('padding-top', '');
        }else{
            alert.tit.hide();
            alert.textcont.css('padding-top', '1rem');
        }
        
        //打开
        alert.div.open(opt.animte); //显示
        $.showMask(); //显示遮罩
        if(opt.clickMaskHide){
            $.Mask.bind('click', function(){ 
                $.hideAlert(opt.animte);
            });
        }
    };
    $.hideAlert = function(animte, unbind){ //关闭弹窗
        if (!alert) return;
        alert.div.close(animte, null, true);
        $.hideMask(unbind);
    };
    function initAlert(){//生成弹窗信息层
        var c = document.createElement("div");
        c.style.cssText = "z-index:11000; display:none; position:fixed; top:27%; left:50%; margin-left:-6rem; width:12rem; font-size:.8rem; background-color:#fff; text-align:center;-webkit-border-radius: .2rem; border-radius: .2rem;";
        c.className = "alert";
        
        var d = document.createElement("div") ;
        d.className = "btn_cont";
        
        var text_cont = document.createElement("div"),
            text = document.createElement("div"),
            tit = document.createElement("h3"),
            btnY = document.createElement("a"),
            btnN = document.createElement("a");
        tit.className = "alert_tit border_b";
        text_cont.className = "alert_text";
        text.style.textAlign = "left"
        btnY.className = "btn";
        btnN.style.cssText = "display:none;";
        btnN.className = "btn";
        text_cont.appendChild(text);
        c.appendChild(tit);
        c.appendChild(text_cont);
        d.appendChild(btnY);
        d.appendChild(btnN);
        c.appendChild(d);
        document.body.appendChild(c);
        c.addEventListener('touchmove', stopProp); //阻止滚动
        return {
            div: $(c),
            tit: $(tit),
            textcont: $(text_cont),
            text: $(text),
            btnY: $(btnY),
            btnN: $(btnN)
        }
    }

    //遮罩层
    $.newMask = function(index){
        var newMask = initMask(index);
        return newMask;
    }
    $.showMask = function(){
        $.Mask = $.Mask || initMask();
        if ($.Mask.height() > 0 ) return false;
        $.Mask.open();
    }
    $.hideMask = function(unbind){
        unbind ? $.Mask.unbind('click') : setTimeout('$.Mask.close()', 200);
    }
    function initMask(index){ //创建遮罩
        index = index || 10600; 
        var c = document.createElement("div");
        c.style.cssText = "z-index:"+ index +"; position:fixed; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,.8); display:none;";
        document.body.appendChild(c);
        c.addEventListener('touchmove', stopProp); //阻止滚动
        return $(c);
    }

    //底部操作
    /* 
    btns = [
        {
            text: "按钮文字",
            style: "按钮样式",
            onClick: '按钮事件'
        },
    ];
    cancal = {
        text: "按钮文字",
        style: "按钮样式",
        onClick: '按钮事件'
    }; */
    var $actions;
    $.showActions = function(btns, cancal){
        $.hideActions(true);
        $.hideAlert(null, true);

        var $temp = initActions(btns, cancal),
            $cancal = $temp.cancal;
        
        $actions = $temp.div;
        
        //事件绑定
        var $btns = $actions.find('.j_act_btn');
        $btns.each(function (index, ele) {
            $(ele).bind('click', function(){
                if (btns[index].onClick) btns[index].onClick($(this));
            });
        });
        
        //事件绑定
        $cancal && $cancal.bind('click', function(){
            $.hideActions();
            cancal && cancal.onClick && cancal.onClick($cancal);
        });

        $actions.open('slideUpAnim');
        $.showMask();

        $.Mask.bind('click', function(){
            $.hideActions();
        });
    };
    $.hideActions = function(unbind){
        if(!$actions) return;
        $actions.close('slideUpAnim', null, true);
        $.hideMask(unbind);
    };

    function initActions(btns, cancal){
        var c = document.createElement("div"),
            b = document.createElement("a"),
            chtml = "",
            len = btns.length;
        c.style.cssText = "z-index:11000; display:none;";
        c.className = "pull_actions pos_fix pos_bottom";
        for (var i = 0; i < len; i++) {
            chtml += '<a class="act_btn border_b j_act_btn '+ btns[i].style +'">'+ btns[i].text +'</a>';
        }
        c.innerHTML = chtml;
        
        //取消按钮
        if (!cancal){
            cancal = {
                text: '取消',
                style: 'red'
            };
        } else {
            cancal.text = cancal.text || '取消';
            cancal.style = cancal.style || 'red';
        }
        b.className = "act_btn " + cancal.style;
        b.innerHTML = cancal.text;
        
        c.appendChild(b);
        document.body.appendChild(c);
        
        c.addEventListener('touchmove', stopProp);//阻止滚动
        return {
            div: $(c),
            cancal: $(b),
        }
    }
})($);
/**
 //信息提示
 *Text 是要展示的文本
 *Time 是提示信息展示的时间，多长时间自动关闭，默认1s
 $.showTip("Text", "Time", "Animation"),    class = "my_tip";
 $.successTip("Text", "Time", "Animation"), class = "my_tip tip_success";
 $.errorTip("Text", "Time", "Animation"),   class = "my_tip tip_error";
 $.closeTip("Animation"),
 */
(function($){
    var tip, timer;
    function waitTimer(time, callback){
        clearTimeout(timer);
        timer = null;
        timer = setTimeout(function(){
            callback();
            timer = null;
        }, time); //确保输停留相应时间
    }
    $.showTip = function(text, time, animte) { //展示提示信息
        tip = tip || initTip();
        tip.text.html(text || "提示信息");
        tip.div.open(animte);
        tip.div[0].className = "my_tip";
        tip.div.css('margin-top', - ( tip.div.height() * .5 ) );
        tip.div.moveToView(.3);
        if(time !== 0) waitTimer(time || 1000, $.closeTip);
    },
    $.successTip = function(text, time, animte) { //展示提示信息
        $.showTip(text, time, animte);
        tip.div[0].className = "my_tip tip_success";
    },
    $.errorTip = function(text, time, animte) { //展示提示信息
        $.showTip(text, time, animte);
        tip.div[0].className = "my_tip tip_error";
    },
    $.closeTip = function(animte) { //关闭提示信息
        tip && tip.div.close(animte);
        timer = null;
    }
    function initTip() { //生成提示信息
        var c = document.createElement("div"),
            b = document.createElement("span"),
            chtml = "" ;
        c.style.cssText = "display:none; z-index: 11001; position: fixed; top: 50%; margin:-1rem auto 0; width: 100%; text-align: center;";
        chtml = "<div style='color: #fff; font-size: .8rem; padding: .45rem .8rem .4rem;margin: 0 auto;display: inline-block; -webkit-border-radius: .2rem; border-radius: .2rem; max-width: 10rem; background: rgba(0, 0, 0, 0.6);'></div>";
        c.innerHTML = chtml;
        c.className = 'my_tip';
        c.firstChild.appendChild(b);
        document.body.appendChild(c);
        return {
            div: $(c),
            text: $(b)
        }
    }
})($);
/**
 //顶部横条提示信息
 *text 是要展示的文本
 *time 是提示信息展示的时间，多长时间自动关闭，不写不关闭
 *color 背景色 默认黑色
 $.showBarTip("text", "time", "color"),    class = "bar_tip";
 $.hideBarTip(), //关闭
 */
(function($){
    var bartip, timer;
    function waitTimer(time, callback){
        clearTimeout(timer);
        timer = null;
        timer = setTimeout(function(){
            callback();
            timer = null;
        }, time); //确保输停留相应时间
    }
    $.showBarTip = function(text, time, color) { //展示提示信息
        bartip = bartip || initBarTip();
        color = color || 0;

        bartip.div[0].className = "bar_tip " + color;
        bartip.div.html(text || "横条信息");
        bartip.div.open('fadeAnim');
        time && waitTimer(time, $.hideBarTip);
    },
    $.hideBarTip = function() { //关闭提示信息
        bartip && bartip.div.close('fadeAnim', 300, true);
        bartip = null;
        timer = null;
    }
    function initBarTip() { //生成提示信息
        var c = document.createElement("div");
        c.style.cssText = "z-index:11001; display:none; line-height:1; padding:.4rem 0; text-align:center; position:fixed; top:0; width:100%; left:0;";
        document.body.appendChild(c);
        return {
            div: $(c)
        }
    }
})($);
/**
 *加载动画
 *text 加载文字
 *anime 出现的动画
 *$.showLoad('text', 'anime'); //显示
 *$.hideLoad(); //关闭
 */
(function($){
    var load;
    $.showLoad = function(text, animte) { //开启加载
        load = load || initLoad();
        load.text.html(text || "正在加载");
        load.div.open(animte, 150);
        $.Load = load.div;
    },
    $.hideLoad = function(animte) { //结束加载
        load && load.div.hide();
    }
    function initLoad() { //生成加载层
        var c = document.createElement("div"),
            b = document.createElement("span"),
            chtml = "" ;
        c.style.cssText = "z-index:11000; position:fixed; top:0; left:0; width:100%; height:100%; overflow:hidden; background: rgba(0,0,0,.1); text-align:center; display:none;";
        chtml = "<div style='min-width: 4rem; color: #fff; font-size: .8rem; margin: -5rem auto 0; position:relative; top:50%; -webkit-border-radius: .3rem; border-radius: .3rem; background: rgba(0, 0, 0, 0.6); display: inline-block; padding: .5rem .8rem;'>";
        chtml += "<img style='width:2rem;margin:.6rem auto; display:block;' src = 'data:image/gif;base64,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'/>";
        chtml += "</div>";
        c.innerHTML = chtml;
        c.firstChild.appendChild(b);
        document.body.appendChild(c);
        return {
            div: $(c),
            text: $(b)
        }
    }
})($);
/**
 //关注提示
 $.showFollow("Animation"); 
 $.hideFollow("Animation");
 //如果定义了$.FollowUrl 关注跳转连接，会默认跳转
 //如果是定义了$.FollowImg 关注二维码，会只显示二维码；
 */
(function($){
    var follow;
    $.showFollow = function(animte){ //展示
        if($.FollowUrl){ //定义了关注连接
            $.showLoad("正在跳转...");
            window.location.href = $.FollowUrl; //跳转关注
        }else{
            if(!follow){
                follow = initFollow();
                follow.btn.bind('click', function(){
                    $.hideFollow(animte);
                });
                follow.div.bind('touchmove', stopProp); //阻止滚动
            }
            follow.div.css('top', $('body').scrollTop());
            follow.div.find('.follow_cont').css('margin-top', $(window).height() * .15);
            follow.div.open(animte); //动画显示
        }
    }
    $.hideFollow = function(animte){//隐藏
        follow && follow.div.close(animte);
    }
    function initFollow(){ //生成关注引导层
        var c = document.createElement("div"),
            d = document.createElement("div"),
            chtml = "", dhtml = "";
        //初始化div    
        c.style.cssText = "z-index:11000; position:absolute; width:100%; height:100%; top:0; left:0; background-color:rgba(0,0,0,.6);";
        chtml = "<div class='follow_cont' style='width:8rem; height: 9.8rem; margin:0 auto; padding: 1rem 1.3rem .4rem; background-color:#fff; text-align:center;'><img src='" + $.FollowImg + "' onerror='nofind()' style='width:100%;'/><p style='font-size: .6rem; margin-top: .5rem;'>长按二维码，识别并关注我们</p>";
        
        c.innerHTML = chtml;
        dhtml = "<span class='wx_closeIcon'><span/>";
        d.className = 'wx_close';
        d.innerHTML = dhtml;
        //添加div
        c.appendChild(d);
        document.body.appendChild(c);
        //添加事件
        c.addEventListener('touchmove', stopProp); //阻止滚动
        return {
            div: $(c),
            btn: $(d)
        }
    }
})($);
/**
 *分享提示
 $.showShare('anime'); //显示
 $.hideShare(); //隐藏
 */
(function($){
    var shareG;
    $.showShare = function(animte){ //展示
        if(!shareG){
            shareG = initShareG();
            shareG.div.bind('click', function(){
                $.hideShare(animte);
            });
        }
        shareG.div.open(animte); //动画显示
    }
    $.hideShare = function(animte){//隐藏
        shareG && shareG.div.close(animte);
    }
    function initShareG(){//生成分享引导层
        var c = document.createElement("div"),
            chtml = "";
        c.style.cssText = "z-index:11000; position:fixed; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,.8); color:#fff; text-align:center; font-size: .8rem;";
        chtml = "<div><span class = 'wx_arrowIcon fr'></span><div style = 'padding-top: 2rem; width: 11rem; margin: 0 auto;'>请点击右上角";
        chtml += "<p>通过<span class = 'wx_sendIcon'></span>【发送给朋友】功能</p><p>把消息告诉小伙伴哟～</p>";
        chtml += "<div class='wx_close'>";
        chtml += "<span class='wx_closeIcon'><span/></div></div>";
        c.innerHTML = chtml;
        document.body.appendChild(c);
        c.addEventListener('touchmove', stopProp);//阻止滚动
        return {
            div: $(c)
        }
    }
})($);
//阻止默认行为
function stopProp(e){
    e.preventDefault();
    e.stopPropagation();
}
//自定义弹出层
(function($){
    var layer;
    //打开层
    $.fn.showLayer = function(anim, nohide){
        $.hideActions();
        $.hideAlert();
        if ($.layerMask) $.layerMask.unbind('click'); //关闭layer
        else $.layerMask = $.newMask(10200);
        layer = this;

        if ($.layerMask.height() <= 0 ) $.layerMask.open();
        layer.open(anim);

        !nohide && $.layerMask.bind('click', function(){
            layer.hideLayer(anim);
        });
        layer.find('.close').bind('click', function(){
            layer.hideLayer(anim);
        });
    };
    //关闭层
    $.fn.hideLayer = function(anim, unbind){
        this.close(anim);
        setTimeout('$.layerMask.close()', 200);
    };
    //关闭labyer
    $.hideLayer = function(anim){
        layer && layer.hideLayer(anim);
    };    
})($);

//分享，关注
$(".j_share").live('click', function(){
    $.showShare();
});
$(".j_follow").live('click', function(){
    $.showFollow();
});

//表单错误提示
(function(){
    $.fn.errorInput = function(msg, time){
        this.parent().addClass("error");
        this.focus();
        msg && $.errorTip(msg, time);
        this.bind("input", function(){
            $(this).removeError();
        });
        
    }
    $.fn.removeError = function(){
        this.parent().removeClass("error");   
    }
})($);

//     Zepto.js  
//     slideDown slideUp
;(function ($) {
    /* SlideDown */
    $.fn.slideDown = function (duration) { 
        if(this.length < 1 || this.css('display') != 'none') return;
        duration = duration || 400;
        
        var position = this.css('position');
        this.css({
            position: 'absolute',
            visibility: 'hidden',
        }).show();
        

        //get naturally height, margin, padding
        var marginTop = this.css('margin-top'),
            marginBottom = this.css('margin-bottom'),
            paddingTop = this.css('padding-top'),
            paddingBottom = this.css('padding-bottom'),
            height = this.css('height');

        // set initial css for animation
        var _this = this;
        _this.css({
            position: position,
            visibility: 'visible',
            overflow: 'hidden',
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            'transition-property': 'all',
            'transition-duration': duration + 'ms',
            '-webkit-transition-duration': duration + 'ms',
            'transform': 'translate3d(0, 0, 0)',
            '-webkit-transform': 'translate3d(0, 0, 0)',
        });
        setTimeout(function(){
            _this.css({
                height: height,
                marginTop: marginTop,
                marginBottom: marginBottom,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
                'transform': 'translate3d(0, 0, 0)',
            });
        },1);
    };

    /* SlideUp */
    $.fn.slideUp = function (duration) {
        if (this.length < 1 || this.css("display") == 'none') return false;
        duration = duration || 400;
        
        var _this = this,
            height = _this.css('height'),
            marginTop = _this.css('margin-top'),
            marginBottom = _this.css('margin-bottom'),
            paddingTop = _this.css('padding-top'),
            paddingBottom = _this.css('padding-bottom');
        
        // set initial css for animation
        _this.css({
            height: height,
            marginTop: marginTop,
            marginBottom: marginBottom,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
            'transition-property': 'all',
            'transition-duration': duration + 'ms',
            '-webkit-transition-duration': duration + 'ms',
            'transform': 'translate3d(0, 0, 0)',
            '-webkit-transform': 'translate3d(0, 0, 0)',
        });
        
        setTimeout(function(){
            _this.css({
                height: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
            }).transitionEnd(function(){
                _this.hide();
                _this.css({
                    height: height,
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    paddingTop: paddingTop,
                    paddingBottom: paddingBottom,
                    'transform': 'translate3d(0, 0, 0)',
                });
            });
        },1);
        
    };
})($);

//倒计时程序
;(function($){
    //倒计时程序
    $.fn.countDown = function(time, onStart, onEnd){
        var _this = this;
        if (time == 0) {
            _this.stopCountDown(onEnd);
        } else {
            time--;
            _this.clearTimer(); //清除上次计时
            var timer = setTimeout(function() {
                _this.countDown(time);
            }, 1000);

            _this.data('timer', timer);
            
            _this.html(time + 's后再发');
            _this.addClass("disabled");
            onStart && onStart(time);
        }
    };
    //停止计时
    $.fn.stopCountDown = function(callback){
        this.clearTimer();
        this.removeClass("disabled");
        callback && callback(this);
    };
    //清除计时
    $.fn.clearTimer = function(){
        var timer = this.data('timer');
        if(timer){        
            clearTimeout(timer);
            timer = null;
            this.data('timer', timer);
        }
    };
})($);