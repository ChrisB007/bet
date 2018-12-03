
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
    

    
    var yChart_tsne = d3.scaleLinear()
	.range([height, 0]);
    
    
    var xAxis_tsne = d3.axisBottom()
        .scale(xChart_tsne);
    
    var yAxis_tsne = d3.axisLeft()
        .scale(yChart_tsne);




    var xChart_tsne = d3.scaleLinear()
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
	    var tsne_data = get_tsne(rawData['tsne']);//groupByWord(fillerWords);
	    //var tsne_data = rawData;
	    
	    var cluster_data = rawData['cluster'];

	    //var countMax = d3.max(tsne_data, function (d) { return d.value;});
	    //tsne_data = tsne_data.sort(function(a, b) {
	    //	return d3.descending(a.value, b.value);
	    //});
	    
	    // set the bar scale's domain
	    	    //xBarScale.domain([0, countMax]);

	    //var logreg_data = get_logreg(rawData);
	    //var countMax_fav = d3.max(logreg_data, function (d) { return d.value;});
	    //logreg_data = logreg_data.sort(function(a, b) {
	    //	return d3.descending(a.value, b.value);
	    //});

	    //var logreg_data = get_logreg(rawData);
	    //console.log(logreg_data);
	    var logreg_data = [];
	    //xChart_tsne.domain(fav_show_data.map(function(entry){
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
	    setupVis(tsne_data, cluster_data, histData);
	    
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
    var setupVis = function (tsne_data, cluster_data, histData) {
	// axis
	
	xChart_tsne.domain( [d3.min(tsne_data, function(d){return +d.x;}) , d3.max(tsne_data, function(d){ return + d.x; })] );

	xAxis_tsne.scale(xChart_tsne);
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_tsne)
	    //.selectAll('text')
	    //.style('text-anchor','end')
	    //.attr("dx", "-1em")
	    //.attr("dy", "-0.5em")
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    ;
			
	    //.call(xAxis_tsne);
	g.select('.x.axis').style('opacity', 0.0);


	g.append("g")
	    .attr("class", "y axis")
	    .call(yAxis_tsne)
	    .style('opacity', 0);
	///g.select('.y.axis').style('opacity', 0.0).call(wrap, 10);
	

	yChart_tsne.domain( [d3.min(tsne_data, function(d){return +d.y;}) , d3.max(tsne_data, function(d){ return + d.y; })] );
	
	var maxBetMean = d3.max(tsne_data, function(d){ return + d.bet_mean; });
	//var maxCountFavShow = d3.max(logreg_data, function(d){ return + d.value; });
	    
	console.log(xChart_tsne);


	var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	var bars_tsne = g.selectAll(".bar_tsne")
	    .data(tsne_data)
	bars_tsne.exit()
	    .remove()
	bars_tsne.enter().append("circle")
	    .attr("class", "bar_tsne")
	    .attr("r", 2)
	    .attr("cx", function(d) { return xChart_tsne(d.x); })
	    .attr("cy", function(d) { return yChart_tsne(d.y); })
	    .attr('fill', function(d) {
	    	return colorScale(d.cluster);
	    })
	    .attr('opacity', 1);


	var legend = g.selectAll(".legend")
	    .data([0,1,2])//tsne_data, function(d) { return d.cluster; })
	legend.exit()
	    .remove()
	legend.enter().append("rect")
	    .attr("class", "legend")
	    .attr("x", width - 18)
	    .attr("width", 18)
	    .attr("height", 18)
	    .style("fill", function(d) { return colorScale(d); })
	    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
	    .style("opacity",1);


	legend.append("text")
	    .attr("x", width - 24)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) {return d; });

//	legend
//	    .transition()
//	    .duration(200)
//	    .delay(function(d,i){ return 100 + 100 * i; })
//	    .style("opacity","1");
	
	    //.attr("x"

	var text_cluster = g.selectAll("text")
	    .data(cluster_data, function(d){
		return d;
	    })
	text_cluster.exit()
	    .remove()
	text_cluster.enter()
	    .append("text")
	    .attr('class', 'text_cluster')
	    .attr("x", function(d, i) {
		return xChart_tsne(-30);
	    })
	    .attr("y", function(d, i) {
		return yChart_tsne(50-i*15);
	    })
	    .text(function (d, i, att_data) {
		var cols = ['num_visitors', 'n_sessions', 'visit_length'];
		var pre = ['Visitor fraction: ', 'Number of sessions: ', 'Length of visit: '];
		//if (d.cluster_id == 0 ){
		console.log(att_data[0].__data__);
		//for(j=0;j<3;j++) {
		//console.log(j, cols[j]);
		//att_data.push(d.attributes[cols[j]]);
		return pre[i] + att_data[0].__data__.attributes[cols[i]].toFixed(2);
		//    }
		//}
		//return att_data;
	    })
	    .attr("font-family", "sans-serif")
	    .attr("font-size", "24px")
	    .attr("fill", "black")
	    .attr('opacity', 0.0);
	

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
	activateFunctions[0] = showNewShow;
	activateFunctions[1] = showGroup1;
	activateFunctions[2] = showGroup2;
	activateFunctions[3] = showGroup3;
	
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
	for (var i = 0; i < 4; i++) {
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
    function showNewShow() {
	// ensure bar axis is set

//	showAxis(xAxis_tsne, yAxis_tsne);
	hideAxis();
	
	g.selectAll('.text_cluster')
	    .transition()
	    .duration(0)
	    .attr('opacity', 0);
	

	g.selectAll('.legend')
	    .transition()
	    .duration(1000)
	    .attr("x", width - 18)
	    .attr("width", 18)
	    .attr("height", 18)
	    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
	    .style("opacity",1);



	
	g.selectAll('.bar_tsne')
	    .transition()
	    //.delay(function (d, i) { return 0.05 * (i + 1);})
	    .duration(500)
	    .attr('opacity', 1.0)
	    .attr("cx", function(d) { return xChart_tsne(d.x); })
	    .attr("cy", function(d) { return yChart_tsne(d.y); });
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
    function showGroup1() {

	
	g.selectAll('.text_cluster')
	    .transition()
	    .duration(1000)
	    .text(function (d, i, att_data) {
		var cols = ['num_visitors', 'n_sessions', 'visit_length'];
		var pre = ['Visitor fraction: ', 'Number of sessions: ', 'Length of visit: '];
		//if (d.cluster_id == 0 ){
		console.log(att_data[0].__data__);
		//for(j=0;j<3;j++) {
		//console.log(j, cols[j]);
		//att_data.push(d.attributes[cols[j]]);
		return pre[i] + att_data[0].__data__.attributes[cols[i]].toFixed(2);
		//    }
		//}
		//return att_data;
	    })
	    .attr('opacity', 1);
	
	g.selectAll('.bar_tsne')	
	    .transition()
	    .duration(500)
	    .attr('opacity', function(d) {
		if (d.cluster == 0){
		    return 0.8;
		}else{
		    return 0.05;
		}
	    })
	    .attr("cx", function(d) { return xChart_tsne(d.x*0.6+20); })
	    .attr("cy", function(d) { return yChart_tsne(d.y*0.6-40); });

	   
	g.selectAll('.legend')
	    .transition()
	    .duration(1000)
	    .style("opacity", function(d){
	    	console.log('hi');
	    	return  d == 0 ? 1 : 0;
	    })
	    //.selectAll('rect')
	    .attr("x", 100)
	    .attr("y", 10)
	    .attr("height", height);
    }



    function showGroup2() {
	
	
	g.selectAll('.text_cluster')
	    .transition()
	    .duration(1000)
	    .text(function (d, i, att_data) {
		var cols = ['num_visitors', 'n_sessions', 'visit_length'];
		var pre = ['Visitor fraction: ', 'Number of sessions: ', 'Length of visit: '];
		//if (d.cluster_id == 0 ){
		console.log(att_data[1].__data__);
		//for(j=0;j<3;j++) {
		//console.log(j, cols[j]);
		//att_data.push(d.attributes[cols[j]]);
		return pre[i] + att_data[1].__data__.attributes[cols[i]].toFixed(2);
		//    }
		//}
		//return att_data;
	    })
	    .attr('opacity', 1);
	
	g.selectAll('.bar_tsne')	
	    .transition()
	    .duration(500)
	    .attr('opacity', function(d) {
		if (d.cluster == 1){
		    return 0.8;
		}else{
		    return 0.05;
		}
	    })
	    .attr("cx", function(d) { return xChart_tsne(d.x*0.6+20); })
	    .attr("cy", function(d) { return yChart_tsne(d.y*0.6-40); });

	    

	//showAxis(xAxis_logreg, yAxis_logreg);

	
	g.selectAll('.legend')
	    .transition()
	    .duration(200)
	    .style("opacity", function(d){
	    	console.log('hi');
	    	return  d == 1 ? 1 : 0;
	    })
	    //.selectAll('rect')
	    .attr("x", 100)
	    .attr("y", 10)
	    .attr("height", height);
	
    }


    function showGroup3() {
	    
	
	g.selectAll('.text_cluster')
	    .transition()
	    .duration(1000)
	    .text(function (d, i, att_data) {
		var cols = ['num_visitors', 'n_sessions', 'visit_length'];
		var pre = ['Visitor fraction: ', 'Number of sessions: ', 'Length of visit: '];
		//if (d.cluster_id == 0 ){
		console.log(att_data[2].__data__);
		//for(j=0;j<3;j++) {
		//console.log(j, cols[j]);
		//att_data.push(d.attributes[cols[j]]);
		return pre[i] + att_data[2].__data__.attributes[cols[i]].toFixed(2);
		//    }
		//}
		//return att_data;
	    })
	    .attr('opacity', 1);
	
	g.selectAll('.bar_tsne')	
	    .transition()
	    .duration(500)
	    .attr('opacity', function(d) {
		if (d.cluster == 2){
		    return 0.8;
		}else{
		    return 0.05;
		}
	    })
	    .attr("cx", function(d) { return xChart_tsne(d.x*0.6+20); })
	    .attr("cy", function(d) { return yChart_tsne(d.y*0.6-40); });

	    

	//showAxis(xAxis_logreg, yAxis_logreg);

	
	g.selectAll('.legend')
	    .transition()
	    .duration(200)
	    .style("opacity", function(d){
	    	return  d == 2 ? 1 : 0;
	    })
	    //.selectAll('rect')
	    .attr("x", 100)
	    .attr("y", 10)
	    .attr("height", height);
	
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
	    .duration(0)
	    //.delay(function (d) {
	    //	return 5 * d.row;
	    //})
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
//	g.selectAll('.bar_tsne')
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
	    .transition().duration(0)
	    .style('opacity', 0);
	g.select('.y.axis')
	    .transition().duration(0)
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
    
    function get_tsne(data) {
	console.log('hii');
	var tsne_data = [];
	for(var i=0;i<data.length;i++){
	    //console.log(i%100);
	    if (i%4 == 0){
		//console.log(i);
		tsne_data.push(data[i]);
	    }
	}
	//return data[0]['tsne'];
	return tsne_data;
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
function display(tsneData, clusterData) {
    // create a new plot and
    // display it
    var data = {};
    console.log(clusterData);
    data['tsne'] = tsneData;
    data['cluster'] = clusterData;
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



var clusterData = [ {'cluster_id': 0,
     'attributes': {'num_visitors': 0.6294361131845015,
		    'n_sessions': 3.8663216903837863,
		    'visit_length': 834.9392661540938,
		    'most_rep_links': [{"https:\/\/www.bet.com\/video\/betexclusive\/2018\/marvel-black-panther-animated\/episode-104-filthy-pigs.html":0.0946663902,"https:\/\/www.bet.com\/shows\/hip-hop-awards\/2018\/photos\/exclusives\/wtf-is-going-down-the-instabooth.html":0.094256117,"https:\/\/www.bet.com\/video\/tales\/season-1\/exclusives\/irv-gotti-lorenzo-on-controversy-behind-ep-1-of-tales.html":0.0933118492,"https:\/\/www.bet.com\/video\/face-value\/season-1\/full-episodes\/episode-101-brandon-t-jackson-vs-sheryl-underwood.html":0.0932844658,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/exclusives\/instabooth-full-hha18.html":0.0476364381,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/exclusives\/45-years-of-hip-hop-hha18.html":0.0449241342,"https:\/\/www.bet.com\/shows.html":0.0436731365,"https:\/\/www.bet.com\/":0.0172852272,"https:\/\/www.bet.com\/shows\/hip-hop-awards.html":0.011031502,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/performances\/cardi-b-performs-get-up-10-and-backin-it-up-hha18.html":0.0101094043,"https:\/\/www.bet.com\/live-tv.html":0.0097075797,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/acceptance-speeches\/i-am-hip-hop-award-hha18.html":0.0096182634,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/performances\/lil-duval-ball-greezy-and-shiggy-are-living-their-best-life-hha18.html":0.0089481369,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/cyphers\/vic-mensa-g-herbo-taylor-benett-and-nick-grant-drop-heat-hha18.html":0.0088736507,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/cyphers\/big-pale-armani-white-and-wynne-digital-cypher-clean-hha18.html":0.0086501587,"*":0.0080837553,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/performances\/ti-performs-wraith-with-yo-gotti-and-jefe-hha18.html":0.0071440108,"https:\/\/www.bet.com\/shows\/hip-hop-awards\/performers.html":0.0070395402,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/cyphers\/casanova-phora-shawn-smith-and-more-put-on-for-their-cities-hha18.html":0.0066663418,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/performances\/flipp-dinero-had-the-crowd-bumpin-hha18.html":0.0066663418}]
		   }
    },
    {'cluster_id' : 1,
     'attributes': {'num_visitors': 0.1686910497387528,
		    'n_sessions': 27.717216411906676,
		    'visit_length': 612.3116287686154,
		    'most_rep_links': [{"https:\/\/www.bet.com\/video\/betexclusive\/2018\/marvel-black-panther-animated\/episode-104-filthy-pigs.html":0.1055257697,"https:\/\/www.bet.com\/shows\/hip-hop-awards\/2018\/photos\/exclusives\/wtf-is-going-down-the-instabooth.html":0.1055257697,"https:\/\/www.bet.com\/video\/face-value\/season-1\/full-episodes\/episode-101-brandon-t-jackson-vs-sheryl-underwood.html":0.1055257697,"https:\/\/www.bet.com\/video\/tales\/season-1\/exclusives\/irv-gotti-lorenzo-on-controversy-behind-ep-1-of-tales.html":0.1055257697,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/exclusives\/instabooth-full-hha18.html":0.0987322386,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/exclusives\/45-years-of-hip-hop-hha18.html":0.0982198729,"https:\/\/www.bet.com\/shows.html":0.0968785969,"https:\/\/www.bet.com\/video\/hiphopawards\/2018\/cyphers\/big-pale-armani-white-and-wynne-digital-cypher-clean-hha18.html":0.0542571924,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/music\/042718-2018-bet-expierence-performance-lineup.html":0.0127483847,"https:\/\/www.bet.com\/shows\/bet-breaks\/episodes.html":0.0112873385,"https:\/\/www.bet.com\/video\/betexclusive\/2018\/marvel-black-panther-animated\/episode-101-black-panther-vs-captain-america.html":0.0086606872,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/lifestyle\/043018-unbanned-the-legend-of-aj1-premieres-at-tribeca.html":0.0077249961,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/celebrities\/043018-dave-chappelle-praises-mayweather-s-boxing-career.html":0.0076025439,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/music\/042718-cardi-b-cancels-summer-tour-dates.html":0.0073882019,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/celebrities\/042718-janelle-monae-comes-out-as-pansexual.html":0.0068673881,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/celebrities\/042718-the-obamas-train-200-african-leaders-in-government.html":0.0061621503,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/celebrities\/042418-steph-curry-inks-multi-year-production-deal-with-sony.html":0.0059780602,"https:\/\/www.bet.com\/video\/bet-breaks\/2018\/celebrities\/042718-avengers-expected-to-shatter-box-office-records.html":0.005609737,"https:\/\/www.bet.com\/video\/face-value\/season-1\/full-episodes\/episode-102-loni-love-vs-letoya-luckett.html":0.004349859,"https:\/\/www.bet.com\/video\/tales\/season-1\/promo\/a-peek-inside-the-making-of-episode-1-of-tales.html":0.003056935}]
		   }
    },
    
    {'cluster_id' : 2,
     'attributes': {'num_visitors': 0.2018728370767456,
		    'n_sessions': 9.83126050420168,
		    'visit_length': 1635.1942643335224,
		    'most_rep_links': [{"*":0.0183983232,"https:\/\/www.bet.com\/news\/sports\/2018\/10\/15\/wife-of-ex-falcons-player-catches-him-standing-with-erection-ove.html":0.0171226773,"https:\/\/www.bet.com\/celebrities\/news\/2018\/10\/20\/ti-and-tiny-talk-about-marriage.html":0.013947767,"https:\/\/www.bet.com\/celebrities\/news\/2018\/10\/16\/jeannie-mai-tears-admitting-wishes-never-married-husband.html":0.0128587331,"https:\/\/www.bet.com\/style\/style-and-beauty\/photos\/2015\/03\/baewatch-celebrities-slaying-in-swimsuits.html":0.0118754488,"https:\/\/www.bet.com\/music\/2018\/10\/15\/snoop-dogg-kim-kardashian-kiki-drake-kanye-west.html":0.0115332101,"https:\/\/www.bet.com\/style\/relationships\/photos\/2015\/03\/celebrity-couplecam.html":0.011212255,"https:\/\/www.bet.com\/celebrities\/news\/2018\/10\/19\/tamar-braxton.html":0.010634276,"https:\/\/www.bet.com\/celebrities\/news\/2018\/10\/24\/kim-kardashian-freaking-out-blac-chyna-reality-show.html":0.010441542,"https:\/\/www.bet.com\/news\/national\/2018\/10\/18\/disturbing-video-shows-mother-dunking-infants-head-underwater-to.html":0.0103344516,"https:\/\/www.bet.com\/style\/fashion\/2018\/03\/14\/see-all-the-times-ej-johnson-showed-off-his-lady-parts.html":0.0102701918,"https:\/\/www.bet.com\/celebrities\/news\/2018\/10\/18\/steve-harvey-is--sick--over-these-rumors-about-him-and-a-member-.html":0.0102059279,"https:\/\/www.bet.com\/music\/2018\/10\/24\/rihanna-watch-gloves-cardi-b-ghetto.html":0.0098416877,"https:\/\/www.bet.com\/":0.0097559648,"https:\/\/www.bet.com\/music\/2018\/10\/22\/50-cent-ashanti-cancelled-concert.html":0.0089841283,"https:\/\/www.bet.com\/music\/2018\/10\/22\/cassie-message-instagram.html":0.0088768816,"https:\/\/www.bet.com\/style\/health-and-wellness\/photos\/2015\/08\/oh-baby-when-stars-celebrate-their-bumps.html":0.008705263,"https:\/\/www.bet.com\/news\/national\/2018\/10\/15\/white-realtor-fired-after-video-shows-her-blocking-a-black-man-f.html":0.008168765,"https:\/\/www.bet.com\/music\/2018\/10\/22\/rihanna-drake-family-comment-response.html":0.0080828987,"https:\/\/www.bet.com\/music\/2018\/10\/20\/ashanti-show.html":0.0079540852}]
		   }
    }
];


//d3.json('./data/clusterAtt.json', function(clusterData) {
d3.json('./data/tsne.json', function(tsneData) {
    display(tsneData, clusterData);
});
//});
  

//display(bothData);

// load data and display
//d3.json(bothData, display);





