const root = getComputedStyle(document.documentElement);
const COLORS = [0,1,2,3,4,5].map(i => root.getPropertyValue(`--color-${i}`).trim());
const BG = COLORS.map(c => c + '33');

function fmtDate(ms) {
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatBytes(b) {
  for (const u of ['B', 'KiB', 'MiB', 'GiB', 'TiB']) {
    if (b < 1024) return b.toFixed(1) + ' ' + u;
    b /= 1024;
  }
}

function xScale() {
  return {
    type: 'linear',
    ticks: { color: '#64748b', callback: fmtDate },
    grid: { color: '#334155' },
  };
}

function yScale(yFmt) {
  return {
    ticks: { color: '#64748b', callback: yFmt },
    grid: { color: '#334155' },
  };
}

function mergedChart() {
  const datasets = [];
  DATA[0].folders.forEach((f, i) => {
    datasets.push({
      label: f.label,
      data: DATA.map(d => ({ x: new Date(d.timestamp).getTime(), y: d.folders[i].files })),
      borderColor: COLORS[i], backgroundColor: BG[i],
      tension: 0.3, yAxisID: 'y',
    });
    datasets.push({
      label: f.label,
      data: DATA.map(d => ({ x: new Date(d.timestamp).getTime(), y: d.folders[i].size_bytes })),
      borderColor: COLORS[i], backgroundColor: BG[i],
      borderDash: [5, 3], tension: 0.3, yAxisID: 'y1',
    });
  });
  new Chart(document.getElementById('mergedChart'), {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', filter: (item) => item.datasetIndex % 2 === 0 } } },
      scales: {
        x: xScale(),
        y: yScale(v => v),
        y1: { position: 'right', ticks: { color: '#64748b', callback: formatBytes }, grid: { drawOnChartArea: false } },
      },
    },
  });
}

mergedChart();

