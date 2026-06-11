#!/usr/bin/env ruby

require 'yaml'
require 'json'
require 'find'
require 'erb'
require 'shellwords'
require 'time'
require 'fileutils'

Dir.chdir(__dir__)

DATA_FILE = 'data.yml'
CONFIG_FILE = 'config.yml'
SAMPLE_FILE = 'sample.data.json'
TEMPLATE = 'index.erb'
OUTPUT = 'index.html'

def generate(data, timestamp, folders)
  data_json = data.to_json
  template = ERB.new(File.read(TEMPLATE), trim_mode: '-')
  File.write(OUTPUT, template.result(binding))
end

unless File.exist?(CONFIG_FILE)
  data = JSON.parse(File.read(SAMPLE_FILE))
  snapshot = data.last
  generate(data, snapshot['timestamp'], snapshot['folders'])
  puts "Demo mode — generated #{OUTPUT} from sample data"
  exit 0
end

config = YAML.load_file(CONFIG_FILE)
data = File.exist?(DATA_FILE) ? YAML.load_file(DATA_FILE) : []

entries = config['folders'].map do |folder|
  path = File.expand_path(folder['path'])
  label = folder['label']

  unless Dir.exist?(path)
    warn "warning: #{path} does not exist, skipping"
    next { 'label' => label, 'files' => 0, 'size_bytes' => 0 }
  end

  files = 0
  Find.find(path) { |f| files += 1 if File.file?(f) }

  size = `du -sb #{path.shellescape}`.split.first.to_i

  { 'label' => label, 'files' => files, 'size_bytes' => size }
end

snapshot = { 'timestamp' => Time.now.iso8601, 'folders' => entries }
data << snapshot

File.write(DATA_FILE, data.to_yaml)
generate(data, snapshot['timestamp'], snapshot['folders'])
