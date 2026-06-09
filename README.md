# Computer Cleanup Dashboard

Tracks file count and disk usage of selected folders over time.

## Usage

1. Edit `config.yml` to list folders you want to monitor.
2. Run `./generate.rb` to take a snapshot and regenerate the dashboard.
3. Open `index.html` in a browser.

### From cron

```
0 6 * * * /path/to/computer-dashboard/generate.rb
```

## Files

| File | Purpose |
|---|---|
| `config.yml` | Monitored folders |
| `data.yml` | Historical snapshots (human-friendly) |
| `generate.rb` | Measurement + dashboard generator |
| `index.erb` | HTML template for the dashboard |
| `index.html` | Dashboard page (generated) |
| `style.css` | Dashboard styles |
| `script.js` | Chart rendering |
| `vendor/` | Vendored Chart.js |
