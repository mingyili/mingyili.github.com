//倒计时程序
(function($){
    //倒计时程序
    $.fn.countDown = function(time, onStart, onEnd){
        var _this = this;
        if (time == 0) {
            _this.stopCountDown(onEnd);
        } else {
            time--;
            _this.clearTimer(); //清除上次计时
            var timer = setTimeout(function() {
                _this.countDown(time);
            }, 1000);

            _this.data('timer', timer);
            
            if(onStart){
                onStart(_this);
            } else {
                _this.html(time + 's后再发');
                _this.addClass("disabled");
            }
        }
    };
    //停止计时
    $.fn.stopCountDown = function(callback){
        this.clearTimer();

        if(callback){
            callback(this);
        } else {
            this.removeClass("disabled");
            this.html('重新发送');
        }
    };
    //清除计时
    $.fn.clearTimer = function(){
        var timer = this.data('timer');
        clearTimeout(timer);
        timer = null;
        this.data('timer', timer);
    };
})($);

var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   
var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X   
function IdCardValidate(idCard) { 
    idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格                     
    if (idCard.length == 15) {   
        return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
    } else if (idCard.length == 18) {   
        var a_idCard = idCard.split("");                // 得到身份证数组   
        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
            return true;   
        }else {   
            return false;   
        }   
    } else {   
        return false;   
    }   
}   
/**  
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 * @return  
 */  
function isTrueValidateCodeBy18IdCard(a_idCard) {   
    var sum = 0;                             // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {   
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
    }   
    for ( var i = 0; i < 17; i++) {   
        sum += Wi[i] * a_idCard[i];            // 加权求和   
    }   
    valCodePosition = sum % 11;                // 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {   
        return true;   
    } else {   
        return false;   
    }   
}   
/**  
  * 验证18位数身份证号码中的生日是否是有效生日  
  * @param idCard 18位书身份证字符串  
  * @return  
  */  
function isValidityBrithBy18IdCard(idCard18){   
    var year =  idCard18.substring(6,10);   
    var month = idCard18.substring(10,12);   
    var day = idCard18.substring(12,14);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if(temp_date.getFullYear()!=parseFloat(year)   
          ||temp_date.getMonth()!=parseFloat(month)-1   
          ||temp_date.getDate()!=parseFloat(day)){   
            return false;   
    }else{   
        return true;   
    }   
}   
  /**  
   * 验证15位数身份证号码中的生日是否是有效生日  
   * @param idCard15 15位书身份证字符串  
   * @return  
   */  
  function isValidityBrithBy15IdCard(idCard15){   
      var year =  idCard15.substring(6,8);   
      var month = idCard15.substring(8,10);   
      var day = idCard15.substring(10,12);   
      var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
      // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
      if(temp_date.getYear()!=parseFloat(year)   
              ||temp_date.getMonth()!=parseFloat(month)-1   
              ||temp_date.getDate()!=parseFloat(day)){   
                return false;   
        }else{   
            return true;   
        }   
  }   
//去掉字符串头尾空格   
  function trim(str) {   
      return str.replace(/(^\s*)|(\s*$)/g, "");   
  }
//银行卡验证
function luhmCheck(bankno){
		if (bankno.length < 16 || bankno.length > 19) {
			$.toast('银行卡号长度必须在16到19之间', "error");
			return false;
		}
		var num = /^\d*$/;  //全数字
		if (!num.exec(bankno)) {
			$.toast('银行卡号必须全为数字', "error");
			return false;
		}
		//开头6位
		var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
		if (strBin.indexOf(bankno.substring(0, 2))== -1) {
			$.toast('银行卡号开头6位不符合规范', "error");
			return false;
		}
        var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
    
        var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
        var newArr=new Array();
        for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i,1));
        }
        var arrJiShu=new Array();  //奇数位*2的积 <9
        var arrJiShu2=new Array(); //奇数位*2的积 >9
        
        var arrOuShu=new Array();  //偶数位数组
        for(var j=0;j<newArr.length;j++){
            if((j+1)%2==1){//奇数位
                if(parseInt(newArr[j])*2<9)
                arrJiShu.push(parseInt(newArr[j])*2);
                else
                arrJiShu2.push(parseInt(newArr[j])*2);
            }
            else //偶数位
            arrOuShu.push(newArr[j]);
        }
        
        var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
        for(var h=0;h<arrJiShu2.length;h++){
            jishu_child1.push(parseInt(arrJiShu2[h])%10);
            jishu_child2.push(parseInt(arrJiShu2[h])/10);
        }        
        
        var sumJiShu=0; //奇数位*2 < 9 的数组之和
        var sumOuShu=0; //偶数位数组之和
        var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal=0;
        for(var m=0;m<arrJiShu.length;m++){
            sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
        }
        
        for(var n=0;n<arrOuShu.length;n++){
            sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
        }
        
        for(var p=0;p<jishu_child1.length;p++){
            sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
            sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
        }      
        //计算总和
        sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
        
        //计算Luhm值
        var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
        var luhm= 10-k;
        
        if(lastNum==luhm){
			return true;
        }
        else{
			//'银行卡号必须符合Luhm校验'
			$.toast('银行卡号输入错误', "error");
			return false;
        }        
    }

// 字符 或 数字 或特殊字符 
function checkpassword(str1){
	var num =/\d+/.test(str1);
	var abc=/[a-zA-Z]+/.test(str1);
	var sp=/[\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"]+/.test(str1);
	if((num && abc)||(num && sp)||(abc && sp)){
		return true;
	}
	else {
		return false;	
	}
	
}
//j_image_summit
$(document).on('click', '.j_image_summit', function() {
	var validate= $("#validate").val();
	alert(validate);
	$.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/test1"+'?sid='+API.sid,
		data: {'validate':validate},
		dataType:'json',
		complete:function(){
			
		},
		success: function(msg){	
			
		}
	});
});
//设置取现密码前判断
$(document).on('click', '.j_cash_password', function() {
	//没绑定手机
	if (!userinfo.is_phone) {
		$.modal({
			text: '请先绑定手机，再设置提现密码',
			buttons:[
				{
					text: '绑定手机',
					onClick: function(){
						$.router.loadPage(userinfo.url_phone);
					},
				},
				{
					text: '取消'
				}
			]
		});
		return false;
	}
	//没实名 没有身份信息
	if (!userinfo.is_realname && !userinfo.is_identity) {
		$.modal({
			text: '请先填写实名信息，再设置提现密码',
			buttons:[
				{
					text: '实名认证',
					onClick: function(){
						$.router.loadPage(userinfo.url_identity);
					},
				},
				{
					text: '取消'
				}
			]
		});
		return false;
	}
	//没设置密码
	if (!userinfo.is_password) {
		$.router.loadPage(userinfo.url_password);
		return false;
	}
	//重设密码
	$.router.loadPage(userinfo.url_modifypassword);
});
//清空input
$(document).on('click', '.j_clear_input', function() {
    var _this = $(this),
        input = _this.prev('input');
    input.val('').focus();
});

//发送验证码     j_send_code_password 
$(document).on('click', '.j_send_code_password', function() {
	var type = $(".j_set_pwd").attr("rel");
    var _this = $(this),
        disabled = _this.hasClass('disabled');
    if(disabled){
    	return  false;
    }
    if (!disabled) {
        _this.addClass('disabled');
        _this.countDown(60);
    }
    $.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/sendverifycode"+'?sid='+API.sid,
		data: {'sendcode':2,'business':'setcashpassword'},
		dataType:'json',
		success: function(msg){	
			if(msg.errcode==1){
				$.toast(msg.errmsg, "error");
			}
		}
    }); 
});


$(document).on('click', '.j_bindphone', function() {
	var type =$(".j_bindphone").attr('rel');
	var code =$("#bindphonecode").val();
	var phone =$("#bindcellphone").val();
	if(!checkMobile(phone)){
		$.toast('手机号不合法', "error");
		return false;
	}
	if(code==''){
		$.toast('验证码为空', "error");
		return false;
	}
	$(".button-fill").removeClass("j_bindphone");
    $.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/savephone"+'?sid='+API.sid,
		data: {'code':code,'phone':phone,'type':type},
		dataType:'json',
		complete:function(){
			$(".button-fill").addClass("j_bindphone");			
		},
		success: function(msg){	
			if(msg.errcode==0){
				if(msg.type==0){
					$.router.loadPage(msg.url);
					return false;
				}
				$.modal({
					text: msg.tittle,
					buttons:[
						{
							text:  msg.errmsg,
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
			else {
				$.toast(msg.errmsg, "error");
			}
	   }
   });  
})
//

//发送短信验证码
function sendMsgCode(phone,code,state) {
	$.showPreloader();
	$('.j_send_code').countDown(60);
	$.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/sendverifycode"+'?sid='+API.sid,
		data: {'phone':phone,'sendcode':1,'business':'bindphone','picvalidate':code,'state':state},
		dataType:'json',
		complete:function(){
			$.hideIndicator();				
		},
		success: function(msg){	
			if(msg.errcode==1){ //发送失败
				$.toast(msg.errmsg, "error");
				$('.j_send_code').stopCountDown();
				$('.j_nextstep').stopCountDown();
			}
			else {
				$('.j_nextstep').countDown(60);
				$('.j_telphone').html(phone);
				$.router.loadPage('#bindcode');
			}
		}
    });
}
//绑定手机 发送验证码
$(document).on('click', '.j_nextstep', function() {
    var _this = $(this),
        disabled = _this.hasClass('disabled');
    if(disabled) return  false;
	
	var phone = $("#bindcellphone").val();
	if(!checkMobile(phone)){
		$.toast("手机号不合法", "error");
		return false;
	}
	var imgCode = $("#imgcode").val();
	if(!imgCode) {
		$.toast("验证码不能为空", "error");
		return false;
	}
	//验证图片验证码是否正确
		sendMsgCode(phone,imgCode,1);
});

//发送绑定手机验证码
$(document).on('click', '.j_send_code', function() {
    var _this = $(this),
        disabled = _this.hasClass('disabled');
    if(disabled) return  false;
	var phone = $("#bindcellphone").val();
	sendMsgCode(phone); 
});


function  checkMobile(str) {
    var re = /^1\d{10}$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

//身份认证
$(document).on('click', '.j_identity', function() {
	var type=$(".j_identity").attr('rel');
	var name=$("#conductname").val();
	var identity=$("#conductidentity").val();
	if(name==''){
		$.toast("姓名不能为空", "error");
		return false;
	}
	if(!IdCardValidate(identity))
	{
		 $.toast("身份证号码不合法", "error");
		 return false;
	}
	$(".button-fill").removeClass("j_identity");
    $.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/saveidentity"+'?sid='+API.sid,
		data: {'name':name,'identity':identity,'type':type},
		dataType:'json',
		complete:function(){
			$(".button-fill").addClass("j_identity");			
		},
		success: function(msg){
			if(msg.errcode==0){
				if( msg.type==4 || msg.type==0){
		        	$.router.loadPage(msg.url);
		        	return false;
		        }
				$.modal({
					text: msg.tittle,
					buttons:[
					{
						text:  msg.errmsg,
						onClick: function(){
							$.router.loadPage(msg.url);
						}
					},
					{
						text: '取消'
					}
					]
				});
			}
			else {
				$.toast(msg.errmsg, "error");
			}
		}
    });
});
// 修改密码j_modify_password
$(document).on('click', '.j_modify_password', function() {
	var oldpassword=$("#oldpassword").val();
	var newpassword=$("#newpassword").val();
	var confirmnewpassword=$("#confirmnewpassword").val(); 
	if(oldpassword==''){
		$.toast("原始密码不能为空", "error");
		return false;
	}
	if(newpassword==''){
		$.toast("密码不能为空", "error");
		return false;
	}
	if(confirmnewpassword==''){
		$.toast("确认密码不能为空", "error");
		return false;
	}
	if(!checkpassword(newpassword) || !checkpassword(confirmnewpassword)  ){
		$.toast("密码为8-16位字符数字、字母、特殊字符，起码其中两种组合", "error");
		return false;
	}
	if(newpassword!=confirmnewpassword){
		$.toast("两次密码不一致", "error");
		return false;
	}
	$(".button-fill").removeClass("j_modify_password");	
    $.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/modifypassword"+'?sid='+API.sid,
		data: {'oldpassword':oldpassword,'newpassword':newpassword,'confirmnewpassword':confirmnewpassword},
		dataType:'json',
		complete:function(){
			$(".button-fill").addClass("j_modify_password");			
		},
		success: function(msg){	
			if(msg.errcode==0){
				$.alert(msg.title, msg.errmsg, function() {
					$.router.reloadPage(msg.url, true);
				});
			}
			else if(msg.errcode==1) {
				$.toast(msg.errmsg, "error");
			}
			else if(msg.errcode==2){
				$.modal({
					text: msg.tittle,
					buttons:[
						{
							text: msg.errmsg,
							onClick: function(){
								$.router.loadPage(msg.url);
							},
						},
						{
							text: '取消'
						}
					]
				});
				return false;
			}
		}
    });
  
});

//确认原密码
$(document).on('click', '.j_oldpwd_confirm', function() {
    $.router.reloadPage(API.HTTPS_HOST + '/index.php/weixin/activity/licai?link=setpwd'+'?sid='+API.sid);
});

//设置密码
$(document).on('click', '.j_set_pwd', function() {
	var type= $(".j_set_pwd").attr('rel');
	var code=$("#vcodepassword").val();
	var password=$("#password").val();
	var confirmpassword=$("#confirmpassword").val();
	if(code==''){
		$.toast('验证码不能为空', "error");
		return false;
	}
	if(password==''){
		$.toast('密码不能为空', "error");
		return false;
	}
	if(confirmpassword==''){
		$.toast('确认密码不能为空', "error");
		return false;
	}
	if(!checkpassword(password) || !checkpassword(confirmpassword) ){
		$.toast('密码为8-16位字符数字、字母、特殊字符，起码其中两种组合', "error");
		return false;
	}
	$(".button-fill").removeClass("j_set_pwd");
    $.ajax({
		type: "POST",
		url: API.HTTPS_HOST+"/index.php/licai/conduct/savepassword"+'?sid='+API.sid,
		data: {'code':code,'password':password,'confirmpassword':confirmpassword,'type':type},
		dataType:'json',
		complete:function(){
			$(".button-fill").addClass("j_set_pwd");			
		},
		success: function(msg){	
			if(msg.errcode==0){
				$.alert(msg.tittle, msg.errmsg, function() {
					$.router.reloadPage(msg.url, true);
				});
			}
			else {
				$.alert(msg.tittle, msg.errmsg, function() {
				   //     $.router.reloadPage(API.HTTPS_HOST + '/index.php/licai/conduct/licai?link=user', true);
				});
			}
		}
    });
  
});

//加息券列表加载
$(document).on("pageInit", "#coupon", function(e, id, page) {
    function addItems($list) {
        // 生成新条目的HTML
        var html = '';
        for (var i = 1; i <= 10; i++) {
            html += '<a href="" class="item-link item-content gray">' +
                '<div class="item-inner">' + 
                    '<div class="item-title-row">' + 
                        '<div class="item-title">红包加息券<span class="color-danger">+0.05%</span></div>' + 
                    '</div>' + 
                    '<div class="item-subtitle color-primary">日利宝七日加息</div>' + 
                    '<div class="item-subtitle color-gray">有效期至2015-11-13</div>' + 
                    '<div class="coupon-tag"><span>已过期</span></div>' + 
                '</div>' + 
            '</a>';
        }
        // 添加新条目
        $list.append(html);
    }
	//addItems($('.j_coupon_list .list-block'));
	/*$.infiniteLoad.init({
		page: page,
		//url: API.HTTPS_HOST + '/index.php/licai/conduct/investday?type=1'+'&sid='+API.sid,
		nowpage: 2,
		processList: function(data, $list){
			addItems($list);
		},

	});*/

});

//绑定银行卡 判断
$(document).on('click', '.j_bind_card', function() {
	// 判断一下，添加银行卡前 进行
	//没实名 没有身份信息
	if (!userinfo.is_identity) {
		$.modal({
			text: '请先填写实名信息，再进行添加银行卡',
			buttons:[
				{
					text: '实名认证',
					onClick: function(){
						$.router.loadPage(API.HTTPS_HOST+'/index.php/licai/conduct/identity?sid='+API.sid+'&type=5');
					},
				},
				{
					text: '取消'
				}
			]
		});
		return false;
	}
	if(userinfo.is_bindcard) {
		//已绑定
		$.router.loadPage(userinfo.url_bankcards);
	} else {
		//未绑定
		$.router.loadPage(userinfo.url_bindcard);
	}
});

//选择银行
$(document).on('click', '.j-selectbank', function() {
    var _this = $(this);
    newhtml = _this.html();
    $("#J_bank_tag").html(newhtml);
    $.closeModal('.selectbank');
});

//绑定确定 保存银行卡
$(document).on('click', '.j_bindcard', function() {
	//购买入口 绑定成功 跳转去购买
	//个人中心入口 绑定成功从 跳我的银行卡
	var type= $(".j_bindcard").attr('rel');
	var card_no=$("#bankcardno").val();

	if(card_no==''){
		$.toast('银行卡为空', "error");
		return false;
	}
	if(luhmCheck(card_no)){
		$(".j_remove_bindcard").removeClass("j_bindcard");
		$.showPreloader();
		 $.ajax({
				type: "POST",
				url: API.HTTPS_HOST+"/index.php/licai/conduct/savecard"+'?sid='+API.sid,
				data: {'card_no':card_no ,'type':type},
				dataType:'json',
				complete:function(){
					$(".j_remove_bindcard").addClass("j_bindcard");	
					$.hideIndicator();
				},
				success: function(msg){	
					$(".button-fill").addClass("j_bindcard");
					if(msg.errcode==0){
						$.router.reloadPage(msg.url);
					}
					else {
						$.toast(msg.errmsg, "error");
						return false;
					}
				}
		});
	}	
});
//卡操作
$(document).on('click','.j_card_action', function () {
      var buttons1 = [
            {
                text: '解除绑定',
                color: 'danger',
                onClick: function() {
                    var textHtml = '<div style="margin: .8rem 0;">请输入身份认证号</div>';
                    $.modalPassword(textHtml, '请输入身份证号', function(identifycode){
                    	$.toast("解绑成功！", 1000, "success");
                    });
                }
            }
      ];
      var buttons2 = [
        {
            text: '取消',
        }
      ];
      var groups = [buttons1, buttons2];

      $.actions(groups);
 });
