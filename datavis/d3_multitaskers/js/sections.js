
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


    

    var xChart_ = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.5);      
    var xChart__l2 = d3.scaleBand();
    var yChart_ = d3.scaleLinear()
	.range([height, 0]);

    var xAxis_ = d3.axisBottom()
        .scale(xChart_);
    var yAxis_ = d3.axisLeft()
        .scale(yChart_);



    var bar_new_width=55;

    
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

	    //var _data = get_(rawData);//groupByWord(fillerWords);
	    var _data = rawData;
	    var countMax = d3.max(_data, function (d) { return +d.value;});
	    _data = _data.sort(function(a, b) {
		return d3.descending(a.value, b.value);
	    });



	    xChart_.domain(_data.map(function(entry){
		return entry.attribute;
	    }));

	    
	    valueNames = ['all', 'bet_fan', 'non_bet_fan']

	    var xChart__l2 = d3.scaleBand();
	    
	    //xChart__l2.domain(d3.range(valueNames))
	    //    .range([0, xChart_.bandwidth() - 10]);//domain(valueNames).bandwidth([xChart_.bandwidth()*5 - xChart_.bandwidth()*5*0.5, xChart_.bandwidth()*5 + xChart_.bandwidth()*5*0.25]);    
    

	    var wordData = 0;
	    var histData = 0;
	    var fillerCounts = 0;
	    var fav_show_data = 0;
	    var discover__data = 0;
	    setupVis(_data, fav_show_data, discover__data);
	    
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
    var setupVis = function (_data, fav_show_data, discover__data) {
	// axis
	
	var categories  = [0,1];
	xChart__l2.domain(categories).bandwidth(2);
	
	xAxis_.scale(xChart_);
	
	g.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + height + ')')
	    .call(xAxis_)
	    .selectAll('text')
	    .style('text-anchor','end')
	    .attr("dx", "-1em")
	    .attr("dy", "-0.5em")
	    //.call(wrap, 0.5)
	    //.attr('transform', function(d){
	    //	return "rotate(-90)";
	    //})
	    ;
			
	    //.call(xAxis_);
	g.select('.x.axis').style('opacity', 1.0);


	g.append("g")
	    .attr("class", "y axis")
	    .call(yAxis_);
	g.select('.y.axis').style('opacity', 1.0);
	

	yChart_.domain( [0, d3.max(_data, function(d){ return + d.value; })+0.01] );
	
	var maxCountNewShow = d3.max(_data, function(d){ return + d.count; });
	    

	
	var bars_ = g.selectAll(".bar_")
	    .data(_data);//, function(d){ return d.attribute; })
	bars_.exit()
	    .remove()
	bars_.enter()
	    .append("rect")
	    .attr("class", "bar_")
	    .attr("x", function(d) {
		//if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Shop online'){
		return  xChart_(d.attribute) + xChart__l2(d.bet_fan)*xChart_.bandwidth();
		//}
		//else{
		//    return  xChart_(d.attribute) + xChart__l2(1)*xChart_.bandwidth()*1.5;
		//}
	    })
	    .attr("width", bar_new_width/2)//xChart__l2.bandwidth()*10)
	    .attr('fill', function(d, i){
		if(d.bet_fan ===0){
		    return'#000000';
		}else{
		    return '#ffaa00';
		}
	    })
	    .attr('stroke', 'black')
	    .attr("y", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Shop online'){
		    return yChart_(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, _data);
		    //all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //return yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		    return yChart_(0);
		}
	    })
	    .attr("height", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Shop online'){
		    return height - yChart_(+d.value);
		}
		//else{// if (d.who === 'bet_fan'){
		//    all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		//    return height - yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		//}
		else{
		    return height - yChart_(0);
		}
	    })
	    .attr('opacity', 1);
		


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
	activateFunctions[0] = showShop;
	activateFunctions[1] = showSocial;
	activateFunctions[2] = showBrowse;
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
	for (var i = 0; i < 3; i++) {
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
    
    
    
    function showShop() {
	// ensure bar axis is set
	
	showAxis(xAxis_, yAxis_);
	

	g.selectAll('.bar_')
	    .transition()
	    .duration(100)
	    .attr("y", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Shop online'){
		    return yChart_(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, _data);
		    //all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //return yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		    return yChart_(0);
		}
	    })
	    .attr("height", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Shop online'){
		    return height - yChart_(+d.value);
		}
		//else{// if (d.who === 'bet_fan'){
		//    all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		//    return height - yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		//}
		else{
		    return height - yChart_(0);
		}
	    });

//	    .transition()
//	    .delay(0)
//	    .duration(1000)
//	    .attr('width', bar_new_width/2)
//	    .attr('opacity', function(d, i){
//	    	if (d.who === 'all'){
//	    	    return 0;
//	    	}else{
//	    	    return 1;
//	    	}
//	    })
//	    .attr("x", function(d) {
//		if(d.who === 'all'){
//		    return  xChart_(d.attribute) + xChart__l2('all')*xChart_.bandwidth()*1.5;
//		}
//		else if(d.who === 'bet_fan'){
//		    return  xChart_(d.attribute) + xChart__l2('bet_fan')*xChart_.bandwidth()*1.5;
//		}
//		else{
//		    return  xChart_(d.attribute) + xChart__l2('all')*xChart_.bandwidth()*1.5;
//		}
//	    })
//	    .attr("y", function (d, i, nodes) {
//	    	for (i=0;i<nodes.length;i++){
//		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
//			return yChart_(nodes[i].__data__["value"]);
//		    }
//		}
//		//if(d.who != 'all'){
//	    	//    return yChart_(+d.value);
//	    	//}
//	    })
//	    .attr("height", function (d, i, nodes) {
//		for (i=0;i<nodes.length;i++){
//		    if (nodes[i].__data__["attribute"] === d.attribute && nodes[i].__data__["who"] === "all"){
//			return height - yChart_(nodes[i].__data__["value"]);
//		    }
//		}
//	    	//if(d.who != 'all'){
//	    	    //return height - yChart_(+d.value);
//	    	//}
//	    })
//	    .attr('fill', function(d, i){
//		return '#000000';
//	    });
//	   
	    //.transition()
	    //.delay(function (d, i) { return 30 * (i + 1);})
	    //.duration(0)
	//.attr('opacity', 1.0);
	//.attr('width', function (d) { return xBarScale(d.attribute); });
	
	
    }
    
    
    function showSocial() {
	// ensure bar axis is set
	
	showAxis(xAxis_, yAxis_);
	
	
	g.selectAll('.bar_')
	    .transition()
	    .duration(100)
	    .attr("y", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Browse social media'){
		    return yChart_(+d.value);
		}
		else{// if(d.who === 'bet_fan'){
		    //console.log(d, i, _data);
		    //all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //return yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		    return yChart_(0);
		}
	    })
	    .attr("height", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Browse social media'){
		    return height - yChart_(+d.value);
		}
		//else{// if (d.who === 'bet_fan'){
		//    all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		//    return height - yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		//}
		else{
		    return height - yChart_(0);
		}
	    });
	   
	    //.transition()
	    //.delay(function (d, i) { return 30 * (i + 1);})
	    //.duration(0)
	    //.attr('opacity', 1.0);
	    //.attr('width', function (d) { return xBarScale(d.attribute); });


    }


        function showBrowse() {
	// ensure bar axis is set
	
	showAxis(xAxis_, yAxis_);
	

	g.selectAll('.bar_')
		.transition()
		.duration(100)
		.attr("y", function (d, i) {
		    if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Browse the internet'){
			return yChart_(+d.value);
		    }
		    else{// if(d.who === 'bet_fan'){
			//console.log(d, i, _data);
			//all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
			//return yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		    return yChart_(0);
		}
	    })
	    .attr("height", function (d, i) {
		if(d.activity === 'Which of the following do you typically do while watching your favorite show vs. other shows? :: Browse the internet'){
		    return height - yChart_(+d.value);
		}
		//else{// if (d.who === 'bet_fan'){
		//    all_row = _data.filter(x => x.who=="all" && x.attribute == d.attribute);
		    //console.log(d, i, all_row, all_row[0]['value']);
		//    return height - yChart_(all_row[0].value);//all_row['value']);//_data[i][index]['value']);
		//}
		else{
		    return height - yChart_(0);
		}
	    });

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
d3.json('./data/multitaskers.json', function(rawData) {display(rawData);} );






