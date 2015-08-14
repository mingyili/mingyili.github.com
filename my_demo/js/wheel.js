draw();
function draw() {
	var wwidth = (typeof($getWindowWidth) != 'undefined') ? $getWindowWidth() : 320;
	var	wheel = document.getElementById("wheel"),
		outerR = (wwidth >= 640 ? 640 : (wwidth <= 320 ? 320 : wwidth)) * 0.76; //转盘宽度
	
	var cont = $(".wheel_cont");
	$(wheel).css({
		"height": outerR + "px",
		"width": outerR + "px"
	});
	cont.height(outerR);
	cont.width(outerR);
	
	var pc = $(wheel).attr('chart');
	pc = pc.replace(/'/g, "\"");
	pc = JSON.parse(pc);
	pc = pieChart(wheel, pc);
	$(wheel).html(pc);
}
function pieChart(el,cd) {
    var tilt = 0,
		width = $(el).width(),
		height = $(el).height(),
		cx = (width / 2),
		cy = (height / 2),
		r = width/2,
		colors = wcolor,
		labels = winfo,
		num = labels.length, //总扇叶数
		angles = 2 * Math.PI / num;
	
    var lx = cd.lx, ly = cd.ly,
		wwidth = (typeof($getWindowWidth) != 'undefined') ? $getWindowWidth() : 320,
		fs = wwidth >= 600 ? "18px" : "3.5vw", //font size
		fw = 9 - num/2, //
		lh = wwidth >= 400 ? 26 : 14, //lineHeight
		fc = wfcolor || "#fff";
	if(wwidth === 320){
		fs = "14px", //font size
		lh = 16; //lineHeight
	}

    var svgns = "http://www.w3.org/2000/svg";    
    var chart = document.createElementNS(svgns, "svg:svg");
    chart.setAttribute("width", width);
    chart.setAttribute("height", height);
    chart.setAttribute("viewBox", "0 0 " + width + " " + height);


    startangle = tilt;
    for (var i = 0; i < num; i++) {
        var endangle = startangle + angles,
			halfangle = startangle + (angles / 2),
			words = labels[i].split(""),
			wlen = words.length,
			wpre = parseInt(wlen/fw);

        var x1 = cx + r * Math.sin(startangle);
        var y1 = cy - r * Math.cos(startangle);
        var x2 = cx + r * Math.sin(endangle); 
        var y2 = cy - r * Math.cos(endangle);
        var degrees = halfangle * (180 / Math.PI);
        
        var offset = (degrees > 180) ? (r + 30 + (labels[i].length*9)) : r + 30; 
        var lx = cx + (r*(0.74 + 0.02*wpre)) * Math.sin(halfangle);
        var ly = cy - (r*(0.74 + 0.02*wpre)) * Math.cos(halfangle);

        var big = 0;
        if (endangle - startangle > Math.PI) big = 1;
        var path = document.createElementNS(svgns, "path");
        var d = "M " + cx + "," + cy +  // Start at circle center
            " L " + x1 + "," + y1 +     // Draw line to (x1,y1)
            " A " + r + "," + r +       // Draw an arc of radius r
            " 0 " + big + " 1 " +       // Arc details...
            x2 + "," + y2 +             // Arc goes to to (x2,y2)
            " Z";                       // Close path back to (cx,cy)

        // Now set attributes on the <svg:path> element
        path.setAttribute("d", d);              // Set this path
		var colorsL = colors.length,
			j = (i > colorsL - 1) ? i % colorsL : i;
	
        path.setAttribute("fill", colors[j]);   // Set wedge color
        //path.setAttribute("stroke", "white");   // Outline wedge in black
        //path.setAttribute("stroke-width", "1"); // 2 units thick   
        chart.appendChild(path);                // Add wedge to chart

        var label = document.createElementNS(svgns, "text");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("x", lx);
        label.setAttribute("y", ly);
        label.setAttribute("font-family", "微软雅黑");
        label.setAttribute("font-size", fs);
		label.setAttribute("fill", fc);
		label.setAttribute("transform","rotate("+360+(2*i+1)/num*180+" "+lx+" "+ly+")");

		

		var LINE_HEIGHT = lh;
		var line = "";
		for (var n = 0; n < wlen; n++) {
			var testLine = line + words[n] + "";
			if (testLine.length > fw){
				var svgTSpan = document.createElementNS(svgns, 'tspan');
				svgTSpan.setAttributeNS(null, 'x', lx);
				svgTSpan.setAttributeNS(null, 'y', ly);
				var tSpanTextNode = document.createTextNode(line);
				svgTSpan.appendChild(tSpanTextNode);
				label.appendChild(svgTSpan);
				line = words[n] + "";
				ly += LINE_HEIGHT;
			}
			else {
				line = testLine;
			}
		}
		var svgTSpan = document.createElementNS(svgns,  'tspan');
		svgTSpan.setAttributeNS(null, 'x', lx);
		svgTSpan.setAttributeNS(null, 'y', ly);
		var tSpanTextNode = document.createTextNode(line);
		svgTSpan.appendChild(tSpanTextNode);
		label.appendChild(svgTSpan);
        
		chart.appendChild(label); 
        startangle = endangle;
    }
    return chart;
}

function angle(center, p1) {
    var p0 = {
        x: center.x, y: center.y - Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x)
                + Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y))
    };
    return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)) * 180 / Math.PI;
}

window.onresize = function(){
	//draw();
}