<template>
<v-container>
<v-row>
  <v-card flat height="10px">

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
</v-row>
</v-container>


  <!--Stepper für den Buchungsprozess-->
  <v-container fluid>
  <v-stepper fluid v-model="step">    
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
          <v-container fluid>
          <v-row>     <!--overall row-container-->
            <v-col cols="6">   <!--overall column left side-->
              <v-row>
                  <v-text-field
                  v-model="startLocation"
                  label="Start der Route"
                  outlined
                  class="Startlocation"
                  ></v-text-field>
                </v-row>

                <v-row>
                    <v-text-field
                      v-model="endLocation"
                      label="Ziel der Route"
                      outlined
                      class="Endlocation"
                    ></v-text-field>
                      </v-row>

                    <v-btn icon @click="swapLocations" class="SwapButton">
                      <v-icon>mdi-swap-horizontal</v-icon>
                    </v-btn>

                    <v-row>
                      <v-col>
                        <v-text-field
                        v-model="date"
                        label="Datum"
                        outlined
                        class="Date"
                        type="date"
                        :rules="[dateRule]">   
                        </v-text-field>
                      </v-col>

                      <v-col >
                        <v-text-field
                        v-model="time"
                        label="Uhrzeit"
                        outlined
                        class="Time"
                        type="time"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="freeSeats"
                            label="Benötigte Plätze"
                            outlined
                            class="Neededseats"
                            type="number"
                            :rules="[freeSeatsRule]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
            </v-col>
            <v-col cols="6">
        <v-sheet height="200px" class="pa-2 ma-2"> <div id="map" class="independent-map"></div> </v-sheet>
      </v-col>     
     
      
    </v-row>
    </v-container>
     <!---&& Suchfunktion mit Datenbank in den Button einfügen--->
   </div>
 </div>
        </v-stepper-window>
    </div> 

    <div v-if="step === 1"> 
      <v-stepper-content step="2">
        <v-container fluid>
          <v-row dense>
          <v-col cols="6">
            <v-card class="overflow-y-auto"
            max-height="450px">
        <v-list lines="two">
          <v-item-group>
          <v-list-item
            v-for="(person, n) in rideOffers"
            :key="n"
            :title="person.name"
            link
          >
          <v-divider class="mb-2"></v-divider>
          <template v-slot:prepend>
            <v-avatar color="info">
              <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
        </template>

        <template v-slot:append>
          <v-list-item-action>
            <v-btn @click="selected = rideOffers.slice(n, n+1)">Auswählen</v-btn>
          </v-list-item-action>
        </template>

          <v-card> 
              <div class="ma-1">
                  <v-row no-gutters>
                    <v-sheet elevation="1" height="40" class="pa-2 ma-2"  border rounded> {{ person.time}}</v-sheet>

                    <v-sheet elevation="1" height="40" class="pa-2 ma-2" border rounded> {{ person.price}}</v-sheet>
                  </v-row>
                </div>
            </v-card>
        </v-list-item>
        </v-item-group>
        </v-list>
      </v-card>
      </v-col>
    </v-row>
    </v-container>
      </v-stepper-content>
    </div>

    <div v-if="step === 2"> 
      <v-stepper-content step="3">
        <v-sheet> 
            <v-row justify="center">
          <a
            v-for="i in selected"
            :key="i"
          >
            {{ i.name }}, {{ i.rideid }}
          </a>
        </v-row>
           </v-sheet>
      </v-stepper-content>
    </div>
    
    <div v-if="step === 3"> 
  <v-stepper-content step="4">
    <v-stepper-window>

  <v-container align="center" justify = center>
    <h2>Diese Fahrt jetzt buchen?</h2>
  </v-container>

  <v-card-actions>
    <v-row align="center" justify="center">
      <v-col cols="auto">
          <v-btn variant="tonal" rounded="sm" density="default" size="large" color="#008557" @click="dialog = !dialog; overlay = !overlay"  block>Ja</v-btn> 
      </v-col>
      <v-col cols="auto">
          <v-btn rounded="sm" density="default" size="large" color="#008557" @click="$router.push('/homepage')" block>Abbrechen</v-btn>
      </v-col>
    </v-row>
  </v-card-actions>
  </v-stepper-window>
  </v-stepper-content>
</div>

  </v-stepper-items>

  <v-stepper-actions
   @click:prev="setStep(this.step-1)"
   @click:next="setStep(this.step+1)"
   ></v-stepper-actions>
</v-stepper>


<v-fade-transition hide-on-leave> 
  <v-overlay v-model="overlay">
    <div class = "centered-container">
      <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
      >
      <v-card>
        <div class="py-12 text-center">
          <v-icon
          class="icon-container"
            color="#009260"
            icon="mdi-check-circle-outline"
            size="128"
          ></v-icon>

          <div> 
            <h3>Deine Fahrt wurde gebucht!</h3>
            <p>Du wirst nun weitergeleitet.</p>
        </div>
        </div>

        <v-divider></v-divider>

        <div class="pa-4 text-end">
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            @click="$router.push('/profilepage') "
          >
            OK
          </v-btn>
        </div>
      </v-card>
      </v-dialog>
    </div>
    </v-overlay>
    </v-fade-transition>
  </v-container>
</template>


<script setup>
import { ref } from 'vue'

const dialog = ref(false) //dient dem Öffnen und Schließen des Popup-Dialogs
const overlay = ref(false)  //dient dem Overlay für den Popup-Dialog
</script>

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
      selected: 0,

      items: [
        { title: 'Foo', value: 'foo' },
        { title: 'Bar', value: 'bar' },
      ],

      rideOffers: [
      {
        name: 'Cara',
        time: '10:30 Uhr',
        price: "5,00€",
        rideid: "4"
      },
      {
        name: 'Johannes',
        time: '11:40 Uhr',
        price: "5,00€",
        rideid: "5"
      },
        {
        name: 'Maria',
        time: '11:50 Uhr',
        price: "7,50€",
        rideid: "500"
      },
      {
        name: 'Sarah',
        time: '11:50 Uhr',
        price: "2,50€",
        rideid: "1"
      },
      {
        name: 'Manuel',
        time: '14:00 Uhr',
        price: "6,50€",
        rideid: "7"
      },
      {
        name: 'Noah',
        time: '11:50 Uhr',
        price: "2,90€",
        rideid: "2"
      },
      {
        name: 'Manuel',
        time: '12:10 Uhr',
        price: "6,50€",
        rideid: "9"
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
  align-items: start;
  height: calc(100vh - 64px); /* damit man nicht scrollen kann */
  padding-right: 100px;
}
.independent-map {
  width: 600px;
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
  font-size: 30px;
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

.icon-container { animation: fadeIn 0.4s;	}

/*Icon animation */
@keyframes fadeIn {
0% {
transform: translateX(0) scale(0);

opacity: 0;
}
45% {
transform: translate(0)
scale(1.3);

opacity: 1;
}
75% {
transform: translate(0)
scale(.9);
}
100% {
transform: translateX(0) scale(1,1);

opacity: 1;
}
}

</style>
