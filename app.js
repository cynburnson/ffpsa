// Title IV-E Prevention Plan Dashboard - Program Explorer
// Uses D3.js v7 and TopoJSON for US map rendering

// -----------------------------------------------------------------------------
// LOOKUPS
// -----------------------------------------------------------------------------

const STATE_BY_NAME = {};
ALL_DATA.forEach(s => { STATE_BY_NAME[s.name] = s; });

function buildProgramIndex() {
  const index = {};
  ALL_DATA.forEach(s => {
    s.programs.forEach(p => {
      if (!index[p]) index[p] = { name: p, states: [] };
      index[p].states.push(s.name);
    });
  });
  return Object.values(index);
}
const PROGRAM_INDEX = buildProgramIndex();

// -----------------------------------------------------------------------------
// TOOLTIP
// -----------------------------------------------------------------------------

const tooltip = d3.select('body').append('div').attr('class', 'tooltip');
function showTooltip(event, html) {
  tooltip.html(html).classed('visible', true)
    .style('left', (event.pageX + 12) + 'px')
    .style('top', (event.pageY - 30) + 'px');
}
function hideTooltip() { tooltip.classed('visible', false); }

// -----------------------------------------------------------------------------
// STATE
// -----------------------------------------------------------------------------

const US_TOPO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

let selectedProgram = null;
let programSortMode = 'popularity';
let programSearchQuery = '';
let mapReady = false;

function colorForStatus(status) {
  return status === 'approved' ? COLORS.approved
       : status === 'submitted' ? COLORS.submitted
       : COLORS.none;
}

// -----------------------------------------------------------------------------
// PROGRAM LIST
// -----------------------------------------------------------------------------

function renderProgramList() {
  let list = PROGRAM_INDEX.slice();
  if (programSearchQuery) {
    const q = programSearchQuery.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }
  if (programSortMode === 'popularity') {
    list.sort((a, b) => b.states.length - a.states.length || a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  const ul = document.getElementById('program-list');
  ul.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    li.className = 'program-item' + (selectedProgram === p.name ? ' selected' : '');
    li.innerHTML = `<span class="program-name">${p.name}</span><span class="program-count">${p.states.length}</span>`;
    li.addEventListener('click', () => selectProgram(p.name === selectedProgram ? null : p.name));
    ul.appendChild(li);
  });
}

function selectProgram(programName) {
  selectedProgram = programName;
  renderProgramList();
  updateMap();
  renderStateUsageList();
}

function renderStateUsageList() {
  const panel = document.getElementById('state-usage-panel');
  if (!selectedProgram) {
    panel.innerHTML = `<h3>States using a program</h3><p style="color:var(--gray);font-size:0.88rem;margin:0;">Select a program to see which states include it in their plan.</p>`;
    return;
  }
  const prog = PROGRAM_INDEX.find(p => p.name === selectedProgram);
  const stateNames = prog.states.slice().sort();
  panel.innerHTML = `
    <h3>${selectedProgram} <span style="color:var(--gray);font-weight:400;font-size:0.85rem;">(${stateNames.length} ${stateNames.length === 1 ? 'state/territory' : 'states/territories'})</span></h3>
    <div class="state-usage-list">
      ${stateNames.map(n => `<span class="state-chip">${n}</span>`).join('')}
    </div>
  `;
}

// -----------------------------------------------------------------------------
// MAP
// -----------------------------------------------------------------------------

async function initMap() {
  const resp = await fetch(US_TOPO_URL);
  const topo = await resp.json();
  const states = topojson.feature(topo, topo.objects.states).features;

  const svg = d3.select('#explorer-map');
  const width = 960, height = 560;
  svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

  const projection = d3.geoAlbersUsa().fitSize([width, height], { type: 'FeatureCollection', features: states });
  const path = d3.geoPath().projection(projection);

  svg.selectAll('path')
    .data(states)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('data-name', d => d.properties.name)
    .on('mouseenter', function(event, d) {
      const rec = STATE_BY_NAME[d.properties.name];
      if (!rec) return;
      const uses = selectedProgram && rec.programs.includes(selectedProgram);
      const msg = selectedProgram
        ? `<strong>${rec.name}</strong><br>${uses ? 'Includes ' + selectedProgram : 'Does not include ' + selectedProgram}`
        : `<strong>${rec.name}</strong><br>${rec.programs.length} program${rec.programs.length===1?'':'s'}`;
      showTooltip(event, msg);
    })
    .on('mousemove', function(event) {
      tooltip.style('left', (event.pageX + 12) + 'px').style('top', (event.pageY - 30) + 'px');
    })
    .on('mouseleave', hideTooltip);

  // Territory tiles
  const tContainer = d3.select('#explorer-territory-tiles');
  tContainer.selectAll('*').remove();
  TERRITORY_DATA.forEach(t => {
    tContainer.append('div')
      .attr('class', 'territory-tile')
      .attr('data-name', t.name)
      .style('background', colorForStatus(t.status))
      .text(t.name)
      .on('mouseenter', function(event) {
        const uses = selectedProgram && t.programs.includes(selectedProgram);
        const msg = selectedProgram
          ? `<strong>${t.name}</strong><br>${uses ? 'Includes ' + selectedProgram : 'Does not include ' + selectedProgram}`
          : `<strong>${t.name}</strong><br>${t.programs.length} program${t.programs.length===1?'':'s'}`;
        showTooltip(event, msg);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', (event.pageX + 12) + 'px').style('top', (event.pageY - 30) + 'px');
      })
      .on('mouseleave', hideTooltip);
  });

  mapReady = true;
  updateMap();
}

function updateMap() {
  if (!mapReady) return;

  d3.selectAll('#explorer-map path')
    .attr('fill', function(d) {
      const rec = STATE_BY_NAME[d.properties.name];
      if (!rec) return COLORS.none;
      if (!selectedProgram) return colorForStatus(rec.status);
      return rec.programs.includes(selectedProgram) ? COLORS.highlight : COLORS.none;
    })
    .classed('dimmed', function(d) {
      if (!selectedProgram) return false;
      const rec = STATE_BY_NAME[d.properties.name];
      return !rec || !rec.programs.includes(selectedProgram);
    });

  d3.selectAll('#explorer-territory-tiles .territory-tile')
    .style('background', function() {
      const name = d3.select(this).attr('data-name');
      const rec = STATE_BY_NAME[name];
      if (!rec) return COLORS.none;
      if (!selectedProgram) return colorForStatus(rec.status);
      return rec.programs.includes(selectedProgram) ? COLORS.highlight : COLORS.none;
    })
    .classed('dimmed', function() {
      if (!selectedProgram) return false;
      const name = d3.select(this).attr('data-name');
      const rec = STATE_BY_NAME[name];
      return !rec || !rec.programs.includes(selectedProgram);
    });
}

// -----------------------------------------------------------------------------
// CONTROLS
// -----------------------------------------------------------------------------

document.getElementById('program-search').addEventListener('input', e => {
  programSearchQuery = e.target.value;
  renderProgramList();
});
document.querySelectorAll('.sort-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    programSortMode = btn.dataset.sort;
    document.querySelectorAll('.sort-toggle button').forEach(b => b.classList.toggle('active', b === btn));
    renderProgramList();
  });
});

// -----------------------------------------------------------------------------
// INIT
// -----------------------------------------------------------------------------

renderProgramList();
renderStateUsageList();
initMap();
