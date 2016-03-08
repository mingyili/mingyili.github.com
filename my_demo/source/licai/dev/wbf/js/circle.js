(function($){
    $.fn.circle = function(option) {
        var options = $.extend({
            percent: 0,
            size: 100,
            color: "#ed6d00",
            back: "rgba(0,0,0, .06)",
            width: .8,
            baserem: 14,
            animationstep: 1.64,
        }, option);

        return this.each(function() {
            //补充信息
            function setCont(parent) {
                parent.css({
                    '-webkit-transform-origin': '0 0',
                    '-webkit-transform': 'scale(.5, .5)',
                    'margin-left': -l.size * .25 + 'rem',
                });
            }
            //画百分比
            function draw(a){ //a
                ctx.clearRect(0, 0, canvas.width, canvas.height),
                ctx.beginPath(),
                ctx.arc(c_x, c_y, x, G, k, !1), 
                //ctx.arc(c_x, c_y, x, -I, P * a - I, !1),
                ctx.strokeStyle = l.back,
                ctx.lineCap = "round",
                ctx.stroke();
                    
                ctx.beginPath();
                ctx.arc(c_x, c_y, x, -I, P * a - I, !1);
                /*if(l.step > M) {
                    ctx.arc(c_x, c_y, x, -I, P * a - I, !1);
                }else{
                    ctx.arc(c_x, c_y, x, -I, P * l.step / 100 - I, !1);
                }*/
                ctx.lineWidth =  l.width * l.baserem,
                ctx.strokeStyle = l.color,
                ctx.stroke();

                l.step > M && (M += z, requestAnimationFrame(function() {
                    draw(Math.min(M, l.step) / 100);
                }, _this));
                /*
                (100 > M) && (M += z, requestAnimationFrame(function() {
                    draw(Math.min(M, 100) / 100);
                }, _this));*/
            }

            var _this = $(this),
                _span = null,
                l = {
                    percent: options.percent / 100,
                    step: options.percent,
                    size: options.size,
                    color: options.color,
                    width: options.width,
                    back: options.back,
                    baserem: options.baserem,
                    animestep: options.animationstep,
                    dely: 500
                };

            if(void 0 != _this.data("percent")){
                l.step = _this.data("percent");
                l.percent = l.step / 100;
            }
            if(void 0 != _this.data("size")){
                l.size = _this.data("size");
                _this.width(l.size + "rem");
                l.baserem =  parseInt(_this.width() / l.size);
                setCont(_this);
            }

            void 0 != _this.data("color") && (l.color = _this.data("color"));
            void 0 != _this.data("back") && (l.back = _this.data("back"));
            void 0 != _this.data("width") && (l.width = _this.data("width"));
            //开始
            var canvas = $("<canvas></canvas>").attr({
                    width: l.size * l.baserem,
                    height: l.size * l.baserem
                }).appendTo(_this).get(0), //b
                ctx = canvas.getContext("2d"), //g
                c_x = canvas.width / 2, //m
                c_y = canvas.height / 2, //v
                angle = 360 * l.percent, //_
                x = (angle * (Math.PI / 180), canvas.width / 2.5), //x
                k = 2.3 * Math.PI, //k
                G = 0, //G 1
                M = 0 === l.animestep ? l.step : 0, //M
                z = Math.max(l.animestep, 0), //z
                P = 2 * Math.PI, //P
                I = Math.PI / 2, //I
                R = "";

            ctx.clearRect(0, 0, canvas.width, canvas.height),
            ctx.beginPath(),
            ctx.arc(c_x, c_y, x, G, k, !1), 
            ctx.strokeStyle = l.back,
            ctx.lineWidth =  l.width * l.baserem,
            ctx.lineCap = "round",
            ctx.stroke();
            
            draw(M / 100);
        });
    }
    
    //新页面切入完成之后实例化页面 js
    $(document).on("pageInit", '#detailprd', function(e, pageId, $page) {
        $("#J_circle").circle();
    });

})(Zepto);