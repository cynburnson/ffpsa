// Title IV-E Prevention Plan Dashboard - Application Logic
// Uses D3.js v7 and TopoJSON for US map rendering

// -----------------------------------------------------------------------------
// LOOKUPS
// -----------------------------------------------------------------------------

// Map state NAMES (as they appear in TopoJSON) to our data records
const STATE_BY_NAME = {};
ALL_DATA.forEach(s => { STATE_BY_NAME[s.name] = s; });

// Build list of unique programs with state counts
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
// TAB NAVIGATION
// -----------------------------------------------------------------------------

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === target));
    // Lazy-init the explorer map first time it's shown (needs layout)
    if (target === 'view-explorer' && !explorerMapInitialized) initExplorerMap();
  });
});

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
// VIEW 1: US MAP
// -----------------------------------------------------------------------------

const US_TOPO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

let mapTopo = null;    // cached topojson
let mainMapRendered = false;
let selectedStateName = null;

function colorForStatus(status) {
  return status === 'approved' ? COLORS.approved
       : status === 'submitted' ? COLORS.submitted
       : COLORS.none;
}

async function loadTopo() {
  if (mapTopo) return mapTopo;
  const resp = await fetch(US_TOPO_URL);
  mapTopo = await resp.json();
  return mapTopo;
}

async function renderMainMap() {
  if (mainMapRendered) return;
  const topo = await loadTopo();
  const states = topojson.feature(topo, topo.objects.states).features;

  const svg = d3.select('#us-map');
  const width = 960, height = 600;
  svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

  const projection = d3.geoAlbersUsa().fitSize([width, height], { type: 'FeatureCollection', features: states });
  const path = d3.geoPath().projection(projection);

  svg.selectAll('path')
    .data(states)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => {
      const rec = STATE_BY_NAME[d.properties.name];
      return rec ? colorForStatus(rec.status) : COLORS.none;
    })
    .attr('data-name', d => d.properties.name)
    .on('mouseenter', function(event, d) {
      const rec = STATE_BY_NAME[d.properties.name];
      if (!rec) return;
      const count = rec.programs.length;
      showTooltip(event, `<strong>${rec.name}</strong><br>${STATUS_LABEL[rec.status]}${count ? ` · ${count} program${count===1?'':'s'}` : ''}`);
    })
    .on('mousemove', function(event) {
      tooltip.style('left', (event.pageX + 12) + 'px').style('top', (event.pageY - 30) + 'px');
    })
    .on('mouseleave', hideTooltip)
    .on('click', function(event, d) {
      selectState(d.properties.name);
    });

  renderTerritoryTiles();
  mainMapRendered = true;
}

function renderTerritoryTiles() {
  const container = d3.select('#territory-tiles');
  container.selectAll('*').remove();

  TERRITORY_DATA.forEach(t => {
    container.append('div')
      .attr('class', 'territory-tile')
      .attr('data-name', t.name)
      .style('background', colorForStatus(t.status))
      .text(t.name)
      .on('mouseenter', function(event) {
        const count = t.programs.length;
        showTooltip(event, `<strong>${t.name}</strong><br>${STATUS_LABEL[t.status]}${count ? ` · ${count} program${count===1?'':'s'}` : ''}`);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', (event.pageX + 12) + 'px').style('top', (event.pageY - 30) + 'px');
      })
      .on('mouseleave', hideTooltip)
      .on('click', () => selectState(t.name));
  });
}

function selectState(name) {
  selectedStateName = name;
  d3.selectAll('#us-map path').classed('selected', d => d && d.properties.name === name);
  d3.selectAll('.territory-tile').classed('selected', function() {
    return d3.select(this).attr('data-name') === name;
  });
  renderDetailPanel(name);
}

function renderDetailPanel(name) {
  const rec = STATE_BY_NAME[name];
  const panel = document.getElementById('detail-panel');
  if (!rec) {
    panel.classList.add('empty');
    panel.innerHTML = 'Click a state or territory to see its prevention plan details.';
    return;
  }
  panel.classList.remove('empty');
  const planYears = rec.planYears ? `<div class="plan-years">${rec.planYears}</div>` : '';
  const programsHtml = rec.programs.length
    ? `<div class="programs-heading">Approved EBPs (${rec.programs.length})</div>
       <ul>${rec.programs.map(p => `<li>${p}</li>`).join('')}</ul>`
    : `<div class="no-programs">No program details available.</div>`;
  panel.innerHTML = `
    <h2>${rec.name}</h2>
    <div class="status-badge" style="background:${colorForStatus(rec.status)}">${STATUS_LABEL[rec.status]}</div>
    ${planYears}
    ${programsHtml}
  `;
}

// Initial empty state
document.getElementById('detail-panel').classList.add('empty');
document.getElementById('detail-panel').innerHTML = 'Click a state or territory to see its prevention plan details.';

// -----------------------------------------------------------------------------
// VIEW 2: PROGRAM EXPLORER
// -----------------------------------------------------------------------------

let explorerMapInitialized = false;
let selectedProgram = null;
let programSortMode = 'popularity'; // or 'alpha'
let programSearchQuery = '';

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
  updateExplorerMap();
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

async function initExplorerMap() {
  const topo = await loadTopo();
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

  // Territory tiles for explorer
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

  explorerMapInitialized = true;
  updateExplorerMap();
}

function updateExplorerMap() {
  if (!explorerMapInitialized) return;

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

// Explorer search + sort controls
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
// VIEW 3: COMPARISON TABLE
// -----------------------------------------------------------------------------

let tableSort = { key: 'name', dir: 'asc' };
let tableSearchQuery = '';
let tableStatusFilter = 'all';

function renderTable() {
  let rows = ALL_DATA.slice();

  if (tableStatusFilter !== 'all') {
    rows = rows.filter(r => r.status === tableStatusFilter);
  }
  if (tableSearchQuery) {
    const q = tableSearchQuery.toLowerCase();
    rows = rows.filter(r => r.name.toLowerCase().includes(q));
  }

  rows.sort((a, b) => {
    let av, bv;
    switch (tableSort.key) {
      case 'name': av = a.name; bv = b.name; break;
      case 'status': av = a.status; bv = b.status; break;
      case 'planYears': av = a.planYears || ''; bv = b.planYears || ''; break;
      case 'count': av = a.programs.length; bv = b.programs.length; break;
      default: av = a.name; bv = b.name;
    }
    if (av < bv) return tableSort.dir === 'asc' ? -1 : 1;
    if (av > bv) return tableSort.dir === 'asc' ? 1 : -1;
    return 0;
  });

  const tbody = document.getElementById('comparison-tbody');
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td><span class="status-pill" style="background:${colorForStatus(r.status)}">${STATUS_LABEL[r.status]}</span></td>
      <td>${r.planYears || '<span style="color:var(--gray)">—</span>'}</td>
      <td>${r.programs.length}</td>
      <td class="programs-cell">${r.programs.length ? r.programs.join(', ') : '<span style="color:var(--gray)">—</span>'}</td>
    </tr>
  `).join('');

  document.getElementById('row-count').textContent = `${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`;

  // Update sort indicators
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.classList.toggle('sorted', th.dataset.sort === tableSort.key);
    const indicator = th.querySelector('.sort-indicator');
    if (th.dataset.sort === tableSort.key) {
      indicator.textContent = tableSort.dir === 'asc' ? '▲' : '▼';
    } else {
      indicator.textContent = '▲▼';
    }
  });
}

document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (tableSort.key === key) {
      tableSort.dir = tableSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      tableSort.key = key;
      tableSort.dir = 'asc';
    }
    renderTable();
  });
});

document.getElementById('table-search').addEventListener('input', e => {
  tableSearchQuery = e.target.value;
  renderTable();
});
document.getElementById('status-filter').addEventListener('change', e => {
  tableStatusFilter = e.target.value;
  renderTable();
});

// -----------------------------------------------------------------------------
// INIT
// -----------------------------------------------------------------------------

renderMainMap();
renderProgramList();
renderStateUsageList();
renderTable();
