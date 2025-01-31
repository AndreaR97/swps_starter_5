<template>
  <div class="profilepage">
    <NavigationBar />
    <v-container fluid class="pa-5 main-container">
      <div style="height: 100px;"></div>
      <v-row class="first-row mt-20">
        <v-col cols="12" md="6">
          <div class="left-area">
            <div style="text-align: center;">
              <img
                src="/assets/profilbild.png"
                alt="ProfilePicture"
                style="width: 150px; height: 150px;"
              />
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="right-area">
            <div style="text-align: left; font-size: 22px;"> 
              <p style="margin-top: 5px;">Rolle: {{ role }}</p>
              <p style="font-weight: bold;">Name: {{ vorname }} {{ nachname }}</p>
              <p style="font-weight: bold;">Email: {{ email }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row class="rides-overview mt-10"> 
        <v-col cols="12" md="6">
          <v-card class="overflow-y-auto" max-height="300px">
            <div class="fixed-title">
              <span
                style="font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
                >Geplante Fahrten als Mitfahrer:</span
              >
            </div>
            <v-list lines="two">
              <template v-if="plannedRides.length === 0">
                <div style="padding: 1rem; font-style: italic;">
                  Noch keine Fahrten geplant :/
                </div>
              </template>
              <template v-else>
                <v-item-group>
                  <v-list-item
                    v-for="ride in plannedRides"
                    :key="ride.Fahrt_ID"
                    link
                  >
                    <template v-slot:title>
                      <div>
                        <span
                          :style="{
                            fontSize: '20px',
                            fontWeight: 'bold'
                          }"
                          >{{ ride.Fahrt.Startort }} - {{ ride.Fahrt.Zielort }}</span
                        >
                        <br />
                        <span
                          :style="{
                            fontSize: '16px'
                          }"
                          >{{ ride.Fahrt.Datum }} um {{ ride.Fahrt.Abfahrtszeit }}</span
                        >
                              <v-btn     
                                v-if="checkIfDeletable(ride.Fahrt.Datum, ride.Fahrt.Abfahrtszeit)"
                                icon=mdi-trash-can-outline 
                                variant="plain"
                                density="compact"
                                @click="this.idDelete = ride.Fahrt_ID; dialog2 = !dialog2">
                                </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-item-group>
              </template>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="overflow-y-auto" max-height="300px">
            <div class="fixed-title">
              <span
                style="font-weight: bold; font-size: 24px; color: #009260; padding:10px;"
                >Geplante Fahrten als Fahrer:</span
              >
            </div>
            <v-list lines="two">
              <template v-if="driverRides.length === 0">
                <div style="padding: 1rem; font-style: italic;">
                  Noch keine Fahrten geplant :/
                </div>
              </template>
              <template v-else>
                <v-item-group>
                  <v-list-item
                    v-for="(ride, index) in driverRides"
                    :key="index"
                    link
                  >
                    <template v-slot:title>
                      <div>
                        <span
                          :style="{
                            fontSize: '20px',
                            fontWeight: 'bold'
                          }"
                          >{{ ride.Startort }} - {{ ride.Zielort }}</span
                        >
                        <br />
                        <span
                          :style="{
                            fontSize: '16px'
                          }"
                          >{{ ride.Datum }} um {{ ride.Abfahrtszeit }}</span
                        >
                        <v-btn     
                                  v-if="checkIfDeletable(ride.Datum, ride.Abfahrtszeit)"
                                  icon=mdi-trash-can-outline 
                                  variant="plain"
                                  density="compact"
                                  @click="this.idDelete = ride.Fahrt_ID; dialog = !dialog">
                                </v-btn>
                      </div>
                    </template>                   
                  </v-list-item>
                </v-item-group>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row style="height: 50px;"></v-row>
        <v-row justify="center"> 
          <v-btn class="big-button" color="#009260" @click="$router.push('/')">
          <template v-if="driverRides.length === 0 && plannedRides.length === 0">
                  Jetzt Fahrten planen
          </template>
          <template v-else>
                  Weitere Fahrten planen
          </template>
        </v-btn>  
        </v-row>
    </v-container>

    <div class="centered-container">
          <v-dialog
            v-model="dialog"
            max-width="600"
            persistent
          >
            <v-card color="white">
              <div class="py-12 text-center">
                <div>
                  <h2>Möchtest du die Fahrt wirklich löschen?</h2>
                </div>
              </div>
              <v-divider></v-divider>
              <v-row align="center" justify="center">
                <v-col cols="auto">
              <div class="pa-4 text-end">
                <v-btn
                  class="text-none"
                  color="medium-emphasis"
                  min-width="92"
                  variant="outlined"
                  @click="deleteRide(this.idDelete); dialog = false; reloadPage();"
                >
                  Ja
                </v-btn>
              </div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  class="text-none"
                  color="medium-emphasis"
                  min-width="92"
                  variant="outlined"
                  @click="dialog = false"
                >
                  Nein
                </v-btn>
              </v-col>
            </v-row>
            </v-card>
          </v-dialog>
        </div>

        <div class="centered-container">
          <v-dialog
            v-model="dialog2"
            max-width="600"
            persistent
          >
            <v-card color="white">
              <div class="py-12 text-center">
                <div>
                  <h2>Möchtest du wirklich deinen Mitfahrerplatz/ deine Mitfahrerplätze aufgeben?</h2>
                </div>
              </div>
              <v-divider></v-divider>
              <v-row align="center" justify="center">
                <v-col cols="auto">
              <div class="pa-4 text-end">
                <v-btn
                  class="text-none"
                  color="medium-emphasis"
                  min-width="92"
                  variant="outlined"
                  @click="deletePassenger(this.idDelete); dialog2 = false; reloadPage();"
                >
                  Ja
                </v-btn>
              </div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  class="text-none"
                  color="medium-emphasis"
                  min-width="92"
                  variant="outlined"
                  @click="dialog2 = false"
                >
                  Nein
                </v-btn>
              </v-col>
            </v-row>
            </v-card>
          </v-dialog>
        </div>


  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue';
import { supabase } from '../lib/supabaseClient';

export default {
  name: 'ProfilePage',
  components: {
    NavigationBar
  },
  data: () => ({
    email: localStorage.getItem('userEmail'),
    vorname: '',
    nachname: '',
    role: '',
    dialog: false,
    dialog2: false,
    idDelete: null,
    passengerRides: [
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },

    ],
    driverRides: [],
    plannedRides: []
  }),
  methods: {
    isFutureRide(dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const rideDate = new Date(year, month - 1, day);
      rideDate.setHours(0, 0, 0, 0);
      const nowDate = new Date();
      nowDate.setHours(0, 0, 0, 0);
      return rideDate.getTime() >= nowDate.getTime();
    },
    async getPlannedRides() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const { data, error } = await supabase
          .from('ist_mitfahrer')
          .select('Fahrt_ID, Fahrt:Fahrt_ID(Startort, Zielort, Datum, Abfahrtszeit)')
          .eq('Person', userEmail);
        if (!error && data) {
          this.plannedRides = data.filter((ride) =>
            this.isFutureRide(ride.Fahrt.Datum)
          );
        }
      } catch (error) {
        console.error('Fehler beim Laden der geplanten Fahrten:', error);
      }
    },
    async getDriverRides() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const { data, error } = await supabase
          .from('Fahrt')
          .select('Fahrt_ID, Startort, Zielort, Datum, Abfahrtszeit')
          .eq('Fahrer', userEmail);
        if (!error && data) {
          this.driverRides = data.filter((ride) =>
            this.isFutureRide(ride.Datum)
          );
        }
      } catch (error) {
        console.error('Fehler beim Laden der Fahrten als Fahrer:', error);
      }
    },
    async deleteRide(rideId) {
      try { 
          const response = await supabase
            .from('Fahrt')
            .delete()
            .eq('Fahrt_ID', rideId);
        if(response){
          console.log('Fahrt erfolgreich gelöscht', response);
          return response; 
        }
      } catch (error) {
      console.log('Fahrt löschen fehlgeschlagen', error);
      }
    },

    async deletePassenger(rideId) {
      try { 
          const response = await supabase
            .from('ist_mitfahrer')
            .delete()
            .eq('Fahrt_ID', rideId,)
            .eq('Person', this.email);
        if(response){
          console.log('Fahrt erfolgreich gelöscht', response);
          return response; 
        }
      } catch (error) {
      console.log('Fahrt löschen fehlgeschlagen', error);
      }
    },

    checkIfDeletable(dateStr, timeStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      const rideDate = new Date(year, month - 1, day, hour, minute);
      return (rideDate - new Date()) > 6 * 60 * 60 * 1000;
    },

    reloadPage() {
      window.location.reload();
    }
  },
  async mounted() {
    if (this.email) {
      const { data: user } = await supabase
        .from('Person')
        .select('Vorname, Nachname, Rolle')
        .eq('E_Mail_Adresse', this.email)
        .single();
      if (user) {
        this.vorname = user.Vorname;
        this.nachname = user.Nachname;
        this.role = user.Rolle;
      }
    }
    await this.getPlannedRides();
    await this.getDriverRides();
  },
};
</script>

<style scoped>

html, body {
  height: 100%;
  overflow-y: auto; /* Enable vertical scrolling */
}

body {
  display: flex;
  flex-direction: column;
}

.profilepage {
  position: relative;
  width: 100%;
  height: calc(100vh - 48px);
  z-index: 1;
  font-family: 'Arial', sans-serif; 
}

.main-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.left-area {
  background-color: #ff000000; 
  padding: 20px;
  border-radius: 10px;
}

.right-area {
  background-color: #f0f0f0; 
  padding: 20px;
  border-radius: 10px;
  color: #000000;
  margin-top: 25px;
}

.rides-overview {
  margin-top: 150px;
  max-width: 1200px;
}

.v-card {
  background-color: #f0f0f0; 
  overflow-y: auto;
  max-height: 300px;
  position: relative;
}

.v-list, .v-list-item {
  background-color: #f0f0f0; 
}

.big-button {
  font-size: 20px;
  line-height: 5px;
  padding: 30px 40px;
}

.fixed-title {
  position: sticky;
  top: 0;
  background-color: #f0f0f0; 
  z-index: 1;
}
</style>
