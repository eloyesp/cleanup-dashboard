const COLORS = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#fb923c'];
const BG = COLORS.map(c => c + '33');
const timestamps = DATA.map(d => d.timestamp.slice(0, 10));

function formatBytes(b) {
  for (const u of ['B', 'KiB', 'MiB', 'GiB', 'TiB']) {
    if (b < 1024) return b.toFixed(1) + ' ' + u;
    b /= 1024;
  }
}

function chart(id, dataKey, yFmt) {
  const datasets = DATA[0].folders.map((f, i) => ({
    label: f.label, data: DATA.map(d => d.folders[i][dataKey]),
    borderColor: COLORS[i], backgroundColor: BG[i],
    tension: 0.3,
  }));
  new Chart(document.getElementById(id), {
    type: 'line',
    data: { labels: timestamps, datasets },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#334155' } },
        y: { ticks: { color: '#64748b', callback: yFmt }, grid: { color: '#334155' } },
      },
    },
  });
}

chart('filesChart', 'files', v => v);
chart('sizeChart', 'size_bytes', formatBytes);

DATA[0].folders.forEach((f, i) => {
  const d = DATA.map(s => s.folders[i]);
  const opts = (yFmt, id) => ({
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        data: d.map(p => p[id]),
        borderColor: COLORS[i], backgroundColor: BG[i],
        tension: 0.3, pointRadius: 2,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#334155' } },
        y: { ticks: { color: '#64748b', callback: yFmt }, grid: { color: '#334155' } },
      },
    },
  });
  new Chart(document.getElementById('chart-' + i + '-files'), opts(v => v, 'files'));
  new Chart(document.getElementById('chart-' + i + '-size'), opts(formatBytes, 'size_bytes'));
});
