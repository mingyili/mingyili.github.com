$(function () {
	//记录列表生成
	function investItems(data, $list) {
		// 生成新条目的HTML
		if(data.count < 1){
			$list.html('<div class="list-block"><div class="list-none">暂无投资记录，<a href="'+ API.HOST +'/index.php/licai/conduct/invest?sid='+ API.sid +'&link=invest" external>立即投资</a></div></div>');
			return;
		}
		var html = "";
		$.each(data.list, function(i, list){
			html += '<div class="list-block list-noborder list-full"><ul>' + 
					'<li class="item-inner">' +
						'<div class="item-title large">'+ (list.title || '') +'</div>' + 
						'<div class="item-after"><span class="tag bg-link">'+list.status_content+'</span></div>' +
					'</li><li class="item-inner">' + 
						'<div class="item-title">持有资金</div>' +
						'<div class="item-after">'+ list.own_money +'元</div>' +
					'</li><li class="item-inner">' + 
						'<div class="item-title">昨日收益</div>' +
						'<div class="item-after">'+ list.yes_money +'元</div>' + 
					'</li><li class="item-inner">' + 
						'<div class="item-title">年化收益</div>' +
						'<div class="item-after">'+ list.profit +'%</div>' +
					'</li>';
					if(list.type==2 || list.type==0){
						
					 html=html+'<li class="item-inner">'+
						'<div class="item-title">投资金额到期日</div>'+
						'<div class="item-after">'+list.due_time_day+'</div>'+
					    '</li>'
					}	
					html=html+'<li class="item-inner">' + 
						'<div class="item-title">存入时间</div>' +
						'<div class="item-after">'+ list.date +'</div>' +
					'</li><li class="item-inner">' + 
						'<div class="item-title">存入方式</div>' +
						'<div class="item-after">'+list.pay_type_content+'</div>' +
					'</li></ul></div>';
		});
		//console.log($list);
		$list.append(html);
	}
	//提现记录
	function cashItems(data, $list) {
		var html = "";
		// 生成新条目的HTML
		if(data.count < 1){
			$list.html('<div class="list-block"><div class="list-none">暂无提现记录</div></div>');
			return;
		}
		
		$.each(data.list, function(i, list){
			html += '<div class="list-block list-noborder list-full"><ul>' +
					'<li class="item-inner">' +
						'<div class="item-title large">'+ (list.title || '') +'</div>';
				
			if (list.status == 0 || list.status == 1 || list.status == 2){
				html += '<div class="item-after"><span class="tag  bg-link">处理中</span></div>';
			} else if (list.status == 3) {
				html += '<div class="item-after"><span class="tag  bg-primary">已出账</span></div>';
			} else if (list.status == 4 || list.status == 5 || list.status == 6){
				html += '<div class="item-after"><span class="tag  bg-gray">取现失败</span></div>';
			} else {
				html += '<div class="item-after"><span class="tag  bg-link">其他状态</span></div>';
			}
							
			html += '</li><li class="item-inner">' +
						'<div class="item-title">提现方式</div>' +
						'<div class="item-after">'+list.out_pay_content+'</div>' +
					'</li><li class="item-inner">' +
						'<div class="item-title">提现金额</div>' +
						'<div class="item-after">'+ list.money +'元</div>' +
					'</li><li class="item-inner">' +
						'<div class="item-title">提现时间</div>' +
						'<div class="item-after">'+ list.date +'</div>' +
					'</li></ul></div>';
		});
		$list.append(html);
	}
	//日利宝、月利宝、特权本金 记录下拉加载
	$(document).on("pageInit", function(e, id, page) {
		if (id === 'detailday' || id === 'detailmonth' || id === 'detailmoney') {
			$.infiniteLoad.init({
				page: page,
				lists: {
					'his_invest': {
						url: API.HOST + '/index.php/licai/conduct/detaildayinvest'+'?sid='+API.sid,
						list:'#his_invest',
						nowpage: 2,
						processUrl: function(url){
							if(id === 'detailmonth') return (API.HOST + '/index.php/licai/conduct/detailmonthinvest'+'?sid='+API.sid);
							if(id === 'detailmoney') return (API.HOST + '/index.php/licai/conduct/detailmoneyinvest'+'?sid='+API.sid);
						},
						processList:  function(data, $list){
							investItems(data, $list);
						},
					},
					'his_cash': {
						url: API.HOST + '/index.php/licai/conduct/detaildayout'+'?sid='+API.sid,
						list: '#his_cash',
						nowpage: 2,
						processUrl: function(url){
							if(id === 'detailmonth') return (API.HOST + '/index.php/licai/conduct/detailmonthout'+'?sid='+API.sid);
							if(id === 'detailmoney') return (API.HOST + '/index.php/licai/conduct/detailmoneyout'+'?sid='+API.sid);
							
						},
						processList:  function(data, $list){
							cashItems(data, $list);
						}
					},
				}
			});
		} else if (id === 'detailmoney') {
			$.infiniteLoad.init({
				page: page,
				list: '#his_money',
				url: API.HOST + '/index.php/licai/conduct/detaildayinvest'+'?sid='+API.sid,
				nowpage: 1,
				processList:  function(data, $list){
					investItems(data, $list);
				}
			});
		}
	
	}); //pageInit end
});