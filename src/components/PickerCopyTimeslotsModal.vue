<template> 
        <div>          
          
            <b-modal v-model="isShown"   scrollable header="Hello" size="lg" @hide="isShown=false"> 
              <template #modal-header>   
                <h1>Zeiträume kopieren</h1>             
            </template>  
            <b-row>
                <b-col>
                <h5>Ursprung</h5>
                  <v-date-picker @input="updateCopyFromEvent" locale="de"   v-model="copyRange" is-range />
                </b-col>
                <b-col v-if="copyRange.start!=null">
                <h5 >Ziel</h5>
                 <v-date-picker  locale="de" :disabled-dates="getDisabledWeekdays" v-model="copyTo" />
                </b-col>
            </b-row> 
            <b-btn  @click="submitCopy()" class="mt-3" variant="primary" v-if="isInputValid">Kopieren</b-btn>
            <template #modal-footer="{ hide }">  
                <b-btn variant="secondary" @click="hide()" float="right">Abbrechen</b-btn>
            </template> 
            </b-modal> 
        </div>
</template>
<script>

import {mapActions} from 'vuex'
import BackendConnection from '../services/authorizedapi';

export default {
  components: {},
  name: 'PickerCopyTimeslotsModal',
  methods:{     
    ...mapActions(['refreshPlaces']),
    async showModal(from) {
        this.from=from
        this.isShown = true
    },

    updateCopyFromEvent(){
     this.copyTo=null
    },
    async submitCopy(){
      if(!this.isInputValid)
        return false

       var response = await BackendConnection.post("/timeslots/copy",{originFrom:this.copyRange.start,originTo:this.copyRange.end,targetFrom:this.copyTo})
          
      if(response.status!=201)
          {
            console.log("Fehler aufgetreten!")
            return
          }

      this.copyRange.start=null
      this.copyRange.end=null
      this.copyTo=null
      this.$parent.refreshTimeslots()
      this.isShown=false
      console.log(response)
    } 

  },
  computed:{   

    isInputValid(){

      if(!this.$moment(this.copyRange.start).isValid())
          return false
      
      if(!this.$moment(this.copyRange.end).isValid())
        return false

      if(!this.$moment(this.copyTo).isValid())
        return false
      
      return true
    },

    getDisabledWeekdays(){
      var weekdays = [1,2,3,4,5,6,7]
      if(this.$moment(this.copyRange.start).isValid())
      {
        const index = weekdays.indexOf(parseInt(this.$moment(this.copyRange.start).format('d'))+1)
        weekdays.splice(index,1)
      }

      return [{weekdays:weekdays},{start:this.copyRange.start,end:this.copyRange.end}]
    }
     
  },
  data(){
      return {
       isShown:false,
       timeslotData:null,
       copyRange:{
            start:null,
            end:null
        },
        copyTo:null,
      }
  }
}
</script>
