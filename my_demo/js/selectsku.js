$(function(){ 
	/**
	 * 选择sku的模块
	*/
	var sku, skuid, num_iid,
		sina_uid, oauthUrl, viewer = '';
		
	var propertie1 = '', //类似于颜色
		propertie2 = '', //类似于尺码
		propertie3 = ''; //备注
		
	var buynum = 1, //购买数量
		sku_quantity = -1, //某组sku库存
		prd_quantity, //总库存
		prd_distype, prd_disnum,
		unsale, oldprice;
		//wbulk, is_presell,

	/** sku信息 **/
	var scrollsku, wheight = wheight || $(window).height(),
		mheight = wheight*0.8 - 120;
	var J_sku = "#J_sku", //sku滑出层id
		$J_sku = $(J_sku), //sku滑出层
		J_skuScroll = 'skuScroll', //sku滚动div的id
		$sku = $('#sku'), //sku信息
		$cnum = $('#cnum'); //购物车数量标签
	/** 商品信息标签 **/
	var $buy_num = $("#buy_num"), //购买数量
		$quantity = $(".quantity"), //库存
		$prd_price = $('.prd_price'), //原价
		$new_price = $('.new_price'), //现价
		$prd_discount = $('.prd_discount'), //优惠信息
		$prd_img = $('.prd_img'), //图片
		$prd_name = $('.prd_name'), //商品名称
		$prd_link = $('.prd_link'), //商品连接
		$btn_sell = $('.btn_sell'), //能购买按钮
		$btn_null = $('.btn_null'), //不能购买按钮
		$btn_minus = $(".btn_minus"), //减数量
		$btn_add = $(".btn_add"); //加数量
	/**
	 *实例化sku滑出层
	 */
	function initSlide(){ 
		var skuScroll = $("#" + J_skuScroll);
		if(skuScroll.height() > mheight){
			skuScroll.css("height", mheight);
			//scrollsku = new iScroll(J_skuScroll);
			$J_sku.unbind("touchmove", stopProp);
		}else{
			//scrollsku && scrollsku.destroy();
			skuScroll.css("height", 'auto');
			$J_sku.bind("touchmove", stopProp);
		}
	}
	var oldid = ""; //上一个商品
	/**
	 * diyBuy(prdid, link, type) 实例化滑出层商品信息，要展示的购买按钮，sku信息，
	 * prdid: 商品id
	 * link: 商品连接
	 * type: 'buy'直接购买，'cart'加入购物车，'zc'众筹//可叠加
	 */ 
	function diyBuy(prdid, link, type){
		//滑出层处理
		if(prdid != oldid){
			$btn_sell.hide(); $btn_null.hide();
			//按钮处理
			if(type.indexOf('buy') > -1){ //立即购买显示
				$(".btnbuy").show();
			}
			if(type.indexOf('cart') > -1){ //加入购物车显示
				$(".btncart").show();
			}
			if(type.indexOf('zc') > -1){ //众筹按钮显示
				$(".btnzc").show();
			}
			My.showLoad("稍等...");
			addSku(prdid, link, callBack);
			function callBack(){
				oldid = prdid;
				showLayer(J_sku, 'slideUpAnim'); //展示
				initSlide();
				My.hideLoad();
			}
		}else{
			showLayer(J_sku, 'slideUpAnim');
		}
	}
	
	//sku关闭
	$(".j_closeBotm").click(function(e){
		stopProp(e);
		hideLayer(J_sku, 'slideUpAnim');
	});

	/**标签 a、li、p、img、div、button、label、
	 *类：.ywk-diybuy默认绑定购买和加入购物车按钮
	 *属性：btntype = buy购买，cart购物车，zc众筹 可叠加
	 *属性：prdid 商品id
	 *属性：prdlink 商品链接 可选
	*/
	$('.ywk-diybuy').live('click', function(){
		var self = $(this),
			type = self.attr("btntype") || 'buy,cart', //展示按钮
			prdid = self.attr("prdid"),
			link = self.attr("prdlink"); //商品连接
			
		if(type == 'zc' && !subscribe){ //未关注
			My.showFollow();
			return false;
		}
		diyBuy(prdid, link, type);		
	});
	/****** 兼容以前的事件 start*******/
	//自定义众筹
	$('.ywk-diybuyzc').live('click', function(e){ //自定义众筹
		if(!subscribe){ //未关注
			My.showFollow();
			return false;
		}
		var self = $(this),
			prdid = self.attr("prdid"),
			link = self.attr("prdlink"), //商品连接
			type = 'zc';
		diyBuy(prdid, link, type);	
	});
	
	//商品列表里按钮事件绑定
	$('.nowBuy, .addCart').live('click', function(e){
		var self=$(this),
			prdid = self.parent("li").attr("replaceid"),
			type = self.parent("li").attr("act") || 'buy,cart', //类型
			link = self.parent("li").find("a").attr("href");
		//type = type || 
		if(type == 'zc' && !subscribe){ //未关注
			My.showFollow();
			return false;
		}
		diyBuy(prdid, link, type);
	});
	/****** 兼容以前的事件 end*******/
	
	//改变数量 -
	$btn_minus.click(function(){
		var num = $buy_num.val();
			num = parseInt(num),
			quantity = parseInt($quantity.text());
		if(num <= 1){
			My.showTip('商品数量不能小于1') ;
		}else{
			buynum = num - 1;
			$buy_num.val(buynum);
			changePrice(oldprice, buynum, prd_distype, prd_disnum);
		}
		buynum <= 1 && $btn_minus.addClass('btn_dis');
		(buynum <= max_buy_num || buynum <= quantity) && $btn_add.removeClass('btn_dis');
		buynum <= 0 && $btn_add.addClass('btn_dis');
	});

	//改变数量 +
	$btn_add.click(function(){
		var num = $buy_num.val();
			num = parseInt(num),
			quantity = parseInt($quantity.text());
		var new_num = num + 1;
		if(sku != 'null' && sku_quantity == -1){
			My.showTip("请选择分类");
		}else{
			if(max_buy_num && new_num > max_buy_num){
				My.showTip("该商品每人仅限购买" + max_buy_num + "件");
				return false;
			}else if(new_num > quantity){
				My.showTip("您购买的数量不能超过库存");
				return false;
			}
		}
		buynum = new_num;
		$buy_num.val(buynum);
		changePrice(oldprice, buynum, prd_distype, prd_disnum);
		
		buynum > 1 && $btn_minus.removeClass('btn_dis');
		(buynum >= max_buy_num || buynum >= quantity) && $btn_add.addClass('btn_dis');
	});

	//绑定sku选择
	$('#sku').delegate('.j_sku', 'click', function(){
		var self = $(this),
			iid = self.prev("input"),
			father = self.attr("father");
			
		if(!self.hasClass("check")){
			$("#"+father+" .j_sku.check").removeClass("check");
			self.addClass("check");
			$("#"+father+" input").removeClass("checked");
			//iid.attr("checked", "checked").change();
			iid.addClass("checked").change();
			
			if(sku_quantity != -1){ //
				if(buynum > sku_quantity){ //购买数量大于库存
					$buy_num.attr("value", sku_quantity);
					buynum = sku_quantity;
				}
			}
		}
	});
	
	//sku input改变
	$('input[name="size"]').live("change", function() { 
		isSku();
	});
	$('input[name="color"]').live("change", function() {
		isSku();
	});
	$('input[name="content"]').live("change", function() {
		isSku();
	});
	//按钮事件
	//立即购买
	$(".btnbuy").live("click",function(){
		btnBuy();
	});
	//加入购物车
	$(".btncart").live("click",function(){
		btnCart();
	});
	//众筹
	$(".btnzc").live("click",function(){
		btnZc();
	});
	
/********************** 处理函数 ********************************/

	/**价格改变
	 * price 原价，num购买数量，distype折扣类型，disnum折扣值
	 */
	function changePrice(price, num, distype, disnum){

		num = num || 1;
		price = price || 0;
		if(!isNaN(price)){
			if(distype == 'price'){ //立减
				price = price * num - disnum; 
			}
			if(distype=='discount'){ //打折
				price = price * num * disnum * 0.1; 
			}
			$new_price.html("<span class='f12'>现价: ￥</span>" + parseFloat(price).toFixed(2));
		}else{
			$new_price.html("<span class='f12 gray'>" + price + "</span>");
		}
		//$new_price.html(Math.round(price*100)/100);
	}
	/**
	 * 购买数量改变的时候加减按钮和购买按钮样式改变
	 */
	function changeBtns(num){
		if(num >= 1){
			$buy_num.val(1);
			$btn_minus.addClass('btn_dis');
			$btn_add.removeClass('btn_dis');
			$btn_sell.removeClass('btn_dis');
		}else{
			$buy_num.val(0);
			$btn_minus.addClass('btn_dis');
			$btn_add.addClass('btn_dis');
			$btn_sell.addClass('btn_dis');
		}
	}

	/**异步添加sku
	 * prdid 商品id，link商品连接，callback回调函数
	 */
	function addSku(prdid, link, callBack){
		$buy_num.val(1);
		$.ajax({
			type:"post",
			timeout:5000, //访问超时
			data:{"prdid":prdid, "sid":sid},
			url:addSku_url,
			success:function(msg){
				var data = eval('(' + msg + ')');
				//console.log(data);
				$prd_name.text(data.title);
				$prd_img.attr("src", data.pic_url + "_80x80.jpg");
				link ? $prd_link.attr("href", link) : $prd_link.attr("href", 'javascript:void(0)');
				
				oldprice = data.price;
				isNaN(oldprice) ? $prd_price.hide() : $prd_price.show().html("原价: ￥" + oldprice);
				
				/******优惠信息处理start*******/
				//折扣类型，window.distype 全局的折扣类型，'discount'为打折， 'price'为减价
				prd_distype = window.distype || data.distype; 
				prd_disnum = window.discount || data.prd_disnum; //折扣值，window.discount 全局的折扣值，
				changePrice(oldprice, 1, prd_distype, prd_disnum)
				if(prd_distype == "discount"){
					$prd_discount.html(prd_disnum + '折').show();
				}else if(prd_distype == "price"){
					$prd_discount.html('立减' + prd_disnum).show();
				}else{
					$prd_discount.hide();
				}
				/*******优惠信息处理end*******/
				prd_quantity = data.prd_num; //总库存
				$quantity.text(prd_quantity);
				changeBtns(prd_quantity); //按钮样式变化
				
				oauthUrl = data.OauthUrl; //?
				sina_uid = data.sina_uid; //?
				
				$sku.html(data.prdsku.sku).show(); 
				sku = data.is_sku ;
				num_iid = data.num_iid;
				sid = data.sid; cid = data.cid;
				propertie1 = data.propertie1;
				propertie2 = data.propertie2;
				propertie3 = data.propertie3;
				//
				if(data.wbulk == 1 || data.is_presell == 1){ //微团购、预售直接跳转
					window.top.location.href = WexinUrl + "?key=ShowPrd:" + num_iid + "&sid=" + sid;
				}
				//商品下架
				if(data.unsale == "unsale"){
					$btn_sell.hide();
					$btn_null.html("商品已下架").show();
				}
				//商品已售完
				if(data.prd_num <= 0){
					$btn_sell.hide();
					$btn_null.html("商品已售完").show();
				}
				else{
					$btn_null.hide();
				}
				callBack();
			},
			error:function(XMLHttpRequest, textStatus, msg){
				My.hideLoad();
				if(textStatus =='timeout') {My.errorTip("请求超时");}
				else{My.errorTip(textStatus);}
			}
		});
	}
	//判断sku改变 
	function isSku(){
		//console.log($('input[name="size"].checked').val());
		if(!( (propertie1 && !$('input[name="color"].checked').val() ) || (propertie2 && !$('input[name="size"].checked').val()) || (propertie3 && !$('input[name="content"].checked').val() ) ) ){
			var color = $('input[name="color"].checked').val() ;
			var cnum = $('input[name="size"].checked').val() ;
			var content_1 = propertie3 ? $('input[name="content"].checked').val(): "" ;
				cnum = cnum > "" ? cnum : color;
				color = color > "" ? color : cnum;
			var reData = getSkuIdAndNum(sku, color, cnum,content_1) ;
				skuid = reData['sku_id'] ;
				sku_quantity = reData['quantity'] ;

			//生成页面内容
			$quantity.html(sku_quantity); 
			changeBtns(sku_quantity); //按钮样式变化
			
			oldprice = reData["price"];
			isNaN(oldprice) ? $prd_price.hide() : $prd_price.show().html("原价: ￥" + oldprice);
			changePrice(oldprice, buynum, prd_distype, prd_disnum);
		}
	}

	//根据颜色和尺码获取skuid
	function getSkuIdAndNum(sku, color, cnum, content_1) {
		var sku = eval('(' + sku + ')'),
			scolor = "",
			properties_name = '',
			scnum = 0,
			reData = new Array(),
			properties_color = new Array(),
			properties_cnum = new Array();
			
		if (!sku.properties_name) { //如果不为单sku 
			var i = 0;
			for (i = 0; i < sku.length; i++) {
				properties_name = sku[i].properties_name;
				properties_color = properties_name.split(":");
				if (content_1) {
					properties_scnum = properties_color[properties_color.length - 4].split(";");
					scnum = properties_scnum[0];
					scontent_1 = properties_color[properties_color.length - 1];
				} else {
					scnum = properties_color[properties_color.length - 1];
					scontent_1 = "";
				}
				properties_cnum = properties_color[3].split(";");
				scolor = properties_cnum[0];
				
				if (color == scolor && scnum == cnum && scontent_1 == content_1) {
					reData['sku_id'] = sku[i].sku_id;
					reData['price'] = sku[i].price;
					reData['quantity'] = sku[i].quantity;
					return reData;
				}
			}
			if (i == sku.length) { //没有找到
				reData['sku_id'] = 0;
				reData['price'] = "暂无产品报价";
				reData['quantity'] = 0;
				return reData;
			}
		} else { //单sku
			reData['sku_id'] = sku.sku_id;
			reData['price'] = sku.price;
			reData['quantity'] = sku.quantity;
			return reData;
		}
		
		reData['sku_id'] = 0;
		reData['price'] = "暂无产品报价";
		reData['quantity'] = 0;
		return reData;
	}
	//验证sku选择
	function checkSku(){
		if(!((propertie1 && !$('input[name="color"].checked').val() ) || (propertie2 && !$('input[name="size"].checked').val() ) || (propertie3 && !$('input[name="content"].checked').val() ) ) ){
			//选择正常
			if (sku_quantity == 0) {
				My.showTip("库存不足哦,请选择其他规格~");
				return false;
			}
		} else if (propertie1 && !$('input[name="color"].checked').val()) {
			My.showTip("请选择" + propertie1 + "!");
			return false;
		} else if (propertie2 && !$('input[name="size"].checked').val()) {
			My.showTip("请选择" + propertie2 + "!");
			return false;
		} else if (propertie3 && !$('input[name="content"].checked').val()) {
			My.showTip("请选择" + propertie3 + "!");
			return false;
		}
		return true;
	}
	//直接购买
	function btnBuy(){
		if(sku != "null" && sku) { //当有sku的时候
			if(checkSku()) window.top.location.href = buy_url + ":" + skuid + ":" + buynum + ":" + num_iid + ":1:" + "&viewer=" + viewer + "&sid=" + sid+"&prdactid="+prdactid+'&init_id='+init_id;
		}else{
			if(parseInt(prd_quantity) < 1 || prd_quantity == ''){
				My.showTip("商品库存不足!");
				return false;
			} 
			//购买连接
			setTimeout(function(){window.top.location.href = buy_url + ":0:" + buynum + ":" + num_iid + ":0:" + "&viewer=" + viewer + "&sid=" + sid+"&prdactid="+prdactid+'&init_id='+init_id; }, 100);
		}
	}
	//众筹
	function btnZc(){
		if(sku != "null" && sku) { //当有sku的时候
			if(checkSku()) window.top.location.href =crowdfunding_url+"?num="+buynum+"&sku_id="+skuid+"&num_iid="+num_iid+"&is_donation=0"+"&paid_type=2"+"&helpbuy=2"+"&sid="+sid;
		}else{
			if(parseInt(prd_quantity) < 1 || prd_quantity == ''){
				My.showTip("商品库存不足!");
				return false;
			} 
			//购买连接
			window.top.location.href =crowdfunding_url+"?num="+buynum+"&num_iid="+num_iid+"&is_donation=0"+"&paid_type=2"+"&helpbuy=2"+"&sid="+sid;
		}
	}
	//加入购物车
	function btnCart() {
		if (!sina_uid) {
			window.top.location.href = oauthUrl;
		} else {
			if (sku != "null" && sku) {
				if(!checkSku()) return false;
			} else {
				//获取当前商品的库存
				if(parseInt(prd_quantity) < 1 || prd_quantity == ''){
					My.showTip("商品库存不足!");
					return false;
				}
			}
			My.showLoad("正在加入购物车...");
			$.ajax({
				type: "POST",
				url: addCart_url,
				//向指定页面发送数据
				data: "prd_id=" + num_iid + "&sku_id=" + skuid + "&buy_num=" + buynum + "&sid=" + sid + "&cid=" + cid,
				success: function(msg) {
					My.hideLoad();
					var re = eval('(' + msg + ')');
					if (parseInt(re.seller) > 0) {
						My.successTip("商品已成功加入购物车");
						hideLayer(J_sku, 'slideUpAnim');
						setTimeout(function(){
							$cnum.addClass("add");
							$cnum.html(parseInt(re.seller));
						},400);
						setTimeout(function(){
							$cnum.removeClass("add");
						},1000);
					}
				}
			}); //ajax
		}
	}
});

