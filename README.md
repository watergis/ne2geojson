# ne2geojson

This is a simple module to download shapefile from Natural Earth and convert them to GeoJSON in order to use for UNVT.

## Installation

```
npm i
```

## Usage

### Target data

`define.json`
```
[
  ["110m", "cultural", "ne_110m_admin_0_countries_lakes"],
  ["110m", "cultural", "ne_110m_admin_0_boundary_lines_land"],
  ["110m", "physical", "ne_110m_coastline"],
  ["110m", "physical", "ne_110m_ocean"],
  ["110m", "physical", "ne_110m_land"]
]
```

Please specify which data from Natural Earth you need.

### Download Shapefile from Natural Earth

```bash
$ node src/index.js download -h
Usage: index download [options] [output] [definition]

It is a CLI tool which can download shapefile from Natural Earth

Options:
  -h, --help  display help for command
```

```bash
npm run download -- $(pwd)/data $(pwd)/define.json
```

or

```bash
node src/index.js download $(pwd)/data $(pwd)/define.json
```