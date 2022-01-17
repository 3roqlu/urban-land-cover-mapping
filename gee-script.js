//Load MODIS/MOD11A2
var collection = ee.ImageCollection('MODIS/006/MOD11A2')
	.filterDate('2001-01-01', '2018-12-31')    
	.filter(ee.Filter.dayOfYear(181, 240))   //select summer months
	.filterBounds(geometry)
print(collection);


//Function to transform T in Kelvin using scaling factor as provided with the link
function convertToC(image){
  var result = image.multiply(0.02)
  .subtract(273.15); 
  result = result.copyProperties(image, ['system:time_start']) ;
  return result;
}
var collectionCelcius = collection.map(convertToC);

	
// Calculate mean LST
var LSTmean = collectionCelcius.select('LST_Day_1km').mean();
Map.addLayer(LSTmean.clip(geometry), {
  min: 20, max: 40,
  palette: ['green', 'yellow', 'darkorange', 'red']},
  'Mean temperature, 2015');




//Create LST vs time for an aoi
var plot = Chart.image.series(collectionCelcius.select('LST_Day_1km'), aoi, ee.Reducer.mean(), 1000)
  .setChartType('ScatterChart')
  .setOptions({
          title: 'LST trend temporally aggregated',
          fontSize: 12,
          lineWidth: 0,
          pointSize: 1,
          legend: { position: 'bottom' },
          vAxis: {title: 'LST'},
          hAxis: {title: 'Date'},
          });

print(plot);
