<template>
  <div class="loginpage">
    <v-alert v-if="errorMessage" type="error" dismissible class="error-popup">{{ errorMessage }}</v-alert>
    <img src="/assets/anmeldepage.png" alt="LoginScreen" class="loginbackground" />
    <div class="whitebox">
      <img src="/assets/unibayreuthlogo.png" alt="Uni Bayreuth Logo" class="logo" />
      <h1 class="title">Anmelden</h1>
      <input type="text" placeholder="jemand@example.com" class="name" v-model="email" />
      <input type="password" placeholder="Kennwort" class="passwort" v-model="password" />
      <button @click="login" class="loginbutton">Anmelden</button>
      <p class="subtitle">
        Melden Sie sich mit Ihrer persönlichen <span class="highlight">Benutzerkennung@myubt.de</span> an.<br> <br>
        Log in with your personal<br>
        <span class="highlight">User-ID@myubt.de</span>.
      </p>
    </div>
  </div>
</template>

<script>
import { supabase } from '../lib/supabaseClient';

export default {
  name: "LoginPage",
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.errorMessage = '';
      try {
        const { data: user } = await supabase
          .from('Person')
          .select('E_Mail_Adresse, Passwort')
          .eq('E_Mail_Adresse', this.email)
          .eq('Passwort', this.password)
          .single();
        
        if (user) {
          this.$router.push('/profilepage');
        } else {
          this.errorMessage = 'Falsche Anmeldedaten';
        }
      } catch (error) {
        this.errorMessage = 'Fehler beim Anmelden';
      }
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
  height: 500px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6); 
  border-radius: 10px; /* runde ecken oder? */
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
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  z-index: 1000;
}
</style>
