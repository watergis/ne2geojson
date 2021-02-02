const geojsonArea = require('@mapbox/geojson-area')

module.exports = (f) => {
  if (!f.geometry)return null;

  f = setMinMaxZoom(f);
  f.tippecanoe.layer = f.file

  // property name to be lowercase
  let props = {};
  Object.keys(f.properties).forEach(k=>{
    props[k.toLowerCase()] = f.properties[k];
  })
  f.properties = props;

  // name
  if (
    f.properties.hasOwnProperty('name_en') ||
    f.properties.hasOwnProperty('name_fr') ||
    f.properties.hasOwnProperty('name_es') ||
    f.properties.hasOwnProperty('name_pt') ||
    f.properties.hasOwnProperty('name_ar') ||
    f.properties.hasOwnProperty('name_ja') ||
    f.properties.hasOwnProperty('name_ko') ||
    f.properties.hasOwnProperty('name_zh')
  ) {
    for (const key in f.properties) {
      if (key.match(/name_/)) {
        if (![
          'name_en',
          'name_fr',
          'name_es',
          'name_pt',
          'name_ar',
          'name_ja',
          'name_ko',
          'name_zh'
        ].includes(key)){
          delete f.properties[key]
        }
      }
    }
  }

  f = ocean(f) ||
    coastline(f) ||
    administrative(f) ||
    land(f) ||
    water(f) ||
    boundary(f) ||
    populated_area(f) ||
    place(f) ||
    urban_area(f) ||
    playas(f) ||
    glaciated_areas(f);
  // if (f)console.log(`\x1e${JSON.stringify(f)}\n`)
  return f
}

const setMinMaxZoom = (f) =>{
  let minzoom;
  if (f.properties['min_zoom']){
    minzoom = f.properties['min_zoom'];
  }
  minzoom = Math.ceil(minzoom);
  let maxzoom = 5;
   if (f.file.indexOf('110m') > 0){
    if (!minzoom){
      minzoom = 0
    }
    maxzoom = 2
  }else if (f.file.indexOf('50m') > 0){
    if (!minzoom){
      minzoom = 3
    }
    maxzoom = 4
  }else if (f.file.indexOf('10m') > 0){
    if (!minzoom){
      minzoom = 5
    }
    maxzoom = 10
  }
  if (minzoom > maxzoom){
    minzoom = maxzoom;
  }
  f.tippecanoe = {
    minzoom: minzoom,
    maxzoom: maxzoom
  }
  return f;
}

const ocean = (f)=>{
  if ([
    'ne_110m_ocean',
    'ne_50m_ocean',
    'ne_10m_ocean'
  ].includes(f.file)){
    f.tippecanoe.layer = 'ocean'
    return f;
  }
  return null;
}

const coastline = (f)=>{
  if ([
    'ne_110m_coastline',
    'ne_50m_coastline',
    'ne_10m_coastline',
    'ne_10m_minor_islands_coastline'
  ].includes(f.file)){
    f.tippecanoe.layer = 'coastline'
    return f;
  }
  return null;
}

const administrative = (f)=>{
  if ([
    'ne_110m_admin_0_countries',
    'ne_110m_admin_0_countries_lakes',
    'ne_50m_admin_0_countries',
    'ne_50m_admin_0_countries_lakes',
    'ne_10m_admin_0_countries',
    'ne_10m_admin_0_countries_lakes',
    'ne_110m_admin_1_states_provinces',
    'ne_110m_admin_1_states_provinces_lakes',
    'ne_50m_admin_1_states_provinces',
    'ne_50m_admin_1_states_provinces_lakes',
    'ne_10m_admin_1_states_provinces',
    'ne_10m_admin_1_states_provinces_lakes',
  ].includes(f.file)){
    f.tippecanoe.layer = 'administrative'
    return f;
  }
  return null;
}

const land = (f)=>{
  if ([
    'ne_110m_land',
    'ne_50m_land',
    'ne_10m_land',
    'ne_10m_minor_islands'
  ].includes(f.file)){
    f.tippecanoe.layer = 'land'
    return f;
  }
  return null;
}

const boundary = (f)=>{
  if ([
    'ne_110m_admin_0_boundary_lines_land',
    'ne_50m_admin_0_boundary_lines_land',
    'ne_10m_admin_0_boundary_lines_land',
    'ne_110m_admin_1_states_provinces_lines',
    'ne_50m_admin_1_states_provinces_lines',
    'ne_10m_admin_1_states_provinces_lines'
  ].includes(f.file)){
    f.tippecanoe.layer = 'boundary'
    return f;
  }
  return null;
}

const water = (f)=>{
  if ([
    'ne_110m_rivers_lake_centerlines',
    'ne_110m_lakes',
    'ne_50m_rivers_lake_centerlines',
    'ne_50m_lakes',
    'ne_50m_lakes_historic',
    'ne_10m_rivers_lake_centerlines',
    'ne_10m_lakes',
    'ne_10m_lakes_historic',
    'ne_10m_lakes_pluvial',
  ].includes(f.file)){
    f.tippecanoe.layer = 'water'
    return f;
  }
  return null;
}

const populated_area = (f)=>{
  if ([
    'ne_50m_populated_places',
    'ne_50m_populated_places_simple',
  ].includes(f.file)){
    f.tippecanoe.layer = 'populated_area'
    return f;
  }
  return null;
}

const place = (f)=>{
  if (f.geometry.type !== 'Point') return null
  if ([
    'ne_50m_airports',
    'ne_10m_airports',
  ].includes(f.file)){
    f.tippecanoe.layer = 'place';
    f.properties.place = 'airports';
    return f;
  }else if ([
    'ne_50m_ports',
    'ne_10m_ports',
  ].includes(f.file)){
    f.tippecanoe.layer = 'place';
    f.properties.place = 'ports';
    return f;
  }
  return null;
}

const urban_area = (f)=>{
  if ([
    'ne_50m_urban_areas',
    'ne_10m_urban_areas',
  ].includes(f.file)){
    f.tippecanoe.layer = 'urban_area'
    return f;
  }
  return null;
}

const playas = (f)=>{
  if ([
    'ne_50m_playas',
    'ne_10m_playas',
  ].includes(f.file)){
    f.tippecanoe.layer = 'playas'
    return f;
  }
  return null;
}

const glaciated_areas = (f)=>{
  if ([
    'ne_110m_glaciated_areas',
    'ne_50m_glaciated_areas',
    'ne_10m_glaciated_areas'
  ].includes(f.file)){
    f.tippecanoe.layer = 'glaciated_areas'
    return f;
  }
  return null;
}