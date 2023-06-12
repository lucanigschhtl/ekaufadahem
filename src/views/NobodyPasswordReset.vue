<template>
  
      <b-container class=" p-5">
        <b-row  align-v="center" align-h="center">          
            <div>      
               <b-img style="width:30vw" :src="require(`../assets/logoekaufa.png`)"/> 
                <div v-if="!IsReset">                 
                  <h1>Passwort Zurücksetzen</h1>
                  <p>Hier können Sie ihr Passwort Zurücksetzen</p>
                </div>
                <b-row >                  
                  <b-col class="m-1" sm>
                    <div v-if="!IsReset">
                      <div v-if="!IsLoading">
                        <b-alert :show="feedback.length>0" data-cy="alertbox" variant="warning">{{feedback}}</b-alert>
                        <b-form-input placeholder="Email-Adresse" data-cy="emailinput" type="email" :state="validateEmail" v-model="email" ></b-form-input>
                        <b-button  variant="primary"  class="mt-2" data-cy="submit" @click="submit()">Zurücksetzen</b-button>
                      </div>
                      <!-- Loading Spinner -->
                      <loading-spinner v-if="IsLoading"/>
                    </div>
                    <div v-if="IsReset">
                      <h2>Gratuliere <b-icon icon="emoji-wink" variant="success"/></h2>
                      <p> Du solltest in den folgenden Minuten eine Email mit einem Link erhalten.</p>
                      <p> Tipp! Schau auch im Junk-Mail-Ordner nach.</p>
                    </div>
                  </b-col>
                  <b-col  class="m-1" sm>
                    <side-navigation/>
                  </b-col>
                </b-row>            
            </div>          
        </b-row>       
      </b-container>
  
</template>
<script>

import SideNavigation from '../components/navigation/TheNobodySideNavigation.vue';
import {HTTP} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  components: {SideNavigation, LoadingSpinner },
  name: "PasswordReset",
  data(){
    return{
      email:"",
      IsReset:false,
      IsLoading:false,  
      feedback:""   
    }
  },
  methods: {   
    async submit(){
        if(this.validateEmail)
        {
          this.IsLoading=true
          var response = await HTTP.put("/user/resetPassword",{"email":this.email}) 
          this.IsLoading=false

           //email already in use
          if(response.status==404)
          {
            this.feedback="Ein Konto mit dieser Email-Adresse ist nicht vorhanden."
            this.email=""
            return
          }

          if(response.status!=200)
          {            
            this.feedback="Fehler aufgetreten"
            return
          }
          this.IsReset=true          
        }      
        this.feedback="Bitte geben Sie Ihre Email-Adressse an!"
    }  
  },
  computed: {    
    validateEmail(){
      if(this.email == "")
          return false
      
      if(!this.email.includes("@"))
          return false
      return true
    }
  }
};
</script>
