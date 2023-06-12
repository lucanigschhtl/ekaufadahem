<template>  
    <b-modal v-model="isCreateCustomerModalShown" scrollable size="lg" @hide="setCreateCustomerModalShowState(false)"> 
        <template #modal-header>
          <h5>Neue Kund:Inn anlegen</h5>
        </template> 
            <b-spinner v-if="this.IsLoading" label="Spinning"></b-spinner>          
            <p v-if="this.feedback!=''">Achtung: {{this.feedback}}</p>
            <b-row class="mb-2">
             <b-col>
             <h6 v-if="userType==undefined">UserType auswählen</h6>
             <b-form-select v-model="userType" :options="options"></b-form-select>
             <small v-if="userType==1">Bei diesem KundenTyp ist keine Emailadresse zwingend notwendig.</small>
            </b-col>
            </b-row>
            <b-container class="p-0" v-if="userType!=undefined">
              <b-row class="mb-2">
                      <b-col>
                        <b-form-input placeholder="Vorname" type="text" v-model="firstName"/>
                      </b-col>
                      <b-col>
                        <b-form-input placeholder="Nachname" type="text" v-model="lastName"  />
                      </b-col>
              </b-row>
              <b-row class="mb-2">
                  <b-col>
                    <small></small>
                      <b-form-input placeholder="Telefonnummer (+435894737584)" type="tel" v-model="tel" />
                    
                  </b-col>
                   <b-col>
                      <b-form-input placeholder="Email" type="email" v-model="email"/>
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col cols="4">
                      <b-form-input placeholder="Straße" type="text" v-model="street" />
                  </b-col>
                   <b-col cols="2">
                      <b-form-input placeholder="Nr" type="text" v-model="housenumber"  />
                  </b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col cols="4">
                      <b-form-input placeholder="Postleitzahl" type="number" v-model="plz" />
                  </b-col>
                  <b-col cols="8">
                      <b-form-input placeholder="Ort" type="text" v-model="place"/>
                  </b-col>                    
              </b-row>
            </b-container>
           
            
          <template #modal-footer>  
                 <b-btn
                  class="float-left"
                  variant="primary"
                  @click="submit()"
                  v-if="validateInputs()"
                >
                  Speichern
                 </b-btn>   
                 <b-btn
                  class="float-right"
                  variant="default"
                  @click="setCreateCustomerModalShowState(false)"
                >
                  Schließen
                 </b-btn>                          
          </template>     
                  
      </b-modal> 
</template>
<script>

import {mapGetters, mapMutations,mapActions} from 'vuex'
import BackendConnection from '../services/authorizedapi';

export default {
components: {},
name: 'PickerCreateCustomerModal',
methods:{
...mapActions(["fetchPickerSearch"]),
...mapMutations(['setCreateCustomerModalShowState']),
async submit(){
     
         this.IsLoading=true
         var response = await BackendConnection.post("/user",{"firstName":this.firstName,"lastName":this.lastName,"tel":this.tel,"street":this.street,"place":this.place,"plz":this.plz,"email":this.email,"housenumber":this.housenumber,"userType":this.userType}) 
         this.IsLoading=false

         //tel already in use
         if(response.status==441)
         {
           this.feedback="Diese Telefon-Nummer ist bereits in Verwendung."
           this.tel=""
           return  
         }

        if(response.status==442)
         {
           this.feedback="Diese Email-Adresse ist bereits in Verwendung."
           this.email=""
           return  
         }

         if(response.status!=200)
         {
           this.feedback="Fehler aufgetreten"
           return
         }
         this.IsRegistered=true 
         this.fetchPickerSearch("")
         this.setCreateCustomerModalShowState(false)
         this.reset()
     
   },
   reset() {
      this.firstName= ""
      this.lastName=""
      this.tel="",
      this.plz="",
      this.place="",
      this.street="",
      this.feedback="",
      this.IsRegistered=false,
      this.IsLoading=false,
      this.email="",
      this.housenumber=""
    },
    validateInputs(){
    if(this.userType==1){
    if(!(this.firstName!=""&&this.lastName!=""&&this.tel!=""&&this.plz!=""&this.housenumber!=""&&this.street!=""&&this.place!=""))
    {
      return false
    }
    return true

  }
  if(this.userType==2){
     if(!(this.firstName!=""&&this.lastName!=""&&this.tel!=""&&this.plz!=""&this.housenumber!=""&&this.street!=""&&this.place!=""&&this.email!=""))
      {
          return false
      }
      return true
    
  }
  return false
}

},
computed:{   
...mapGetters(['isCreateCustomerModalShown'])
},
data(){
    return{
      firstName: "",
      lastName:"",
      tel:"",
      plz:"",
      place:"",
      street:"",
      feedback:"",
      userType:undefined,
      IsRegistered:false,
      IsLoading:false,
      email:"",
      housenumber:"",
      options:[
        {value:1, text:"Ohne Kundenzugang"},
        {value:2,text:"Mit Kundenzugang"}
      ]
    }
},
}
</script>

