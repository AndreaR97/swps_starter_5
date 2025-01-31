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
    <v-dialog
      v-model="showVerificationDialog"
      persistent
      max-width="400px"
    >
      <v-card style="border: 4px solid #009260; padding: 20px; border-radius: 10px;">
        <v-card-title class="text-h5" style="justify-content: center; text-align: center;">
          Code eingeben
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center" style="text-align: center;">
          <div>Gib den Code ein der an deine E-mail geschickt wurde.</div>
          <v-row class="mt-4" justify="center" align="center">
            <v-col
              cols="2"
              class="ma-0 pa-0 d-flex justify-center"
              v-for="(digit, index) in codeDigits"
              :key="index"
            >
              <v-text-field
                variant="outlined"
                v-model="codeDigits[index]"
                maxlength="1"
                style="width: 40px; text-align: center;"
                class="mx-1"
                :ref="`digit${index}`"
                @input="handleDigitInput(index)"
                @keydown="handleDigitBackspace(index, $event)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex flex-column align-center">
          <v-btn color="primary" @click="resendCode" class="mb-2">
            Code erneut senden
          </v-btn>
          <v-btn color=#009260 @click="confirmVerification" class="mb-2">
            Bestätigen
          </v-btn>
          <div 
            style="text-decoration: underline; color: #1976D2; cursor: pointer;"
            @click="changeEmail"
          >
            E-Mail-Adresse ändern
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';
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
      errorMessage: '',
      showVerificationDialog: false,
      codeDigits: ['', '', '', '', '', ''],
      canCreateAccount: false,
      serverCode: ''
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
      return v => v.toLocaleLowerCase() === this.email.toLocaleLowerCase() 
        || 'E-Mail Bestätigung muss mit der E-Mail übereinstimmen';
    },
    passwordRule() {
      return v => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,30}$/.test(v) || 'Passwort muss 8-30 Zeichen lang sein und Buchstaben, Zahlen und Sonderzeichen enthalten';
    },
    isFormValid() {
      return (
        this.firstName &&
        this.lastName &&
        this.role &&
        this.emailRule(this.email) === true &&
        this.confirmEmailRule(this.confirmEmail) === true &&
        this.passwordRule(this.password) === true
      );
    }
  },
  methods: {
    generateRandomCode() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    },
    async validateForm() {
      this.errorMessage = '';
      if (!this.isFormValid) {
        this.errorMessage = 'Bitte füllen Sie alle Felder korrekt aus';
        return;
      }
      try {
        const emailLower = this.email.toLocaleLowerCase();
        const { data: existingUser } = await supabase
          .from('Person')
          .select('E_Mail_Adresse')
          .eq('E_Mail_Adresse', emailLower)
          .single();
        
        if (existingUser) {
          this.errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet';
          return;
        }
        this.canCreateAccount = true;
        this.serverCode = this.generateRandomCode();
        try {
          await emailjs.send(
            'service_dafafbr',
            'template_7hofqxd',
            {
              to_name: this.firstName,
              to_email: this.email,
              from_name: 'campusconnect',
              message: this.serverCode
            },
            'O-8oRDyiDSI8iVivd'
          );
        } catch (mailError) {
          this.errorMessage = 'Fehler beim Senden der E-Mail: ' + mailError;
          return;
        }
        this.showVerificationDialog = true;
      } catch (error) {
        this.errorMessage = 'Fehler beim Überprüfen der E-Mail-Adresse';
      }
    },
    async confirmVerification() {
      const fullCode = this.codeDigits.join('');
      console.log('Eingegebener Code:', fullCode);

      if (fullCode.length !== 6) {
        this.errorMessage = 'Der code ist nicht vollständig (6 Ziffern)!';
        return;
      }
      if (fullCode !== this.serverCode) {
        this.errorMessage = 'Der Code stimmt nicht überein.';
        return;
      }
      if (!this.canCreateAccount) {
        this.errorMessage = 'Etwas ist schiefgelaufen. Bitte erneut versuchen.';
        return;
      }
      try {
        await supabase
          .from('Person')
          .insert([{
            E_Mail_Adresse: this.email.toLocaleLowerCase(),
            Passwort: this.password,
            Vorname: this.firstName,
            Nachname: this.lastName,
            Rolle: this.role
          }]);
        this.$router.push({
          path: '/loginpage',
          query: { redirectTo: this.$route.query.redirectTo }
        });
      } catch (error) {
        this.errorMessage = 'Fehler beim Erstellen des Kontos';
      }
    },
    async resendCode() {
      console.log('Code erneut senden');
      if (!this.canCreateAccount) {
        this.errorMessage = 'E-Mail nicht geprüft. Bitte Formular erneut ausfüllen.';
        return;
      }
      this.serverCode = this.generateRandomCode();
      try {
        await emailjs.send(
          'service_dafafbr',
          'template_7hofqxd',
          {
            to_name: this.firstName,
            to_email: this.email,
            from_name: 'campusconnect',
            message: this.serverCode
          },
          'O-8oRDyiDSI8iVivd'
        );
      } catch (mailError) {
        this.errorMessage = 'Fehler beim erneuten Senden: ' + mailError;
      }
    },
    changeEmail() {
      console.log('E-Mail-Adresse ändern');
      this.showVerificationDialog = false;
    },
    handleDigitInput(index) {
      if (this.codeDigits[index].length === 1 && index < this.codeDigits.length - 1) {
        this.$nextTick(() => {
          const nextRef = this.$refs[`digit${index + 1}`];
          if (Array.isArray(nextRef) && nextRef[0]) {
            nextRef[0].focus();
          } else if (nextRef && typeof nextRef.focus === 'function') {
            nextRef.focus();
          }
        });
      }
    },
    handleDigitBackspace(index, event) {
      if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
        this.$nextTick(() => {
          const prevRef = this.$refs[`digit${index - 1}`];
          if (Array.isArray(prevRef) && prevRef[0]) {
            prevRef[0].focus();
          } else if (prevRef && typeof prevRef.focus === 'function') {
            prevRef.focus();
          }
        });
      }
    }
  }
};
</script>
