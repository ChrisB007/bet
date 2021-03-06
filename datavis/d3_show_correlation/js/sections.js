
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
    // constants to define the size
    // and margins of the vis area.
    var width = 500;
    var height = 300;
    var margin = { top: 0, left: 100, bottom: 50, right: 0 };
    
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
    var xBarScale = d3.scaleLinear()
	.range([0, width]);
    
    
    

    var yChart_logreg = d3.scaleBand()
	//.domain(logreg_data.map(function(entry){
	//    return entry.attribute;
	//}))
	.rangeRound([0, height])
	.padding(0.1);          
    var xChart_logreg = d3.scaleLinear()
	.range([width, 0]);
    
    
    var xAxis_logreg = d3.axisBottom();
    var yAxis_logreg = d3.axisLeft()
        .scale(yChart_logreg);
    

    
    var yChart_pca = d3.scaleLinear()
	.range([height, 0]);
    
    
    var xAxis_pca = d3.axisBottom()
        .scale(xChart_pca);
    
    var yAxis_pca = d3.axisLeft()
        .scale(yChart_pca);




    var xChart_pca = d3.scaleLinear()
	.range([0, width]);
    
    
    
    
    // The histogram display shows the
    // first 30 minutes of data
    // so the range goes from 0 to 30
    // @v4 using new scale name
    var xHistScale = d3.scaleLinear()
	.domain([0, 30])
	.range([0, width - 20]);
    
    // @v4 using new scale name
    var yHistScale = d3.scaleLinear()
	.range([height, 0]);
    
    // The color translation uses this
    // scale to convert the progress
    // through the section into a
    // color value.
    // @v4 using new scale name
    var coughColorScale = d3.scaleLinear()
	.domain([0, 1.0])
	.range(['#008080', 'red']);
    
    // You could probably get fancy and
    // use just one axis, modifying the
    // scale, but I will use two separate
    // ones to keep things easy.
    // @v4 using new axis name
    var xAxisBar = d3.axisBottom()
	.scale(xBarScale);



    
    // @v4 using new axis name
    var xAxisHist = d3.axisBottom()
	.scale(xHistScale)
	.tickFormat(function (d) { return d + ' min'; });
    
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
	    var pca_data = get_pca(rawData);//groupByWord(fillerWords);
	    //var pca_data = rawData;
	    console.log(pca_data);
	    //var countMax = d3.max(pca_data, function (d) { return d.value;});
	    //pca_data = pca_data.sort(function(a, b) {
	    //	return d3.descending(a.value, b.value);
	    //});
	    
	    // set the bar scale's domain
	    	    //xBarScale.domain([0, countMax]);

	    //var logreg_data = get_logreg(rawData);
	    //var countMax_fav = d3.max(logreg_data, function (d) { return d.value;});
	    //logreg_data = logreg_data.sort(function(a, b) {
	    //	return d3.descending(a.value, b.value);
	    //});

	    var logreg_data = get_logreg(rawData);
	    console.log(logreg_data);

	    //xChart_pca.domain(fav_show_data.map(function(entry){
	//	return entry.attribute;
	  //  }));

    
    
	    yChart_logreg.domain(logreg_data.map(function(entry){
		console.log(entry.label);
		return entry.label;
	    }));
		    

	    // get aggregated histogram data
	    
	    //var histData = getHistogram(fillerWords);
	    // set histogram's domain
	    //var histMax = d3.max(histData, function (d) { return d.length; });
	    //yHistScale.domain([0, histMax]);
	    var wordData = 0;
	    var histData = 0;
	    var fillerCounts = 0;
	    setupVis(pca_data, logreg_data, histData);
	    
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
    var setupVis = function (pca_data, logreg_data, histData) {
	// axis

	var boundbox = 0.2;
	xChart_pca.domain( [d3.min(pca_data, function(d){return +d.x;})-boundbox , d3.max(pca_data, function(d){ return + d.x; })+boundbox] );
	yChart_pca.domain( [d3.min(pca_data, function(d){return +d.y;})-boundbox , d3.max(pca_data, function(d){ return + d.y; })+boundbox] );

	xAxis_pca.scale(xChart_pca);
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_pca)
	    .selectAll('text')
	    .style('text-anchor','end')
	    .attr("dx", "-1em")
	    .attr("dy", "-0.5em")
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    ;
			
	    //.call(xAxis_pca);
	g.select('.x.axis').style('opacity', 0.0);


	g.append("g")
	    .attr("class", "y axis")
	    .call(yAxis_pca)
	    ;
	g.select('.y.axis').style('opacity', 0.0);//.call(wrap, 10);
	
	
	var maxBetMean = d3.max(pca_data, function(d){ return + d.bet_mean; });
	var maxLogReg = d3.max(logreg_data, function(d){ return + d.value; });
	var minLogReg = d3.min(logreg_data, function(d){ return + d.value; });

	    
	console.log(xChart_pca);

//	var bars_pca = g.selectAll(".bar_pca")
//	    .data(pca_data, function(d){ return d.x; })
//	bars_pca.exit()
//	    .remove()
//	bars_pca.enter()
//	    .append("rect")
//	    .attr("class", "bar_pca")
//	    .attr("x", function(d) { return xChart_pca(d.x);})
//	    //.attr("width", 20)
//	    //.attr('fill', function(d, i){
//	    //	if(d.value > 1.0){
//	    //	    return'#000000';
//	    //	}else{
//	    //	    return'#000000';
//	    //	}
//	    //})
//	    .style("fill-opacity", function(d) { return 1;})//d.bet_mean/maxCountBetMean;})
//	    //.attr("height", function(d, i) {
//	    //	return 0;
//	    //})
//	    //.transition()
//	    //.duration(400)
//	    //.delay(function (d, i) {
//	    //	return i * 20;
//	    //})
//	    .attr("y", function (d, i) {
//		return yChart_pca(d.y) ;
//	    })
//	    //.attr("height", function (d, i) {
//		//return height - yChart_pca(d.value) ;
//	    //})
	//	    .attr('opacity', 0);

	var scales = {
	    'puOr11': ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
	    'spectral8': ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'],
	    'redBlackGreen': ['#ff0000', '#AA0000', '#550000', '#005500', '#00AA00', '#00ff00'],
	    'viridis': ["#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]
	};

	
	var scale = scales['viridis'].reverse();
	
	var colorScale = d3.scaleLinear()
	    .domain(linspace(0, 1, scale.length))
	    .range(scale);


	function linspace(start, end, n) {
	    var out = [];
	    var delta = (end - start) / (n - 1);

	    var i = 0;
	    while(i < (n - 1)) {
		out.push(start + (i * delta));
		i++;
	    }

	    out.push(end);
	    return out;
	}

	

	var bars_pca_init = g.selectAll(".bar_pca_init")
	    .data(pca_data)
	bars_pca_init.exit()
	    .remove()
	bars_pca_init.enter().append("circle")
	    .attr("class", "bar_pca_init")
	    .attr("r", 4)
	    .attr("cx", function(d) { return xChart_pca(d.x);})//xChart_pca(d.x); })
	    .attr("cy", function(d) { return 0;})//yChart_pca(d.y); })
	    .attr('opacity', 1)
	    .attr('fill', function(d) {
	    	return '#cccccc';//colorScale(d.bet_mean/maxBetMean);
	    })
	    .transition()
	    .delay(1000)
	    .duration(1000)
	    .delay(function (d, i) {
		return i * 0.6;
	    })
	    .attr("cx", function(d) { return xChart_pca(d.x); })
	    .attr("cy", function(d) { return yChart_pca(d.y); })
	    .attr('fill', function(d) {
	    	return '#cccccc';//colorScale(d.bet_mean/maxBetMean);
	    })
	;
	
	
	var bars_pca_no_color = g.selectAll(".bar_pca_no_color")
	    .data(pca_data)
	bars_pca_no_color.exit()
	    .remove()
	bars_pca_no_color.enter().append("circle")
	    .attr("class", "bar_pca_no_color")
	    .attr("r", 4)
	    .attr("cx", function(d) { return xChart_pca(d.x); })
	    .attr("cy", function(d) { return yChart_pca(d.y); })
	    .attr('fill', function(d) {
	    	return '#cccccc';//colorScale(d.bet_mean/maxBetMean);
	    })
	    .attr('opacity', 0);
	
	
	
	var bars_pca1 = g.selectAll(".bar_pca_step_1")
	    .data(pca_data)
	bars_pca1.exit()
	    .remove()
	bars_pca1.enter().append("circle")
	    .attr("class", "bar_pca_step_1")
	    .attr("r", 4)
	    .attr("cx", function(d) { return xChart_pca(d.x); })
	    .attr("cy", function(d) { return yChart_pca(d.y); })
	    .attr('fill', function(d) {
		if( d.bet_mean/maxBetMean > 0.7 ){
	    	    return colorScale(d.bet_mean/maxBetMean);
		}
		else{
		    return '#cccccc';
		}
	    })
	    .attr('opacity', 0);




	
	var bars_pca2 = g.selectAll(".bar_pca_step_2")
	    .data(pca_data)
	bars_pca2.exit()
	    .remove()
	bars_pca2.enter().append("circle")
	    .attr("class", "bar_pca_step_2")
	    .attr("r", 4)
	    .attr("cx", function(d) { return xChart_pca(d.x); })
	    .attr("cy", function(d) { return yChart_pca(d.y); })
	    .attr('fill', function(d) {
		if( d.bet_mean/maxBetMean > 0.4 ){
	    	    return colorScale(d.bet_mean/maxBetMean);
		}
		else{
		    return '#cccccc';
		}
	    })
	    .attr('opacity', 0);



	
	var bars_pca3 = g.selectAll(".bar_pca_step_3")
	    .data(pca_data)
	bars_pca3.exit()
	    .remove()
	bars_pca3.enter().append("circle")
	    .attr("class", "bar_pca_step_3")
	    .attr("r", 4)
	    .attr("cx", function(d) { return xChart_pca(d.x); })
	    .attr("cy", function(d) { return yChart_pca(d.y); })
	    .attr('fill', function(d) {
	    	return colorScale(d.bet_mean/maxBetMean);
	    })
	    .attr('opacity', 0);


	
	//g.select('.y').call(yAxis_pca);
	//
	//g.select('.x.axis')
	//    .attr("transform", "translate(0," + height/2 + ")")
	//    .call(xAxis_pca);
	    //.selectAll("text")
	    //.style("text-anchor", "end")
	    //.attr("dx", "-.8em")
	    //.attr("dy", ".0em")
	    //.attr("transform", function(d){
	    //	return "rotate(-90)";
	    //});
	


	yChart_logreg.domain(logreg_data.map(function(entry){
	    return entry.label;
	}));

	
	
	console.log(xAxis_logreg);
	xAxis_logreg.scale(xChart_logreg);
	console.log(xAxis_logreg);
	
	//xChart_logreg.domain( [d3.min(logreg_data, function(d){return + d.value; }) -0.05, d3.max(logreg_data, function(d){ return + d.value; })+0.05] );
	xChart_logreg.domain( [d3.min(logreg_data, function(d){return + d.value; }) -0.05, 0] );

	var pos_list = [];
	for (var i=0; i<logreg_data.length; i++){
	    pos_list.push(logreg_data[i]['label'].trim());
	}
	console.log(pos_list, pos_list.length);
	var i=0;
	var d = 0;

	var pos_counter = 0;
	var neg_counter = 0;
	
	var text = g.selectAll("text")
	    .data(logreg_data, function(d){return d.label;})
	text.exit()
	    .remove()
	text.enter()
	    .append("text")
	    .attr('class', 'text_logreg')
	    .attr("x", function(d, i) {
		if(d.value > 0){
		    return 10;
		}
		else{
		    return 250;
		}
	    })
	    .attr("y", function(d, i) {
		if (d.value > 0) {
		    pos_counter = pos_counter + 1;
		    return 20+pos_counter*10;
		}
		else{
		    neg_counter = neg_counter + 1;
		    return 20+neg_counter*10;
		}
	    })
	    .text( function (d) { return  d.label ; })
	    .attr("font-family", "sans-serif")
	    .attr("font-size", "10px")
	    .attr("fill", "black")
	    .attr('opacity', 0.0);
	
	
	var bars_logreg = g.selectAll(".bar_logreg")
	    .data(logreg_data, function(d){ return d.label; })
	bars_logreg.exit()
	    .remove()
	bars_logreg.enter()
	    .append("rect")
	    .attr("class", "bar_logreg")
	    .attr("y", function(d) { return yChart_logreg(d.label) +0.01*yChart_logreg(d.label);})
	    .attr("height", 10)
	    .attr('fill', function(d, i){
		if(d.value > 0.0){
		    return colorScale((d.value - minLogReg)/(maxLogReg- minLogReg));
		}else{
		    return colorScale((d.value - minLogReg)/(maxLogReg- minLogReg));
		}
		
	    })
	    //.style("fill-opacity", function(d) { return d.count/maxCountFavShow;})
	    //.attr("height", function(d, i) {
	    //	return 0;
	    //})
	    //.transition()
	    //.duration(400)
	    //.delay(function (d, i) {
	    //	return i * 20;
	    //})
	    .attr("x", function (d, i) {
		if (d.value > 0) {
		    return xChart_logreg(0);//xChart_logreg(d.value);
		}
		else{
		    return xChart_logreg(0);
		}
		//return ( xChart_logreg(d.value) > 0) ? xChart_logreg(d.value) : 0 ;
	    })
	    .attr("width", function (d) {
	    	return  Math.abs(xChart_logreg(d.value) - xChart_logreg(0) );
	    })
	    .attr('opacity',0);

		
    };
    
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
	activateFunctions[0] = showInit;
	activateFunctions[1] = showColorPca1;//NewShow;
	activateFunctions[2] = showColorPca2;//NewShow;
	activateFunctions[3] = showColorPca3;//NewShow;
	activateFunctions[4] = showFavShow;
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
	for (var i = 0; i < 5; i++) {
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
    function showInit() {
	// ensure bar axis is set

//	showAxis(xAxis_pca, yAxis_pca);
	hideAxis();

	g.selectAll('.text_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	
	g.selectAll('.bar_pca_init')
	    .attr('opacity', 1.0);
	
	g.selectAll('.bar_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
		
	g.selectAll('.bar_pca_step_1')
	    //.transition()
	    //.delay(function (d, i) { return 0.5 * (i + 1);})
	    //.duration(300)
	    .attr('opacity', 0.0);
	g.selectAll('.bar_pca_step_2')
	    //.transition()
	    //.delay(function (d, i) { return 0.5 * (i + 1);})
	    //.duration(300)
	    .attr('opacity', 0.0);
	g.selectAll('.bar_pca_step_3')
	//.transition()
	//.delay(function (d, i) { return 0.5 * (i + 1);})
	//.duration(300)
	    .attr('opacity', 0.0);
	//.attr('width', function (d) { return xBarScale(d.attribute); });


    }



    function showColorPca1() {
	hideAxis();

	g.selectAll('.text_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	
	g.selectAll('.bar_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);

	g.selectAll('.bar_pca_step_1')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

		
	g.selectAll('.bar_pca_step_2')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

			
	g.selectAll('.bar_pca_step_3')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

	g.selectAll('.bar_pca_init')
	    .transition()
	    .delay(0)
	    .attr('opacity', 0.0);

		
	g.selectAll('.bar_pca_step_1')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 1.0);

	
	    //.attr('width', function (d) { return xBarScale(d.attribute); });

    }




    function showColorPca2() {
	hideAxis();


	g.selectAll('.text_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);	
	g.selectAll('.bar_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);

	g.selectAll('.bar_pca_step_1')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

		
	g.selectAll('.bar_pca_step_2')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 1.0);

			
	g.selectAll('.bar_pca_step_3')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);
	
	g.selectAll('.bar_pca_init')
	    .transition()
	    .delay(0)
	    .attr('opacity', 0.0);

	    //.attr('width', function (d) { return xBarScale(d.attribute); });

    }



    
    function showColorPca3() {
	hideAxis();
	
	g.selectAll('.text_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	
	g.selectAll('.bar_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);

	g.selectAll('.bar_pca_step_1')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

		
	g.selectAll('.bar_pca_step_2')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 0.0);

			
	g.selectAll('.bar_pca_step_3')
	    .transition()
	    //.delay(function (d, i) { return 0.2 * (i + 1);})
	    .duration(0)
	    .attr('opacity', 1.0);
	
	g.selectAll('.bar_pca_init')
	    .transition()
	    .delay(0)
	    .attr('opacity', 0.0);

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
    function showFavShow() {

	//showAxis(xAxis_logreg, yAxis_logreg);

	g.selectAll('.bar_pca_init')
	    .attr('opacity', 0.0);	
	
	g.selectAll('.bar_pca_step_1')	
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);
	g.selectAll('.bar_pca_step_2')	
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);
	g.selectAll('.bar_pca_step_3')	
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);


	
//	g.selectAll('.bar_logreg')
//	    .transition()
//	    .delay(function (d, i) { return 30 * (i + 1);})
//	    .duration(60)
//	    .attr('opacity', 0.0);

	g.selectAll('.text_logreg')
	    .transition()
	    .duration(0)
	    .attr('opacity', 1);
	
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
	//hideAxis();
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
//	g.selectAll('.bar_pca')
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
	    .call(xaxis)
	    //.attr('transform', 'translate(0,' + height + ')')
	    //.transition().duration(400)
	    //.call(xaxis)
	    //.selectAll('text')
	    //.style('text-anchor','end')
	    //.attr("dx", "-1em")
	    //.attr("dy", "-0.5em")
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    .style('opacity', 1.0)
	    //.selectAll(".tick text")
	    //.call(wrap, 10)
	;
	

	g.select('.y.axis')
	    .call(yaxis)
	    .style('opacity', 1.0);
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
	g.select('.y.axis')
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
    
    function get_pca(data) {
	console.log('hii');
	return data[0]['pca'];
    }
    function get_logreg(data) {
	return data[1]['logreg'];
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
    console.log(data);
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


d3.json('./data/predict_fan_data.json', function(rawData) {display(rawData);} );

//display(bothData);

// load data and display
//d3.json(bothData, display);





