(function(){
	var dataA = [
		{ name: '及时雨', time: '08:10'},
		{ name: '智多星', time: '08:20'},
		{ name: '黑旋风', time: '08:30'},
		{ name: '鼓上蚤', time: '08:40'},
		{ name: '母大虫', time: '08:50'},
		{ name: '母夜叉', time: '09:10'}
	],
	dataB = [
		{ name: '行者', time: '10:20'},
		{ name: '花和尚', time: '10:30'},
		{ name: '九纹龙', time: '10:40'}
	];

	var demo = new Vue({
		el: '#demo',
		data: {
			items: dataA
		}
	});

	function changeA(control){
		control.items.$set(6, { name: '豹子头', time: '10:10'})
	}
	function changeB(control){
		control.items = control.items.concat(dataB);
	}

	setTimeout(function(){
		changeB(demo);
	}, 1000);
})();