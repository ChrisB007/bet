
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
    // constants to define the size
    // and margins of the vis area.
    var width = 1000;
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
    
    
    
    
    var yChart_fav_show = d3.scaleLinear()
	.range([height, 0]);
    
    
    var xAxis_fav_show = d3.axisBottom();
        
    
    var yAxis_fav_show = d3.axisLeft()
        .scale(yChart_fav_show);
    

    
    var yChart_text = d3.scaleLinear()
	.range([height, 0]);
    
    
    var xAxis_text = d3.axisBottom()
        .scale(xChart_text);
    
    var yAxis_text = d3.axisLeft()
        .scale(yChart_text);




    var xChart_text = d3.scaleBand()
	.rangeRound([0, height])
	.padding(0.5);      
    
    
    
    var xChart_fav_show = d3.scaleBand()
	//.domain(fav_show_data.map(function(entry){
	//    return entry.attribute;
	//}))
	.rangeRound([0, height])
	.padding(0.1);      

    

    
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
	    var text_data = get_text(rawData);//groupByWord(fillerWords);
	    //var countMax = d3.max(text_data, function (d) { return d.value;});
	    //text_data = text_data.sort(function(a, b) {
	    //return d3.descending(a.value, b.value);
	    //});
	    // set the bar scale's domain
	    	    //xBarScale.domain([0, countMax]);
	    var fav_show_data = [];
	    //var fav_show_data = get_fav_show(rawData);
	    //var countMax_fav = d3.max(fav_show_data, function (d) { return d.value;});
	    //fav_show_data = fav_show_data.sort(function(a, b) {
	    //	return d3.descending(a.value, b.value);
	    //});
	    
	    

	    xChart_text.domain(fav_show_data.map(function(entry){
		return entry.attribute;
	    }));

    
    
	    xChart_fav_show.domain(fav_show_data.map(function(entry){
		return entry.attribute;
	    }));
		    

	    // get aggregated histogram data
	    
	    //var histData = getHistogram(fillerWords);
	    // set histogram's domain
	    //var histMax = d3.max(histData, function (d) { return d.length; });
	    //yHistScale.domain([0, histMax]);
	    var wordData = 0;
	    var histData = 0;
	    var fillerCounts = 0;
	    setupVis(text_data, fav_show_data, histData);
	    
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
    var setupVis = function (text_data, fav_show_data, histData) {
	// axis
	xChart_text.domain(text_data.map(function(entry, i){
	    return entry.attribute;
	}));

	xAxis_text.scale(xChart_text);
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_text)
	    .selectAll('text')
	    .style('text-anchor','end')
	    .attr("dx", "-1em")
	    .attr("dy", "-0.5em")
	    .call(wrap, 0.5)
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    ;
			
	    //.call(xAxis_text);
	g.select('.x.axis').style('opacity', 1.0);


	g.append("g")
	    .attr("class", "y axis")
	    .call(yAxis_text);
	g.select('.y.axis').style('opacity', 1.0);
	
	console.log(text_data);
	
	yChart_text.domain( [0, d3.max(text_data, function(d, i){ return + d.value; })] );
	
	var maxCountNewShow = d3.max(text_data, function(d){ return + d.count; });
	var maxCountFavShow = d3.max(fav_show_data, function(d){ return + d.count; });
	    
	
	
	var bars_text = g.selectAll(".bar_text")
	    .data(text_data, function(d){ return d.attribute; })
	bars_text.exit()
	    .remove()
	bars_text.enter()
	    .append("rect")
	    .attr("class", "bar_text")
	    .attr("x", function(d, i) { return xChart_text(d.attribute) +0.01*xChart_text(d.attribute) + 20*d.bet_fan;})
	    .attr("width", 20)
	    .attr('fill', function(d, i){
		if(d.bet_fan == 1.0){
		    return'#aaaaaa';
		}else{
		    return'#cccccc';
		}
	    })
	    .style("fill-opacity", function(d) { return d.count/maxCountNewShow;})
	    //.attr("height", function(d, i) {
	    //	return 0;
	    //})
	    //.transition()
	    //.duration(400)
	    //.delay(function (d, i) {
	    //	return i * 20;
	    //})
	    .attr("y", function (d, i) {
		return yChart_text(d.value) ;
	    })
	    .attr("height", function (d, i) {
		return height - yChart_text(d.value) ;
	    })
	    .attr('opacity', 0);
	
	//g.select('.y').call(yAxis_text);
	//
	//g.select('.x.axis')
	//    .attr("transform", "translate(0," + height/2 + ")")
	//    .call(xAxis_text);
	    //.selectAll("text")
	    //.style("text-anchor", "end")
	    //.attr("dx", "-.8em")
	    //.attr("dy", ".0em")
	    //.attr("transform", function(d){
	    //	return "rotate(-90)";
	    //});
	


	xChart_fav_show.domain(fav_show_data.map(function(entry){
		return entry.attribute;
	}));

	
	

	xAxis_fav_show.scale(xChart_fav_show);
	
	yChart_fav_show.domain( [0, d3.max(fav_show_data, function(d){ return + d.value; })] );
	

	var bars_fav_show = g.selectAll(".bar_fav_show")
	    .data(fav_show_data, function(d){ return d.attribute; })
	bars_fav_show.exit()
	    .remove()
	bars_fav_show.enter()
	    .append("rect")
	    .attr("class", "bar_fav_show")
	    .attr("x", function(d) { return xChart_fav_show(d.attribute) +0.01*xChart_fav_show(d.attribute);})
	    .attr("width", 10)
	    .attr('fill', function(d, i){
		if(d.value > 1.0){
		    console.log('hi');
		    return'#000000';
		}else{
		    return'#000000';
		}
	    })
	    .style("fill-opacity", function(d) { return d.count/maxCountFavShow;})
	    //.attr("height", function(d, i) {
	    //	return 0;
	    //})
	    //.transition()
	    //.duration(400)
	    //.delay(function (d, i) {
	    //	return i * 20;
	    //})
	    .attr("y", function (d, i) {
		return yChart_fav_show(d.value) ;
	    })
	    .attr("height", function (d, i) {
		return height - yChart_fav_show(d.value) ;
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
	activateFunctions[0] = showNewShow;
	activateFunctions[1] = showFavShow;
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
	for (var i = 0; i < 2; i++) {
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

	showAxis(xAxis_text, yAxis_text);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);

		
	g.selectAll('.bar_text')
	    .transition()
	    .delay(function (d, i) { return 30 * (i + 1);})
	    .duration(600)
	    .attr('opacity', 1.0);
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

	showAxis(xAxis_fav_show, yAxis_fav_show);
	
	
	g.selectAll('.bar_text')
	    .transition()
	    .duration(300)
	    .attr('opacity', 0);
	
	g.selectAll('.bar_fav_show')
	    .transition()
	    .delay(function (d, i) { return 30 * (i + 1);})
	    .duration(600)
	    .attr('opacity', 1.0);


	
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
//	g.selectAll('.bar_text')
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
    
    function get_text(data) {
	var text_data = [];
	for(var i = 0; i < data.length; i++){
	    if(data[i]["activity"] === "Which of the following do you typically do while watching your favorite show vs. other shows? :: Text/message on the phone"){
		text_data.push(data[i]);
	    }
	}
	return text_data;
    }
    function get_fav_show(data) {
	var show_data = [];
	for(var i = 0; i < data.length; i++){
	    if(bothData[i]["feature"] === "favorite_show"){
		show_data.push(bothData[i]);
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
		}
	    }
	});
    };
    
    function wrap(text, width) {
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



d3.json('./data/multitaskers.json', function(rawData) {display(rawData);} );

// load data and display
//d3.json(bothData, display);





