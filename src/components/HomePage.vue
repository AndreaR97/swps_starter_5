<template>
  <div class="container1">
    <!-- Navigation Bar -->
    <NavigationBar></NavigationBar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list :items="items"></v-list>
    </v-navigation-drawer>

    <!-- First Empty Row (keine Buttons) -->
    <div class="row">
      <div class="col"></div>
      <div class="col"></div>
    </div>

    <!-- Second Row mit Buttons (Book Ride und Offer Ride) -->
    <div class="row buttons-row">
      <!-- Book Ride Button in Column 1 -->
      <div class="col">
        <v-btn @click="$router.push('/bookride')" class="btn">Book Ride</v-btn>
      </div>

      <!-- Offer Ride Button in Column 2 -->
      <div class="col">
        <v-btn @click="$router.push('/offerride')" class="btn">Offer Ride</v-btn>
      </div>
    </div>

    <!-- Third Empty Row (keine Buttons) -->
    <div class="row">
      <div class="col"></div>
      <div class="col"></div>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-nav" class="mobile-nav">
      <div class="row">
        <div class="col-6">
          <div id="mobile-nav-dropdown">
            <div id="mobile-nav-bottom"><span>&equiv;</span></div>
            <div id="mobile-nav-content">
              <ul>
                <li><a href="#">Startseite</a></li>
                <li><a href="#">Leistungen</a></li>
                <li><a href="#">Kontakt</a></li>
                <li><a href="#">Impressum</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container-Layout */
.container1 {
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  width: 100%;
  height: 33.33%; /* Jede Row nimmt 33,33% der Containerhöhe ein */
}

.col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons-row {
  display: flex;
  justify-content: space-around; /* Buttons gleichmäßig verteilen */
  align-items: center;
}

.btn {
  height: 200px;
  width: 400px;
  padding: 10px 20px;
  background-color: #008557;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background-color: #006946;
}

/* Desktop Navigation */
.navbar {
  background-color: #008557;
  color: white;
}

/* Mobile Navigation Styles */
#mobile-nav {
  display: none;
}

#mobile-nav-bottom {
  color: #FFF;
  float: right;
  font-size: 2rem;
  border: 2px solid #FFF;
  width: 37px;
  height: 37px;
  position: relative;
  margin-top: .4rem;
  margin-bottom: 8px;
}

#mobile-nav-bottom > span {
  position: absolute;
  bottom: -2px;
  left: 7px;
}

#mobile-nav-content > ul > li {
  display: block;
  background-color: #3D3F45;
  height: 50px;
  padding: 0 1.2rem;
  text-align: center;
}

#mobile-nav-dropdown {
  position: relative;
  display: inline-block;
  float: right;
}

#mobile-nav-content {
  position: absolute;
  right: 0;
  top: 50px;
  display: none;
}

#mobile-nav-dropdown:hover > #mobile-nav-content {
  display: block;
}

@media (max-width: 768px) {
  #desktop-nav {
    display: none;
  }
  #mobile-nav {
    display: block;
  }

  /* Hide all logo-related elements on mobile */
  .logo-link {
    display: none;
  }

  /* Mobile buttons untereinander */
  .buttons-row {
    flex-direction: column; /* Buttons vertikal anordnen */
    gap: 20px; /* Abstand zwischen den Buttons */
    padding-top: 20px; /* Abstand oben für mobile Geräte */
  }

  /* Button-Styling für mobile Ansicht */
  .btn {
    width: calc(100% - 40px); /* Buttons auf 100% Breite minus Rand setzen */
    height: 150px; /* Kleinere Buttonhöhe für mobile Ansicht */
    margin: 0 20px; /* Rand zwischen den Buttons */
    font-size: 14px; /* Schriftgröße anpassen */
    padding: 10px 20px; /* Optional Padding anpassen */
  }
}
</style>

<script>
import NavigationBar from './NavigationBar.vue';

export default {
  name: 'HomePage',
  components: {
    NavigationBar
  },
  data: () => ({
    drawer: false,
    group: null,
    items: [
      {
        title: 'Foo',
        value: 'foo',
      },
      {
        title: 'Bar',
        value: 'bar',
      }
    ],
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
