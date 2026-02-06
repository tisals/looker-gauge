const dscc = require('@google/dscc');
const d3 = require('d3');

function getStyleNumber(style, key) {
  return style && style[key] && style[key].value != null ? Number(style[key].value) : null;
}
function getStyleString(style, key) {
  return style && style[key] && style[key].value != null ? String(style[key].value) : '';
}
function getStyleColor(style, key, fallback) {
  return style && style[key] && style[key].value ? style[key].value : fallback;
}

function drawViz(data) {
  if (!data || !data.tables || !data.tables.DEFAULT) return;
  const table = data.tables.DEFAULT;
  if (!table || table.length === 0) return;

  document.body.innerHTML = '<div id="viz" style="width:100%;height:100%;"></div>';

  const width = dscc.getWidth();
  const height = dscc.getHeight();
  const container = d3.select('#viz');
  container.selectAll('*').remove();

  const value = Number(table[0].metric[0]) || 0;
  const title = table[0].dimension && table[0].dimension[0] ? table[0].dimension[0] : '';

  const style = data.style || {};
  const rawLevels = [];
  for (let i = 1; i <= 6; i++) {
    const v = getStyleNumber(style, `level${i}`);
    if (v !== null && !isNaN(v)) rawLevels.push(v);
  }
  rawLevels.sort((a,b)=>a-b);

  const maxValueStyle = getStyleNumber(style, 'maxValue') || 100;
  const maxValue = rawLevels.length ? Math.max(maxValueStyle, rawLevels[rawLevels.length-1]) : maxValueStyle;

  const labels = [];
  const colors = [];
  for (let i = 1; i <= rawLevels.length; i++) {
    labels.push( getStyleString(style, `label${i}`) || (`Nivel ${i}`) );
    colors.push( getStyleColor(style, `color${i}`, d3.schemeCategory10[i-1]) );
  }
  if (rawLevels.length === 0) {
    rawLevels.push(maxValue);
    labels.push('Valor');
    colors.push('#d1d5db');
  }

  const ranges = [0, ...rawLevels];
  if (ranges[ranges.length-1] < maxValue) ranges.push(maxValue);

  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height);

  const cx = width / 2;
  const cy = height * 0.85;
  const radius = Math.min(width, height * 1.6) * 0.38;

  const scale = d3.scaleLinear().domain([0, maxValue]).range([-Math.PI/2, Math.PI/2]).clamp(true);

  for (let i = 0; i < ranges.length - 1; i++) {
    const a0 = scale(ranges[i]);
    const a1 = scale(ranges[i+1]);
    const arc = d3.arc().innerRadius(radius * 0.66).outerRadius(radius).startAngle(a0).endAngle(a1);
    svg.append('path')
      .attr('d', arc)
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', colors[i] || colors[colors.length-1])
      .attr('stroke', '#fff');
  }

  const showLabels = data.style && data.style.showLabels && data.style.showLabels.value !== false;
  if (showLabels) {
    for (let i = 0; i < ranges.length - 1; i++) {
      const mid = (ranges[i] + ranges[i+1]) / 2;
      const px = cx + Math.cos(scale(mid) - Math.PI/2) * (radius * 0.45);
      const py = cy + Math.sin(scale(mid) - Math.PI/2) * (radius * 0.45);
      svg.append('text')
        .attr('x', px)
        .attr('y', py)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', Math.max(10, Math.min(14, width/60)))
        .text(labels[i] || '');
    }
  }

  const needleAngle = scale(value);
  const needleLen = radius * 0.72;
  const needle = svg.append('g').attr('transform', `translate(${cx},${cy})`);
  needle.append('line')
    .attr('x1', 0).attr('y1', 0)
    .attr('x2', needleLen * Math.sin(needleAngle))
    .attr('y2', -needleLen * Math.cos(needleAngle))
    .attr('stroke', getStyleColor(style, 'needleColor', '#2d3748'))
    .attr('stroke-width', Math.max(3, width/120))
    .attr('stroke-linecap', 'round');

  svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', Math.max(6, width/120)).attr('fill', getStyleColor(style, 'needleColor', '#2d3748'));

  svg.append('text')
    .attr('x', cx)
    .attr('y', cy - radius * 0.45)
    .attr('text-anchor', 'middle')
    .attr('font-size', Math.max(12, width/40))
    .attr('font-weight', '600')
    .text(title);

  svg.append('text')
    .attr('x', cx)
    .attr('y', cy - radius * 0.20)
    .attr('text-anchor', 'middle')
    .attr('font-size', Math.max(18, width/20))
    .attr('font-weight', '700')
    .text((Math.round(value * 10) / 10).toString().replace('.', ','));
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });