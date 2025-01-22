<template>
        <div id="map2"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { supabase } from '../lib/supabaseClient';


export default {
  inject: ['getStartLocation', 'getEndLocation',],
  props: {
    startLocation: {
      type: String,
      required: true
    },
    endLocation: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      map2: null,
      coordArray: [],
    };
  },
  watch: {
    startLocation: {
      handler(newVal) {
        if (newVal && this.endLocation) {
          this.getStartandEnd();
        }
      }
    },
    endLocation: {
      handler(newVal) {
        if (newVal && this.startLocation) {
          this.getStartandEnd();
        }
      }
    }
  },
  
  methods: {
    
        async getStartandEnd(){
          const startLocation = this.getStartLocation();
          const { data: data, error } = await supabase
          .from('Ort')
          .select('Koordinate_X, Koordinate_Y')
          .eq('Adresse', startLocation)

        if (error) {
          console.error('Error fetching coordinates:', error);
          return;
        }
        if (!data || data.length === 0) {
          console.warn('No coordinates found');
          return;
        }
        for (const d of data) {
          this.coordArray.push([d.Koordinate_X, d.Koordinate_Y]);
          }
        
          const endLocation = this.getEndLocation();
          const { data: data2 } = await supabase
          .from('Ort')
          .select('Koordinate_X, Koordinate_Y')
          .eq('Adresse', endLocation)
          
          if (!data2 || data.length === 0) {
          console.warn('No coordinates found');
          return;
        }
        for (const d of data2) {
          this.coordArray.push([d.Koordinate_X, d.Koordinate_Y]);
          }

        console.log('Coordinates', this.coordArray);
        console.log('Start:', this.coordArray[0][0]);
        console.log('Ende:', this.coordArray[1][0])

        await this.initializeRoutingControl();
        },
        
       async initializeRoutingControl() {
        if(this.coordArray.length > 1){
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(this.coordArray[0][0], this.coordArray[0][1]),
          L.latLng(this.coordArray[1][0], this.coordArray[1][1])
        ],
        routeWhileDragging: false,
        show: false,
        showAlternatives: true,
        addWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: "#f23549", weight: 3 }]
        },
      });     

      routingControl.addTo(this.map2);
    }
  }
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

        if(this.startLocation && this.endLocation){
          this.getStartandEnd();
          console.log('coordinates:', this.coordArray);
        }
  },
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