(function($){
    //选择加息券 列表加载 和 选择事件
    var selectCoupon = function(){
        this.inited = false;
        this.defaultId = '';
    };
    selectCoupon.prototype.open = function(opt){
        this.inited ? $.popup($plug) : this.init(opt);
    };
    selectCoupon.prototype.init = function(opt){
        var _this = this;
        if (opt.defaultId) _this.defaultId = opt.defaultId;
        if (opt.url) _this.url = opt.url;
       	if (opt.callback) _this.callback = opt.callback;

        var popupHTML = '<div class="popup">'+
    		'<header class="bar bar-nav">' + 
    			'<a class="button button-link button-nav pull-right close-popup"><span class="icon close icon-close"></span></a>' +
				'<h1 class="title">选择加息券</h1>' +
			'</header>' +
            '<div class="content infinite-scroll" data-distance="100" data-toggle="scroller" data-type="js">'+
            '<div class="content-inner"><div class="list-block media-list list-full select-list"></div>' +
            '</div></div>';        

        $plug = $($.popup(popupHTML, false));
        $plug.one('opened', function(){
            if (_this.inited) return;
            $.infiniteLoad.load({
                page: $plug,
                url: _this.url,
                initScroll: true, //新生成的元素要init 一下
                processList: function(data, $list){
                    // 添加新条目
                    _this.addItems(data, $list);
                    //容器发生改变,如果是js滚动，需要刷新滚动
                }
            });
            _this.inited = true;
        });

        $plug.on("click", ".label-checkbox",  function(){
            var $this = $(this),
                data = $this.data('info');

            $plug.find('.label-checkbox.checked').removeClass('checked');
            $this.addClass('checked');
            
            _this.defaultId = data.id;
            _this.callback(data);
            setTimeout(function(){
                $.closeModal($plug);
            }, 100);
        });
    };
        
    selectCoupon.prototype.addItems = function(listData, $list) {
        // 生成新条目的HTML
        var _this = this, checked = '';
        $.each(listData, function(i, data){
            data.id === _this.defaultId ? (checked = 'checked') : (checked = '');
            var $temp = $('<div class="label-checkbox item-content '+ checked +'">'),
            	html ='<div class="item-inner">' +
                    '<div class="item-title-row">' +
                        '<div class="item-title">'+ data.title +'<span class="color-danger">+'+ data.rate +'%</span></div>' +
                    '</div>' +
                    '<div class="item-subtitle color-primary">'+ data.info +'</div>' +
                    '<div class="item-subtitle color-gray">有效期至'+ data.enddate +'</div>' +
                    //'<input type="radio" '+ checked +' >' +
                    '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>'
                '</div>';
        	// 添加新条目
            $temp.html(html).data('info', data).appendTo($list);
        });
    }
   
    $.selectCoupon = new selectCoupon();
})(Zepto);