<template> 
        <div>
            <b-modal v-model="isShown" scrollable header="Hello" size="lg" @hide="isShown=false"> 
              <template #modal-header>
                <b-container v-if="isLoading">
                 <b-row>                 
                     <h2>Timeslot</h2>
                </b-row>
                 <b-row>
                  <b-col>
                  <h5>PickupTyp</h5><b-skeleton animation="wave" width="40%"></b-skeleton>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                  <h5>von</h5><b-skeleton animation="wave" width="40%"></b-skeleton>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                  <h5>bis</h5><b-skeleton animation="wave" width="40%"></b-skeleton>
                 </b-col>
                </b-row>               
              </b-container>
                <b-container v-else>
                <b-row>
                  <h2>Timeslot</h2>
                </b-row>
                <b-row>
                  <b-col>
                  <h5>PickupTyp</h5>
                  {{TypeConverter.getOrderPickupTypeDetailById(timeslotData.pickupType).title}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                  <h5>von</h5>
                  {{$moment(timeslotData.from).format('LLL')}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                <h5>bis</h5>
                {{$moment(timeslotData.to).format('LLL')}}
                </b-col>
                </b-row>
              </b-container>
            </template>   
            <h5>Plätze</h5>
            <div v-if="isLoading">
                  <b-skeleton class="mb-2" type="button" animation="fade" ></b-skeleton>
                  <b-skeleton class="mb-2" type="button" animation="fade"></b-skeleton>
                  <b-skeleton class="mb-2" type="button" animation="fade" ></b-skeleton>
            </div>
            <div v-else>
              <b-col class="mb-2" v-for="placeReservation in timeslotData.placeReservations" :key="placeReservation.id">
                  <div v-if="!placeReservation.booked">
                    <b-button-group>
                        <b-dropdown text="Frei" variant="success" class="mx-1" right>
                          <b-dropdown-item variant="info" @click="createNeutralReserve(placeReservation._id)">Reserve erstellen</b-dropdown-item>
                          <b-dropdown-divider></b-dropdown-divider>
                          <b-dropdown-form>
                            <b-row>
                              <small>Bestellreservierung</small>
                              <b-input class="w-50" variant="primary" placeholder="id"></b-input>
                              <b-btn class="ml-2" variant="primary" @click="createOrderReserve($event,placeReservation._id)"  size="sm">Ok</b-btn>
                            </b-row>
                          </b-dropdown-form>
                        </b-dropdown>
                    </b-button-group>
                  </div>  
                  <div v-else-if="placeReservation.booked&&placeReservation.order==undefined">
                    <b-button-group>
                        <b-dropdown text="Reserve" variant="info" class="mx-1" right>
                          <b-dropdown-item variant="danger" @click="removeReservation(placeReservation._id)">Reserve Löschen</b-dropdown-item>
                        </b-dropdown>
                    </b-button-group>
                  </div>
                  <div v-else>
                      <b-button-group>
                        <b-dropdown variant="outline-primary" :text="'#'+placeReservation.order.nr" class="mx-1" right>
                          <b-dropdown-item variant="primary" @click="showOrder(placeReservation.order._id)">Bestellung ansehen</b-dropdown-item>
                          <b-dropdown-item variant="danger" @click="removeReservation(placeReservation._id)">Reservierung Löschen</b-dropdown-item>
                        </b-dropdown> 
                      </b-button-group>
                  </div>
              </b-col>
            </div>
            <template #modal-footer="{ hide }">  
              <div class="w-100">
                <div v-if="!isLoading">
                  <b-btn v-if="timeslotData.isDeletable" float="left" @click="removeTimeslot()" variant="danger">Löschen</b-btn> 
                  </div>  
                <b-skeleton v-else float="left"  type="button" animation="fade"></b-skeleton>
                <b-btn variant="secondary"  class="float-right" @click="hide()">Schließen</b-btn>
              </div>
            </template> 
            </b-modal> 
        </div>
</template>
<script>

import {mapActions} from 'vuex'
import BackendConnection from '../services/authorizedapi';
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: {},
  name: 'PickerTimeslotPlanningModal',
  methods:{     
    ...mapActions(['showCustomer','showOrder','refreshPlaces']),
    async showModal(timeslotId) {
        this.timeslotId=timeslotId
        await this.fetchTimeslotData()
        this.isShown = true
    },
    async fetchTimeslotData(){
      this.isShown=true
      this.isLoading=true
       var response = await BackendConnection.get('/timeslots/'+this.timeslotId)

        if(response.status!=200){
            console.log("Fehler aufgetreten")
            return
          }

        this.isLoading=false

        this.timeslotData = response.data
    },
    async createNeutralReserve(placeReservationId){
       var response = await BackendConnection.put('/timeslots/'+this.timeslotId+'/reserves/neutral',{placeReservationId})

        if(response.status!=201){
            console.log("Fehler aufgetreten")
            return
          }
        this.fetchTimeslotData()
        this.$parent.refreshTimeslots()
    },
    async createOrderReserve(event,placeReservationId){
      const orderNr = event.currentTarget.form[0]._value
      var response = await BackendConnection.put('/timeslots/'+this.timeslotId+'/reserves/order',{placeReservationId,orderNr})

      if(response.status!=201){
          console.log("Fehler aufgetreten")
          return
        }
      this.fetchTimeslotData()
      this.$parent.refreshTimeslots()
    },
     async removeReservation(placeReservationId){
       var response = await BackendConnection.delete('/timeslots/'+this.timeslotId+'/reserves/'+placeReservationId)

        if(response.status!=200){
            console.log("Fehler aufgetreten")
            return
        }
        this.fetchTimeslotData()
        this.$parent.refreshTimeslots()
    },
    async removeTimeslot(){
       var response = await BackendConnection.delete('/timeslots/'+this.timeslotId)

        if(response.status!=200){
            console.log("Fehler aufgetreten")
            return
        }
       
        this.isShown=false
        this.$parent.refreshTimeslots()
    }
  },
  computed:{   
     
  },
  data(){
      return {
      TypeConverter,
      isLoading:true,
       isShown:false,
       timeslotData:null,
       timeslotId:null
      }
  },
  filters: {
    formatAmount (unit) {
      return parseFloat(unit.toString());
    }
  }
}
</script>
