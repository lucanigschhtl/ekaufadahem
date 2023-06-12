<template>
  
      <b-container class=" p-5">
        <b-row align-v="center" align-h="center">          
            <div>      
               <b-img style="width:30vw" :src="require(`../assets/logoekaufa.png`)"/>                  
                <h1>Login</h1>
                <p>Hier können sich zum Einkaufsportal "Ekaufa Dahem" anmelden</p>
                <b-row>
                  <b-col class="m-1" sm>
                     <b-alert variant="warning" data-cy="alertbox" :show="feedback.length>0">{{feedback}}</b-alert>
                    <b-form-input placeholder="Email-Adresse" data-cy="emailinput" type="email" v-model="email" ></b-form-input>
                    <b-form-input class="mt-3" data-cy="passwordinput" @keyup.enter="submit()" placeholder="Passwort" type="password" v-model="password"></b-form-input>
                    <b-button  variant="primary" data-cy="submit" class="mt-2" @click="submit()">Absenden</b-button> 
                  </b-col>
                   <b-col class="m-1" sm>
                    <side-navigation/>
                  </b-col>
                </b-row>            
            </div>          
        </b-row>       
      </b-container>
  
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import SideNavigation from '../components/navigation/TheNobodySideNavigation.vue';
import {HTTP} from '../services/api';

export default {
  components: {SideNavigation },
  name: "Login",
  data(){
    return{
      email:"",
      password:"",
      feedback:""        
    }
  },
  methods: {
    ...mapMutations(["setUserLoggedIn","setAccessToken","setRefreshToken","setAuthorization"]),
    async submit(){
        if(this.email!=""&this.password!="")
        {
            var response = await HTTP.post("/user/login",{email:this.email,password:this.password})

            //password false
            if(response.status==435)
            {
              this.feedback="Falsches Passwort"
              return
            }

            //password false
            if(response.status==404)
            {
              this.feedback="Dieses Konto existiert nicht"
              return
            }          


            if(response.status!=200)
            {            
              this.feedback="Fehler aufgetreten"
              return
            }

            this.setAuthorization(response.data.userType)
            this.setAccessToken(response.data.accessToken)
            this.setRefreshToken(response.data.refreshToken)  
            this.$router.push({name:'CustomerOrders'})                  
          
        }
    }   
  },
  computed: mapGetters(["isUserLoggedIn"]) 
};
</script>
