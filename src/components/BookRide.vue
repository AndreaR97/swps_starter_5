<template> 
  <v-card
    color=""
    height="200px"
    rounded="0"
    flat>

  <v-app-bar density="compact"
    style="background-color:#E9E9ED;">
    
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>
          <v-btn icon>
              <v-icon>mdi-message-text</v-icon>
          </v-btn>

          <v-btn icon>
               <v-icon @click="$router.push('/loginpage')">mdi-account</v-icon>
          </v-btn>

          <v-btn icon>
              <v-icon>mdi-logout</v-icon>
          </v-btn>
  </v-app-bar>
    
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list
        :items="items"
      ></v-list>
    </v-navigation-drawer>
  </v-card>

  <!--<v-stepper editable model-value="step">-->

  <v-stepper v-model="step">    
  <v-stepper-header> 
    <v-stepper-item
        title="Suche eine Fahrt"
        value="1"
        editable
        @click= setStep(0)
      ></v-stepper-item>

      <v-divider></v-divider>

      <v-stepper-item
        title="Wähle eine Fahrt aus"
        value="2"
        editable
        @click= setStep(1)
      ></v-stepper-item>

      <v-divider></v-divider>

      <v-stepper-item
        title="Details zur Fahrt"
        value="3"
        editable
        @click="setStep(2)"
      ></v-stepper-item>

      <v-divider></v-divider>

      <v-stepper-item
        title="Fertig"
        value="4"
      ></v-stepper-item>

    </v-stepper-header>

    <v-stepper-items>

      <div v-if="step === 0"> 
        <v-stepper-window>
          <div>
          <div class="map-container">
          <b-container fluid>
          <b-row>
        <b-col>
          <v-text-field
          v-model="startLocation"
          label="Start der Route"
          outlined
          class="Startlocation"
          ></v-text-field>
        </b-col>

        <b-col cols="12" sm="6">
          <div id="map" class="independent-map"></div>
        </b-col>
      </b-row>
      
      <b-row>
        <b-col cols="12" sm="6">
     <v-text-field
       v-model="endLocation"
       label="Ziel der Route"
       outlined
       class="Endlocation"
     ></v-text-field>
      </b-col>
      </b-row>

     <v-btn icon @click="swapLocations" class="SwapButton">
       <v-icon>mdi-swap-horizontal</v-icon>
     </v-btn>

     <b-row>
        <b-col cols="12" sm="3">
          <v-text-field
          v-model="date"
          label="Datum"
          outlined
          class="Date"
          type="date"
          :rules="[dateRule]">   
          </v-text-field>
        </b-col>

        <b-col cols="12" sm="3">
          <v-text-field
          v-model="time"
          label="Uhrzeit"
          outlined
          class="Time"
          type="time"
          ></v-text-field>
        </b-col>
      </b-row>
     
      <b-row>
        <b-col cols="12" sm="4">
          <v-text-field
            v-model="freeSeats"
            label="Benötigte Plätze"
            outlined
            class="Neededseats"
            type="number"
            :rules="[freeSeatsRule]"
          ></v-text-field>
        </b-col>
      </b-row>
    </b-container>
     <!---&& Suchfunktion mit Datenbank in den Button einfügen--->
   </div>
 </div>
        </v-stepper-window>
    </div> 

    <div v-if="step === 1"> 
      <p>Inhalt für Schritt 2: Wähle eine Fahrt aus</p> 
      <v-stepper-content step="2">
        <v-list lines="two">
            <v-list-item
              v-for="n in 3"
              :key="n"
              :title="'Item ' + n"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
            > <template v-slot:prepend>
              <img src="/assets/unibayreuthlogo.png"/>
        </template>
        </v-list-item>
          </v-list>
        
      </v-stepper-content>
    </div>

    <div v-if="step === 2"> 
      <v-stepper-content step="3">
        <v-text-field>Part one</v-text-field>
      </v-stepper-content>
    </div>


    <div v-if="step === 3"> 
      <v-stepper-content step="4">

      <div class="fullscreen-container">
        <v-btn class="confirmation-button" elevation="5">
          <v-icon large>mdi-check</v-icon>
        </v-btn>
      </div>


      </v-stepper-content>
    </div>
    

  </v-stepper-items>

  <v-stepper-actions
   @click:prev="setStep(this.step-1)"
   @click:next="setStep(this.step+1)"
   ></v-stepper-actions>
</v-stepper>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default {

  data() {
    return {
      drawer: false,
      group: null,
      step: 0,
      items: [
        { title: 'Foo', value: 'foo' },
        { title: 'Bar', value: 'bar' },
      ],

     steps: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Roadmap',
        href: 'https://vuetifyjs.com/introduction/roadmap/',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
      map: null,
      startLocation: '',
      endLocation: '',
      date: '',
      time: '',
      freeSeats: '',
      dateRule: value => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 28); // das datum muss in den näschten 4 wochen liegen
        const selectedDate = new Date(value);
        return selectedDate >= today && selectedDate <= maxDate || 'Datum muss innerhalb der nächsten 4 Wochen liegen';
      },
      freeSeatsRule: value => {
        const number = parseInt(value, 10);
        return number >= 1 && number <= 9 || 'Freie Plätze müssen eine ganze Zahl zwischen 1 und 9 sein';
      },
    };
  },
  methods: {
    setStep(a) { this.step = a; },
    initMap() {
      const uniBayreuthCoords = [49.928809, 11.585835];
      this.map = L.map("map").setView(uniBayreuthCoords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      const defaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = defaultIcon;

      L.marker(uniBayreuthCoords).addTo(this.map);
    },
    swapLocations() {
      const temp = this.startLocation;
      this.startLocation = this.endLocation;
      this.endLocation = temp;
    },
  },
  mounted() {
    this.initMap();
  }
};
</script>

<style>
.map-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: calc(100vh - 64px); /* damit man nicht scrollen kann */
  padding-right: 100px;
}
.independent-map {
  width: 800px;
  height: 600px;
  border-radius: 15px;
  z-index: 500;
}

.v-text-field input {
    font-size: 1.4em;
    font-weight: 100;
    text-transform: capitalize;
}

.v-text-field label{
    font-size: 1.1em;
    font-weight: 100;
}

.Startlocation {
  position: absolute;
  top: 240px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 30px; /* schriftgröße ändern geht irgendwie nicht :/ */
}

.Endlocation {
  position: absolute;
  top: 390px; 
  left: 100px; 
  width: 700px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Date {
  position: absolute;
  top: 540px; 
  left: 100px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Time {
  position: absolute;
  top: 540px; 
  left: 525px; 
  width: 275px; 
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Freeseats {
  position: absolute;
  top: 690px; 
  left: 100px; 
  width: 250px;
  height: 150px; 
  z-index: 1000;
  font-family: 'Minion Pro Italic'; ;
  font-size: 30px; 
}

.Submitbutton {
  position: absolute;
  top: 690px; 
  left: 500px; 
  width: 300px;
  height: 100px;
  z-index: 1000;
  font-family: 'Minion Pro Italic';
  font-size: 20px;
  color: #48535A;
}

.SwapButton {
  position: absolute;
  top: 320px; 
  left: 650px;
  z-index: 1000;
  width: 80px;
  height: 80px;
}



.fullscreen-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 95vh;
  width: 95vw;
}

.confirmation-button {
  background-color: #4CAF50;  
  border-radius: 50%;        
  width: 150px;              
  height: 150px;              
  display: flex;            
  justify-content: center; 
  align-items: center;      
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); 
}

/* Stile für das Icon im Button */
.confirmation-button .v-icon {
  color: white;              
  font-size: 60px;          
}




</style>


