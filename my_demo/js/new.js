/*

*/
(function(window, $, undefined) {
	// body...
	function JsPlug(opt) {
		var config = opt || {};
		
		this.get = function(n) {
			return config[n];
		};
		this.set = function(n, v) {
			config[n] = v;
		};

		this.init();
	}
	
})(window, $);