

const mapFeatures = {}

const fetchData = async () => {
  const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326"
  const res = await fetch(url)
  const data = await res.json()





    initMap(data)
    
}



const initMap = (data) =>{  

  var listedValues = getData();

  let map = L.map('map', {
    minZoom: -3
  })

  let geoJSON = L.geoJSON(data, {
    onEachFeature: getFeature,
    style: getStyle


  }).addTo(map)

 

  let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

 
listedValues.then(value => {
  for (var i = 2; i < value.length; i++) { 
    layer = mapFeatures[value[i][0]]
    layer.bindPopup(
    `<ul>
      <li>Arrivals : ${value[i][1]}</li>
      <li>Departures: ${value[i][2]}</li>
    </ul>`)

    colorHue = ((value[i][1]/value[i][2])**3*60)
    if(colorHue > 120) colorHue = 120;
    layer.setStyle({fillColor: "hsl("+colorHue+",75%,50%)"})
  }

}).catch(err => {
  console.log(err);
})



  map.fitBounds(geoJSON.getBounds())
}

colorLayers = () => {
  geoJSON.eachLayer(styleKunta())
}

getFeature = (feature, layer) => {
  
  if (!feature.id) return;

  
  var kuntaTag = feature.properties.kunta
  mapFeatures[kuntaTag] = layer;
  layer.bindTooltip(feature.properties.nimi)
  
}

getStyle = (feature) => {
  return{
    weight: 2
  }
}

getData = async () => {

  const urlPositive = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f"
  const resPositive = await fetch(urlPositive)
  const dataPositive = await resPositive.json()

  const urlNegative = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e"
  const resNegative = await fetch(urlNegative)
  const dataNegative = await resNegative.json()

  var dataPack = [[]]

  Object.keys(dataPositive.dataset.dimension.Tuloalue.category.label).forEach(key => {
    alkiot = [key.replace("KU",''), dataPositive.dataset.value[dataPositive.dataset.dimension.Tuloalue.category.index[key]]]
    dataPack.push(alkiot)

  });

  

  Object.keys(dataNegative.dataset.dimension.L??ht??alue.category.index).forEach(key => {
    negative = dataNegative.dataset.value[dataNegative.dataset.dimension.L??ht??alue.category.index[key]]  
    dataPack[dataNegative.dataset.dimension.L??ht??alue.category.index[key]+1].push(negative)
  });


return(dataPack);

}

fetchData();