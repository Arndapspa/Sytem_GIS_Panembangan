<template>
    <div>
      <h3>An interactive leaflet map</h3>
      <div id="map" style="height: 90vh; margin-top: 100px"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import "leaflet/dist/leaflet.css";
  import * as L from "leaflet";
  import "leaflet-draw/dist/leaflet.draw.css";
  import "leaflet-draw";
  
  const initialMap = ref(null);
  
  onMounted(() => {
    initialMap.value = L.map("map").setView([51.505, -0.09], 13);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    }).addTo(initialMap.value);
  
    const drawnItems = L.featureGroup().addTo(initialMap.value);
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: {
          allowIntersection: false,
        },
      },
    }).addTo(initialMap.value);
  
    initialMap.value.on(L.Draw.Event.CREATED, (e) => {
      const type = e.layerType;
      const layer = e.layer;
      drawnItems.addLayer(layer);
    });
  });
  </script>