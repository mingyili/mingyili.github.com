$(function () {
    //日利宝、月利宝 产品下拉加载
    $(document).on("pageInit", "#invest", function(e, id, page) {
        function addItems(data, $list) {
            // 生成新条目的HTML
        	if(data.count < 1){
        		$list.html('<div class="list-block"><div class="list-none">暂无投资项目</div></div>');
        		return;
        	}
            $.each(data.list, function(i, list){
            	if(list.status==2){
            	  	var $temp = $(' <a href="#" class="item-link item-content gray" >');
            	}
            	else {
            	  	var $temp = $('<a href='+API.HTTPS_HOST+'/index.php/licai/conduct/investpay?sid='+list.seller_id+'&link=investpay&type='+list.type+'&id='+list.prd_id +' class="item-link item-content">');
            	}
                      	html = '<div class="item-inner">' + 
    					'<i class="tag-hot"></i>' +
        				'<div class="item-title-row"><div class="item-title">'+ list.title +'</div></div>' +
        				'<div class="row"><div class="col-33">' +
        					'<div class="item-subtitle">'+ list.all + list.units +'</div><small>总金额</small>' +
        				'</div><div class="col-33">' +
        					'<div class="item-subtitle">'+ list.progress +'%</div><small>项目进度</small>' +
    					'</div><div class="col-33">' +
        					'<div class="item-subtitle">'+ list.people_buycount +'</div><small>投资人数</small>' +
    					'</div></div>' ;
                      	if(list.status==2){
                         	html = html +	'<div class="invest-tag"><span>已经售罄</span></div>' +'</div>';
                      	}
                      	else {
                        	html = html +	'<div class="invest-tag"><span>我要投资</span></div>' +'</div>';	
                      	}
            	$temp.html(html).data('info', list).appendTo($list);
            });
            
        }
        $.infiniteLoad.init({
			page: page,
			lists: {
				'prd_day': {
					url: API.HTTPS_HOST + '/index.php/licai/conduct/investday?type=1'+'&sid='+API.sid,
					nowpage: 2,
					processList:  function(data, $list){
						addItems(data, $list);
					},
				},
				'prd_month': {
					url: API.HTTPS_HOST + '/index.php/licai/conduct/investmonth?type=2'+'&sid='+API.sid,
					nowpage: 2,
					processList:  function(data, $list){
						addItems(data, $list);
					}
				},
			}
		});
	});
    //支付验证
	//选择加息券
    $(document).on('click', '.j_select_coupon', function() {
        var _this = $(this);
        $.selectCoupon.open({
            callback: function(data){
                _this.html(data.title + '<span class="color-danger"> +' + data.rate + '%</span>');
                _this.data('id', data.id);
            }
        });

    });

    function payMent()
    {
        document.getElementById("pay").submit();  
    }

    //支付完成请求后台，查询订单是否真的支付完成
    function payCallback(times,tid,showUrl,errUrl){
    	$.showPreloader('订单确认中...');
    	$.ajax({
			type:"POST",
			url : API.HTTPS_HOST + "/index.php/licai/order/orderpaydone"+'?sid='+API.sid,
			data:{'tid':tid},
			success:function(data){
				$.hidePreloader();	
				var data = eval("("+data+")");
				if(data.errcode == 0){
					// 支付成功后页面跳转																								       
					$.router.reloadPage(showUrl+"&tid="+tid+'&sid='+API.sid);
				}else {
					times++;
					if(times >= 3){
						$.alert(data.errmsg, function() {
							$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败！"+'&sid='+API.sid);
						});						
					}else{
						setTimeout(function(){payCallback(times,tid,showUrl,errUrl);},500);						
					}					
				}
			}
		});		
    }   

	//选择银行卡
	var investScard = null;
    $(".j_selectcards").live('click', function() {
		var _this = $(this);
		if(!investScard) { //未实例化
			investScard = new $.selectCard(_this, {
				url: '', //获取我的银行卡
				addCardUrl: API.HTTPS_HOST + "/index.php/licai/conduct/bindcard?sid=" + API.sid,
				defaultId: '', //默认银行卡id
				callback: '', //选择银行卡后返回方法 （data）为返回数据
			});
		}
		
        investScard.open();
    });
	
    //红包领取弹出层
    $(document).on('click', '.j_open_redbag', function() {
        var popupHTML = '<div class="popup redbag_pop">' + 
    	    '<div class="redbag_cont">' + 
    	    	'<a class="close icon-close close-popup"></a>' + 
    	    	'<p class="redbag_tit">0.5%日利宝加息券</p>' + 
    	    	'<p class="redbag_info">2015.11.14 过期</p>' + 
    	    	'<p class="redbag_info">一分钟内与账户绑定</p>' + 
    	    '</div>' + 
        '</div>';
        $.popup(popupHTML);
    });

//钱数改变
function moneyOnChange(){
	var val = $(".payMoney").val();
	if (!isNaN(val) && val > 0 && $('#is_agree').is(':checked'))  $(".j_pay_submit").removeClass('disabled');
	else $(".j_pay_submit").addClass('disabled');
}
$(document).on('input', '.payMoney', moneyOnChange);
$(document).on('change', '#is_agree', moneyOnChange);
$(document).on("input",'#inputpaymoney', moneyOnChange);
// 马上支付 进行 支付
$(".j_pay_submit").live('click', function() {
	//判断支付类型
    var _this=$("input[name='payway']:checked"),
		value=_this.val();
    var datachannel=_this.attr("data-channel");  
   	var money = parseFloat($(".payMoney").val()).toFixed(2);
   	var minPay = isNaN(PAY.minPay)?0:parseFloat(PAY.minPay);//最小支付金额
	var maxPay = isNaN(PAY.maxPay)?0:parseFloat(PAY.maxPay);//最大支付金额
   	var showUrl = PAY.showUrl;
   	var errUrl = PAY.errUrl;
   	var prdid = PAY.prdId;
   	var prdtype =PAY.prdType;
   	var allAmount = PAY.allAmount;//总投资金额
   	var canPay = PAY.canPay;
   	var addInvest = parseFloat(PAY.addInvest);
   	addInvest = addInvest.toFixed(2);
   	if(isNaN(addInvest) || addInvest<=0){    		
   		addInvest = 0.01;   //最小递增金额 		
   	}  
   	if(!(money > 0)){
   		$.alert("请输入您要支付金额");
   		$(".payMoney").val(minPay);
		$(".j_pay_submit").removeClass('disabled');
   		return false;
   	}else if(money > allAmount || money > canPay){
   		$.alert("超过了最大投资金额");
   		$(".payMoney").val(canPay);
		$(".j_pay_submit").removeClass('disabled');
		return false ;
	}else if(money<minPay && minPay > 0 ){
		minPay = minPay.toFixed(2);
		$(".payMoney").val(minPay);
		$(".j_pay_submit").removeClass('disabled');
		$.alert("少于￥"+minPay+" 拿不出手呀");
		return false ;
	}else if(money>maxPay && maxPay > 0 ){
		$.alert("不用出这么多血") ;
		maxPay = maxPay.toFixed(2) ;
		$(".payMoney").val(maxPay);
		$(".j_pay_submit").removeClass('disabled');
		return false ;
	}else{
		var diff = parseFloat(money - minPay);
		var tmp = diff/addInvest;
		if(!(parseInt(tmp) == tmp)){
			$.alert("输入金额不对哦，输入金额为"+minPay+"+"+addInvest+"的整数倍");
			return false ;
		}
	}
	if(!$('#is_agree').is(':checked')) {
		$.alert("请您同意《沃百富平台服务协议》");
		return false;
	}
	if(isavailable()){
		switch(datachannel){
		case "wobaifu_myself":
							  switch (value) {
								case "wxpay":  wxpaysummit('wxpay',prdid,money,showUrl,errUrl);break;
								case "cardpay": var id=_this.attr("rel"); 
								                lianlianpaysummit('llcardpay',prdid,money,id);
									            break;
								default : $.alert("无支付方式，无法进行提交！"); return false ; break;
							  }
			                  break;
		case "wobaifu_jiufu":var id=_this.attr("rel"); 
		                         jiufupaysummit("jiufucardpay",prdid,money,id);
			                 break;
		default : $.alert("无支付方式，无法进行提交！"); return false ; break;
		}
	}
});
var paylock = false;
function jiufupaysummit(paytype,prdid,money,id){ 
	
	if(paylock) return;
	paylock = true;
	$.showPreloader('正在加载');
	$.ajax({
		type : "POST",
		url : API.HTTPS_HOST + "/index.php/shoukuan/weixinpay/licai"+'?sid='+API.sid,
		data : {"prdid":prdid,"money":money,"paytype":paytype,"card_id":id},
		dataType:'json',
		complete:function(){
			paylock = false;	
		   $.hidePreloader();
		},
		success: function(msg){	
			if(msg.errcode==0){	
				var tid= msg.data.tid;
				var strhtml=msg.data.jiufucardpay;
				$("#lianlianpaylink").html(strhtml);
				payMent(); 
			}
			else {
				alert(msg.errmsg+" 跳转页面失败！");
			}
		}
	}); 
}
function isavailable(){
	if (!PAY.is_phone) {
		$.modal({
			text: '进行支付前，请先绑定手机',
			buttons:[
				{
					text: '绑定手机',
					onClick: function(){
						$.router.loadPage(PAY.url_phone);
					},
				},
				{
					text: '取消'
				}
			]
		});
		return false;
	}
	if (!PAY.is_identity) {
		$.modal({
			text: '进行支付前，还需要实名',
			buttons:[
				{
					text: '去实名',
					onClick: function(){
						$.router.loadPage(PAY.url_identity);
					},
				},
				{
					text: '取消'
				}
			]
		});
		return false;
	}
	else {
		return true;
	}
}
function lianlianpaysummit(paytype,prdid,money,id){ 
	if(paylock) return;
	paylock = true;
	$.ajax({
		type : "POST",
		url : API.HTTPS_HOST + "/index.php/shoukuan/weixinpay/licai"+'?sid='+API.sid,
		data : {"prdid":prdid,"money":money,"paytype":paytype,"card_id":id},
		dataType:'json',
		complete:function(){
			paylock = false;			
		},
		success: function(msg){	
			if(msg.errcode==0){
				var tid= msg.data.tid;
				var strhtml=msg.data.llcardpay;
				$("#lianlianpaylink").html(strhtml);
			}
		}
	}); 
}
// 
function wxpaysummit( paytype,prdid,money,showUrl,errUrl){
	if(paylock) return;
	paylock = true;
  	$(".j_pay_submit").html("等待支付...");
  	$.ajax({
			type : "POST",
			url : API.HTTPS_HOST + "/index.php/shoukuan/weixinpay/licai"+'?sid='+API.sid,
			data : {"prdid":prdid,"money":money,"paytype":paytype},
			complete:function(){
				paylock = false;		
			},
			success : function(msg) {
				var ua = "";
				// 如果传入的参数为字符串类型，则尝试转换为JSON
				if (typeof msg === 'string') {
					msg = $.parseJSON(msg);
				}
				if (msg.errcode == 1) {
					$.alert(msg.errmsg);
					$(".j_pay_submit").html('微信安全支付');
					return false;
				} else {
					var data = msg.data;
					var wxpay = data.wxpay;
					var payData = wxpay.pay_data;
					ua = wxpay.user_agent;
					var tid = data.tid;
				}
				var wxVer = ua.match(/MicroMessenger\/(\d+(\.\d+)*)/);
				var wpVer = ua.match(/Windows Phone/); //wp系统默认支持
				if ((wxVer !== null && wxVer.length) || (wpVer !== null && wpVer.length)) {
					// 微信版本 >= 5.0
					if (wpVer || (parseFloat(wxVer[1]) >= 5)) {
						//判断调用的支付版本，isNewV=1:新版的JS调用方式，isNewV=0:老版的调用方式
						// 调用微信安全支付						
						if(window.isNewV==1){
							var payParam = {
								timestamp:payData.timeStamp, 
								nonceStr:payData.nonceStr, 
								package:payData.package, 
								signType:payData.signType, 
								paySign:payData.paySign,
								success: function (res) {
									//支付成功
									$(".j_pay_submit").html('支付成功，正在处理订单...');
									paylock = false;
									// 支付成功后页面跳转
									var times = 0;
									payCallback(times,tid,showUrl,errUrl);
							    },
						      	cancel: function (res) {
						      		//取消支付
						      		$(".j_pay_submit").html('微信安全支付');
									paylock = false;
						        },
					        	fail: function (res) {
					        		//支付失败
					                $(".j_pay_submit").html('支付失败，请重新尝试！');
					                paylock = false;
									$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败！");
					            }
							}
							wx.chooseWXPay(payParam) ;

						}else{
							WeixinJSBridge.invoke('getBrandWCPayRequest',payData,
								function(res) {
									var msg = res.err_msg;
									if (msg === 'get_brand_wcpay_request:ok') {
										$(".j_pay_submit").html('支付成功，正在处理订单...');										
										var times = 0;
										payCallback(times,tid,showUrl,errUrl);								
									} else if (msg === 'get_brand_wcpay_request:fail') {
										$(".j_pay_submit").html('支付失败，请重新尝试！');
										paylock = false;
									} else if (msg === 'get_brand_wcpay_request:cancel') {
										$(".j_pay_submit").html('微信安全支付');
										paylock = false;									
									} else {
										//查询订单状态
										$.ajax({
											type : "POST",
											url : API.HTTPS_HOST + "/index.php/licai/order/orderinfosign"+'?sid='+API.sid,
											data : {"tid":tid},
											success : function(order_msg) {
												var order_msg = eval("("+order_msg+")");
												if (order_msg.code == 100001) {
													$.alert(order_msg.msg,function(){														
														$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败!");
													});
													return false;
												} else if (order_msg.code == 100000) {
													$(".j_pay_submit").html('支付成功，正在处理订单...');
													// 支付成功后页面跳转
													setTimeout(function(){$.router.reloadPage(showUrl);},100);
												}
											}
										});
									}
							});							 
						}						
					} else {
						$(".j_pay_submit").html('微信安全支付');
						$.alert("请使用微信(5.0以上)进行购买!");
					}
					
					} else {
						$(".j_pay_submit").html('微信安全支付');
						$.alert("您的微信版本低于5.0，不支持“微信安全支付”!");
					}
				}
			});
	  
  }
window.getpayinfo = function(evt) {
	var prdid=PAY.prdId;
	var prdtype=PAY.prdType;
	var money = parseFloat($(".payMoney").val());
		money = money.toFixed(2);
	addbankcard(prdid,prdtype,money);
}
  //添加银行卡
  function addbankcard(prdid,prdtype,money){
	  $.showPreloader();
	  $.ajax({
	    	type : "POST",
			url : API.HTTPS_HOST + "/index.php/licai/conduct/selectcard"+'?sid='+API.sid,
			data : {"prdid":prdid,"prdtype":prdtype,"money":money,"type":1},
			dataType:'json',
			complete:function(){
				$.hideIndicator();				
			},
	    	success: function(msg){	
	    		if(msg.errcode==0){
	    			// 去添加银行卡界面
	    			$.router.loadPage(msg.url);
	    		}
	    		else {
	    			$.modal({
	    				text: msg.errmsg,
	    				buttons:[
	    					{
	    						text: msg.errbutton,
	    						onClick: function(){
	    							$.router.loadPage(msg.url);
	    						},
	    					},
	    					{
	    						text: '取消'
	    					}
	    				]
	    			});

	    		}
	    	}
		});
  }
});
