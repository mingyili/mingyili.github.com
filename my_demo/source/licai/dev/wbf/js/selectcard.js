(function ($) {
	var selectCard = function (ele, opt) {
		var defaults = {
				url: '', //数据调取路径
				addCardUrl:'',
        		maxSelectNum: 1, //最多可选几项 0 为无限
        		defaultId: '', //默认选项
        		callback: undefined,
			};

		var opts = opt || ele.data('option'),
			_this = this;

		_this.option = $.extend(defaults, opts);
		_this.ele = ele.bind('click', function(){
			_this.open();
		});
	};
/*	var tempHtml = '<label class="label-checkbox item-content">' +
			'<div class="item-media"><img class="inline-img" src="'+ API.HOST +'/licai/dist/common/img/bank_zs.png"></div>' +
            '<div class="item-inner">' +
                '<div class="item-title">招商银行 储蓄卡 (6654)</div>' +
                '<div class="item-subtitle">单笔5万/单日50万</div>' +
            '</div>' +
            '<input type="radio" name="bankcards">' +
            '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>'+
            '</label>';*/
	selectCard.prototype = {
		//创建列表
		build: function(){
			var _this = this,
				popupHTML = '<div class="popup">'+
    		'<header class="bar bar-nav">' + 
    			'<a class="button button-link button-nav pull-right close-popup"><span class="icon close icon-close"></span></a>' +
				'<h1 class="title">选择银行卡</h1>' +
			'</header>'+
			'<div class="content infinite-scroll" data-toggle="scroller" data-type="js">'+
            '<div class="content-inner"><div class="cont-margin cont-padded">' +
				'<div class="list-block list-full media-list list-checklist"></div>'+
				'<div class="mt-big"><a class="button button-big button-noround j-addcard"><i class="icon-add v-2"></i> 添加银行卡</a></div>'+
            '</div></div>';

           	this.popup = $($.popup(popupHTML, false));
           	this.popup.one('opened', function(){ //绑定滚动加载事件
	            $.infiniteLoad.reload({
	                page: _this.popup,
	                initScroll: true, //新生成的元素要init 一下
	                url: _this.option.url,
	                processList: function(data, $list){
	                    // 添加新条目
	                    _this.addItems(data, $list);
	                    //容器发生改变,如果是js滚动，需要刷新滚动
	                }
	            });
            });
           	//列表绑定点击事件
            this.popup.on("click", ".label-checkbox",  function(){
	            var $this = $(this),
	                data = $this.data('info');

	            _this.option.defaultId = data.id;
	            _this.option.callback(data);
                $.closeModal(_this.popup);
	        });
	        this.popup.on("click", ".j-addcard",  function(){
	            $.closeModal(_this.popup);
	            $.router.loadPage(_this.option.addCardUrl);
	        });
		},
		//添加列表项
		addItems: function(listData, $list){
			var _this = this, checked = '';
			$.each(listData, function(i, data){
	            (data.id === _this.option.defaultId || $.inArray(data.id, _this.option.defaultId) > -1 ) ? (checked = 'checked') : (checked = '');
	            var $temp = $('<label class="label-checkbox item-content">'),
	            	html ='<div class="item-media"><img class="inline-img" src="'+ API.HOST +'/licai/dist/common/img/bank_zs.png"></div>' +
	                    '<div class="item-inner">' +
	                        '<div class="item-title">招商银行储蓄卡尾号6654</div>' +
	                        '<div class="item-subtitle">单笔5万/单日50万</div>' +
	                    '</div>' +
	                    '<input type="radio" name="bankcards" '+ checked +' >' +
	                    '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>';
	        	// 添加新条目
	            $temp.html(html).data('info', data).appendTo($list);
	        });
		},
		//打开列表
		open: function () {
			var _this = this;
			_this.popup ? $.popup(_this.popup) : _this.build();
		},
		//关闭列表
		close: function () {
			$.closeModal(_this.popup);
		}
	};

	selectCard.init = function (eles) {
		var _this = this;
		eles && eles.length > 0 &&  eles.each(function(){
			new _this($(this));
		});
	};

	$.selectCard = selectCard;
	
	$.selectCard.init($('.j_selectcard'));
})(Zepto);