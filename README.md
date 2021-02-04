# ne2geojson

This is a simple module to download shapefile from Natural Earth and convert them to GeoJSON in order to use for UNVT.

## Installation

```
npm i
```

## Usage

### Configuration

You can use `config_all.json` to create your own `config.json` by deleting unnecessary data for tiles.

<details>

```json
[
  ["110m", "cultural", "ne_110m_admin_0_countries"],
  ["110m", "cultural", "ne_110m_admin_0_countries_lakes"],
  ["110m", "cultural", "ne_110m_admin_0_sovereignty"],
  ["110m", "cultural", "ne_110m_admin_0_map_units"],
  ["110m", "cultural", "ne_110m_admin_0_scale_rank"],
  ["110m", "cultural", "ne_110m_admin_0_tiny_countries"],
  ["110m", "cultural", "ne_110m_admin_0_boundary_lines_land"],
  ["110m", "cultural", "ne_110m_admin_0_pacific_groupings"],
  ["110m", "cultural", "ne_110m_admin_1_states_provinces"],
  ["110m", "cultural", "ne_110m_admin_1_states_provinces_lakes"],
  ["110m", "cultural", "ne_110m_admin_1_states_provinces_lines"],
  ["110m", "cultural", "ne_110m_populated_places"],
  ["110m", "cultural", "ne_110m_populated_places_simple"],
  ["110m", "physical", "ne_110m_coastline"],
  ["110m", "physical", "ne_110m_land"],
  ["110m", "physical", "ne_110m_ocean"],
  ["110m", "physical", "ne_110m_rivers_lake_centerlines"],
  ["110m", "physical", "ne_110m_lakes"],
  ["110m", "physical", "ne_110m_geography_regions_polys"],
  ["110m", "physical", "ne_110m_geography_regions_points"],
  ["110m", "physical", "ne_110m_geography_regions_elevation_points"],
  ["110m", "physical", "ne_110m_geography_marine_polys"],
  ["110m", "physical", "ne_110m_glaciated_areas"],
  ["50m", "physical", "ne_50m_coastline"],
  ["50m", "physical", "ne_50m_land"],
  ["50m", "physical", "ne_50m_ocean"],
  ["50m", "physical", "ne_50m_rivers_lake_centerlines"],
  ["50m", "physical", "ne_50m_rivers_lake_centerlines_scale_rank"],
  ["50m", "physical", "ne_50m_lakes"],
  ["50m", "physical", "ne_50m_lakes_historic"],
  ["50m", "physical", "ne_50m_geography_regions_polys"],
  ["50m", "physical", "ne_50m_geography_regions_points"],
  ["50m", "physical", "ne_50m_geography_regions_elevation_points"],
  ["50m", "physical", "ne_50m_geography_marine_polys"],
  ["50m", "physical", "ne_50m_playas"],
  ["50m", "physical", "ne_50m_glaciated_areas"],
  ["50m", "cultural", "ne_50m_admin_0_countries"],
  ["50m", "cultural", "ne_50m_admin_0_countries_lakes"],
  ["50m", "cultural", "ne_50m_admin_1_states_provinces"],
  ["50m", "cultural", "ne_50m_admin_1_states_provinces_lakes"],
  ["50m", "cultural", "ne_50m_admin_1_states_provinces_lines"],
  ["50m", "cultural", "ne_50m_populated_places"],
  ["50m", "cultural", "ne_50m_populated_places_simple"],
  ["50m", "cultural", "ne_50m_airports"],
  ["50m", "cultural", "ne_50m_ports"],
  ["50m", "cultural", "ne_50m_urban_areas"],
  ["10m", "physical", "ne_10m_coastline"],
  ["10m", "physical", "ne_10m_land"],
  ["10m", "physical", "ne_10m_minor_islands"],
  ["10m", "physical", "ne_10m_minor_islands_coastline"],
  ["10m", "physical", "ne_10m_reefs"],
  ["10m", "physical", "ne_10m_ocean"],
  ["10m", "physical", "ne_10m_rivers_lake_centerlines"],
  ["10m", "physical", "ne_10m_rivers_lake_centerlines_scale_rank"],
  ["10m", "physical", "ne_10m_lakes"],
  ["10m", "physical", "ne_10m_lakes_historic"],
  ["10m", "physical", "ne_10m_lakes_pluvial"],
  ["10m", "physical", "ne_10m_geography_regions_polys"],
  ["10m", "physical", "ne_10m_geography_regions_points"],
  ["10m", "physical", "ne_10m_geography_regions_elevation_points"],
  ["10m", "physical", "ne_10m_geography_marine_polys"],
  ["10m", "physical", "ne_10m_playas"],
  ["10m", "physical", "ne_10m_glaciated_areas"],
  ["10m", "cultural", "ne_10m_admin_0_countries"],
  ["10m", "cultural", "ne_10m_admin_0_countries_lakes"],
  ["10m", "cultural", "ne_10m_admin_1_states_provinces"],
  ["10m", "cultural", "ne_10m_admin_1_states_provinces_lakes"],
  ["10m", "cultural", "ne_10m_admin_1_states_provinces_lines"],
  ["10m", "cultural", "ne_10m_airports"],
  ["10m", "cultural", "ne_10m_ports"],
  ["10m", "cultural", "ne_10m_urban_areas"]
]
```

</details>

Please specify which data from Natural Earth you need.

You can delete unnecessary data from `config/config_all.json`.

### How to generate

```bash
$ node src/index.js -h
Usage: index [options] [command]

Options:
  -V, --version                   output the version number
  -h, --help                      display help for command

Commands:
  download [output] [definition]  It is a CLI tool which can download shapefile from Natural Earth
  convert                         It is a CLI tool which can convert Shapefile to GeoJSON
  help [command]                  display help for command
```

#### Download Shapefile from Natural Earth

```bash
node src/index.js download $(pwd)/data $(pwd)/config/config.json
```

#### Convert to GeoJSON

```bash
node src/index.js download $(pwd)/data $(pwd)/config/config.json | node src/index.js convert > test.geojson
```

#### Convert to mbtiles through tippecanoe
```
node src/index.js download $(pwd)/data $(pwd)/config/config.json | node src/index.js convert | tippecanoe --no-feature-limit --no-tile-size-limit --force --simplification=2 --maximum-zoom=5 --base-zoom=5 --hilbert --output=tiles.mbtiles
```

You can use this module together with `unvt/naru`.

## Development

### Build mbtiles

```
npm run dev:tiles
```

### Extract pbf under `docs/zxy`

```
npm run dev:extract
```

### Build style.json

```
npm run dev:style
```

### Deploy to gh-pages

```
npm run dev:deploy
```

## License

This source code is under `MIT license`.

---
`Copyright (c) 2021 Jin IGARASHI`