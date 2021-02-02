const geojsonArea = require('@mapbox/geojson-area')

module.exports = (f) => {
  if (!f.geometry)return null;

  f = setMinMaxZoom(f);
  f.tippecanoe.layer = f.file

  return ocean(f) ||
    coastline(f) ||
    administrative(f) ||
    land(f) ||
    boundary(f) ||
    water(f) ||
    populated_area(f) ||
    airports(f) ||
    ports(f) ||
    urban_area(f) ||
    playas(f) ||
    glaciated_areas(f)
}

const setMinMaxZoom = (f) =>{
  if (f.file.indexOf('110m') > 0){
    f.tippecanoe = {
      minzoom: 1,
      maxzoom: 2
    }
  }else if (f.file.indexOf('50m') > 0){
    f.tippecanoe = {
      minzoom: 3,
      maxzoom: 4
    }
  }else if (f.file.indexOf('10m') > 0){
    f.tippecanoe = {
      minzoom: 5,
      maxzoom: 5
    }
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
  }else{
    return null;
  }
  
  return f;
}

const coastline = (f)=>{
  if ([
    'ne_110m_coastline',
    'ne_50m_coastline',
    'ne_10m_coastline',
    'ne_10m_minor_islands_coastline'
  ].includes(f.file)){
    f.tippecanoe.layer = 'coastline'
  }else{
    return null;
  }
  
  return f;
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
  }else{
    return null
  }
  
  return f;
}

const land = (f)=>{
  if ([
    'ne_110m_land',
    'ne_50m_land',
    'ne_10m_land',
    'ne_10m_minor_islands'
  ].includes(f.file)){
    f.tippecanoe.layer = 'land'
  }else{
    return null
  }
  
  return f;
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
  }else{
    return null
  }
  
  return f
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
  }else{
    return null
  }
  return f
}

const populated_area = ()=>{
  if ([
    'ne_50m_populated_places',
    'ne_50m_populated_places_simple',
  ].includes(f.file)){
    f.tippecanoe.layer = 'populated_area'
  }else{
    return null
  }
  
  return f
}

const airports = ()=>{
  if (f.geometry.type !== 'Point') return null
  if ([
    'ne_50m_airports',
    'ne_10m_airports',
  ].includes(f.file)){
    f.tippecanoe.layer = 'airports'
  }else{
    return null
  }
  
  return f
}

const ports = ()=>{
  if (f.geometry.type !== 'Point') return null
  if ([
    'ne_50m_ports',
    'ne_10m_ports',
  ].includes(f.file)){
    f.tippecanoe.layer = 'ports'
  }else{
    return null
  }
  return f
}

const urban_area = ()=>{
  if ([
    'ne_50m_urban_areas',
    'ne_10m_urban_areas',
  ].includes(f.file)){
    f.tippecanoe.layer = 'urban_area'
  }else{
    return null
  }
  return f
}

const playas = ()=>{
  if ([
    'ne_50m_playas',
    'ne_10m_playas',
  ].includes(f.file)){
    f.tippecanoe.layer = 'playas'
  }else{
    return null
  }
  return f
}

const glaciated_areas = ()=>{
  if ([
    'ne_110m_glaciated_areas',
    'ne_50m_glaciated_areas',
    'ne_10m_glaciated_areas'
  ].includes(f.file)){
    f.tippecanoe.layer = 'glaciated_areas'
  }else{
    return null
  }
  return f
}