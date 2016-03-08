(function($){
    //选择加息券 列表加载 和 选择事件
    var selectInvest = function(){
        this.inited = false;
    };
    selectInvest.prototype.open = function(opt){
        this.inited ? $.popup(this.$plug) : this.init(opt);
    };
    selectInvest.prototype.reopen = function(opt){
    	var _this = this;
    	if (!_this.inited) {
    		_this.init(opt);
    	} else if (_this.$plug[0].id != opt.id) {
    		_this.$plug.remove();
        	_this.inited = false;
    		_this.init(opt);
    	} else {
    		$.popup(_this.$plug);
    	}
    };
    selectInvest.prototype.init = function(opt){
    	var _this = this,
        	option = {
        		title: '选择提现项目', //顶部标题
        		id: '',
        		url: '', //数据调取路径
        		maxSelectNum: 1, //最多可选几项 0 为无限
        		defaultId: '', //默认选项
        		calculate: undefined, //计算
        		callback: undefined,
        	};

        for(var i in opt){
        	option[i] = opt[i];
        }

        if (isNaN(option.maxSelectNum)) option.maxSelectNum = 0;
        _this.opt = option;

        var popupHTML = '<div class="popup" id="'+ option.id +'">'+
    		'<header class="bar bar-nav">' + 
    			'<a class="button button-link button-nav pull-right close-popup"><span class="icon close icon-close"></span></a>' +
				'<h1 class="title">'+ option.title +'</h1>' +
			'</header>';
			if (option.maxSelectNum !== 1) {
				popupHTML += '<div class="bar bar-standard bar-footer">' +
				'<div class="list-block media-list">' +
					'<div class="item-content">' +
						'<div class="row">'+
							'<small>已选择 <span class="j-select-num">0</span> 个</small>' +
							'<div class="item-subtitle color-primary">共 <span class="j-select-money">0.00</span> 元</div>' +
						'</div>' +
						'<div class="item-media"><a href="#" class="button button-fill disabled j-select select-button">确定</a>' +
					'</div></div>' +
				'</div></div>';
			}
            popupHTML += '<div class="content infinite-scroll" data-distance="100" data-toggle="scroller" data-type="js">'+
            '<div class="content-inner"><div class="list-block media-list list-full select-list"></div>' +
            '</div></div>';
        
        var $plug = $($.popup(popupHTML, false));

        $plug.one('opened', function(){ //绑定滚动加载事件
        	if (_this.inited) return;
            $.infiniteLoad.reload({
                page: $plug,
                initScroll: true, //新生成的元素要init 一下
                url: option.url,
                processList: function(data, $list){
                    // 添加新条目
                    _this.addItems(data, $list);
                    //容器发生改变,如果是js滚动，需要刷新滚动
                }
            });
            _this.inited = true;
        });

        _this.close = function(){ //关闭模块
        	$.closeModal($plug);
        };

        if (option.maxSelectNum === 1) { //选取数量为1时
	        $plug.on("click", ".label-checkbox",  function(){
	            var $this = $(this),
	                data = $this.data('info');

	            $plug.find('.label-checkbox.checked').removeClass('checked');
	            $this.addClass('checked');
	            
	            _this.opt.defaultId = data.id;
	            option.callback(data);
	            setTimeout(function(){
	                $.closeModal($plug);
	            }, 100);
	        });

		} else { //多选时候

			var selectData = [], //选择的数据
				$selectNum = $plug.find('.j-select-num'),
				$selectMoney = $plug.find('.j-select-money'),
				$selectBtn = $plug.find('.j-select');
			if (typeof _this.opt.defaultId !== typeof []) _this.opt.defaultId = [];

	        //dom 计算 改变
	        function change(data){
	        	console.log(data);
	        	var money = 0,
	        		count = data.length;

	        	$.each(data, function(i, v){
	        		money += v.money;
	        	});

	        	$selectNum.text(count);
	        	$selectMoney.text(money);

	        	if(money > 0) $selectBtn.removeClass('disabled'); 
        		else $selectBtn.addClass('disabled')
        	}

			$plug.on("click", ".label-checkbox",  function(){
	            var $this = $(this),
	                data = $this.data('info');

                if( $this.hasClass('checked')) { //已选
            		var hadSelect = $.inArray(data.id, _this.opt.defaultId);
                	if(hadSelect > -1) {
                		selectData.splice(hadSelect, 1);
                		_this.opt.defaultId.splice(hadSelect, 1);
                		change(selectData);
                	}
                	$this.removeClass('checked');
                }
                else { //未选

                	if (!option.maxSelectNum || selectData.length < option.maxSelectNum) {
	                	selectData.push(data);
	                	_this.opt.defaultId.push(data.id);
	                	change(selectData);
	                	$this.addClass('checked');
                	} 
                	else {
                		$.toast('已达上限，不能再选');
                		return false;
                	}
                }

	        });

	        $plug.on("click", ".j-select",  function(){
	            option.callback(selectData);
	            setTimeout(function(){
	                $.closeModal($plug);
	            }, 100);
	        });
		}
		_this.$plug = $plug;
        
    };  
    selectInvest.prototype.addItems = function(listData, $list) {
        // 生成新条目的HTML
        var _this = this, checked = '';
        $.each(listData, function(i, data){
            (data.id === _this.opt.defaultId || $.inArray(data.id, _this.opt.defaultId) > -1 ) ? (checked = 'checked') : (checked = '');
            var $temp = $('<div class="label-checkbox item-content '+ checked +'">'),
            	html ='<div class="item-inner">' +
                    '<div class="item-title-row">' +
                        '<div class="item-title">'+ data.title +'</div>' +
                    '</div>' +
                    '<div class="row no-gutter">' +
    					'<div class="col-33">' +
    						'<small>持有金额</small>' +
    						'<div class="item-subtitle">10.00</div>' +
    					'</div><div class="col-33">' +
					    	'<small>累计收益</small>' +
    						'<div class="item-subtitle">5.01</div>' +
					    '</div><div class="col-33">' +
					    	'<small>可提金额</small>' +
    						'<div class="item-subtitle color-primary">15.01</div>' +
					    '</div>' +
					'</div>' +
                    //'<input type="radio" '+ checked +' >' +
                    '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>'
                '</div>';
        	// 添加新条目
            $temp.html(html).data('info', data).appendTo($list);
        });
    }
   
    $.selectInvest = new selectInvest();
})(Zepto);