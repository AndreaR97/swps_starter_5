<template>
    <v-container>
      <v-card>
        <v-card-title>
          Hallo, {{ userName }}! <!-- Display the user's name -->
        </v-card-title>
        <v-card-subtitle>
          Wichtige Orte in Bayreuth
        </v-card-subtitle>
        <v-card-text>
          <div id="map" style="height: 400px; width: 100%;"></div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { createClient } from '@supabase/supabase-js';
  
  // Fix default marker icon path issue
  import markerIcon from 'leaflet/dist/images/marker-icon.png';
  import markerShadow from 'leaflet/dist/images/marker-shadow.png';
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
  
  export default {
    props: {
      userName: {
        type: String,
        required: true, // The user name is required
      },
      userPassword: {
        type: String,
        required: true, // The user name is required
      },
    },
    data() {
      return {
        map: null,
      };
    },
    async mounted() {
      this.map = L.map('map').setView([49.9427, 11.5760], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
  
      await this.loadMarkers();
    },
    methods: {
      async loadMarkers() {
        const supabaseUrl = 'https://ldpsaujnvjyjtflecpgb.supabase.co';
        const supabaseKey = this.userPassword + 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHNhdWpudmp5anRmbGVjcGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NTc4NDcsImV4cCI6MjA0MTUzMzg0N30.56c2P7OPQyNd1flTA4vlyZ7Hn_8sFAWG8ThW6Q341DI';
        const supabase = createClient(supabaseUrl, supabaseKey);
  
        const { data: locations, error } = await supabase
          .from('orte')
          .select('ort_name, x_koordinate, y_koordinate, link');
  
        // Check for errors
        if (error) {
          console.error('Error fetching data from Supabase:', error);
          return;
        }
  
        // Debugging: log the data to see if it's fetched correctly
        console.log(locations); // This should show the data from your table
  
        if (!locations || locations.length === 0) {
          console.warn('No data found in the "orte" table');
          return;
        }
  
        locations.forEach((location) => {
          const { ort_name, x_koordinate, y_koordinate, link } = location;
  
          // Ensure coordinates are valid before placing markers
          if (x_koordinate && y_koordinate) {
            // Construct the popup content with the name and a hyperlink
            const popupContent = `
              <b>${ort_name}</b><br>
              <a href="${link}" target="_blank">Website</a>
            `;
  
            // Add marker to the map and bind the popup with name and website link
            L.marker([y_koordinate, x_koordinate])
              .addTo(this.map)
              .bindPopup(popupContent);
          } else {
            console.warn(`Invalid coordinates for ${ort_name}`);
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Adjust map container height */
  #map {
    height: 400px;
  }
  </style>