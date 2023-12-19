import './style.css'
import * as d3 from 'd3'

const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const data = await d3.json(dataURL)

if(data) {
  data.forEach(item => {
    item.Place = +item.Place
    let parsedTime = item.Time.split(':')
    item.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
  })
  
  // console.log(data)
  
  const w = 800
  const h = 500
  
  let minDate = d3.min(data, d => d.Year)
  let maxDate = d3.max(data, d => d.Year)
  
  console.log(minDate, maxDate)
  
  const xScale = d3.scaleLinear()
                    .domain([minDate - 1, maxDate + 1])
                    .range([0, w - 80])
  
  const yScale = d3.scaleTime()
                    .domain(d3.extent(data, function (d) {return d.Time}))
                    .range([0, h - 40])
  
  d3.select('#app')
    .append('h2')
    .attr('id', 'title')
    .text('Doping in Professional Bicycle Racing')
  
  d3.select('#app')
    .append('div')
    .attr('class', 'data-container')
  
  const svg = d3.select('.data-container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
  
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
  
  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, ' + (h - 20) + ')')
      .call(xAxis)
      
  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 20)')
      .call(yAxis)
  
  svg.append('g')
      .attr('id', 'legend')
      .append('g')
      .attr('class', 'legend-label')
      .attr('id', 'dopping')
      .append('rect')
      .attr('x', w - 10)
      .attr('y', 10)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', 'red')
      
      d3.select('#legend')
      .append('g')
      .attr('class', 'legend-label')
    .attr('id', 'no-dopping')
    .append('rect')
    .attr('x', w - 10)
    .attr('y', 30)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', 'green')
    
    d3.select('#dopping')
    .append('text')
    .text('Riders with dopping allegations')
    .attr('x', w - 20)
    .attr('y', 20)
    .style('text-anchor', 'end')
    d3.select('#no-dopping')
    .append('text')
    .text('No dopping allegations')
    .attr('x', w - 20)
    .attr('y', 40)
    .style('text-anchor', 'end')

    d3.selectAll('.legend-label')
      .selectAll('text')
      .style('fill', 'white')

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('fill', d => {
      return d.Doping !== '' ? 'red' : 'green'
    })
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => d.Time.toISOString())
    .attr('cx', d => xScale(d.Year) + 60)
    .attr('cy', d => yScale(d.Time) + 20)
    .attr('r', 5)
    .on('mouseover', (e, d)=> {handleTooltip(e, d)})
    .on('mouseout', () => {d3.select('#tooltip').style('visibility', 'hidden')})
  
  d3.select('.data-container')
    .append('div')
    .attr('id', 'tooltip')
  
  function handleTooltip (e, d) {
    const minutes = new Date(d.Time).getMinutes()
    const seconds = new Date(d.Time).getSeconds()
    const dataYear = e.target.getAttribute('data-xvalue')
  
    console.log(e.target)
  
    d3.select('#tooltip')
    .attr('data-year', dataYear)
      .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${minutes}:${seconds}<br><br>${d.Doping}`)
      .style('visibility', 'visible')
      .style('transform', `translate(${e.target.cx.baseVal.value + 5}px, ${e.target.cy.baseVal.value}px)`)
  }
}
