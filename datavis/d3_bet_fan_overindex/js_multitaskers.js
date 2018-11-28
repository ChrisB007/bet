// https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages
var sample = [{"feature": " Watched sneak peek content prior to watching the show", "value": 0.652109220006265}, {"feature": " Watched behind the scenes or highlight videos after watching", "value": 0.8143954918032786}, {"feature": " Used a hashtag specific to the series in your own social media posting", "value": 1.6813326282390268}, {"feature": " Follow the actors of a specific show on social media", "value": 0.8790300546448087}, {"feature": " Liked or followed the show's specific page/handle on social media", "value": 1.0378729803042812}, {"feature": " Follow the channel/network on social media corresponding to the show", "value": 1.3862050924311127}, {"feature": " Follow specific hashtags related to the show", "value": 1.3245113493064313}, {"feature": " Joined a live stream or a social media (Facebook/Instagram/Snapchat) story hosted by the cast/team behind the show", "value": 1.7218647540983607}, {"feature": " Attended a live event centered around the show (like a watch party or meet the cast event)", "value": 2.0359887295081966}]

//[
//      {
//        language: 'Rust',
//        value: 78.9,
//        color: '#000000'
//      },
//      {
//        language: 'Kotlin',
//        value: 75.1,
//        color: '#00a2ee'
//      },
//      {
//        language: 'Python',
//        value: 68.0,
//        color: '#fbcb39'
//      },
//      {
//        language: 'TypeScript',
//        value: 67.0,
//        color: '#007bc8'
//      },
//      {
//        language: 'Go',
//        value: 65.6,
//        color: '#65cedb'
//      },
//      {
//        language: 'Swift',
//        value: 65.1,
//        color: '#ff6e52'
//      },
//      {
//        language: 'JavaScript',
//        value: 61.9,
//        color: '#f9de3f'
//      },
//      {
//        language: 'C#',
//        value: 60.4,
//        color: '#5d2f8e'
//      },
//      {
//        language: 'F#',
//        value: 59.6,
//        color: '#008fc9'
//      },
//      {
//        language: 'Clojure',
//        value: 59.6,
//        color: '#507dca'
//      }
//    ];


//sort bars based on value
sample = sample.sort(function (a, b) {
    return d3.descending(a.value, b.value);
});


const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 700 - 2 * margin;
const height = 500 - 2 * margin;

const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
      .range([0, width])
      .domain(sample.map((s) => s.feature))
      .padding(0.3)

const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 2.5]);

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeYLines = () => d3.axisLeft()
      .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));

// vertical grid lines
// chart.append('g')
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(makeXLines()
//     .tickSize(-height, 0, 0)
//     .tickFormat('')
//   )

chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
	  .tickSize(-width, 0, 0)
	  .tickFormat('')
	 )

const barGroups = chart.selectAll()
      .data(sample)
      .enter()
      .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.feature))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
	d3.selectAll('.value')
	    .attr('opacity', 0)

	d3.select(this)
	    .transition()
	    .duration(300)
	    .attr('opacity', 0.6)
	    .attr('x', (a) => xScale(a.feature) - 5)
	    .attr('width', xScale.bandwidth() + 10)

	const y = yScale(actual.value)

	line = chart.append('line')
	    .attr('id', 'limit')
	    .attr('x1', 0)
	    .attr('y1', y)
	    .attr('x2', width)
	    .attr('y2', y)

	barGroups.append('text')
	    .attr('class', 'divergence')
	    .attr('x', (a) => xScale(a.feature) + xScale.bandwidth() / 2)
	    .attr('y', (a) => yScale(a.value) + 30)
	    .attr('fill', 'white')
	    .attr('text-anchor', 'middle')
	    .text((a, idx) => {
		const divergence = (a.value - actual.value).toFixed(1)

		let text = ''
		if (divergence > 0) text += '+'
		text += `${divergence}%`

		return idx !== i ? text : '';
	    })

    })
    .on('mouseleave', function () {
	d3.selectAll('.value')
	    .attr('opacity', 1)

	d3.select(this)
	    .transition()
	    .duration(300)
	    .attr('opacity', 1)
	    .attr('x', (a) => xScale(a.feature))
	    .attr('width', xScale.bandwidth())

	chart.selectAll('#limit').remove()
	chart.selectAll('.divergence').remove()
    })

barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.feature) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    .text((a) => d3.format(".2f")(`${a.value}`))

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('BET fan indexing');


svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Features')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('BET fans are X times more likely to participate in one of the following activities:')
