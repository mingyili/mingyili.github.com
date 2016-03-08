/*
 *顶部广告
 */
(function(){
	'use strict';

	if(typeof(AD) != 'undefined') {
		AD.close = function(){
			/*$(AD.html).addClass('hideAD').transitionEnd(function(){
				$(AD.html).removeClass('hideAD').hide();
			});*/
			$(AD.html).hide();
	        $.refreshScroller();
	    };
		AD.add = function(){
			var _this = this;
	        this.html = $('<div class="ad_banner"><a href="'+ this.link +'" target="_blank" external><img src="'+ this.str +'" style="width:100%"><i class="icon-close-a"></i></a></div>');
	        this.target = this.target ||'.page.page-current .content-inner';

	        var $target = $(this.target);
	        if($target.length > 0) {
	        	$target.prepend(this.html);
	        }else{
	        	$target = $('.page.page-current .content');
	        	if($target.length > 0) {
	        		$target.prepend(this.html);
	        	}
	        }

	        this.html.find('.icon-close-a').bind('click', function(e){
	        	e.preventDefault();
	        	_this.close();
	        });
	    };
	}
})($);

/*
 * 页面切换 加载内容
*/
+ function($) {
	'use strict';

	//处理路径 添加基础路径
	function processPath(path, type){
	    var base = 'js/';
	    if (type == 'css') base = 'css/';
	    if (typeof(path) == 'object') { //数组
	        var len = path.length;
	        for(var i = 0; i < len; i++){
	            path[i] = base + path[i].replace(/(^\s*)|(\s*$)/g, '');
	        }
	    }else{
	        path = base + path.replace(/(^\s*)|(\s*$)/g, '');
	    }
	    return path;
	}

	//识别page data-js/data-css 加载对应的 js/css 文件
	function loadPage(_page, type, callback){
	    var path = _page.data(type) != undefined ? _page.data(type).split(',') : '';

	    if (!callback) {
	        callback = function(){ return true };
	    }
	    if (path && path != '') { //存在要加载的js才进行加载
	        path = processPath(path, type);
	        seajs.use(path, callback);
	    } else {
	    	callback();
	    } 
	}

	//页面初始加载js
	$(document).ready(function(){
	    var _page = $('.page.page-current');
	    loadPage(_page, 'css', function(){
	        //$('body').css('visibility', 'visible');
			$('#body').css('visibility', 'visible').addClass('fadeIn');
	    });
	    loadPage(_page, 'js', function(){
			if(typeof(AD) != 'undefined') AD.add();
	        $.init();
			$.refreshScroller();
	    });
	});
	//页面滚动刷新
	$(window).bind("load", function(){
		$.refreshScroller();
	});

	//新页面切入之前 判断id 加载对应文件
	$(document).on("pageAnimationStart", function(e, pageId, _page) {
	    loadPage(_page, 'css');
	    loadPage(_page, 'js');
		
	});
	
	//新页面切入之后配置分享信息
	/*$(document).on("pageAnimationEnd", function(e, pageId, _page) {
		if(typeof shareData != 'undefined') {
			console.log(shareData);
	    	window.setShareData(shareData);
	    }
	});*/
	//新页面切入完成之后实例化页面 js
	$(document).on("pageInit", function(e, pageId, _page) {
		setTimeout(pageCount, 400); //统计
	});
	
}(Zepto);

/*
 *滚动一定距离 悬浮顶部
*/
+ function($) {
	"use strict";
	
	$(document).on("pageInit", function(e, id, page) {
		var $content = page.hasClass("content") ? page : page.find(".content"),
			tag = $content.find('.scroll-fixtop');
		if (tag.length <= 0) return;
		
		var scroller = $.getScroller($content),
			height = tag[0].offsetHeight,
			distance = tag[0].getBoundingClientRect().top,
			clone = false;
		
		$.checkFixTop = function(){
			var scrollTop = scroller.scrollTop();
			if (scrollTop >= distance + height) {
				if (clone) return;
				clone = tag.clone();
				clone.insertBefore($content).addClass('fix-top').addClass('slideDown');
			}else{
				if (!clone) return;
				var html = clone.html();
				tag.html(html);
				clone.remove();
				clone = false;
			}
		};
		
		scroller.on('scroll', function(){
			$.checkFixTop();
		});	
	});
	
}(Zepto);

/*
 *无限下拉列表加载
*/
+ function($) {
	"use strict";

	var loadList = function () {
		this.inited = false;
	};

    loadList.prototype.init = function(option){
		//if (this.inited) return;
		var opt = {
			page: undefined, //页面
			content: undefined, //content 层
			loadbar: undefined, //加载状态bar
			list: undefined,
			lists: undefined,
			/*{ //多个列表，
				'modal': {
					list: '',
					url: '', //请求url
					lock: false, //请求状态
					nowpage: 0, //当前页码
					processUrl: undefined, //处理请求url
		    		processData: undefined, //处理传入数据
		    		processList: undefined, //处理列表
		    	}
			}*/
			url: '', //请求url
			lock: false, //请求状态
			nowpage: 0, //当前页码
			initScroll: false,
    		processUrl: undefined, //处理请求url
    		processData: undefined, //处理传入数据
    		processList: undefined //处理列表
		}
    	
    	for (var i in option) {
    		opt[i] = option[i];
		}
    	
    	if(!opt.page) return;
    	opt.page = $(opt.page);
		//content 实例化
		if (opt.content) {
			if (typeof(opt.content) === typeof 'string') opt.content = $(opt.content);
		} else {
			opt.content = opt.page.find('.content');
		}
		//列表实例化
		if (opt.list) {
			if (typeof(opt.list) === typeof 'string') opt.list = $(opt.list);
		} else {
			opt.list = opt.content.find(".list-block");
		}
		//loadbar
		if (opt.loadbar) {
			if (typeof(opt.loadbar) === typeof 'string') opt.loadbar = $(opt.loadbar);
		} else {
			opt.loadbar = opt.content.find('.infinite-scroll-preloader');
		}
		if (opt.loadbar.length < 1) {
			opt.loadbar = $('<div class="infinite-scroll-preloader">');
			opt.loadbar.html('<div class="preloader"></div><span class="preloader-text">正在加载...</span></div>');
			opt.loadbar.appendTo(opt.content.find('.content-inner'));
			//opt.loadbar.insertAfter(opt.list);
		}
		opt.loadText = opt.loadbar.find('.preloader-text');
		opt.loadLoader = opt.loadbar.find('.preloader');
		
		opt.loadbar.hide();
		//正在加载
		opt.loading = function(){
			opt.loadbar.show().removeClass('hide');
			opt.loadLoader.css('display', 'inline-block');
			opt.loadText.text('正在加载...');
		};
		//加载成功
		opt.loadend = function(str){
    		str = str || '加载成功';
    		opt.loadLoader.hide();
    		opt.loadText.text(str);
    		opt.loadbar.addClass('hide');
			setTimeout(function(){
				opt.content.scroller('refresh');
			}, 800);
    	};

		//滚动实例化
		if(opt.initScroll) $.initInfiniteScroll(opt.content);
		opt.content.scroller('refresh');
		//存在 lists
		if (opt.lists) { 
			opt.content.find(".tab-link").live("click", function(){
				setTimeout(function() {
					opt.content.scroller('refresh');
					if($.checkFixTop) $.checkFixTop();
                }, 100);
				
			});
		}
		
		var _this = this;
    	opt.page.on('infinite', function() {
			_this.load();
	    });
		
		this.opt = opt;
		this.inited = true;
    };
    
	loadList.prototype.load = function(opt){
		if(!this.inited) this.init(opt);
		var _this = this,
			opt = _this.opt,
			$nowlist = opt.list,
			nowlist = '';

		if (opt.lists) { //存在list
			$nowlist = $('.tab.active'),
			nowlist = $nowlist[0].id;
			if (opt.lists[nowlist].list) {
				if (typeof(opt.lists[nowlist].list) === typeof 'string') opt.lists[nowlist].list = $(opt.lists[nowlist].list);
			} else {
				opt.lists[nowlist].list = $nowlist.find('.list-block');
			}
			opt.lists[nowlist].nowpage = opt.lists[nowlist].nowpage || 0;
			getList(opt.lists[nowlist], opt);
		} else {
			getList(opt, opt);
		}
	};
	loadList.prototype.reload = function(opt){
		this.inited = false;
		this.load(opt);
	};
	function getList(l, def){
		//加锁
		if (l.lock) return;
		l.lock = true;

		var postUrl = l.url,
			postData = {};
		//url 处理
		if (l.processUrl) {
			postUrl = l.processUrl(postUrl) || postUrl;
		} else if (def.processUrl) {
			postUrl = def.processUrl(postUrl) || postUrl;
		}
		//数据处理
		if (l.processData) {
			postData = l.processData(postData);
		} else if (def.processData) {
			postData = def.processData(postData);
		}
		
		postData.page = l.nowpage;
		//开始加载
		def.loading();
		$.ajax({
            type: 'POST',
            url: postUrl,
            data: postData,
            error:function(msg){
                l.lock = false;
                $.toast('出错啦，请联系客服', 'warn');
                def.loadend('加载失败');
            },
            success: function(msg){
                var data = eval('(' + msg + ')');
                
				if(!data || data.status) {
					def.loadend('加载完成');
					l.lock = true;
                	return;
                }
            	
            	if (l.processList) {
					l.processList(data, l.list);
				} else if (def.processList) {
					def.processList(data, l.list);
				}
				//$.refreshScroller();
            	def.content.scroller('refresh');
            	l.nowpage++ ;
				
				//所有数据加载完成所有
                if (!data.have_next || !data.list.length) {
                	def.loadend('所有数据加载完成');
                	//$.detachInfiniteScroll(def.content);
                	l.lock = true;
                }else{
					l.lock = false;
				}
            }
                
        });
    }

    $.infiniteLoad = new loadList();
    $.getList = getList;
}(Zepto);