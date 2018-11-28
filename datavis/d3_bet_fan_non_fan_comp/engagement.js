var margin2 = {top: 30, right: 20, bottom: 800, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x02 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x12 = d3.scale.ordinal();

var y2 = d3.scale.linear()
    .range([height, 0]);

var xAxis2 = d3.svg.axis()
    .scale(x02)
    .tickSize(0)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["#090909","#aaaaaa","#d5d5d5","#92c5de","#0571b0"]);

var svg2 = d3.select('#engagement').append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.json("d3_bet_fan_non_fan_comp/data_engagement.json", function(error, data) {

    var categoriesNames2 = data.map(function(d) { return d.category; });
    var rateNames2 = data[0].values.map(function(d) { return d.rate; });
    
    x02.domain(categoriesNames2);
    x12.domain(rateNames2).rangeRoundBands([x02.rangeBand()*0.6 - x02.rangeBand()*0.6*0.5, x02.rangeBand()*0.6 + x02.rangeBand()*0.6*0.25]);
    y2.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })+0.1]);
    
    svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis2)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("dy", "0em")
	.attr("dx", "-1.0em")
	.attr("transform", "rotate(-90)")
	//.call(wrap2, x02.rangeBand())
    ;
    
    
    
    svg2.append("g")
	.attr("class", "y axis")
	.style('opacity','0')
	.call(yAxis2)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.style('font-weight','bold')
	.text("Value");
    
    svg2.select('.y').transition().duration(300).delay(700).style('opacity','1');
    
    var slice2 = svg2.selectAll(".slice")
	.data(data)
	.enter().append("g")
	.attr("class", "g")
	.attr("transform",function(d) { return "translate(" + x02(d.category) + ",0)"; });
    
    
    slice2.selectAll("rect")
	.data(function(d) { return d.values; })
	.enter().append("rect")
	.attr("width", x12.rangeBand())
	.attr("x", function(d) { return x12(d.rate); })
	.style("fill", function(d) { return color(d.rate) })
	.attr("y", function(d) { return y2(0); })
	.attr("height", function(d) { return height - y2(0); })
	.on("mouseover", function(d) {
	    d3.select(this).style("fill", d3.rgb(color(d.rate)).brighter(0.3));
	})
	.on("mouseout", function(d) {
	    d3.select(this).style("fill", color(d.rate));
	});
    
    slice2.selectAll("rect")
	.transition()
	.delay(function (d) {return Math.random()*500;})
	.duration(500)
	.attr("y", function(d) { return y2(d.value); })
	.attr("height", function(d) { return height - y2(d.value); });
    
    //Legend
    var legend = svg2.selectAll(".legend")
	.data(data[0].values.map(function(d) { return d.rate; }).reverse())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
	.style("opacity","0");
    
    legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", function(d) { return color(d); });
    
    legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) {return d; });
    
    legend.transition().duration(200).delay(function(d,i){ return 100 + 100 * i; }).style("opacity","1");
    
    
    
    
    function wrap2(text, width) {
	console.log(text);
	text.each(function() {
	    var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = text.attr("y"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
		line.push(word);
		tspan.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width) {
		    line.pop();
		    tspan.text(line.join(" "));
		    line = [word];
		    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		    console.log(tspan);
		}
	    }
	});
    };
    
});


