function  checkMobile(str) {
    var re = /^1\d{10}$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
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
			//$("#banknoInfo").html("银行卡号长度必须在16到19之间");
			 $.alert('银行卡号长度必须在16到19之间', '【验证失败】', function() {

			    });
			return false;
		}
		var num = /^\d*$/;  //全数字
		if (!num.exec(bankno)) {
			//$("#banknoInfo").html("银行卡号必须全为数字");
			 $.alert('银行卡号必须全为数字', '【验证失败】', function() {

			    });
			return false;
		}
		//开头6位
		var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
		if (strBin.indexOf(bankno.substring(0, 2))== -1) {
			//$("#banknoInfo").html("银行卡号开头6位不符合规范");
			 $.alert('银行卡号开头6位不符合规范', '【验证失败】', function() {

			    });
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
        // $("#banknoInfo").html("银行卡号必须符合Luhm校验");
   	    $.alert('银行卡输入错误', '【验证失败】', function() {

	    });
        return false;
        }        
    }
function showAwardTips(regbag,tqbj){
	if(regbag){
	    var popupHTML = '<div class="popup redbag_pop">'+
	    '<div class="act_info"><i>红包<br/>已发送</i><i class="gleamAnim"></i><i class="gleamAnim"></i><i class="gleamAnim"></i><div class="act_line"></div></div>' +
	    '<div class="redbag_cont">' + 
	        '<a class="close icon-close close-popup"></a>' + 
	        '<p class="redbag_tit">再送<br/>5000元特权本金</p>' + 
	        '<p class="redbag_info btn"><a class="button button-fill button-round" href="'+licai_url+'" external>查看我的理财</a></p>' + 
	    '</div>' + 
	    '<div class="redbag_back"></div>' +  
	'</div>';
	}else{
	    var popupHTML = '<div class="popup redbag_pop">' +
	    '<div class="redbag_cont">' + 
	        '<a class="close icon-close close-popup"></a>' + 
	        '<p class="redbag_tit">已送<br/>5000元特权本金</p>' + 
	        '<p class="redbag_info btn"><a class="button button-fill button-round" href="'+licai_url+'" external>查看我的理财</a></p>' + 
	    '</div>' + 
	    '<div class="redbag_back"></div>' +  
	'</div>';
	}
	$.popup(popupHTML);
	setTimeout(function(){
	    $(".act_info").css('top', '10%');
	    $(".act_line").css('height', '5rem');
	    $(".redbag_cont").show().addClass('popAnim shown');
	    $(".redbag_back").show().addClass('popAnim shown');
	}, 500);
}
$(document).on('click', '.j-selectbank', function() {
    var _this = $(this);
    newhtml = _this.find('.item-title').html();

    $("#J_bank_tag .item-input").html(newhtml);
    $.closeModal('.selectbank');
});
var bindstatus=1;
$(document).on('click', '.j_bindcard', function() {
	if(bindstatus!=1){
		return false;
	}
	bindstatus=0;
	var _this=$(this);
	var name=$("#conductname").val();
	var phone =$("#bindcellphone").val();
	var code =$("#bindphonecode").val();
	var identity=$("#conductidentity").val();
	var card_no=$("#bankcardno").val().trim();
	if(name==''){
		 $.alert('请输入姓名', function() {

		    });
		bindstatus=1;
		 return false;
	}
	if(!IdCardValidate(identity)){
		$.alert('请输入正确的身份证号', function() {

		    });
		bindstatus=1;
		 return false;
	}
	//购买入口 绑定成功 跳转去购买
	//个人中心入口 绑定成功从 跳我的银行卡
	//$(".j_remove_bindcard").removeClass("j_bindcard");
	if(card_no==''){
		bindstatus=1;
		 $.alert('请输入银行卡号', function() {

		    });
		 return false;
	}
	var result=luhmCheck(card_no);
	if(result){
		$(this).html("正在绑定中...");
		$.showPreloader();
		 $.ajax({
				type: "POST",
				url: register_url,
				data: {'phone':phone,'phonecode':code,'card_no':card_no,'realname':name,'id_num':identity,'id':act_id,'ask_id':ask_id},
				dataType:'json',
				complete:function(){
					$(".j_remove_bindcard").addClass("j_bindcard");	
					$.hideIndicator();
				},
				success: function(msg){
					$(".button-fill").addClass("j_bindcard");
					if(msg.errcode==0){
						_this.hide();
						if(msg.data.redbag.status==0){//仅送特权本金，不需要跳转
							showAwardTips(0,1);
						}else{
							window.location.href=msg.data.redbag.jump_url;
						}
					}
					else {
						bindstatus=1;
						_this.html("确定");
						 $.alert(msg.errmsg, '', function() {

						    });
						 return false;
					}
				}
		});
	}else{

		bindstatus=1;
	}	
});


//计时程序
function time(dom, now) {
    if (now == 0) {
        dom.removeClass("disabled");
        dom.html('发送验证码');
    } else {
        dom.addClass("disabled");
        now--;
        dom.html(now + 's后再发');
        setTimeout(function() {
            time(dom, now);
        }, 1000);
    }
}
//发送验证码
//$(document).on('click', '.j_send_code', function() {
//    var _this = $(this),
//        disabled = _this.hasClass('disabled');
//    if (!disabled) {
//        _this.addClass('disabled');
//        time(_this, 60);
//    }
//});
//发送验证码     j_send_code_password 
$(document).on('click', '.j_send_code', function() {
	var phone =$("#bindcellphone").val();
	if(!checkMobile(phone)){
		 $.alert('手机号不合法', '【无法进行发送短信】', function() {

		    });
		return false;
	}
    var _this = $(this),
        disabled = _this.hasClass('disabled');
    if(disabled){
    	return  false;
    }
    if (!disabled) {
        _this.addClass('disabled');
        time(_this, 60);
      
    }
    $.ajax({
	type: "POST",
	url: API.HOST+"/index.php/licai/conduct/sendverifycode"+'?sid='+API.sid,
	data: {'phone':phone,'sendcode':1,'business':'bindphone'},
	dataType:'json',
	success: function(msg){	
		if(msg.errcode==1){
			 $.alert(msg.errmsg, '【发送失败】', function() {
			    });
		}
	}
    }); 
});


//红包领取弹出层
if(show_award_page==1){
	showAwardTips(1,0);
}