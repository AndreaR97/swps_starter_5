<template>
        <div id="map2"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default {
  data() {
    return {
      map2: null,
    };
  },
  async mounted() {
    const uniBayreuthCoords = [49.928809, 11.585835];
    this.map2 = L.map('map2').setView(uniBayreuthCoords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map2);

    const defaultIcon = L.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = defaultIcon;
  
        L.marker(uniBayreuthCoords).addTo(this.map2);


  },
  methods: {
      }
    }
</script>
  <style scoped>
  /* Adjust map container height */
  #map2 {
    width: 100%;
    max-width: 700px; /* Increase the max width */
    max-height: 700px; /* Increase the max height */
    aspect-ratio: 1 / 1; /* Hält die Karte quadratisch */
    border-radius: 15px; 
  }
  </style>