const dscc = require('@google/dscc');
const d3 = require('d3');

// Función principal que se ejecuta cuando cambian los datos en Looker
const drawViz = (data) => {
  // Limpiar el contenedor
  document.body.innerHTML = '<div id="viz"></div>';
  
  const rowData = data.tables.DEFAULT;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const width = dscc.getWidth() - margin.left - margin.right;
  const height = dscc.getHeight() - margin.top - margin.bottom;

  const svg = d3.select('#viz')
    .append('svg')
    .attr('width', dscc.getWidth())
    .attr('height', dscc.getHeight())
    .append('g')
    .attr('transform', `translate(${dscc.getWidth()/2}, ${dscc.getHeight() - 40})`);

  // Aquí va la lógica de D3 que hicimos antes (arcos, aguja, etc.)
  // Usando rowData[0].metric[0] para el valor y rowData[0].dimension[0] para el título
  
  // Ejemplo rápido de arco
  const radius = Math.min(width / 2, height) - 20;
  const arc = d3.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  svg.append('path')
    .attr('d', arc)
    .attr('fill', '#e2e8f0');
    
  // Aguja animada basada en el valor de Looker
  const value = rowData[0].metric[0];
  const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI/2, Math.PI/2]);
  
  svg.append('line')
    .attr('x1', 0).attr('y1', 0)
    .attr('x2', (radius - 10) * Math.sin(scale(value)))
    .attr('y2', -(radius - 10) * Math.cos(scale(value)))
    .attr('stroke', '#2d3748')
    .attr('stroke-width', 5);
};

// Suscribirse a los datos de Looker Studio
dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});