/*!
 * Last Update : 2016-02-25 04:04:09
 */
function checkMobile(a){var b=/^1\d{10}$/;return b.test(a)?!0:!1}function IdCardValidate(a){if(a=trim(a.replace(/ /g,"")),15==a.length)return isValidityBrithBy15IdCard(a);if(18==a.length){var b=a.split("");return isValidityBrithBy18IdCard(a)&&isTrueValidateCodeBy18IdCard(b)?!0:!1}return!1}function isTrueValidateCodeBy18IdCard(a){var b=0;"x"==a[17].toLowerCase()&&(a[17]=10);for(var c=0;17>c;c++)b+=Wi[c]*a[c];return valCodePosition=b%11,a[17]==ValideCode[valCodePosition]?!0:!1}function isValidityBrithBy18IdCard(a){var b=a.substring(6,10),c=a.substring(10,12),d=a.substring(12,14),e=new Date(b,parseFloat(c)-1,parseFloat(d));return e.getFullYear()!=parseFloat(b)||e.getMonth()!=parseFloat(c)-1||e.getDate()!=parseFloat(d)?!1:!0}function isValidityBrithBy15IdCard(a){var b=a.substring(6,8),c=a.substring(8,10),d=a.substring(10,12),e=new Date(b,parseFloat(c)-1,parseFloat(d));return e.getYear()!=parseFloat(b)||e.getMonth()!=parseFloat(c)-1||e.getDate()!=parseFloat(d)?!1:!0}function trim(a){return a.replace(/(^\s*)|(\s*$)/g,"")}function luhmCheck(a){if(a.length<16||a.length>19)return $.alert("银行卡号长度必须在16到19之间","【验证失败】",function(){}),!1;var b=/^\d*$/;if(!b.exec(a))return $.alert("银行卡号必须全为数字","【验证失败】",function(){}),!1;var c="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";if(-1==c.indexOf(a.substring(0,2)))return $.alert("银行卡号开头6位不符合规范","【验证失败】",function(){}),!1;for(var d=a.substr(a.length-1,1),e=a.substr(0,a.length-1),f=new Array,g=e.length-1;g>-1;g--)f.push(e.substr(g,1));for(var h=new Array,i=new Array,j=new Array,k=0;k<f.length;k++)(k+1)%2==1?2*parseInt(f[k])<9?h.push(2*parseInt(f[k])):i.push(2*parseInt(f[k])):j.push(f[k]);for(var l=new Array,m=new Array,n=0;n<i.length;n++)l.push(parseInt(i[n])%10),m.push(parseInt(i[n])/10);for(var o=0,p=0,q=0,r=0,s=0,t=0;t<h.length;t++)o+=parseInt(h[t]);for(var u=0;u<j.length;u++)p+=parseInt(j[u]);for(var v=0;v<l.length;v++)q+=parseInt(l[v]),r+=parseInt(m[v]);s=parseInt(o)+parseInt(p)+parseInt(q)+parseInt(r);var w=parseInt(s)%10==0?10:parseInt(s)%10,x=10-w;return d==x?!0:($.alert("银行卡输入错误","【验证失败】",function(){}),!1)}function showAwardTips(a,b){if(a)var c='<div class="popup redbag_pop"><div class="act_info"><i>红包<br/>已发送</i><i class="gleamAnim"></i><i class="gleamAnim"></i><i class="gleamAnim"></i><div class="act_line"></div></div><div class="redbag_cont"><a class="close icon-close close-popup"></a><p class="redbag_tit">再送<br/>5000元特权本金</p><p class="redbag_info btn"><a class="button button-fill button-round" href="'+licai_url+'" external>查看我的理财</a></p></div><div class="redbag_back"></div></div>';else var c='<div class="popup redbag_pop"><div class="redbag_cont"><a class="close icon-close close-popup"></a><p class="redbag_tit">已送<br/>5000元特权本金</p><p class="redbag_info btn"><a class="button button-fill button-round" href="'+licai_url+'" external>查看我的理财</a></p></div><div class="redbag_back"></div></div>';$.popup(c),setTimeout(function(){$(".act_info").css("top","10%"),$(".act_line").css("height","5rem"),$(".redbag_cont").show().addClass("popAnim shown"),$(".redbag_back").show().addClass("popAnim shown")},500)}function time(a,b){0==b?(a.removeClass("disabled"),a.html("发送验证码")):(a.addClass("disabled"),b--,a.html(b+"s后再发"),setTimeout(function(){time(a,b)},1e3))}var Wi=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1],ValideCode=[1,0,10,9,8,7,6,5,4,3,2];$(document).on("click",".j-selectbank",function(){var a=$(this);newhtml=a.find(".item-title").html(),$("#J_bank_tag .item-input").html(newhtml),$.closeModal(".selectbank")});var bindstatus=1;$(document).on("click",".j_bindcard",function(){if(1!=bindstatus)return!1;bindstatus=0;var a=$(this),b=$("#conductname").val(),c=$("#bindcellphone").val(),d=$("#bindphonecode").val(),e=$("#conductidentity").val(),f=$("#bankcardno").val().trim();if(""==b)return $.alert("请输入姓名",function(){}),bindstatus=1,!1;if(!IdCardValidate(e))return $.alert("请输入正确的身份证号",function(){}),bindstatus=1,!1;if(""==f)return bindstatus=1,$.alert("请输入银行卡号",function(){}),!1;var g=luhmCheck(f);g?($(this).html("正在绑定中..."),$.showPreloader(),$.ajax({type:"POST",url:register_url,data:{phone:c,phonecode:d,card_no:f,realname:b,id_num:e,id:act_id,ask_id:ask_id},dataType:"json",complete:function(){$(".j_remove_bindcard").addClass("j_bindcard"),$.hideIndicator()},success:function(b){return $(".button-fill").addClass("j_bindcard"),0!=b.errcode?(bindstatus=1,a.html("确定"),$.alert(b.errmsg,"",function(){}),!1):(a.hide(),void(0==b.data.redbag.status?showAwardTips(0,1):window.location.href=b.data.redbag.jump_url))}})):bindstatus=1}),$(document).on("click",".j_send_code",function(){var a=$("#bindcellphone").val();if(!checkMobile(a))return $.alert("手机号不合法","【无法进行发送短信】",function(){}),!1;var b=$(this),c=b.hasClass("disabled");return c?!1:(c||(b.addClass("disabled"),time(b,60)),void $.ajax({type:"POST",url:API.HOST+"/index.php/licai/conduct/sendverifycode?sid="+API.sid,data:{phone:a,sendcode:1,business:"bindphone"},dataType:"json",success:function(a){1==a.errcode&&$.alert(a.errmsg,"【发送失败】",function(){})}}))}),1==show_award_page&&showAwardTips(1,0);