// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoiemhlbmxpbndhbmciLCJhIjoiY201d2l3bnBsMGJyaTJrcXU0YjF3eWl3cSJ9.JM6Sr28yqNuOs30yUg-drQ";

const style_2022 = "mapbox://styles/zhenlinwang/cm6o7rpmn00h901sd3frd2qiq";

const style_2024 = "mapbox://styles/zhenlinwang/cm6o8acoz000m01s6e32e74mq";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: style_2022,
  center: [-0.089932, 51.514441],
  zoom: 14
});

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

//On click the radio button, toggle the style of the map.
for (const input of inputs) {
  input.onclick = (layer) => {
    if (layer.target.id == "style_2022") {
      map.setStyle(style_2022);
    }
    if (layer.target.id == "style_2024") {
      map.setStyle(style_2024);
    }
  };
}
