/*!
 * Last Update : 2016-02-25 04:04:09
 */
$(function(){function payMent(){document.getElementById("pay").submit()}function payCallback(times,tid,showUrl,errUrl){$.showPreloader("订单确认中..."),$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/licai/order/orderpaydone?sid="+API.sid,data:{tid:tid},success:function(data){$.hidePreloader();var data=eval("("+data+")");0==data.errcode?$.router.reloadPage(showUrl+"&tid="+tid+"&sid="+API.sid):(times++,times>=3?$.alert(data.errmsg,function(){$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败！&sid="+API.sid)}):setTimeout(function(){payCallback(times,tid,showUrl,errUrl)},500))}})}function moneyOnChange(){var a=$(".payMoney").val();!isNaN(a)&&a>0&&$("#is_agree").is(":checked")?$(".j_pay_submit").removeClass("disabled"):$(".j_pay_submit").addClass("disabled")}function jiufupaysummit(a,b,c,d){paylock||(paylock=!0,$.showPreloader("正在加载"),$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/shoukuan/weixinpay/licai?sid="+API.sid,data:{prdid:b,money:c,paytype:a,card_id:d},dataType:"json",complete:function(){paylock=!1,$.hidePreloader()},success:function(a){if(0==a.errcode){var b=(a.data.tid,a.data.jiufucardpay);$("#lianlianpaylink").html(b),payMent()}else alert(a.errmsg+" 跳转页面失败！")}}))}function isavailable(){return PAY.is_phone?PAY.is_identity?!0:($.modal({text:"进行支付前，还需要实名",buttons:[{text:"去实名",onClick:function(){$.router.loadPage(PAY.url_identity)}},{text:"取消"}]}),!1):($.modal({text:"进行支付前，请先绑定手机",buttons:[{text:"绑定手机",onClick:function(){$.router.loadPage(PAY.url_phone)}},{text:"取消"}]}),!1)}function lianlianpaysummit(a,b,c,d){paylock||(paylock=!0,$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/shoukuan/weixinpay/licai?sid="+API.sid,data:{prdid:b,money:c,paytype:a,card_id:d},dataType:"json",complete:function(){paylock=!1},success:function(a){if(0==a.errcode){var b=(a.data.tid,a.data.llcardpay);$("#lianlianpaylink").html(b)}}}))}function wxpaysummit(paytype,prdid,money,showUrl,errUrl){paylock||(paylock=!0,$(".j_pay_submit").html("等待支付..."),$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/shoukuan/weixinpay/licai?sid="+API.sid,data:{prdid:prdid,money:money,paytype:paytype},complete:function(){paylock=!1},success:function(msg){var ua="";if("string"==typeof msg&&(msg=$.parseJSON(msg)),1==msg.errcode)return $.alert(msg.errmsg),$(".j_pay_submit").html("微信安全支付"),!1;var data=msg.data,wxpay=data.wxpay,payData=wxpay.pay_data;ua=wxpay.user_agent;var tid=data.tid,wxVer=ua.match(/MicroMessenger\/(\d+(\.\d+)*)/),wpVer=ua.match(/Windows Phone/);if(null!==wxVer&&wxVer.length||null!==wpVer&&wpVer.length)if(wpVer||parseFloat(wxVer[1])>=5)if(1==window.isNewV){var payParam={timestamp:payData.timeStamp,nonceStr:payData.nonceStr,"package":payData["package"],signType:payData.signType,paySign:payData.paySign,success:function(a){$(".j_pay_submit").html("支付成功，正在处理订单..."),paylock=!1;var b=0;payCallback(b,tid,showUrl,errUrl)},cancel:function(a){$(".j_pay_submit").html("微信安全支付"),paylock=!1},fail:function(a){$(".j_pay_submit").html("支付失败，请重新尝试！"),paylock=!1,$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败！")}};wx.chooseWXPay(payParam)}else WeixinJSBridge.invoke("getBrandWCPayRequest",payData,function(res){var msg=res.err_msg;if("get_brand_wcpay_request:ok"===msg){$(".j_pay_submit").html("支付成功，正在处理订单...");var times=0;payCallback(times,tid,showUrl,errUrl)}else"get_brand_wcpay_request:fail"===msg?($(".j_pay_submit").html("支付失败，请重新尝试！"),paylock=!1):"get_brand_wcpay_request:cancel"===msg?($(".j_pay_submit").html("微信安全支付"),paylock=!1):$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/licai/order/orderinfosign?sid="+API.sid,data:{tid:tid},success:function(order_msg){var order_msg=eval("("+order_msg+")");return 100001==order_msg.code?($.alert(order_msg.msg,function(){$.router.reloadPage(errUrl+"&tid"+tid+"&errmsg=支付失败!")}),!1):void(1e5==order_msg.code&&($(".j_pay_submit").html("支付成功，正在处理订单..."),setTimeout(function(){$.router.reloadPage(showUrl)},100)))}})});else $(".j_pay_submit").html("微信安全支付"),$.alert("请使用微信(5.0以上)进行购买!");else $(".j_pay_submit").html("微信安全支付"),$.alert("您的微信版本低于5.0，不支持“微信安全支付”!")}}))}function addbankcard(a,b,c){$.showPreloader(),$.ajax({type:"POST",url:API.HTTPS_HOST+"/index.php/licai/conduct/selectcard?sid="+API.sid,data:{prdid:a,prdtype:b,money:c,type:1},dataType:"json",complete:function(){$.hideIndicator()},success:function(a){0==a.errcode?$.router.loadPage(a.url):$.modal({text:a.errmsg,buttons:[{text:a.errbutton,onClick:function(){$.router.loadPage(a.url)}},{text:"取消"}]})}})}$(document).on("pageInit","#invest",function(a,b,c){function d(a,b){return a.count<1?void b.html('<div class="list-block"><div class="list-none">暂无投资项目</div></div>'):void $.each(a.list,function(a,c){if(2==c.status)var d=$(' <a href="#" class="item-link item-content gray" >');else var d=$("<a href="+API.HTTPS_HOST+"/index.php/licai/conduct/investpay?sid="+c.seller_id+"&link=investpay&type="+c.type+"&id="+c.prd_id+' class="item-link item-content">');html='<div class="item-inner"><i class="tag-hot"></i><div class="item-title-row"><div class="item-title">'+c.title+'</div></div><div class="row"><div class="col-33"><div class="item-subtitle">'+c.all+c.units+'</div><small>总金额</small></div><div class="col-33"><div class="item-subtitle">'+c.progress+'%</div><small>项目进度</small></div><div class="col-33"><div class="item-subtitle">'+c.people_buycount+"</div><small>投资人数</small></div></div>",2==c.status?html+='<div class="invest-tag"><span>已经售罄</span></div></div>':html+='<div class="invest-tag"><span>我要投资</span></div></div>',d.html(html).data("info",c).appendTo(b)})}$.infiniteLoad.init({page:c,lists:{prd_day:{url:API.HTTPS_HOST+"/index.php/licai/conduct/investday?type=1&sid="+API.sid,nowpage:2,processList:function(a,b){d(a,b)}},prd_month:{url:API.HTTPS_HOST+"/index.php/licai/conduct/investmonth?type=2&sid="+API.sid,nowpage:2,processList:function(a,b){d(a,b)}}}})}),$(document).on("click",".j_select_coupon",function(){var a=$(this);$.selectCoupon.open({callback:function(b){a.html(b.title+'<span class="color-danger"> +'+b.rate+"%</span>"),a.data("id",b.id)}})});var investScard=null;$(".j_selectcards").live("click",function(){var a=$(this);investScard||(investScard=new $.selectCard(a,{url:"",addCardUrl:API.HTTPS_HOST+"/index.php/licai/conduct/bindcard?sid="+API.sid,defaultId:"",callback:""})),investScard.open()}),$(document).on("click",".j_open_redbag",function(){var a='<div class="popup redbag_pop"><div class="redbag_cont"><a class="close icon-close close-popup"></a><p class="redbag_tit">0.5%日利宝加息券</p><p class="redbag_info">2015.11.14 过期</p><p class="redbag_info">一分钟内与账户绑定</p></div></div>';$.popup(a)}),$(document).on("input",".payMoney",moneyOnChange),$(document).on("change","#is_agree",moneyOnChange),$(document).on("input","#inputpaymoney",moneyOnChange),$(".j_pay_submit").live("click",function(){var a=$("input[name='payway']:checked"),b=a.val(),c=a.attr("data-channel"),d=parseFloat($(".payMoney").val()).toFixed(2),e=isNaN(PAY.minPay)?0:parseFloat(PAY.minPay),f=isNaN(PAY.maxPay)?0:parseFloat(PAY.maxPay),g=PAY.showUrl,h=PAY.errUrl,i=PAY.prdId,j=(PAY.prdType,PAY.allAmount),k=PAY.canPay,l=parseFloat(PAY.addInvest);if(l=l.toFixed(2),(isNaN(l)||0>=l)&&(l=.01),!(d>0))return $.alert("请输入您要支付金额"),$(".payMoney").val(e),$(".j_pay_submit").removeClass("disabled"),!1;if(d>j||d>k)return $.alert("超过了最大投资金额"),$(".payMoney").val(k),$(".j_pay_submit").removeClass("disabled"),!1;if(e>d&&e>0)return e=e.toFixed(2),$(".payMoney").val(e),$(".j_pay_submit").removeClass("disabled"),$.alert("少于￥"+e+" 拿不出手呀"),!1;if(d>f&&f>0)return $.alert("不用出这么多血"),f=f.toFixed(2),$(".payMoney").val(f),$(".j_pay_submit").removeClass("disabled"),!1;var m=parseFloat(d-e),n=m/l;if(parseInt(n)!=n)return $.alert("输入金额不对哦，输入金额为"+e+"+"+l+"的整数倍"),!1;if(!$("#is_agree").is(":checked"))return $.alert("请您同意《沃百富平台服务协议》"),!1;if(isavailable())switch(c){case"wobaifu_myself":switch(b){case"wxpay":wxpaysummit("wxpay",i,d,g,h);break;case"cardpay":var o=a.attr("rel");lianlianpaysummit("llcardpay",i,d,o);break;default:return $.alert("无支付方式，无法进行提交！"),!1}break;case"wobaifu_jiufu":var o=a.attr("rel");jiufupaysummit("jiufucardpay",i,d,o);break;default:return $.alert("无支付方式，无法进行提交！"),!1}});var paylock=!1;window.getpayinfo=function(a){var b=PAY.prdId,c=PAY.prdType,d=parseFloat($(".payMoney").val());d=d.toFixed(2),addbankcard(b,c,d)}});