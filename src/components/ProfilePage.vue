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
          Weitere Fahrten planen
        </v-btn> 
      </v-row>
    </v-container>
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
    passengerRides: [
      { from: 'Bayreuth', to: 'Nürnberg', date: '2023-10-15', time: '10:30' },

    ],
    driverRides: [],
    plannedRides: []
  }),
  methods: {
    async getPlannedRides() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const { data, error } = await supabase
          .from('ist_mitfahrer')
          .select('Fahrt_ID, Fahrt:Fahrt_ID(Startort, Zielort, Datum, Abfahrtszeit)')
          .eq('Person', userEmail);
        if (!error && data) {
          this.plannedRides = data;
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
          this.driverRides = data;
        }
      } catch (error) {
        console.error('Fehler beim Laden der Fahrten als Fahrer:', error);
      }
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
.profilepage {
  position: relative;
  width: 100%;
  height: calc(100vh - 48px);
  overflow: hidden;
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
