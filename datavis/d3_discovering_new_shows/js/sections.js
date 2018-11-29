
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
    // constants to define the size
    // and margins of the vis area.
    var width = 400;
    var height = 300;
    var margin = { top: 0, left: 100, bottom: 500, right: 0 };



    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;
    
    // Sizing for the grid visualization
    var squareSize = 6;
    var squarePad = 2;
    var numPerRow = width / (squareSize + squarePad);
    
    // main svg used for visualization
    var svg = null;
    
    // d3 selection that will be used
    // for displaying visualizations
    var g = null;
    
    // We will set the domain when the
    // data is processed.
    // @v4 using new scale names

    var xChart_fav_show = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.5);     
    var xChart_fav_show_l2 = d3.scaleBand();
    var yChart_fav_show = d3.scaleLinear()
	.range([height, 0]);
    
    var xAxis_fav_show = d3.axisBottom();
    var yAxis_fav_show = d3.axisLeft()
        .scale(yChart_fav_show);


    

    var xChart_new_show = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.5);      
    var xChart_new_show_l2 = d3.scaleBand();
    var yChart_new_show = d3.scaleLinear()
	.range([height, 0]);

    var xAxis_new_show = d3.axisBottom()
        .scale(xChart_new_show);
    var yAxis_new_show = d3.axisLeft()
        .scale(yChart_new_show);



    var xChart_discover_new_show = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.5);      
    var xChart_discover_new_show_l2 = d3.scaleBand();
    var yChart_discover_new_show = d3.scaleLinear()
	.range([height, 0]);

    var xAxis_discover_new_show = d3.axisBottom()
        .scale(xChart_discover_new_show);
    var yAxis_discover_new_show = d3.axisLeft()
        .scale(yChart_discover_new_show);

    

    var bar_new_width=20;
    var bar_fav_width = 12;
    var bar_discover_new_width=10;
    
    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];
    
    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */
    var chart = function (selection) {
	selection.each(function (rawData) {
	    // create svg and give it a width and height
	    svg = d3.select(this).selectAll('svg').data([wordData]);
	    var svgE = svg.enter().append('svg');
	    // @v4 use merge to combine enter and existing selection
	    svg = svg.merge(svgE);
	    
	    svg.attr('width', width + margin.left + margin.right);
	    svg.attr('height', height + margin.top + margin.bottom);
	    
	    svg.append('g');
	    
	    
	    // this group element will be used to contain all
	    // other elements.
	    g = svg.select('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	    
	    // perform some preprocessing on raw data
	    //var wordData = getWords(rawData);
	    // filter to just include filler words
	    //var fillerWords = getFillerWords(wordData);
	    
	    // get the counts of filler words for the
	    // bar chart display

	    var new_show_data = get_new_show(rawData);//groupByWord(fillerWords);
	    var countMax = d3.max(new_show_data, function (d) { return +d.value;});
	    new_show_data = new_show_data.sort(function(a, b) {
		return d3.descending(a.value, b.value);
	    });


	    var discover_new_show_data = get_discover_new_show(rawData);//groupByWord(fillerWords);
	    var countMax_discover_new_sho = d3.max(discover_new_show_data, function (d) { return +d.value;});
	    discover_new_show_data = discover_new_show_data.sort(function(a, b) {
		return d3.descending(a.value, b.value);
	    });

	    // set the bar scale's domain
	    	    //xBarScale.domain([0, countMax]);

	    var fav_show_data = get_fav_show(rawData);
	    var countMax_fav = d3.max(fav_show_data, function (d) { return d.value;});
	    fav_show_data = fav_show_data.sort(function(a, b) {
		return d3.descending(a.value, b.value);
	    });
	    
	    

	    xChart_new_show.domain(new_show_data.map(function(entry){
		return entry.attribute;
	    }));

	    xChart_discover_new_show.domain(discover_new_show_data.map(function(entry){
		return entry.attribute;
	    }));

	    
	    valueNames = ['all', 'bet_fan', 'non_bet_fan']

	    var xChart_new_show_l2 = d3.scaleBand();
	    var xChart_discover_new_show_l2 = d3.scaleBand();
	    var xChart_fav_show_l2 = d3.scaleBand();
	    
	    //xChart_new_show_l2.domain(d3.range(valueNames))
	    //    .range([0, xChart_new_show.bandwidth() - 10]);//domain(valueNames).bandwidth([xChart_new_show.bandwidth()*5 - xChart_new_show.bandwidth()*5*0.5, xChart_new_show.bandwidth()*5 + xChart_new_show.bandwidth()*5*0.25]);    
    
	    xChart_fav_show.domain(fav_show_data.map(function(entry){
		return entry.attribute;
	    }));
		    

	    var wordData = 0;
	    var histData = 0;
	    var fillerCounts = 0;
	    setupVis(new_show_data, fav_show_data, discover_new_show_data);
	    
	    setupSections();
	});
    };
    
    
    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.
     *
     * @param wordData - data object for each word.
     * @param fillerCounts - nested data that includes
     *  element for each filler word type.
     * @param histData - binned histogram data
     */
    var setupVis = function (new_show_data, fav_show_data, discover_new_show_data) {
	// axis
	
	var categories  = ['all', 'bet_fan', 'non_bet_fan'];
	xChart_new_show_l2.domain(categories).bandwidth(2);
	xChart_discover_new_show_l2.domain(categories).bandwidth(2);
	xChart_fav_show_l2.domain(categories).bandwidth(2);
	
	xAxis_new_show.scale(xChart_new_show);
	xAxis_discover_new_show.scale(xChart_discover_new_show);
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_new_show)
	    .selectAll('text')
	    .style('text-anchor','end')
	    .attr("dx", "-1em")
	    .attr("dy", "-0.5em")
	    //.call(wrap, 0.5)
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    ;
			
	    //.call(xAxis_new_show);
	g.select('.x.axis').style('opacity', 1.0);


	g.append("g")
	    .attr("class", "y axis")
	    .call(yAxis_new_show);
	g.select('.y.axis').style('opacity', 1.0);
	

	yChart_new_show.domain( [0, d3.max(new_show_data, function(d){ return + d.value; })+0.01] );
	
	var maxCountNewShow = d3.max(new_show_data, function(d){ return + d.count; });
	var maxCountFavShow = d3.max(fav_show_data, function(d){ return + d.count; });
	    

	
	var bars_new_show = g.selectAll(".bar_new_show")
	    .data(new_show_data);//, function(d){ return d.attribute; })
	bars_new_show.exit()
	    .remove()
	bars_new_show.enter()
	    .append("rect")
	    .attr("class", "bar_new_show")
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('bet_fan')*xChart_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("width", bar_new_width/2)//xChart_new_show_l2.bandwidth()*10)
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#000000';
		}else{
		    return '#000000';
		}
	    })
	    .attr('stroke', 'black')
	    .attr("y", function (d, i) {
		if(d.who === 'all'){
		    return yChart_new_show(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, new_show_data);
		    all_row = new_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    return yChart_new_show(all_row[0].value);//all_row['value']);//new_show_data[i][index]['value']);
		}
		//else{
		//    return yChart_new_show(0);
		//}
	    })
	    .attr("height", function (d, i) {
		if(d.who === 'all'){
		    return height - yChart_new_show(+d.value);
		}
		else{// if (d.who === 'bet_fan'){
		    all_row = new_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		    return height - yChart_new_show(all_row[0].value);//all_row['value']);//new_show_data[i][index]['value']);
		}
		//else{
		//    return height - yChart_new_show(0);
		//}
	    })
	    .attr('opacity', function(d, i){
		if (d.who === 'all'){
		    return 0;
		}else{
		    return 0;
		}
	    });


	//DISCOVERING A PARTICULAR NEW SHOW
	
	yChart_discover_new_show.domain( [0, d3.max(discover_new_show_data, function(d){ return + d.value; })+0.01] );
	
	var maxCountNewShow = d3.max(discover_new_show_data, function(d){ return + d.count; });
	var maxCountFavShow = d3.max(fav_show_data, function(d){ return + d.count; });
	    

	
	var bars_discover_new_show = g.selectAll(".bar_discover_new_show")
	    .data(discover_new_show_data);//, function(d){ return d.attribute; })
	bars_discover_new_show.exit()
	    .remove()
	bars_discover_new_show.enter()
	    .append("rect")
	    .attr("class", "bar_discover_new_show")
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('bet_fan')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("width", bar_discover_new_width/2)//xChart_discover_new_show_l2.bandwidth()*10)
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#000000';
		}else{
		    return '#000000';
		}
	    })
	    .attr('stroke', 'black')
	    .attr("y", function (d, i) {
		if(d.who === 'all'){
		    return yChart_discover_new_show(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, discover_new_show_data);
		    all_row = discover_new_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    return yChart_discover_new_show(all_row[0].value);//all_row['value']);//discover_new_show_data[i][index]['value']);
		}
		//else{
		//    return yChart_discover_new_show(0);
		//}
	    })
	    .attr("height", function (d, i) {
		if(d.who === 'all'){
		    return height - yChart_discover_new_show(+d.value);
		}
		else{// if (d.who === 'bet_fan'){
		    all_row = discover_new_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		    return height - yChart_discover_new_show(all_row[0].value);//all_row['value']);//discover_new_show_data[i][index]['value']);
		}
		//else{
		//    return height - yChart_discover_new_show(0);
		//}
	    })
	    .attr('opacity', function(d, i){
		if (d.who === 'all'){
		    return 0;
		}else{
		    return 0;
		}
	    });

	//FAVORITE SHOWS
	
	xChart_fav_show.domain(fav_show_data.map(function(entry){
	    return entry.attribute;
	}));

	
	
	//console.log(xAxis_fav_show);
	xAxis_fav_show.scale(xChart_fav_show);
	//console.log(xAxis_fav_show);
	
	yChart_fav_show.domain( [0, d3.max(fav_show_data, function(d){ return + d.value; })] );

	//var bar_fav_width = 11;

	var bars_fav_show = g.selectAll(".bar_fav_show")
	    .data(fav_show_data);//, function(d){ return d.attribute; })
	bars_fav_show.exit()
	    .remove()
	bars_fav_show.enter()
	    .append("rect")
	    .attr("class", "bar_fav_show")
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('bet_fan')*xChart_fav_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
	    })
	    .attr("width", bar_fav_width/2)
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#000000';
		}else{
		    return '#000000';
		}
	    })
	    .attr('stroke', 'black')
	    .attr("y", function (d, i) {
		if(d.who === 'all'){
		    return yChart_fav_show(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, fav_show_data);
		    all_row = fav_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    return yChart_fav_show(all_row[0].value);//all_row['value']);//fav_show_data[i][index]['value']);
		}
		//else{
		//    return yChart_fav_show(0);
		//}
	    })
	    .attr("height", function (d, i) {
		if(d.who === 'all'){
		    return height - yChart_fav_show(+d.value);
		}
		else{// if (d.who === 'bet_fan'){
		    all_row = fav_show_data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		    return height - yChart_fav_show(all_row[0].value);//all_row['value']);//fav_show_data[i][index]['value']);
		}
		//else{
		//    return height - yChart_fav_show(0);
		//}
	    })
	    .attr('opacity', function(d, i){
		if (d.who === 'all'){
		    return 0;
		}else{
		    return 1;
		}
	    });

	var colorScale = ['#000000', '#ffaa00', '#aaaaaa']

	var color = d3.scaleOrdinal(colorScale);//categorical[0].name])
	

	var legend = svg.selectAll(".legend")
	    .data(['all', 'bet_fan', 'non_bet_fan'])
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
	

    }
    //	    .data(fav_show_data, function(d){ return d.attribute; })
    //	bars_fav_show.exit()
    //	    .remove()
    //	bars_fav_show.enter()
    //	    .append("rect")
    //	    .attr("class", "bar_fav_show")
    //	    .attr("x", function(d) { return xChart_fav_show(d.attribute) +0.01*xChart_fav_show(d.attribute);})
    //	    .attr("width", 10)
    //	    .attr('fill', function(d, i){
    //		if(d.value > 1.0){
    //		    console.log('hi');
    //		    return'#000000';
    //		}else{
    //		    return'#000000';
    //		}
    //	    })
    //	    //.style("fill-opacity", function(d) { return d.count/maxCountFavShow;})
    //	    //.attr("height", function(d, i) {
    //	    //	return 0;
    //	    //})
    //	    //.transition()
    //	    //.duration(400)
    //	    //.delay(function (d, i) {
    //	    //	return i * 20;
    //	    //})
    //	    .attr("y", function (d, i) {
    //		return yChart_fav_show(d.value) ;
    //	    })
    //	    .attr("height", function (d, i) {
    //		return height - yChart_fav_show(d.value) ;
    //	    })
    //	    .attr('opacity',0);
    //
    //		
    //    };
    
    /**
     * setupSections - each section is activated
     * by a separate function. Here we associate
     * these functions to the sections based on
     * the section's index.
     *
     */
    var setupSections = function () {
	// activateFunctions are called each
	// time the active section changes
	activateFunctions[0] = showFavShow_all;
	activateFunctions[1] = showFavShow_bet;
	activateFunctions[2] = showDiscoverNewShow_all;
	activateFunctions[3] = showDiscoverNewShow_bet;
	activateFunctions[4] = showNewShow_all;
	activateFunctions[5] = showNewShow_bet;

	//      activateFunctions[2] = showGrid;
	//      activateFunctions[3] = highlightGrid;
	//      activateFunctions[4] = showBar;
	//      activateFunctions[5] = showHistPart;
	//      activateFunctions[6] = showHistAll;
	//      activateFunctions[7] = showCough;
	//      activateFunctions[8] = showHistAll;
	
	// updateFunctions are called while
	// in a particular section to update
	// the scroll progress in that section.
	// Most sections do not need to be updated
	// for all scrolling and so are set to
	// no-op functions.
	for (var i = 0; i < 6; i++) {
	    updateFunctions[i] = function () {};
	}
	///updateFunctions[7] = updateCough;
    };
    
    /**
     * ACTIVATE FUNCTIONS
     *
     * These will be called their
     * section is scrolled to.
     *
     * General pattern is to ensure
     * all content for the current section
     * is transitioned in, while hiding
     * the content for the previous section
     * as well as the next section (as the
     * user may be scrolling up or down).
     *
     */
    
    /**
     * showTitle - initial title
     *
     * hides: count title
     * (no previous step to hide)
     * shows: intro title
     *
     */
    
    
    
    function showFavShow_all() {
	// ensure bar axis is set
	
	showAxis(xAxis_fav_show, yAxis_fav_show);
	
	g.selectAll('.bar_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);

	g.selectAll('.bar_discover_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);
	
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_fav_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('bet_fan')*xChart_fav_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i, nodes) {
	    	for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return yChart_fav_show(nodes[i].__data__["value"]);
		    }
		}
		//if(d.who != 'all'){
	    	//    return yChart_fav_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i, nodes) {
		for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return height - yChart_fav_show(nodes[i].__data__["value"]);
		    }
		}
	    	//if(d.who != 'all'){
	    	//return height - yChart_fav_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		return '#000000';
	    })
	    .attr("data-legend",function(d) { return d.who});
	
	//.transition()
	//.delay(function (d, i) { return 30 * (i + 1);})
	//.duration(0)
	//.attr('opacity', 1.0);
	//.attr('width', function (d) { return xBarScale(d.attribute); });
	
	
    }
    
    
    function showFavShow_bet() {
	
	
	showAxis(xAxis_fav_show, yAxis_fav_show);//fav_show);


	g.selectAll('.bar_discover_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);

	
	//var bar_fav_width = 11;
	g.selectAll('.bar_fav_show')	
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_fav_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })

	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('bet_fan')*xChart_fav_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_fav_show(d.attribute) + xChart_fav_show_l2('all')*xChart_fav_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return yChart_fav_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return height - yChart_fav_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#ffaa00';
		}else{
		    return '#aaa';
		}
	    })
	;
//	    .transition()
//	    .duration(300)
//	    .attr('opacity', 0);
	
	g.selectAll('.bar_new_show')
	    .transition()
	    .delay(function (d, i) { return 30 * (i + 1);})
	    .duration(600)
	    .attr('opacity', 0.0);


	
    }


    
    
    function showNewShow_all() {
	// ensure bar axis is set
	
	showAxis(xAxis_new_show, yAxis_new_show);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);

	
	g.selectAll('.bar_discover_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);



	
	g.selectAll('.bar_new_show')
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_new_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('bet_fan')*xChart_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i, nodes) {
	    	for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return yChart_new_show(nodes[i].__data__["value"]);
		    }
		}
		//if(d.who != 'all'){
	    	//    return yChart_new_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i, nodes) {
		for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return height - yChart_new_show(nodes[i].__data__["value"]);
		    }
		}
	    	//if(d.who != 'all'){
	    	    //return height - yChart_new_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		return '#000000';
	    });
	   
	    //.transition()
	    //.delay(function (d, i) { return 30 * (i + 1);})
	    //.duration(0)
	    //.attr('opacity', 1.0);
	    //.attr('width', function (d) { return xBarScale(d.attribute); });


    }
    
    /**
     * showFillerTitle - filler counts
     *
     * hides: intro title
     * hides: square grid
     * shows: filler count title
     *
     */
    function showNewShow_bet() {


	showAxis(xAxis_new_show, yAxis_new_show);//fav_show);
	

	g.selectAll('.bar_discover_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);



	g.selectAll('.bar_new_show')	
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_new_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })

	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('bet_fan')*xChart_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_new_show(d.attribute) + xChart_new_show_l2('all')*xChart_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return yChart_new_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return height - yChart_new_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#ffaa00';
		}else{
		    return '#aaa';
		}
	    })
	;
//	    .transition()
//	    .duration(300)
//	    .attr('opacity', 0);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .delay(function (d, i) { return 30 * (i + 1);})
	    .duration(600)
	    .attr('opacity', 0.0);


	
    }



    
    function showDiscoverNewShow_all() {
	// ensure bar axis is set
	
	showAxis(xAxis_discover_new_show, yAxis_discover_new_show);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);

	
	g.selectAll('.bar_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);


	
	g.selectAll('.bar_discover_new_show')
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_discover_new_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })
	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('bet_fan')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i, nodes) {
	    	for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return yChart_discover_new_show(nodes[i].__data__["value"]);
		    }
		}
		//if(d.who != 'all'){
	    	//    return yChart_discover_new_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i, nodes) {
		for (i=0;i<nodes.length;i++){
		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
			return height - yChart_discover_new_show(nodes[i].__data__["value"]);
		    }
		}
	    	//if(d.who != 'all'){
	    	    //return height - yChart_discover_new_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		return '#000000';
	    });
	   
	    //.transition()
	    //.delay(function (d, i) { return 30 * (i + 1);})
	    //.duration(0)
	    //.attr('opacity', 1.0);
	    //.attr('width', function (d) { return xBarScale(d.attribute); });


    }
    
    /**
     * showFillerTitle - filler counts
     *
     * hides: intro title
     * hides: square grid
     * shows: filler count title
     *
     */
    function showDiscoverNewShow_bet() {


	showAxis(xAxis_discover_new_show, yAxis_discover_new_show);//fav_show);
	

	g.selectAll('.bar_new_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);


	g.selectAll('.bar_discover_new_show')	
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('width', bar_discover_new_width/2)
	    .attr('opacity', function(d, i){
	    	if (d.who === 'all'){
	    	    return 0;
	    	}else{
	    	    return 1;
	    	}
	    })

	    .attr("x", function(d) {
		if(d.who === 'all'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else if(d.who === 'bet_fan'){
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('bet_fan')*xChart_discover_new_show.bandwidth()*1.5;
		}
		else{
		    return  xChart_discover_new_show(d.attribute) + xChart_discover_new_show_l2('all')*xChart_discover_new_show.bandwidth()*1.5;
		}
	    })
	    .attr("y", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return yChart_discover_new_show(+d.value);
	    	//}
	    })
	    .attr("height", function (d, i) {
	    	//if(d.who != 'all'){
	    	    return height - yChart_discover_new_show(+d.value);
	    	//}
	    })
	    .attr('fill', function(d, i){
		if(d.who ==='all'){
		    return'#000000';
		}else if(d.who === 'bet_fan'){
		    return'#ffaa00';
		}else{
		    return '#aaa';
		}
	    })
	;
//	    .transition()
//	    .duration(300)
//	    .attr('opacity', 0);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .delay(function (d, i) { return 30 * (i + 1);})
	    .duration(600)
	    .attr('opacity', 0.0);


	
    }


    
    /**
     * showGrid - square grid
     *
     * hides: filler count title
     * hides: filler highlight in grid
     * shows: square grid
     *
     */
    function showGrid() {
	g.selectAll('.count-title')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	
	g.selectAll('.square')
	    .transition()
	    .duration(600)
	    .delay(function (d) {
		return 5 * d.row;
	    })
	    .attr('opacity', 1.0)
	    .attr('fill', '#ddd');
    }
    
    /**
     * highlightGrid - show fillers in grid
     *
     * hides: barchart, text and axis
     * shows: square grid and highlighted
     *  filler words. also ensures squares
     *  are moved back to their place in the grid
     */
    function highlightGrid() {
	hideAxis();
	g.selectAll('.bar')
	    .transition()
	    .duration(600)
	    .attr('width', 0);
	
	g.selectAll('.bar-text')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	
	
	g.selectAll('.square')
	    .transition()
	    .duration(0)
	    .attr('opacity', 1.0)
	    .attr('fill', '#ddd');
	
	// use named transition to ensure
	// move happens even if other
	// transitions are interrupted.
	g.selectAll('.fill-square')
	    .transition('move-fills')
	    .duration(800)
	    .attr('x', function (d) {
		return d.x;
	    })
	    .attr('y', function (d) {
		return d.y;
	    });
	
	g.selectAll('.fill-square')
	    .transition()
	    .duration(800)
	    .attr('opacity', 1.0)
	    .attr('fill', function (d) { return d.filler ? '#008080' : '#ddd'; });
    }
    
    /**
     * showBar - barchart
     *
     * hides: square grid
     * hides: histogram
     * shows: barchart
     *
     */
//    function showBar() {
//	// ensure bar axis is set
//	showAxis(xAxisBar);
//	
//	g.selectAll('.square')
//	    .transition()
//	    .duration(800)
//	    .attr('opacity', 0);
//	
//	g.selectAll('.fill-square')
//	    .transition()
//	    .duration(800)
//	    .attr('x', 0)
//	    .attr('y', function (d, i) {
//		return yBarScale(i % 3) + yBarScale.bandwidth() / 2;
//	    })
//	    .transition()
//	    .duration(0)
//	    .attr('opacity', 0);
//	
//	g.selectAll('.hist')
//	    .transition()
//	    .duration(600)
//	    .attr('height', function () { return 0; })
//	    .attr('y', function () { return height; })
//	    .style('opacity', 0);
//	
//	g.selectAll('.bar_discover_new_show')
//	    .transition()
//	    .delay(function (d, i) { return 300 * (i + 1);})
//	    .duration(600)
//	    .attr('width', function (d) { return xBarScale(d.value); });
//	
//	g.selectAll('.bar-text')
//	    .transition()
//	    .duration(600)
//	    .delay(1200)
//	    .attr('opacity', 1);
//    }
    
    /**
     * showHistPart - shows the first part
     *  of the histogram of filler words
     *
     * hides: barchart
     * hides: last half of histogram
     * shows: first half of histogram
     *
     */
  function showHistPart() {
    // switch the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.bar')
      .transition()
      .duration(600)
      .attr('width', 0);

    // here we only show a bar if
    // it is before the 15 minute mark
    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return (d.x0 < 15) ? yHistScale(d.length) : height; })
      .attr('height', function (d) { return (d.x0 < 15) ? height - yHistScale(d.length) : 0; })
      .style('opacity', function (d) { return (d.x0 < 15) ? 1.0 : 1e-6; });
  }

  /**
   * showHistAll - show all histogram
   *
   * hides: cough title and color
   * (previous step is also part of the
   *  histogram, so we don't have to hide
   *  that)
   * shows: all histogram bars
   *
   */
  function showHistAll() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    // named transition to ensure
    // color change is not clobbered
    g.selectAll('.hist')
      .transition('color')
      .duration(500)
      .style('fill', '#008080');

    g.selectAll('.hist')
      .transition()
      .duration(1200)
      .attr('y', function (d) { return yHistScale(d.length); })
      .attr('height', function (d) { return height - yHistScale(d.length); })
      .style('opacity', 1.0);
  }

  /**
   * showCough
   *
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   *
   */
  function showCough() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return yHistScale(d.length); })
      .attr('height', function (d) { return height - yHistScale(d.length); })
      .style('opacity', 1.0);
  }

  /**
   * showAxis - helper function to
   * displayparticular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
    function showAxis(xaxis, yaxis) {

	
	g.select('.x.axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .transition().duration(400)
	    .call(xaxis)
	    .selectAll('text')
	    .style('text-anchor','end')
	    .attr("dx", "-1em")
	    .attr("dy", "-0.5em")
	    .attr('transform', function(d){
	    	return "rotate(-90)";
	    })
	    .style('opacity', 1.0)
	    .selectAll(".tick text")
	    .call(wrap, 10)
	;
	

	g.select('.y.axis')
	    .call(yaxis);
//	    .transition().duration(400)
//	    .style('opacity', 1.0);

	
//	g.select('.x.axis')
//	    .call(axis)
//	    .transition().duration(500)
//	    .style('opacity', 1);
    }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hideAxis() {
    g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * updateCough - increase/decrease
   * cough text and color
   *
   * @param progress - 0.0 - 1.0 -
   *  how far user has scrolled in section
   */
  function updateCough(progress) {
    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', progress);

    g.selectAll('.hist')
      .transition('cough')
      .duration(0)
      .style('fill', function (d) {
        return (d.x0 >= 14) ? coughColorScale(progress) : '#008080';
      });
  }

  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   *
   */

  /**
   * getWords - maps raw data to
   * array of data objects. There is
   * one data object for each word in the speach
   * data.
   *
   * This function converts some attributes into
   * numbers and adds attributes used in the visualization
   *
   * @param rawData - data read in from file
   */
    function getWords(rawData) {
//	console.loc(rawData);
    return rawData.map(function (d, i) {
      // is this word a filler word?
      d.filler = (d.filler === '1') ? true : false;
      // time in seconds word was spoken
      d.time = +d.time;
      // time in minutes word was spoken
      d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  }
    
    /**
     * getFillerWords - returns array of
     * only filler words
     *
     * @param data - word data from getWords
     */
    function getFillerWords(data) {
	return data.filter(function (d) {return d.filler; });
    }
    
    function get_new_show(data) {
	var show_data = [];
	for(var i = 0; i < data.length; i++){
	    if(data[i]["feature"] === "new_show"){
//		if(data[i]["who"] === "all"){
		show_data.push(data[i]);
		//}
	    }
	}
	return show_data;
    }
    
    function get_discover_new_show(data) {
	var show_data = [];
	for(var i = 0; i < data.length; i++){
	    if(data[i]["feature"] === "discover_new_shows"){
		//		if(data[i]["who"] === "all"){
		show_data.push(data[i]);
		//}
	    }
	}
	console.log(show_data);
	return show_data;
    }
    function get_fav_show(data) {
	var show_data = [];
	for(var i = 0; i < data.length; i++){
	    if(data[i]["feature"] === "favorite_show"){
		show_data.push(data[i]);
	    }
	}
	return show_data;
    }
	
  /**
   * getHistogram - use d3's histogram layout
   * to generate histogram bins for our word data
   *
   * @param data - word data. we use filler words
   *  from getFillerWords
   */
  function getHistogram(data) {
    // only get words from the first 30 minutes
    var thirtyMins = data.filter(function (d) { return d.min < 30; });
    // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3.histogram()
      .thresholds(xHistScale.ticks(10))
      .value(function (d) { return d.min; })(thirtyMins);
  }

  /**
   * groupByWord - group words together
   * using nest. Used to get counts for
   * barcharts.
   *
   * @param words
   */
  function groupByWord(words) {
    return d3.nest()
      .key(function (d) { return d.word; })
      .rollup(function (v) { return v.length; })
      .entries(words)
      .sort(function (a, b) {return b.value - a.value;});
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
	activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };



    
    function wrap2(text, width) {
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
		    line = [word];
		    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		    console.log(tspan);
		}
	    }
	});
    };
    
    function wrap(text, width) {
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
	    console.log(text);
	    while (word = words.pop()) {
		line.push(word);
		tspan.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width) {
		    line.pop();
		    tspan.text(line.join(" "));
		    line = [word];
		    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		    console.log('long line');
		    console.log(tspan);
		}
	    }
	});
    };
    





    
  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#vis')
	.datum(data)
	.call(plot);
    
    // setup scroll functionality
    var scroll = scroller()
	.container(d3.select('#graphic'));
    
    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));
    
    // setup event handling
    scroll.on('active', function (index) {
	// highlight current step text
	d3.selectAll('.step')
	    .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });
	
	// activate current section
	plot.activate(index);
    });
    
    scroll.on('progress', function (index, progress) {
	plot.update(index, progress);
    });
}


//display(bothData);

// load data and display
d3.json('./data/new_fans.json', function(rawData) {display(rawData);} );






