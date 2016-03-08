//分享提示
$(document).on('click','.j_share', function () {
	$.share();
});
$.share = function(){
	var popupHTML = '<div class="popup guide_pop">'+
				'<div class="share_cont"><i class="wx_arrowIcon pull-right"></i>'+
				'<p>请点击右上角</p>'+
				'<p>通过 <i class="wx_sendIcon"></i>【发送给朋友】功能</p>'+
				'<p>把消息告诉小伙伴哟～</p></div>'+
				'<a class="wx_guide_close close-popup"><i class="wx_closeIcon"></i></a>' +
			'</div>';

	$.popup(popupHTML);
}
//关注提示
$(document).on('click','.j_follow', function () {
	var _this = $(this),
		text = _this.data('text') != undefined ? _this.data('text') : '长按二维码识别，关注我们';
	$.follow(text);
});

$.follow = function(text, img){
	if(!text) text = '长按二维码识别，关注我们';
	if(!img) img = API.FollowImg ;
	
	var popupHTML = '<div class="popup guide_pop">' +
				'<div class="follow_cont"><img src="' + img + '"/>' +
				'<p class="small">' + text + '</p></div>'+
				'<a class="wx_guide_close close-popup"><i class="wx_closeIcon"></i></a>' +
			'</div>';
	$.popup(popupHTML);
}
/**
 * @param sharing_data
 * @param cancle_fun
 * @param confirm_fun
 * @param fail_fun
 * @param show_menu 是否展示微信右上角分享按钮
 */
function shareywk(wx, shareData, cancle_fun, confirm_fun, fail_fun, show_menu){
	//alert('已用分享');
	wx.config({
		debug: wxConfig.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: wxConfig.appId, // 必填，公众号的唯一标识
		timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
		nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
		signature: wxConfig.signature,// 必填，签名，见附录1
		jsApiList: wxConfig.jsApiList
	});
	
	wx.error(function(res){ //
		//接口验证失败
		//alert('微信认证失败！');
	});
	
	wx.ready(function(){ //接口验证成功
		wx.checkJsApi({
			jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
			success: function (res) {
				var msg = res.checkResult;
				if(!msg.onMenuShareAppMessage || !msg.onMenuShareTimeline){
					//alert('不能配置分享信息');
				}else{
					setShare(wx, shareData, cancle_fun, confirm_fun, fail_fun, show_menu);
				}
			}
		});
	});
}

/**
 * 设置分享数据 可用于再次更改分享数据
 * @param sharing_data
 * @param cancle_fun
 * @param confirm_fun
 * @param fail_fun
 * @param show_menu 是否展示微信右上角分享按钮
**/
function setShare(wx, shareData, cancle_fun, confirm_fun, fail_fun, show_menu){
	// 微信分享的数据
	var wxData = {};
	
	var hidMenuArry = []; //隐藏右上角按钮
	(typeof(hide_menus)!="undefined") && (hidMenuArry = hide_menus);
	(typeof(hideShareFCircle)!="undefined") && hidMenuArry.push("menuItem:share:timeline");
	//分享重新赋值
	if(typeof(shareData) == 'object'){
		if(shareData.desc && shareData.desc.length>0){
			shareData.subject = shareData.subject + "(" + shareData.desc + ")" ;
		}
		wxData.appId = wxConfig.appId;
		wxData.title = (typeof(shareData.title) != "undefined") ? shareData.title : document.title;
		wxData.desc = (typeof(shareData.subject) != "undefined") ? shareData.subject : document.title;
		wxData.link = (typeof(shareData.link) != "undefined") ? shareData.link : window.location.href;
		wxData.imgUrl = (typeof(shareData.pic_url) != "undefined") ? shareData.pic_url : '';
		wxData.type = (typeof(shareData.type)!= "undefined") ? shareData.type : 'link';
		wxData.dataUrl = (typeof(shareData.dataUrl)!= "undefined") ? shareData.dataUrl : '';
	}else{
		wxData.appId = wxConfig.appId;
		wxData.title = (typeof(prd_title)!= "undefined") ? prd_title : (typeof(title) != "undefined" ? title : document.title);
		wxData.desc = (typeof(prd_desc)!= "undefined") ? prd_desc : (typeof(desc) != "undefined" ? desc : document.title);
		wxData.link = (typeof(prd_href)!= "undefined") ? prd_href : (typeof(link) != "undefined" ? link : window.location.href);
		wxData.imgUrl = (typeof(prd_pic_url)!="undefined") ? prd_pic_url : (typeof(imgUrl) != "undefined" ? imgUrl : '');
		wxData.type = (typeof(share_type)!="undefined") ? share_type : 'link';
		wxData.dataUrl = (typeof(share_dataUrl)!="undefined") ? share_dataUrl : '';
	}
	//分享链接末尾添加唯一字符串
	if(wxConfig.shareUniKey && wxData.link.indexOf('UniqueKey=')<=-1){
		var shareUniKey = wxConfig.shareUniKey;
		if(wxData.link.indexOf('?')>-1){
			shareUniKey = "&UniqueKey=" + shareUniKey;
		}else{
			shareUniKey = "?UniqueKey=" + shareUniKey;
		}
		wxData.link = wxData.link + shareUniKey;
	}
	
	// 分享的回调
	var wxCallbacks = {
		// 收藏操作不执行回调，默认是开启(true)的
		favorite : false,
		// 发送操作开始之前
		ready : _empty(),
		// 发送被用户自动取消
		cancel : function(){
			if(cancle_fun){
				cancle_fun("cancle_fun") ; 
			}
		},
		// 发送失败了
		fail : function(){
			if(fail_fun){
				fail_fun("fail_fun") ; 
			}
		},
		// 发送成功
		confirm : function(){
			if(confirm_fun){
				if(shareData.data){
					confirm_fun(shareData.data, "friend") ; 
				}else{
					confirm_fun("friend") ; 
				}
			}

			//分享统计
	        // if(shareData.c_function){
	        //     shareData.c_function(shareData.c_function_data) ;
	        // }
	        if(typeof(Collect) == "undefined"){
	        	//没引入统计JS，不做处理，防止报错
	        }else{
	            if(typeof(Collect) == 'function'){
	            	//调起http请求
	            	var param = {} ; //参数对象
	            	var rebuildParam = {} ; //经过分析后重组的参数对象
	            	
	            	param.collectUrl = collectUrl ; //后端接收地址
	            	param.active = 2 ;
	            	var c = new Collect() ;
	            	rebuildParam = c.count(param) ;

	            }
	        }
	        
		},
		//QQ/微博完成 //预留
		complete : function(){
			if(complete_fun){
				complete_fun() ; 
			}
		}	
	};
	//空方法
	function _empty() {
		return function() {
			return true;
		}
	}
	//设置分享数据
	newShare(wx, wxData, wxCallbacks);
	
	
	//隐藏右上角
	if(show_menu == 0){
		hideOptionMenu(wx);
	}
	// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
	if(hidMenuArry.length>0){
		wx.hideMenuItems({
			menuList: hidMenuArry 
		});
	}
}

/**
 * //新版分享回调
 * @param wxData //分享数据
 * @param wxCallbacks //分享回调回调函数
 */
function newShare(wx, wxData, wxCallbacks){
	//alert("新版执行");
	//发送给朋友
	wx.onMenuShareAppMessage({
		title : wxData.title, // 发送标题
		desc : wxData.desc, // 发送描述
		link : wxData.link, // 发送链接
		imgUrl : wxData.imgUrl, // 发送图标
		type : wxData.type,  // 发送类型,music、video或link，不填默认为link
		dataUrl : wxData.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
		trigger : function (res) {
			// 用户触发发送后执行的回调函数
			wxCallbacks.ready();
		},
		success: function () { 
			// 用户发送成功后执行的回调函数
			wxCallbacks.confirm();
		},
		cancel: function () {
			// 用户取消发送后执行的回调函数
			wxCallbacks.cancel();
		},
		fail: function (res) {
			// 用户发送失败后执行的回调函数
			wxCallbacks.fail();
		}
	});
	
	//分享到朋友圈
	wx.onMenuShareTimeline({
		title : wxData.desc, // 发送标题
		desc : wxData.title, // 发送描述
		link : wxData.link, // 发送链接
		imgUrl : wxData.imgUrl, // 发送图标
		trigger : function (res) {
			// 用户触发发送后执行的回调函数
			wxCallbacks.ready();
		},
		success: function () { 
			// 用户发送成功后执行的回调函数
			wxCallbacks.confirm();
		},
		cancel: function () {
			// 用户取消发送后执行的回调函数
			wxCallbacks.cancel();
		},
		fail: function (res) {
			// 用户发送失败后执行的回调函数
			wxCallbacks.fail();
		}
	});
	//分享到QQ
	wx.onMenuShareQQ({
		title : wxData.title, // 发送标题
		desc : wxData.desc, // 发送描述
		link : wxData.link, // 发送链接
		imgUrl : wxData.imgUrl, // 发送图标
		trigger : function (res) {
			wxCallbacks.ready();
		},
		complete : function (res) {
			wxCallbacks.complete();
		},
		success : function (res) {
			wxCallbacks.confirm();
		},
		cancel : function (res) {
			wxCallbacks.cancel();
		},
		fail : function (res) {
			wxCallbacks.fail();
		}
	});
	//分享到腾讯微博
	wx.onMenuShareWeibo({
		title : wxData.title, // 发送标题
		desc : wxData.desc, // 发送描述
		link : wxData.link, // 发送链接
		imgUrl : wxData.imgUrl, // 发送图标
		trigger : function (res) {
			wxCallbacks.ready();
		},
		complete : function (res) {
			wxCallbacks.complete();
		},
		success : function (res) {
			wxCallbacks.confirm();
		},
		cancel : function (res) {
			wxCallbacks.cancel();
		},
		fail : function (res) {
			wxCallbacks.fail();
		}
	});
}
/**
 * 隐藏右上角
*/
function hideOptionMenu(wx){
	wx.hideOptionMenu();
}
/**
 * 显示右上角
*/
function showOptionMenu(wx){
	wx.showOptionMenu();
}

//****//
//微信图片预览
(function(){
	var imgUrls = [],
		_images = '.viewimg img';
	function setImgPreview() {
		var images = $(_images);
		imgUrls = [];
		images.each(function() {
			var _this = $(this);
			var imgurl = _this.attr("src");
			imgurl && imgUrls.push(imgurl);
		});
	}
	if(typeof(wx) == 'undefined') return;
	wx.ready(function(){ //接口验证成功
		wx.checkJsApi({
			jsApiList: ['previewImage'],
			success: function (res) {
				var msg = res.checkResult;
				if(!msg.previewImage){
					//alert('不能配置图片预览');
				}else{
					setImgPreview(); //获取页面所有图片
					$(_images).live("click", function() {
						var url = $(this).attr("src");
						if (imgUrls.indexOf(url) < 0) imgUrls.push(url);
						wx.previewImage({
							current: url, // 当前显示图片的http链接
							urls: imgUrls // 需要预览的图片http链接列表
						});
					});
				}
			} //success
		}); //checkJsApi
	});
})();