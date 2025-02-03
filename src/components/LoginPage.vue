<template>
  <div class="loginpage">
    <v-alert v-if="errorMessage" type="error" dismissible class="error-popup">{{ errorMessage }}</v-alert>
    <img src="/assets/anmeldepage.png" alt="LoginScreen" class="loginbackground" />
    <div class="whitebox">
      <img src="/assets/unibayreuthlogo.png" alt="Uni Bayreuth Logo" class="logo" />
      <h1 class="title">Anmelden</h1>
      <input 
        type="text" 
        placeholder="jemand@example.com" 
        class="name" 
        v-model="email" 
      />
      <input 
        type="password" 
        placeholder="Kennwort" 
        class="passwort" 
        v-model="password" 
      />
      <button @click="login" class="loginbutton">Anmelden</button>
      <p class="subtitle">
        Melden Sie sich mit 
        <span class="highlight">vorname.nachname@uni-bayreuth.de</span> an.<br> <br>
        Log in with<br>
        <span class="highlight">firstname.lastname@uni-bayreuth.de</span>.
      </p>
      <v-row class="d-flex justify-center mt-3">
        <v-btn 
          variant="text" 
          class="registration-link"
          @click="goToRegistration"
        >
          Noch kein Konto? Registrieren
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import { supabase } from '../lib/supabaseClient';

export default {
  name: "LoginPage",
  data() {
    return {
      // Stores the user's email input for login
      email: '',
      // Stores the user's password input for login
      password: '',
      // Holds any error message displayed to the user upon a failed login
      errorMessage: ''
    };
  },
  methods: {
    // This method is called when the user clicks the "Anmelden" button
    // It checks credentials in the 'Person' table and handles routing upon success or error
    async login() {
      this.errorMessage = '';
      try {
        const emailLower = this.email.toLocaleLowerCase();
        const { data: user } = await supabase
          .from('Person')
          .select('E_Mail_Adresse, Passwort')
          .ilike('E_Mail_Adresse', emailLower)
          .eq('Passwort', this.password)
          .single();

        if (user) {
          const token = `dummy-token-for-${user.E_Mail_Adresse}`;
          localStorage.setItem('authToken', token);
          localStorage.setItem('userEmail', user.E_Mail_Adresse);

          const redirectRoute = this.$route.query.redirectTo || localStorage.getItem('redirectTo');
          if (redirectRoute) {
            localStorage.removeItem('redirectTo');
            this.$router.push(redirectRoute);
          } else {
            this.$router.push('/profilepage');
          }
        } else {
          this.errorMessage = 'Falsche Anmeldedaten';
        }
      } catch (error) {
        this.errorMessage = 'Fehler beim Anmelden';
      }
    },
    // This method navigates the user to the registration page if they don't have an account
    goToRegistration() {
      const redirectParam = this.$route.query.redirectTo || localStorage.getItem('redirectTo');
      this.$router.push({
        path: '/registrationpage',
        query: { redirectTo: redirectParam }
      });
    }
  }
};
</script>

<style scoped>
.loginpage {
  background-color: brown;
}

.loginbackground {
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  position: absolute; 
}

.whitebox {
  width: 450px;
  height: 550px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.logo {
  width: 125px;
  position: absolute;
  top: 40px;
  left: 40px;
}

.title {
  text-align: left; 
  font-size: 22px;
  margin-top: 100px;
  margin-left: 47px; 
  font: 22px Arial;
}

.subtitle {
  text-align: left;
  font-size: 18px; 
  margin-left: 47px;
  margin-right: 47px;
  margin-top: 10px;
}

.highlight {
  color: red;
}

.name {
  width: 80%;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px; 
  font-size: 16px;
}

.passwort {
  width: 80%;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px; 
  font-size: 16px;
}

.loginbutton {
  width: 80%;
  padding: 10px;
  background-color: rgb(0, 103, 184);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 150px auto;
}

.loginbutton:hover {
  background-color: rgb(0, 82, 147);
}

.error-popup {
  position: fixed;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  z-index: 1000;
}

.registration-link {
  font-size: 1.2em;
  width: 400px;
  height: 60px;
  font-weight: bold;
  color: rgb(0, 82, 147);
  text-decoration: underline;
}
.registration-link:hover {
  color: rgb(0, 82, 147);
}
</style>
