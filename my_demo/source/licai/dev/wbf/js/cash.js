var j_addr_load = $(".j_addr_load")
$(document).ready(function(){
	var $selectedvalue = $("input[name='outcardpay']:checked").val();
	var rel= $("input[name='outcardpay']:checked").attr("rel");
	if($selectedvalue==1){
		data1 = CASH.usercardinfo;
		if(data1[rel]["is_need_bankname"]==1){
			defaultAddrData = data1[rel]["addr_info"];
			if (defaultAddrData) {
				$('.j-selectaddr .item-title').html(defaultAddrData.name.join(" "));
				$("#id_bank_account").val(data1[rel]["brabank_name"]);
				$(".j_addr_load").show();
			}
			else {
				defaultAddrData= {};
				$(".j_addr_load").show();
			}
		}
		else {
			defaultAddrData= {};
			$(".j_addr_load").hide();
		}
	}
	else {
		defaultAddrData= {};
		$(".j_addr_load").hide();
	}
});
//现金提取时候的一些js
$(document).on('click','.j-daycash', function () {//日利宝
	var isPassword = SCASH.isPassword;
	var setPwdUrl = SCASH.setPwdUrl;
	var dayCash = SCASH.dayCash;
	var dayCashNum = SCASH.dayCashNum;
	var sid = SCASH.sid;
//	console.log(setPwdUrl);
	if(isPassword == 0){
		$.alert('请先设置取现密码！',function(){
			window.location.href = setPwdUrl;
		});
		return false;
	}
	if(dayCashNum <= 0){
		$.alert("每天只有3次取现机会哦，请明天再来");
		return false;
	}else if(dayCash < 100){
		$.alert("您的日利宝账户还未达到取现最低金额100元，快来投资赚钱吧！");
		return false;
	}else{
		$.router.loadPage(API.HTTPS_HOST + "/index.php/licai/cash/cashtake?sid="+sid+"&link=cashtake&type=1");
	}
});

$(document).on('click','.j-monthcash', function () {//月利宝
	var isPassword = SCASH.isPassword;
	var setPwdUrl = SCASH.setPwdUrl;
	var investMoney = SCASH.investMoney;
	var sid = SCASH.sid;
	var monthCash = SCASH.monthCash;
	var monthCashNum = SCASH.monthCashNum;
	if(investMoney <= 100){
		$.alert('您的投资金额还未达到100元，快来投资赚钱吧');
		return false;
	}
	if(isPassword == 0){
		$.alert('请先设置取现密码！',function(){
			window.location.href = setPwdUrl;
		});
		return false;
	}
	if(monthCashNum <= 0){
		$.alert("本月的取现机会已经没有了，请下月再来");
		return false;
	}else if(!(monthCash > 0)){
		$.alert("您的月利宝账户还没有余额可取，快来投资赚钱吧！");
		return false;
	}else{
		$.router.loadPage(API.HTTPS_HOST + "/index.php/licai/cash/cashselect?sid="+sid+"&link=cashselect&type=2");
	}
});
var selectBankAddr,
	defaultAddrData = {
		id: ['0111', '0999'], 
		name: ['黑龙江', '哈尔滨']	
	};

$(document).on('click','.j-selectaddr', function () {//月利宝
	var _this = $(this);
	if(!selectBankAddr) {
		console.log('new');
		selectBankAddr = new $.selectCard(_this, {
			defaultData: defaultAddrData, //默认选项
			callback: function(data){
		/*		console.log('d');
				console.log(data);*/
				defaultAddrData=data;
			},
		});
		selectBankAddr.open();
	}
});
window.getpayinfo = function(evt) {
	var orderId=CASH.orderId;
	var prdtype=CASH.type;
	var money= CASH.cash;
	var money = parseFloat($(".payMoney").val());
	
	money = money.toFixed(2);
  	addcard(orderId,prdtype,money);
}
function addcard(orderId,prdtype,money){
	$.showPreloader();
	$.ajax({
    	type : "POST",
		url : API.HTTPS_HOST + "/index.php/licai/conduct/selectcard"+'?sid='+API.sid+'&type=2',
		data : {"orderId":orderId,"prdtype":prdtype,"money":money,"type":2},
		dataType:'json',
		complete:function(){
			$.hidePreloader();				
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
function changeBankAddr(){
	selectBankAddr = null;
	defaultAddrData = {};	
}
window.getRadio = function(evt) {
	var evt = evt || window.event,
		e = $(evt),
		data1 = CASH.usercardinfo,
		rel = e.attr("rel");
	if(e.val() == "1")
	{
		defaultAddrData = data1[rel]["addr_info"];
		if(defaultAddrData){
			$('.j-selectaddr .item-title').html(defaultAddrData.name.join(" "));
			$("#id_bank_account").val(data1[rel]["brabank_name"]);
			$(".j_addr_load").show();
		}
		else{
			defaultAddrData={};
			$(".j_addr_load").show();
		}
	}
	else{
		$(".j_addr_load").hide();
	}
};
//输入密码弹层
var lock = true;
$(document).on('click','.j_open_pwd', function () {
	//取现方式
	var takecash = $(".j_take_cash").attr("value");
	$(".button-big").addClass("disabled");
	$(".button-big").removeClass("j_open_pwd");
	var sid = CASH.sid;
	var minCash = CASH.minCash;
	var maxCash = CASH.maxCash;
	var cash = CASH.cash;
	var type = CASH.type;
	var dayCashNum = CASH.dayCashNum;
	var monthCashNum = CASH.monthCashNum;
	var orderId = CASH.orderId;
	if(type == 1){		
			if(dayCashNum <= 0){
				$.alert("今天的取现机会已经没有了，请明天再来");
				$(".button-big").addClass("j_open_pwd");
				$(".button-big").removeClass("disabled");
				return false;
			}
			if(takecash < minCash && takecash){
				$.alert("最低取现金额为"+minCash+"!");
				$(".j_take_cash").val(minCash);
				$(".button-big").addClass("j_open_pwd");
				$(".button-big").removeClass("disabled");
				return false;
			}else if(takecash > maxCash && takecash){
				$.alert("最大取现金额为"+maxCash+"!");
				$(".button-big").addClass("j_open_pwd");
				$(".button-big").removeClass("disabled");
				$(".j_take_cash").val(maxCash);
				return false;
			}else if(!takecash){
				$.alert("请输入取现金额");
				$(".j_take_cash").val(minCash);
				$(".button-big").addClass("j_open_pwd");
				$(".button-big").removeClass("disabled");
				return false;
			}
	}else if(type == 2){
		if(monthCashNum <= 0){
			$.alert("本月的取现机会已经没有了，请下个月再来！");
			$(".button-big").addClass("j_open_pwd");
			$(".button-big").removeClass("disabled");
			return false;
		}
		if(takecash != cash){
			$.alert("取现金额为"+cash+"!");
			$(".j_take_cash").val(cash);
			$(".button-big").addClass("j_open_pwd");
			$(".button-big").removeClass("disabled");
			return false;
		}
	}else{
		$.alert("错误的取现类型，请重试！");
		$(".button-big").addClass("j_open_pwd");
		$(".button-big").removeClass("disabled");
		return false;
	}
    
	switch(CASH.pay_type_display){
	case "0":
		   // 获取到信息
		   var outype1= $("#to_bank").hasClass("active");
		   var outype2= $("#to_wx").hasClass("active");
		   if(outype1){
			   var pay_cashtype = 9;
			   var brabank_name =$("#id_bank_account").val();
			   var bankid=$("input[name='outcardpay']:checked").attr("rel");
		   }
		   else if(outype2){
			   var pay_cashtype = 5;
		   }
		  break;
	case "5":
		  var pay_cashtype = 5;//微信
		  break;
	case "9":
		  var pay_cashtype = 9;//银行卡
		  var brabank_name =$("#id_bank_account").val();
		  var bankid=$("input[name='outcardpay']:checked").attr("rel");
		  break;
	default:break;
	}
	if( pay_cashtype==9 && CASH.cardcount==0 ){
		$.alert("没有银行卡，无法进行提现");
		return false;
	}
    var textHtml = '<div class="">输入取现密码</div>' +
            '<div class="color-gray small">取现金额</div>' +
            '<div class="color-primary xbig" style="margin-top:.2rem">￥'+takecash+'</div>';
    $.modalPassword(textHtml, '请输入取现密码', function(pwd){
    	if(!lock){
    		lock = false;
    		$.alert("提交过于频繁，请刷新后重试！");
    		return false;
    	}
    	if(!pwd){
    		$.alert("请输入取现密码！");
    		$(".button-big").addClass("j_open_pwd");
			$(".button-big").removeClass("disabled");
    		return false;
    	}
    	lock = false;
    	$.ajax({
    		type : "POST",
    		url : API.HTTPS_HOST + "/index.php/licai/cash/cashtake"+'?sid='+API.sid,
    		data : {'pwd':pwd,'takecash':takecash,'flag':'submitcash','type':type,'order_id':orderId,'pay_cashtype':pay_cashtype,'pay_cashouttype':CASH.pay_type_display,'bankid':bankid,'brabank_name':brabank_name,'addr_info': JSON.stringify(defaultAddrData)},
    		success : function(msg){
    			lock = true;
    			var data = eval("("+msg+")");
    			if(data.code == 0){
    				$.toast("取现申请成功！", 1200, "success");
    		        setTimeout(function(){
    		        	//$.router.loadPage( API.HTTPS_HOST + "/index.php/licai/cash/cashsuccess?link=cashsuccess&sid="+sid+"&id="+data.insId);
    		        	window.location.href=API.HTTPS_HOST + "/index.php/licai/activity/prepare?sid="+sid+"&outorderid="+data.insId;
    		        }, 1000);
    			}else if(data.code == 2){
    				$(".button-big").addClass("j_open_pwd");
    				$(".button-big").removeClass("disabled");
    				$.modal({ title:  '密码错误！',text: data.errmsg,buttons: [{text: '重试',onClick: function() {
    					$.closeModal();
			        }},{text: '找回密码',onClick: function() {
			        	var url = data.url;
//			        	console.log(url)
			        	window.location.href = url;
			        }},]});
    			}else{
    				$.alert(data.errmsg);
    				$(".button-big").addClass("j_open_pwd");
    				$(".button-big").removeClass("disabled");
    				return false; 
    			}
    		}
    	});        
    });
});


