const deepcopy = require('deepcopy');
const turf = require('@turf/turf');


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
    f.properties.hasOwnProperty('name_zh') ||
    f.properties.hasOwnProperty('name')
  ) {
    let name;
    if ('name_en' in f.properties){
      name = f.properties['name_en']
    }else if ('name_fr' in f.properties){
      name = f.properties['name_fr']
    }else if ('name_es' in f.properties){
      name = f.properties['name_es']
    }else if ('name_pt' in f.properties){
      name = f.properties['name_pt']
    }else if ('name_ar' in f.properties){
      name = f.properties['name_ar']
    }else if ('name_ja' in f.properties){
      name = f.properties['name_ja']
    }else if ('name_ko' in f.properties){
      name = f.properties['name_ko']
    }else if ('name_zh' in f.properties){
      name = f.properties['name_zh']
    }else if ('name' in f.properties){
      name = f.properties['name']
    }
    f.properties['name'] = name;

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

  // delete properties except name columns
  Object.keys(f.properties).forEach(k=>{
    if (!k.match(/name/)) {
      delete f.properties[k];
    }
  })

  f = ocean(f) ||
    coastline(f) ||
    country(f) ||
    province(f) ||
    land(f) ||
    snow(f) ||
    water(f) ||
    boundary(f) ||
    place(f) ||
    urban_area(f) ||
    playas(f);
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

const country = (f)=>{
  if ([
    'ne_110m_admin_0_countries',
    'ne_110m_admin_0_countries_lakes',
    'ne_50m_admin_0_countries',
    'ne_50m_admin_0_countries_lakes',
    'ne_10m_admin_0_countries',
    'ne_10m_admin_0_countries_lakes',
  ].includes(f.file)){
    f.tippecanoe.layer = 'country'
    
    let features = [f];
    const centroid = contry_annotation(f);
    if (centroid) features.push(centroid);
    return features;
  }
  return null;
}

const contry_annotation = (org) =>{
  let f = deepcopy(org);
  let centroid;
  switch (f.geometry.type){
    case 'Polygon':
      centroid = turf.centroid(f);
      break;
    case 'MultiPolygon':
      let largest_polygon;
      let largest_area;
      f.geometry.coordinates.forEach(c1=>{
        let poly = turf.polygon(c1)
        console.log(JSON.stringify(poly))
        let current_area = turf.area(poly);
        console.log(current_area)
        if (!largest_polygon){
          largest_polygon = poly
          largest_area = current_area
        }else{
          if (current_area > largest_area){
            largest_polygon = poly
            largest_area = current_area
          }
        }
      })
      centroid = turf.centroid(largest_polygon);
      break;
    default:
      break;
  }
  if (!centroid){
    return null;
  }
  f.geometry = centroid.geometry;
  f.tippecanoe = deepcopy(org.tippecanoe);
  f.tippecanoe.layer = 'country_annotation';
  f.properties = deepcopy(org.properties)
  return f
}

const province = (f)=>{
  if ([
    'ne_110m_admin_1_states_provinces',
    'ne_110m_admin_1_states_provinces_lakes',
    'ne_50m_admin_1_states_provinces',
    'ne_50m_admin_1_states_provinces_lakes',
    'ne_10m_admin_1_states_provinces',
    'ne_10m_admin_1_states_provinces_lakes',
  ].includes(f.file)){
    f.tippecanoe.layer = 'province'
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
    f.tippecanoe.layer = 'land';
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
    'ne_10m_rivers_lake_centerlines',
    'ne_10m_lakes',
  ].includes(f.file)){
    f.tippecanoe.layer = 'water'
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
  }else if ([
    'ne_110m_geography_regions_points',
    'ne_50m_geography_regions_points',
    'ne_10m_geography_regions_points'
  ].includes(f.file)){
    f.tippecanoe.layer = 'place';
    f.properties.place = 'regions';
    return f;
  }else if ([
    'ne_110m_geography_regions_elevation_points',
    'ne_50m_geography_regions_elevation_points',
    'ne_10m_geography_regions_elevation_points'
  ].includes(f.file)){
    f.tippecanoe.layer = 'place';
    f.properties.place = 'mountains';
    return f;
  }else if (f.file.indexOf('populated_places') > -1){
    if (f.file.indexOf('110m') > -1){
      f.tippecanoe.minzoom = 3;
      f.tippecanoe.maxzoom = 3;
    }else if (f.file.indexOf('50m') > -1){
      f.tippecanoe.minzoom = 4;
      f.tippecanoe.maxzoom = 4;
    }else if (f.file.indexOf('10m') > -1){
      f.tippecanoe.minzoom = 5;
      f.tippecanoe.maxzoom = 7;
    }
    f.tippecanoe.layer = 'place';
    f.properties.place = 'city';
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

const snow = (f)=>{
  if ([
    'ne_110m_glaciated_areas',
    'ne_50m_glaciated_areas',
    'ne_10m_glaciated_areas'
  ].includes(f.file)){
    f.tippecanoe.layer = 'snow'
    return f;
  }
  return null;
}