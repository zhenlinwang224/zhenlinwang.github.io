// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoiemhlbmxpbndhbmciLCJhIjoiY201d2l3bnBsMGJyaTJrcXU0YjF3eWl3cSJ9.JM6Sr28yqNuOs30yUg-drQ";

//Before map
const beforeMap = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/zhenlinwang/cm6o7rpmn00h901sd3frd2qiq",
  center: [-0.089932, 51.514441],
  zoom: 14
});
mapboxgl.accessToken =
  "pk.eyJ1IjoiemhlbmxpbndhbmciLCJhIjoiY201d2l3bnBsMGJyaTJrcXU0YjF3eWl3cSJ9.JM6Sr28yqNuOs30yUg-drQ";
//After map
const afterMap = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/zhenlinwang/cm6o8acoz000m01s6e32e74mq",
  center: [-0.089932, 51.514441],
  zoom: 14
});
const container = "#comparison-container";
const map = new mapboxgl.Compare(beforeMap, afterMap, container, {});
