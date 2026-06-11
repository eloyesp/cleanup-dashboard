const COLORS = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#fb923c'];
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

function chart(id, dataKey, yFmt) {
  const datasets = DATA[0].folders.map((f, i) => ({
    label: f.label,
    data: DATA.map(d => ({ x: new Date(d.timestamp).getTime(), y: d.folders[i][dataKey] })),
    borderColor: COLORS[i], backgroundColor: BG[i],
    tension: 0.3,
  }));
  new Chart(document.getElementById(id), {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: { x: xScale(), y: yScale(yFmt) },
    },
  });
}

chart('filesChart', 'files', v => v);
chart('sizeChart', 'size_bytes', formatBytes);

