// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken = "YOUR_ACESS_TOKEN";

// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  // Replace YOUR_STYLE_URL with your style URL.
  style: "YOUR_STYLE_URL"
});