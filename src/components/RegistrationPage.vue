<template>
    <div>
      <NavigationBar></NavigationBar>
      <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>
      <v-container
        class="d-flex flex-column justify-center pt-5"
        style="margin-top: 100px; height: 70vh; max-width: 70vh;"
      >
        <v-row class="mb-1">
          <v-col>
            <v-text-field 
              label="Vorname" 
              variant="outlined" 
              style="font-size: 1.2em;" 
              v-model="firstName"
              :rules="[requiredRule]"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field 
              label="Nachname" 
              variant="outlined" 
              style="font-size: 1.2em;" 
              v-model="lastName"
              :rules="[requiredRule]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-select
              label="Rolle"
              variant="outlined"
              style="font-size: 1.2em;"
              :items="roles"
              v-model="role"
              :rules="[requiredRule]"
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field 
              label="Mail" 
              variant="outlined" 
              style="font-size: 1.2em;" 
              v-model="email"
              :rules="[emailRule]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field 
              label="Mail bestätigen" 
              variant="outlined" 
              style="font-size: 1.2em;" 
              v-model="confirmEmail"
              :rules="[confirmEmailRule]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-1">
          <v-col>
            <v-text-field 
              label="Passwort" 
              variant="outlined" 
              style="font-size: 1.2em;" 
              v-model="password"
              :rules="[passwordRule]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-btn 
            variant="tonal" 
            style="font-size: 1em; width: 200px; height: 60px; background-color: #009260; font-weight: bold;" 
            @click="validateForm"
            :disabled="!isFormValid"
          >
            Konto erstellen
          </v-btn>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import NavigationBar from './NavigationBar.vue';
  import { supabase } from '../lib/supabaseClient';
  
  export default {
    components: {
      NavigationBar,
    },
    data() {
      return {
        roles: [
          'Student',
          'Doktorand',
          'Professor/Dozent',
          'Wissenschaftlicher Mitarbeiter',
          'Mitarbeiter in Verwaltung/Technik',
          'Gast',
          'Alumni'
        ],
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        confirmEmail: '',
        password: '',
        errorMessage: ''
      };
    },
    computed: {
      requiredRule() {
        return v => !!v || 'Dieses Feld ist erforderlich';
      },
      emailRule() {
        return v => /.+@uni-bayreuth\.de$/.test(v) || 'E-Mail muss im Format Vorname.Nachname@uni-bayreuth.de sein';
      },
      confirmEmailRule() {
        return v => v === this.email || 'E-Mail Bestätigung muss mit der E-Mail übereinstimmen';
      },
      passwordRule() {
        return v => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,30}$/.test(v) || 'Passwort muss 8-30 Zeichen lang sein und Buchstaben, Zahlen und Sonderzeichen enthalten';
      },
      isFormValid() {
        return this.firstName && this.lastName && this.role && this.emailRule(this.email) === true && this.confirmEmailRule(this.confirmEmail) === true && this.passwordRule(this.password) === true;
      }
    },
    methods: {
      async validateForm() {
        this.errorMessage = '';
        if (!this.isFormValid) {
          this.errorMessage = 'Bitte füllen Sie alle Felder korrekt aus';
          return;
        }
        try {
          const { data: existingUser } = await supabase
            .from('Person')
            .select('E_Mail_Adresse')
            .eq('E_Mail_Adresse', this.email)
            .single();
          
          if (existingUser) {
            this.errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet';
            return;
          }
  
          await supabase
            .from('Person') 
            .insert([{
              E_Mail_Adresse: this.email,
              Passwort: this.password,
              Vorname: this.firstName,
              Nachname: this.lastName,
              Rolle: this.role
            }]);
          this.$router.push('/loginpage');
        } catch (error) {
          this.errorMessage = 'Fehler beim Erstellen des Kontos';
        }
      }
    }
  };
  </script>
