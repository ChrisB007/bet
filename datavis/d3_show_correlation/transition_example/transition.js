var btnNewShow = document.getElementById("new_show")
btnNewShow.addEventListener('click', function(e){
  change(e.target.id)
})

var btnFavShow = document.getElementById("favorite_show")
btnFavShow.addEventListener('click', function(e){
  change(e.target.id)
})


var bothData = [{"value": 0.9239623075155137, "attribute": " To understand the plot/storyline", "feature": "new_show", "count": 102.0}, {"value": 0.8277106559502204, "attribute": " Feel confident that it would be worth my time", "feature": "new_show", "count": 81.0}, {"value": 1.11980127309424, "attribute": " Have someone on the cast that I recognize and like from previous work", "feature": "new_show", "count": 61.0}, {"value": 2.049088575096277, "attribute": " Feel like it will help me connect with others", "feature": "new_show", "count": 54.0}, {"value": 1.6689377990430625, "attribute": " Feel like it will enrich my life", "feature": "new_show", "count": 59.0}, {"value": 0.8854086435601197, "attribute": " To be able to imagine what the show will be like", "feature": "new_show", "count": 35.0}, {"value": 0.8227225691347011, "attribute": " Feel like I would be missing out if I didn't watch this show", "feature": "new_show", "count": 39.0}, {"value": 0.6493729977116705, "attribute": " To be able to watch this show with others (friends, family, significant others)", "feature": "new_show", "count": 24.0}, {"value": 0.7497780596068485, "attribute": " To see that it has a great rating/review score", "feature": "new_show", "count": 20.0},
		{"value": 1.0321584769745304, "attribute": " Recommendation/comment from friend/family/significant other", "feature": "favorite_show", "count": 84.0}, {"value": 1.9918451852790804, "attribute": " Print or digital magazine ad", "feature": "favorite_show", "count": 47.0}, {"value": 1.5911645290527279, "attribute": " Online review/recommendation from someone within your social circle", "feature": "favorite_show", "count": 59.0}, {"value": 1.3295334040296927, "attribute": " Online review/recommendation from someone you do not know", "feature": "favorite_show", "count": 35.0}, {"value": 1.9553429750192683, "attribute": " Social Media post/comment by someone you do not already follow (not an ad)", "feature": "favorite_show", "count": 43.0}, {"value": 1.5574534161490683, "attribute": " Social Media ad", "feature": "favorite_show", "count": 46.0}, {"value": 0.4065521393402559, "attribute": " Advertisement for the show on tv", "feature": "favorite_show", "count": 34.0}, {"value": 2.1136867790594502, "attribute": " Advertisement on the radio", "feature": "favorite_show", "count": 19.0}, {"value": 1.9526281635301752, "attribute": " In-theater advertising (pre-movie)", "feature": "favorite_show", "count": 21.0}, {"value": 0.5333744575852974, "attribute": " Short form trailer (30 or so seconds) related to the show", "feature": "favorite_show", "count": 25.0}, {"value": 0.43051557844771, "attribute": " Long form trailer (1 or 2 minutes) related to the show", "feature": "favorite_show", "count": 17.0}, {"value": 4.360869565217391, "attribute": " Attending a live event related to the show", "feature": "favorite_show", "count": 14.0}, {"value": 0.5358979496426902, "attribute": " Recommendation within a streaming service like Netflix or Hulu", "feature": "favorite_show", "count": 16.0}, {"value": 0.4927536231884058, "attribute": " Browsing the guide or on-demand section on my TV", "feature": "favorite_show", "count": 14.0}, {"value": 0.757680040288736, "attribute": " Ads on billboards, posters, taxis or public transportation (subways, buses, trains, etc.)", "feature": "favorite_show", "count": 9.0}]





var dataNewShow = [];
var dataFavShow = [];

for(var i = 0; i < bothData.length; i++){
    if(bothData[i]["feature"] === "new_show"){
        dataNewShow.push(bothData[i]);
    }else if(bothData[i]["feature"] === "favorite_show"){
        dataFavShow.push(bothData[i]);
    }
}

function change(value){
    if(value === 'new_show'){
        update(dataNewShow);
    }else if(value === 'favorite_show'){
        update(dataFavShow);
    }
}

function update(data){
    
    console.log(data);
    data = data.sort(function(a, b) {
	return d3.ascending(a.value, b.value);
    });
    console.log(data);

    
    xChart.domain(data.map(function(d) {
		      return d.attribute;
		  }));
    
    yChart.domain( [0, d3.max(data, function(d){ return + d.value; })] );
    var barWidth = width / data.length;

    var max_count = d3.max(data, function(d){ return + d.count; });
    
    var bars = chart.selectAll(".bar")
        .data(data, function(d){ return d.attribute; })
    bars.exit()
        .remove()
    bars.enter()
        .append("rect")
        .attr("class", "bar")
    	.attr("x", function(d) { return xChart(d.attribute) +0.01*xChart(d.attribute);})
        .attr("width", xChart.rangeBand())
        .attr('fill', function(d, i){
            if(d.value > 1.0){
		console.log('hi');
                return'#000000';
            }else{
                return'#000000';
            }
        })
        .style("opacity", function(d) { return d.count / max_count;})
	.attr("height", function(d, i) {
	    return 0;
	})
    	.transition()
    	.duration(400)
    	.delay(function (d, i) {
    	    return i * 20;
    	})
    	.attr("y", function (d, i) {
    	    return yChart(d.value) ;
    	})
    	.attr("height", function (d, i) {
    	    return height - yChart(d.value) ;
    	});



//    
//    d3.select("#sortAscending")
//	.on("click", function() {
//	    
//	    bars.data(data.sort(function(a, b) {
//		return d3.ascending(a.count, b.count);
//	    }))
//	    
//		.transition()
//		.delay(function(d, i) {
//		    return i * 25;  // gives it a smoother effect
//		})
//		.duration(500)
//	        .attr("x", function(d) { return xChart(d.attribute) +0.01*xChart(d.attribute);});
//	//	.attr("transform", function(d, i) {
//	//	    return "translate(" + xChart(d.attribute) + ",0)";
//	//	});
//	      
//	});
//
//    //This is EXACTLY the same as above, except for:
//    d3.select("#sortDescending")  //DEscending
//	.on("click", function() {
//
//	    bars.data(data.sort(function(a, b) {
//		return d3.descending(a.value, b.value);
//	    }))
//		.transition()
//		.delay(function(d, i) {
//		    return i * 25;
//		})
//		.duration(500)
//	    	.attr("x", function(d) { return xChart(d.attribute) +0.01*xChart(d.attribute);})
//		//.attr("transform", function(d, i) {
//		//    console.log(d.value);
//		//    return "translate(" + xChart(d.attribute) + ",0)";
//		//});
//
//	});

    chart.select('.y').call(yAxis);


    
    
    chart.select('.xAxis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".0em")
        .attr("transform", function(d){
            return "rotate(-90)";
        });
    
}

var margin = {top: 20, right: 50, bottom: 600, left: 50};
var width = 400;
var height = 200;

var chart = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var xChart = d3.scaleBand()
//       .range([0, width])
//	.paddingOuter(0.25);
var xChart = d3.scale.ordinal()
    .rangeBands([0, width], 0.1);


var yChart = d3.scale.linear()
    .range([height, 0]);

//    var xAxis = d3.axisBottom(xChart);
//    var yAxis = d3.axisLeft(yChart);


var xAxis = d3.svg.axis()
    .scale(xChart)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yChart)
    .orient("left");



chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)

chart.append("g")
    .attr("class", "xAxis")
//    .attr("transform", "translate(0," + height + ")")
//    .call(xAxis)
//    .selectAll("text")
//    .style("text-anchor", "end")
//    .attr("dx", "-.8em")
//    .attr("dy", ".0em")
//    .attr("transform", function(d){
//        return "rotate(-90)";
//    });
;
chart.append("text")
    .attr("transform", "translate(-35," +  (height+margin.bottom)/2 + ") rotate(-90)")
    .text("Ratio");

chart.append("text")
    .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 5) + ")")
    .text("Shows");

update(dataNewShow);

