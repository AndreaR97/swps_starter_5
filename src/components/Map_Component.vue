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
//Import of all APIs and properties needed from leaflet
//Import of supabase client to access the database

export default {
  /*Injection of startLocation and endLocation from parent component BookRide to receive the
  corresponding values the user has entered to be able to add the route to the map*/
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
      map2: null,           //map object
      coordArray: [],       //holds the coordinates of the start and end location
      tdistance: 0,         //is given the distance between start and end location
      ttime: 0              //is given the driving time from start to end location
    };
  },
  watch: {
    //Observes changes in startLocation and endLocation and requests the new values from BookRide component
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
    },
    //when tdistance and ttime are changed the new values are sent out to the subscribing BookRide component
    tdistance: {
      handler(newVal) {
        if(newVal && this.tdistance !== 0){
        this.changeDistance();
        }
      }
    },
      ttime: {
        handler(newVal){
          if(newVal && this.ttime !== 0){
            this.changeTime();
        }
      }
    }
  },
  
  methods: {
        //Requests the coordinates of the start location a user entered from the database
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

        //Enters the coordinates of the start location into the coordArray
        for (const d of data) {
          this.coordArray.push([d.Koordinate_X, d.Koordinate_Y]);
          }
        
        //Requests the coordinates of the start and end location a user entered from the database
        const endLocation = this.getEndLocation();
        const { data: data2 } = await supabase
          .from('Ort')
          .select('Koordinate_X, Koordinate_Y')
          .eq('Adresse', endLocation)
          
          if (!data2 || data.length === 0) {
          console.warn('No coordinates found');
          return;
          }
         
        //Enters the coordinates of the end location into the coordArray
        for (const d of data2) {
          this.coordArray.push([d.Koordinate_X, d.Koordinate_Y]);
          }

        console.log('Coordinates', this.coordArray);
        console.log('Start:', this.coordArray[0][0]);
        console.log('Ende:', this.coordArray[1][0])

        await this.initializeRoutingControl();
        },

        setTimeString(time){
          const hours = Math.round(time / 3600);
          const minutes = Math.round(time % 3600 / 60);
          return `${hours}:${minutes}`;
        },

        changeDistance() {
          this.$emit('distance-changed', this.tdistance); // Emit the event with tdistance
          console.log('Distance3:', this.tdistance);
        },

        changeTime() {
          this.$emit('ttime-changed', this.ttime); // Emit the event with ttime
          console.log('TTime', this.ttime);
        },
       
        //Is being called by getStartandEnd() as soon as the needed coordinates are retrieved.
        //Draws the route from the start to the end location into the map.
       async initializeRoutingControl() {
        if(this.coordArray.length > 1){
      const routingControl = L.Routing.control({ 
        waypoints: [
          L.latLng(this.coordArray[0][0], this.coordArray[0][1]),
          L.latLng(this.coordArray[1][0], this.coordArray[1][1])
        ],
        
        //Disables several options so the user can't add waypoints or drag waypoints to change or alter the route.
        //No alternative routes are shown to avoid confusion
        routeWhileDragging: false,
        show: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: "#f23549", weight: 3 }]
        },
      });     
      routingControl.on('routesfound', (e)  =>{
      var routes = e.routes;
      var summary = routes[0].summary;
      // distance and time in km and minutes
      var kdistance = summary.totalDistance / 1000;
      this.ttime = this.setTimeString(summary.totalTime);
      this.tdistance = kdistance;
      console.log('Distance:', this.tdistance);
      console.log('Distance_:', kdistance);
      console.log('Time:', this.ttime);
      this.changeDistance();
   });
      routingControl.addTo(this.map2);
    }
  }
  },
      //sets up the map with its initial properties
      async mounted() {
      //The coordinates of the Campus Universität Bayreuth 
    const uniBayreuthCoords = [49.928809, 11.585835];
    //sets the initial view of the map to the Campus Universität Bayreuth
    this.map2 = L.map('map2').setView(uniBayreuthCoords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map2);

    //Specification of the marker icon
    const defaultIcon = L.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = defaultIcon;
        
        //adds a blue marker at the coordinates of the Campus Universität Bayreuth 
        L.marker(uniBayreuthCoords).addTo(this.map2);

        /*Checks whether start and end location have been entered and calls the method to 
        draw the route if true*/
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