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
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();
/**
 * wheight屏幕高度
 */
(function(window) {
    window.wheight = $getWindowHeight();
    window.Click = "click";
})(window);
/******* My.js code by Li_mingyi main for all activities 2014.12.09 *******/
/**
 //主要变量
 My.FollowUrl 商户关注页面连接 加载时定义
 My.WxName 商户微信昵称 加载时定义
 My.FollowImg 关注二维码，会只显示二维码；
 //动画展开，触摸
 Animation 动画包括：
 渐入 fadeAnim,(默认动画)
 弹出 popAnim,
 放大 scaleAnim,
 下滑 slideDAnim,
 上滑 slideUpAnim,
 右滑 slideRightAnim
 Divs 可以是 .class #div tagets this 等DOM元素或数组 但不能是$()返回的对象
 Time是动画时间
 My("Divs").open("Animation", "Time");
 My("Divs").close("Animation", "Time");

 My("Divs").touch("Class"); //Class 是触摸元素要加的class 默认值是touch
 */
var My = (function() {

    return function(div) {
        var _this = typeof(div) == "string" ? document.querySelectorAll(div) : div,
            isShow = undefined;
        function openAll(anim, time, dom, type){
            if(My.Load && dom != My.Load){ //所有动画都在加载动画之后执行
                if(My.Load.className != ""){
				    window.requestAnimFrame(openAll.curry(anim, time, dom, type));
                    return false;
                }
            }
            if(_id(dom).hasClass("hidden")){ 
                window.requestAnimFrame(openAll.curry(anim, time, dom, type));
            }else{
				type = type || 'block';
				isShow = (dom.style.display == type) ? 1 : 0;

				if(!isShow){
					time && (dom.style.cssText += " -webkit-animation-duration:" + time + "ms;");
					anim = anim || "fadeAnim";
					_id(dom).show(type).classList.add(anim);
					dom.classList.add("shown");
					var self = dom;
					setTimeout(function(){
						self.classList.remove(anim);
						self.classList.remove("shown");
					}, time || 350);
				}
			}
        }

        function closeAll(anim, time, dom){
            if(_id(dom).hasClass("shown")){ //如果显示动画还未执行完毕，过300ms再执行
                if(My.Load && dom == My.Load){ //加载动画时候
                    My.Load.className = ""; My.Load.style.display = "none";
                }
				window.requestAnimFrame(closeAll.curry(anim, time, dom));
			}else{
				isShow = (dom.style.display != 'none') ? 1 : 0;

				if(isShow){
					time && (dom.style.cssText += "-webkit-animation-duration:" + time + "ms;");
					anim = anim || "fadeAnim";
					dom.classList.add(anim);
					dom.classList.add("hidden");
					var self = dom;
					setTimeout(function(){
						self.style.display = "none";
						self.classList.remove(anim);
						self.classList.remove("hidden");
					}, time || 350);
				}
			}
        }

        function touchAll(tclass, dom){
            tclass = tclass || "touch" ;
            dom.addEventListener("touchstart", function(){
                this.classList.add(tclass);
            });
            dom.addEventListener("touchend", function(){
                var self = this;
                setTimeout(function(){
                    self.classList.remove(tclass);
                }, 100);
            });
        }

        return {
            open: function(anim, time, type) {
                var length = _this.length;
                if(length){
                    for (var i = 0; i < length; i++) {
                        openAll(anim, time, _this[i], type);
                    }
                }else{
                    openAll(anim, time, _this, type);
                }
            },
            close: function(anim, time) {
                var length = _this.length;
                if(length){
                    for (var i = 0; i < length; i++) {
                        closeAll(anim, time, _this[i] );
                    }
                }else{
                    closeAll(anim, time, _this);
                }
            },
            touch: function(tclass) {
                var length = _this.length;
                if(length){
                    for (var i = 0; i < length; i++) {
                        touchAll(tclass, _this[i] );
                    }
                }else{
                    touchAll(tclass, _this);
                }
            }
        }
    }
})();

/**
 //弹窗
 My.showAlert({
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

 My.hideAlert("Animation"); //关闭弹窗
 My.reshowAlert(); //显示最近关闭的弹窗

 //遮罩
 My.showMask("Animation")
 My.hideMask("Animation")
 My.mask //抛出创建的mask div, jquery可用 $(My.mask) 调用, 绑定事件
 */
(function(my){
    var alert, hasmask;

    my.showAlert = function(opt) { //定义弹窗
        var option = {
            title: "",          //弹窗标题
            text: "弹窗提示",   //弹窗文字
            yesText: "好的",     //确定按钮文字
            yesStyle: "b_dred",       //确定按钮样式
            onYes: function(){return true;},        //确定按钮的事件
            noText: "",          //取消按钮文字
            noStyle: "b_white",        //取消按钮样式
            onNo: function(){return true;},         //取消按钮的事件
            animte: "fadeAnim", //弹出动画
            hasMask: true,         //显示遮罩
            clickMaskHide: false    //点击遮罩关闭
        };
        for (var i in opt) {
            option[i] = opt[i];
        }
        var title = option.title,
            text = option.text,
            yText = option.yesText,
            yStyle = option.yesStyle,
            onYes = option.onYes,
            nText = option.noText,
            noStyle = option.noStyle,
            onNo = option.onNo,
            animte = option.animte,
            cMHide = option.clickMaskHide;

        hasmask = option.hasMask;

        alert && alert.div.parentNode.removeChild(alert.div);//清除

        alert = initAlert();
        alert.text.innerHTML = text;
        alert.text.clientHeight > 65 && (alert.text.style.textAlign = "left");

        alert.btnY.innerHTML = yText;
        alert.btnY.className = "btn btn_yes " + yStyle;
        alert.btnY.addEventListener(Click, function(){
			(onYes() !== false) && my.hideAlert(animte);
			//当onYes return false 时候就不关闭alert
        });

        if(title){ //显示标题
            alert.tit.show().innerHTML = title;
        }else{
            alert.tit.hide();
        }

        if(nText){ //显示取消按钮
            alert.btnY.style.display = "table-cell";
            alert.btnN.style.display = "table-cell";
            alert.btnN.className = "btn btn_no " + noStyle;
            alert.btnN.innerHTML = nText;
            alert.btnN.addEventListener(Click, function(){
				(onNo() !== false) && my.hideAlert(animte);
            }); //绑定取消事件
        }else{
            alert.btnN.hide();
        }
        my(alert.div).open(animte); //显示
        hasmask && my.showMask(); //显示遮罩

        if(hasmask && cMHide){
            my.mask.addEventListener(Click, function(){ 
				My.hideAlert();
			});
        }

        my.reshowAlert = function(){ //再次显示弹窗
            my(alert.div).open(animte); //显示
            hasmask && my.showMask(); //显示遮罩
        }
    }

    my.hideAlert = function(animte){ //关闭弹窗
        my(alert.div).close(animte);
        hasmask && my.hideMask();
    }

    function initAlert(){//生成弹窗信息层
        var c = document.createElement("div");
        c.style.cssText = "text-align:center; position:fixed; top:27%; left:50%; z-index:1400; margin-left:-130px; width:260px; font-size:14px; background-color:#fff; border-radius: 4px;";
        c.className = "alert";
        //chtml = "<div style='padding:10px; text-align:center; position:relative;'></div>";
        //c.innerHTML = chtml;
        
        var d = document.createElement("div") ;
        d.style.cssText = "";
        d.className = "btn_cont";
        

        var text = document.createElement("p"),
            tit = document.createElement("h3"),
            btnY = document.createElement("a"),
            btnN = document.createElement("a");

        tit.className = "alert_tit";
        text.className = "alert_text";
        btnY.className = "btn_yes";
        btnN.style.cssText = "display:none;";
        btnN.className = "btn_cont";

        c.appendChild(tit);
        c.appendChild(text);
        d.appendChild(btnY);
        d.appendChild(btnN);
        c.appendChild(d);
        document.body.appendChild(c);

        c.addEventListener('touchmove', stopProp); //阻止滚动

        return {
            div: _id(c),
            tit: _id(tit),
            text: _id(text),
            btnY: _id(btnY),
            btnN: _id(btnN)
        }
    }

    //遮罩层
    my.showMask = function(animte, time){
        my.mask = my.mask || initMask();
        my(my.mask).open(animte, time);
    }

    my.hideMask = function(animte, time){
        my(my.mask).close(animte, time);
    }

    function initMask(){ //创建遮罩
        var c = document.createElement("div");
        c.style.cssText = "position:fixed;left:0;top:0;z-index:99;width:100%;height:100%;background-color:rgba(0,0,0,.8);display:none;";
        document.body.appendChild(c);
        c.addEventListener('touchmove', stopProp); //阻止滚动
        return _id(c);
    }
})(My);

/**
 //信息提示
 *Text 是要展示的文本
 *Time 是提示信息展示的时间，多长时间自动关闭，默认1s

 My.showTip("Text", "Time", "Animation"),    class = "my_tip";
 My.successTip("Text", "Time", "Animation"), class = "my_tip tip_success";
 My.errorTip("Text", "Time", "Animation"),   class = "my_tip tip_error";
 My.closeTip("Animation"),
 */

(function(my){
    var tip;
    my.showTip = function(text, time, animte) { //展示提示信息
        tip = tip || initTip();
        tip.div.className = "my_tip";
        tip.text.innerHTML = text || "提示信息";
        my(tip.div).open(animte);

        setTimeout(my.closeTip, time || 1000);
    },

	my.successTip = function(text, time, animte) { //展示提示信息
		tip = tip || initTip();
		tip.div.className = "my_tip tip_success";
		tip.text.innerHTML = text || "成功信息";
		my(tip.div).open(animte);

		setTimeout(my.closeTip, time || 1000);
	},

	my.errorTip = function(text, time, animte) { //展示提示信息
		tip = tip || initTip();
		tip.div.className = "my_tip tip_error";
		tip.text.innerHTML = text || "错误信息";
		my(tip.div).open(animte);

		setTimeout(my.closeTip, time || 1000);
	},

	my.closeTip = function(animte) { //关闭提示信息
		tip && my(tip.div).close(animte);
	}

    function initTip() { //生成提示信息
        var c = document.createElement("div"),
            b = document.createElement("span"),
            chtml = "" ;
        c.style.cssText = "display:none; position: fixed; top: 30%; margin: 0 auto; z-index: 1300; width: 100%; text-align: center;";
        chtml = "<div style = 'color: #fff; font-size: 16px; line-height: 22px; padding: 10px 15px;margin: 0 auto;display: inline-block; border-radius: 4px; max-width: 200px; background: rgba(0, 0, 0, 0.6);'></div>";
        c.innerHTML = chtml;
        c.firstChild.appendChild(b);
        document.body.appendChild(c);

        return {
            div: _id(c),
            text: _id(b)
        }
    }

})(My);
/**
 //顶部横条提示信息
 *text 是要展示的文本
 *time 是提示信息展示的时间，多长时间自动关闭，不写不关闭
 *color 背景色 默认黑色

 My.showBarTip("text", "time", "color"),    class = "bar_tip";
 My.hideBarTip(), //关闭
 */
(function(my){
    var bartip;

    my.showBarTip = function(text, time, color) { //展示提示信息
        bartip = bartip || initBarTip();
        color = color || 'bg_dark';
        bartip.div.className = "bar_tip " + color;
        bartip.div.innerHTML = text || "横条信息";
        my(bartip.div).open('fadeAnim');

        time && setTimeout(my.hideBarTip, time);
    },

	my.hideBarTip = function() { //关闭提示信息
		bartip && my(bartip.div).close('fadeAnim');
	}

    function initBarTip() { //生成提示信息
        var c = document.createElement("div");
        c.style.cssText = "z-index:1400; line-height:1; padding:8px 0; text-align:center;position:fixed; top:0px; width:100%; left:0px;";
        document.body.appendChild(c);

        return {
            div: _id(c)
        }
    }

})(My);

/**
 *加载动画
 *text 加载文字
 *anime 出现的动画
 *My.showLoad('text', 'anime'); //显示
 *My.hideLoad(); //关闭
 */
(function(my){
    var load;

    my.showLoad = function(text, animte) { //开启加载
        load = load || initLoad();
        load.text.innerHTML = text || "正在加载...";
        my(load.div).open(animte, 150);
        my.Load = load.div;
    },

	my.hideLoad = function(animte) { //结束加载
		load && my(load.div).close(animte);
	}

    function initLoad() { //生成加载层
        var c = document.createElement("div"),
            b = document.createElement("span"),
            chtml = "" ;
        c.style.cssText = "display:none;position:fixed; top:0px;left:0;width:100%; height:100%; z-index:1200; overflow:hidden;background: rgba(0,0,0,.1);text-align:center;";
        chtml = "<div style = 'max-width:200px; color: #fff; font-size:16px;margin: 48% auto 0;line-height: 22px;border-radius: 5px;background: rgba(0, 0, 0, 0.6);display: inline-block;padding: 12px 15px 10px;'>";
        chtml += "<img style = 'width:22px;height:22px;margin:0 6px 3px 0;' src = 'data:image/gif;base64,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'/>";
        chtml += "</div>";
        c.innerHTML = chtml;
        c.firstChild.appendChild(b);
        document.body.appendChild(c);

        return {
            div: _id(c),
            text: _id(b)
        }
    }

})(My);

/**
 //关注提示
 My.showFollow("Animation"); 
 My.hideFollow("Animation");
 //如果定义了My.FollowUrl 关注跳转连接，会默认跳转
 //如果是定义了My.FollowImg 关注二维码，会只显示二维码；
 */
(function(my){
    var follow;

    my.showFollow = function(animte){ //展示
        if(my.FollowUrl){ //定义了关注连接
            my.showLoad("正在跳转...");
            window.location.href = my.FollowUrl; //跳转关注
        }else{
            if(!follow){
                follow = initFollow();
                follow.btn.addEventListener(Click, function(){
                    my.hideFollow(animte);
                });
				follow.div.addEventListener('touchmove', stopProp); //阻止滚动
            }
			my.FollowImg && (follow.div.style.top = $getPageScrollHeight() + "px");
            my(follow.div).open(animte); //动画显示
        }
    }

    my.hideFollow = function(animte){//隐藏
        follow && my(follow.div).close(animte);
    }


    function initFollow(){ //生成关注引导层
        var c = document.createElement("div"),
            d = document.createElement("div"),
            chtml = "", dhtml = "";
        //初始化div
        if(!my.FollowImg){
			c.style.cssText = "position:fixed;z-index:1100;width:100%;height:100%;top:0;bottom:0;right:0;left:0;background-color:#22292c;font-size:16px;";
			chtml = "<div style = 'width:300px;margin:0 auto;padding-top:40px; color:#fff;'><h3>方法1：</h3><p>点击右上角<span class = 'wx_menuIcon'></span>查看公众号";
			chtml += "<span class = 'wx_weIcon'></span>关注我们</p><div class = 'clear blank'></div><h3>方法2：</h3><div class = 'clear blank'></div><span>长按复制微信号：</span><br/>";
			chtml += "<h3 style = 'display:inline-block;margin:8px 0;padding:2px 8px 0;background-color:#fff;color:#333;border-radius:5px;font-size:16px;line-height:30px;'>";
			chtml += my.WxName+"</h3><br/><span>到微信 “通讯录” 中搜索关注</span></div>";
        }else{
			c.style.cssText = "position:absolute;z-index:1100;width:100%;height:100%;top:0;bottom:0;right:0;left:0;background-color:rgba(0,0,0,.6);";
			chtml = "<div style = 'width:180px; height:180px; margin:25vh auto; padding:25px; background-color:#fff; text-align:center;'><img src='" + my.FollowImg + "' style='width:160px;height:160px;'/><p style='margin:0; font-size:12px;'>长按二维码，识别并关注我们</p>";
		}
		
		c.innerHTML = chtml;

        d.style.cssText = "position:absolute;bottom:16%;left:50%;margin-left:-25px;padding:16px;background-color: rgba(0,0,0,.5);text-align:center;border-radius:100px;";
        dhtml = "<span class = 'wx_closeIcon'><span/>";
        d.innerHTML = dhtml;
        //添加div
        c.appendChild(d);
        document.body.appendChild(c);

        //添加事件
        c.addEventListener('touchmove', stopProp); //阻止滚动
        return {
            div: _id(c),
            btn: _id(d)
        }
    }

})(My);

/**
 *分享提示
 My.showShare('anime'); //显示
 My.hideShare(); //隐藏
 */
(function(my){
    var shareG;

    my.showShare = function(animte){ //展示
        if(!shareG){
            shareG = initShareG();
            shareG.div.addEventListener(Click, function(){
                my.hideShare(animte);
            });
        }
        my(shareG.div).open(animte); //动画显示
    }

    my.hideShare = function(animte){//隐藏
        shareG && my(shareG.div).close(animte);
    }

    function initShareG(){//生成分享引导层
        var c = document.createElement("div"),
            chtml = "";
        c.style.cssText = "position:fixed;left:0;top:0;z-index:1000;width:100%;height:100%;background-color:rgba(0,0,0,.8);color:#fff;text-align:center;font-size:16px;";
        chtml = "<div><span class = 'wx_arrowIcon fr'></span><div style = 'padding-top: 48px;width: 300px;margin: 0 auto;line-height:32px;'>请点击右上角";
        chtml += "<p>通过<span class = 'wx_sendIcon'></span>【发送给朋友】功能</p><p>把消息告诉小伙伴哟～</p>";
        chtml += "<div style = 'position:absolute;bottom:18%;left:50%;margin-left:-25px; padding:16px;background-color: rgba(0,0,0,.5);text-align:center;border-radius:100px;'>";
        chtml += "<span class = 'wx_closeIcon'><span/></div></div>";
        c.innerHTML = chtml;
        document.body.appendChild(c);

        c.addEventListener('touchmove', stopProp);//阻止滚动
        return {
            div: _id(c)
        }
    }

})(My);

/**
 *自定义的js选择区id并绑定事件
 *_id(id).show(); 显示
 *_id(id).hide(); 隐藏
 *_id(id).isShow(); 判断是否显示
 *_id(id).addClass('class'); 添加类
 *_id(id).removeClass('class'); 删除类
 *_id(id).hasClass('class'); 判断是否有这个class
 */
function _id(id){
    var _this = typeof(id) == "string" ? document.getElementById(id) : id,
		myClass = _this.className || "";

    _this.show = function(type){
        type = type || "block";
        _this.style.display = type;
        return _this;
    }
    _this.hide = function(){
        _this.style.display = "none";
        return _this;
    }
    _this.isShow = function(){
        return _this.style.display == "block" ? true : false ;
    }
    _this.addClass = function(a){
        !(_this.hasClass(a)) && (_this.className = myClass + " " + a);
        return _this;
    }
    _this.removeClass = function(b){
        var reg = RegExp("\\b" + b + "\\b", "g"); //按单词匹配
        myClass = myClass.replace(reg, "");
        myClass = myClass.replace(/\s{2,}/g, " ");//去掉连续出现的空格
        _this.className = myClass.replace(/(^\s*)|(\s*$)/g, "");//去掉开始结尾的空格
        return _this;
    }
    _this.hasClass = function(c){
        var reg = RegExp("\\b" + c + "\\b", "g"), //按单词匹配
            flag = myClass.match(reg) ? true : false;
        return flag;
    }
    _this.toggleClass = function(d){
        _this.hasClass(d) ? _this.removeClass(d) : _this.addClass(d);
        return _this;
    }

    return _this;
};

//阻止默认行为
function stopProp(e){
    e.preventDefault();
    e.stopPropagation();
}

//获取高度/宽度
function $getContentHeight() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) ? bodyCath.scrollHeight: doeCath.scrollHeight;
};
function $getContentWidth() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) ? bodyCath.scrollWidth: doeCath.scrollWidth;
};
function $getPageScrollHeight() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    var ua = navigator.userAgent.toLowerCase();
    return (window.MessageEvent && ua.indexOf('firefox') == -1 && ua.indexOf('opera') == -1 && ua.indexOf('msie') == -1) ? bodyCath.scrollTop: doeCath.scrollTop;
};
function $getPageScrollWidth() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) ? bodyCath.scrollLeft: doeCath.scrollLeft;
};
function $getWindowHeight() {
    var bodyCath = document.body;
    return (document.compatMode == 'BackCompat' ? bodyCath: document.documentElement).clientHeight;
};
function $getWindowWidth() {
    var bodyCath = document.body;
    return (document.compatMode == 'BackCompat' ? bodyCath: document.documentElement).clientWidth;
};