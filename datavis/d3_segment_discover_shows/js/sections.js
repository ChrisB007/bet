
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
    var margin = { top: 0, left: 100, bottom: 100, right: 0 };



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

    var yChart_seg_rank = d3.scaleBand()
	.rangeRound([height,0])
	.padding(0.5);     

    var xChart_seg_rank = d3.scaleLinear()
	.range([width,0]);
    var xChart_seg_count = d3.scaleLinear()
	.range([0,width]);
    
    var xAxis_seg_rank = d3.axisBottom();
    var xAxis_seg_count = d3.axisBottom();

    var yAxis_seg_rank = d3.axisLeft()
	.scale(yChart_seg_rank);



    
//
//    var xChart_new_show = d3.scaleBand()
//	.rangeRound([0, width])
//	.padding(0.5);      
//    var xChart_new_show_l2 = d3.scaleBand();
//    var yChart_new_show = d3.scaleLinear()
//	.range([height, 0]);
//
//    var xAxis_new_show = d3.axisBottom()
//        .scale(xChart_new_show);
//    var yAxis_new_show = d3.axisLeft()
//        .scale(yChart_new_show);
//
//
//
//    var xChart_discover_new_show = d3.scaleBand()
//	.rangeRound([0, width])
//	.padding(0.5);      
//    var xChart_discover_new_show_l2 = d3.scaleBand();
//    var yChart_discover_new_show = d3.scaleLinear()
//	.range([height, 0]);
//
//    var xAxis_discover_new_show = d3.axisBottom()
//        .scale(xChart_discover_new_show);
//    var yAxis_discover_new_show = d3.axisLeft()
//        .scale(yChart_discover_new_show);
//
//    
//
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
	    svg = d3.select(this).selectAll('svg').data([rawData]);
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


	    //var seg_rank_data = get_seg_rank(rawData);
	    var seg_rank_data = rawData;
	    var countMax_fav = d3.max(seg_rank_data, function (d) { return d.count;});
	    console.log(d3.sum(seg_rank_data, function(d) {return d.count;}));
	    //seg_rank_data = seg_rank_data.sort(function(a, b) {
		//return d3.descending(a.value, b.value);
	//});

	    var wordData = 0;
	    var histData = 0;
	    var fillerCounts = 0;
	    var new_show_data = 0;
	    var discover_new_show_data = 0;
	    setupVis(new_show_data, seg_rank_data, discover_new_show_data);
	    
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
    var setupVis = function (new_show_data, seg_rank_data, discover_new_show_data) {
	// axis
	    yChart_seg_rank.domain(seg_rank_data.map(function(entry){
		return entry.label;
	    }));

	   
 	xChart_seg_rank.domain( [d3.min(seg_rank_data, function(d){ return + d.rank; })-0.1, d3.max(seg_rank_data, function(d){ return + d.rank; })+0.1] );

	xChart_seg_count.domain( [0, d3.max(seg_rank_data, function(d){ return + d.count; })+0.1] );
	    
	xAxis_seg_rank.scale(xChart_seg_rank);
	xAxis_seg_count.scale(xChart_seg_count);
	yAxis_seg_rank.scale(yChart_seg_rank);	
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_seg_rank)
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
	    .call(yAxis_seg_rank);
	g.select('.y.axis').style('opacity', 1.0);
	

	
	//var maxCountNewShow = d3.max(new_show_data, function(d){ return + d.count; });
	//var maxCountFavShow = d3.max(seg_rank_data, function(d){ return + d.count; });
	    	


	
	
	//console.log(xAxis_seg_rank);
	//xAxis_seg_rank.scale(xChart_seg_rank);
	//console.log(xAxis_seg_rank);

	console.log(seg_rank_data);
	


	//var bar_fav_width = 11;


	var colorScale = ['#bbjj77', '#ffaa00', '#aaaaaa', '#dddddd', '#DAD', '#DECADE']
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);

	color.domain(seg_rank_data.map(function(entry){
		return entry.segment;
	}));

	
	var bars_seg_rank = g.selectAll(".bar_seg_rank")
	    .data(seg_rank_data);//, function(d){ return d.attribute; })
	bars_seg_rank.exit()
	    .remove()
	bars_seg_rank.enter()
	    .append("circle")
	    .attr("class", "bar_seg_rank")
	    .attr('r', function(d){
		return d.count*30;
	    })
	    .attr("cx", function(d) {
		return xChart_seg_rank(d.rank);	
	    })
	    .attr('fill', function(d, i){
		return color(d.segment);
	    })
	    .attr("cy", function (d, i) {
		return yChart_seg_rank(d.label);
	    })
	    .attr("data-legend",function(d) { return d.segment});

	var legend_vals = d3.set(seg_rank_data.map( function(d) { return d.segment } ) ).values();
	
	var legend = svg.selectAll(".legend")
	    .data(legend_vals)
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
	    .style("opacity","1");
	
	legend.append("rect")
	    .attr("x", width+70)
	    .attr("y", height-140)
	    .attr("width", 12)
	    .attr("height", 12)
	    .style("fill", function(d) { return color(d); });
	
	legend.append("text")
	    .attr("x", width+60)
	    .attr("y", height-140+5)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) {return d; });


	legend.on("click", function(type) {
	    // dim all of the icons in legend
	    //d3.selectAll(".legend")
	    //    .style("opacity", 0.1);
	    // make the one selected be un-dimmed
	    d3.select(this)
	        .style("opacity", function(d){
		    console.log(d3.select(this).style("opacity"));
		    if(d3.select(this).style("opacity") == 1){
			return 0.1;
		    }else{
			return 1;
		    }
		});
	    // select all dots and apply 0 opacity (hide)
	    d3.selectAll(".bar_seg_rank")
	    // .transition()
	    // .duration(500)
	        //.style("opacity", 0.0)
	    // filter out the ones we want to show and apply properties
	        .filter(function(d) {
		    return d["segment"] == type;
		})
	        .style("opacity",  function(d){
		    console.log(d3.select(this).style("opacity"));
		    if(d3.select(this).style("opacity") == 0.1){
			return 1;
		    }else{
			return 0.1;
		    }
		}) // need this line to unhide dots
	        //.style("stroke", "black")
	    //apply stroke rule
	        .style("fill", function(d) {
		    if (d.segment == type) {
			return color(d.segment);
		    } else {
			return "white";
		    };
		});
	});
	    
	
	//legend.transition().duration(200).delay(function(d,i){ return 100 + 100 * i; }).style("opacity","1");
	

    }
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
	activateFunctions[0] = showSegRank;
	activateFunctions[1] = showSegCount;
	//activateFunctions[1] = showFavShow_bet;
	//activateFunctions[2] = showDiscoverNewShow_all;
	//activateFunctions[3] = showDiscoverNewShow_bet;
	//activateFunctions[4] = showNewShow_all;
	//activateFunctions[5] = showNewShow_bet;

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
    
    
    
    function showSegRank() {
	// ensure bar axis is set
	
	showAxis(xAxis_seg_rank, yAxis_seg_rank);
	
	g.selectAll('.bar_seg_rank')
	    .transition()
	    .duration(1000)
	    .attr('r', function(d){
		return d.count*30;
	    })
	    .attr("cx", function(d) {
		return xChart_seg_rank(d.rank);	
	    })
	    .attr("cy", function (d, i) {
		return yChart_seg_rank(d.label);
	    })
	    .attr('opacity', 0.8);

	
	
    }

    
    function showSegCount() {
	// ensure bar axis is set
	
	showAxis(xAxis_seg_count, yAxis_seg_rank);
	
	g.selectAll('.bar_seg_rank')
	    .transition()
	    .duration(1000)
	    .attr('r', function(d){
		return (3-d.rank)*5;
	    })
	    .attr("cx", function(d) {
		return xChart_seg_count(d.count);	
	    })
	    .attr("cy", function (d, i) {
		return yChart_seg_rank(d.label);
	    })
	    .attr('opacity', 0.8);

	
	
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
    function get_seg_rank(data) {
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
d3.json('./data/segment_rank.json', function(rawData) {display(rawData);} );






