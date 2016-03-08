//处理路径 添加基础路径
function process(path, type){
	var base = 'js/';
	if (type == 'css') base = 'css/';
	if (typeof(path) == 'object') {
		var len = path.length;
		for(var i = 0; i < len; i++){
			path[i] = base + path[i].replace(/(^\s*)|(\s*$)/g, '');
		}
	}else{
		path = base + path.replace(/(^\s*)|(\s*$)/g, '');
	}
	return path;
}

//识别page data-js 加载对应的 js 文件
function loadPageJs(_page){
	var jspath = _page.data('js') != undefined ? _page.data('js').split(',') : '';
	if (jspath && jspath != '') { //存在要加载的js才进行加载
		
		jspath = process(jspath);
		seajs.use(jspath, function() {
			
			//商品详情执行
	       if ($("#J_circle").circle) $("#J_circle").circle();
		});
	}
}

//识别page data-css 加载对应的 css 文件
function loadPageCss(_page){
	var csspath = _page.data('css') != undefined ? _page.data('css').split(',') : '';

	if (csspath && csspath != '') {
		csspath = process(csspath, 'css');
		seajs.use(csspath);
	}
}

//页面初始加载js
window.onload = function() {
	var loadPage = $('.page.page-current');
	loadPageCss(loadPage);	
	loadPageJs(loadPage);
}

//新页面切入之前 判断id 加载对应文件
$(document).on("pageAnimationStart", function(e, pageId, $page) {
	loadPageCss($page);	
});

//新页面切入完成之后实例化页面 js
$(document).on("pageInit", function(e, pageId, $page) {
	loadPageJs($page);
});
