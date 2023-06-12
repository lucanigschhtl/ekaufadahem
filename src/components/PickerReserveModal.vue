<template>  
          <b-modal v-model="isReserveModalShown"  @show="loadPlaceData()"  scrollable size="xl" @hide="setReserveModalShowState(false)"> 
              <template #modal-header>
                <h5>Reservierungs-Möglichkeiten</h5>
                 
              </template>           
                <h1>Platz-Auswahl</h1>
                 <small v-if="isReserveModalShown==true">Gewählter PickupType: {{TypeConverter.getOrderPickupTypeDetailById(getReserveModalPickupType).title}}</small>
               <div if="isLoading!=true">
                    <b-form-checkbox class="mt-2" v-if="getReserveModalPickupType==1" size="lg" v-model="traysBool">Fächer direkt öffnen</b-form-checkbox>
                  <b-container>
                    <b-row>
                    <!-- Vorne links spalten namen -->
                      <b-col>
                      
                        <b-row style="height:95px"></b-row>
                        <b-row class="rowelement" style="border-bottom:1px solid"><h6>Aktuelle Belegung</h6></b-row>
                         <b-row class="rowelement" style="border-bottom:1px solid" v-if="activeTimeslot!=null" >
                         <b-col>
                          <h6>Reservierungen für den aktuellen Zeitraum</h6>
                          {{$moment(activeTimeslot.from).format("LLL")}}--{{$moment(activeTimeslot.to).format("LLL")}}
                         </b-col>
                         </b-row>
                        <b-row class="rowelement" style="border-bottom:1px solid" v-for="timeslot in futureTimeslots" :key="timeslot._id">
                          <b-col>
                          <h6>Zukünftige Reservierung</h6>
                          {{$moment(timeslot.from).format("LLL")}}--{{$moment(timeslot.to).format("LLL")}}
                          </b-col>
                        </b-row>
                      </b-col>
                    <!-- Daten -->
                   <b-col  :class="{selected:  isPlaceSelected(activePlace._id)}"  v-for="(activePlace,index) in activePlaces" :key="activePlace._id">
                      <b-row class="mb-2"><h3>Platz {{index+1}}</h3></b-row>
                      <b-row style="height:40px" class="mb-1"><b-btn  variant="success" v-if=" isSelectable(activePlace)"  @click="togglePlaceSelect(activePlace)">Auswählen</b-btn></b-row>
                        <b-row class="rowelement">
                          <div class="primaryField" @click="showOrder(activePlace.order._id)" v-if="activePlace.order">
                            Bestellung #{{activePlace.order.nr}}
                          </div>
                          <div class="successField"  v-else>
                              Frei
                          </div>
                        </b-row >
                        <b-row class="rowelement" v-if="activeTimeslot!=null"> 
                            <div  @click="showOrder(getResForPlaceFromT(activeTimeslot,activePlace._id).order._id)" v-if="getResForPlaceFromT(activeTimeslot,activePlace._id).booked&&getResForPlaceFromT(activeTimeslot,activePlace._id).order!=undefined">
                              Bestellung #{{getResForPlaceFromT(activeTimeslot,activePlace._id).order.nr}}
                          </div>
                          <div class="neutralField" v-else-if="getResForPlaceFromT(activeTimeslot,activePlace._id).booked&&getResForPlaceFromT(activeTimeslot,activePlace._id).order==undefined">
                              Neutrale Reservierung
                          </div>
                          <div class="successField" v-else>
                             Frei
                          </div>
                        </b-row>
                       
                        <b-row class="rowelement" v-for="timeslot in futureTimeslots" :key="timeslot._id">
                          <div   class="primaryField"  @click="showOrder(getResForPlaceFromT(timeslot,activePlace._id).order._id)" v-if="getResForPlaceFromT(timeslot,activePlace._id).booked&&getResForPlaceFromT(timeslot,activePlace._id).order!=undefined">
                              Bestellung #{{getResForPlaceFromT(timeslot,activePlace._id).order.nr}}
                          </div>
                          <div class="neutralField"  v-else-if="getResForPlaceFromT(timeslot,activePlace._id).booked&&getResForPlaceFromT(timeslot,activePlace._id).order==undefined">
                              Neutrale Reservierung
                          </div>
                          <div class="successField" v-else>
                             Frei
                          </div>
                        </b-row>
                   </b-col>
                   </b-row>
                  </b-container>
                     <!--  
                    <div class="m-2"  :class="{ disabled:  !isSelectable(item.place)}" v-for="item in reserveModalOptions[1]" :key="item.place._id">
                    <b-card :class="{ selected:  isPlaceSelected(item.place._id)}" @click="togglePlaceSelect(item.place)">
                    {{item.place}}
                    <h5>Reservierungen im aktiven Zeitraum</h5>
                    <div v-for="reservation in item.currentReservation" :key="reservation._id">
                    </div>
                      <h5>Reservierungen im aktiven Zeitraum</h5>
                     <div v-for="reservation in item.futureReservations" :key="reservation._id">
                    </div>
                    </b-card>
                    
                      <b-card>
                        <b-card-title>{{place.name}}</b-card-title>
                        <b-card-sub-title>{{place.order}}</b-card-sub-title>
                        <b-card-body>
                        <b-row>
                        <b-col @click="togglePlaceSelect(tray)" :class="{ disabled:  !isSelectable(tray)}" v-for="tray in box.trays" :key="tray.id">
                            <b-card  class="mb-3" md="auto" :class="{ selected:  isPlaceSelected(tray.place.id)}"  >
                                <b-card-title> {{tray.name}}</b-card-title>
                                <b-card-sub-title>{{tray.size.size}}<br> {{tray.open | trayOpen}}</b-card-sub-title>
                                <b-card-body>   
                             
                                  <b-row>                            
                                    <div class="mr-2">
                                        <h5>Reale Belegung</h5>
                                        <h3> 
                                          <b-badge class="mt-2" v-if="tray.state.id==4" v-b-tooltip.hover.bottom title="Das Fach ist momentan frei." variant="success">Frei</b-badge>
                                          <b-badge class="mt-2" v-else-if="tray.state.id==3" v-b-tooltip.hover.bottom title="Es liegt im momentan aktiven Abholzeitraum eine neutrale Reservierung vor. Sie ist aber keiner Bestellung zugeteilt." variant="info">Reservierung</b-badge>  
                                          <div class="mt-2"  v-else-if="tray.state.id==5">          
                                            <b-badge v-if="tray.activePlaceReserve.purchase==reserveModalActiveOrder" v-b-tooltip.hover.bottom title="Es liegt im momentan aktiven Abholzeitraum eine Bestell-Reservierung vor. Diese Reservierung gehört zu der momentan aktiven Bestellung." variant="success">Reservierung #{{tray.activePlaceReserve.purchase}}</b-badge>
                                            <b-badge  v-else variant="secondary" v-b-tooltip.hover.bottom title="Es liegt im momentan aktiven Abholzeitraum eine Bestell Reservierung vor. Diese Reservierung gehört jedoch nicht zu der momentan aktiven Bestellung.">Reservierung #{{tray.activePlaceReserve.purchase}}</b-badge>
                                          </div>
                                          <b-badge class="mt-2" v-else-if="tray.state.id==6"  variant="warning" v-b-tooltip.hover.bottom title="In diesem Fach befindet sich momentan eine Bestellung, jedoch ist für diese keine Reservierung vorhanden.">#{{tray.place.order}} Ohne Reservierung</b-badge>
                                          <b-badge class="mt-2" v-else-if="tray.state.id==7"  variant="secondary" v-b-tooltip.hover.bottom title="In diesem Fach befindet sich momentan eine Bestellung mit einer gültigen Reservierung.">#{{tray.place.order}}</b-badge>
                                        </h3> 
                                    </div>
                                  
                                    <div>
                                    
                                    <h5>Zukünftige Belegung</h5>
                                   
                                      <b-container>
                                       
                                            <b-col class="mr-1" v-for="timeslot in tray.futureTimeslots" :key="timeslot.id">
                                              <h3>
                                              <b-badge class="mt-2"  v-b-tooltip.hover.bottom="{ variant: 'info' }" :title=" $moment(timeslot.to).format('LLL') + ' -> '+ $moment(timeslot.to).format('LLL')" v-if="timeslot.state.id==4" variant="success">Frei</b-badge>
                                              <b-badge class="mt-2" v-else-if="timeslot.state.id==3" v-b-tooltip.hover.bottom="{ variant: 'info' }" :title=" $moment(timeslot.to).format('LLL') + ' -> '+ $moment(timeslot.to).format('LLL')" variant="info">Reserve</b-badge>
                                              <div class="mt-2"  v-else-if="timeslot.state.id==5" >    
                                                 <b-badge v-if="timeslot.state.reserve.purchase==reserveModalActiveOrder" v-b-tooltip.hover.bottom="{ variant: 'info' }" :title=" $moment(timeslot.to).format('LLL') + ' <-> '+ $moment(timeslot.to).format('LLL')" variant="success">Reservierung #{{timeslot.state.reserve.purchase}}</b-badge>
                                                <b-badge v-else v-b-tooltip.hover.bottom="{ variant: 'info' }" :title=" $moment(timeslot.to).format('LLL') + ' -> '+ $moment(timeslot.to).format('LLL')" variant="secondary">Reservierung #{{timeslot.state.reserve.purchase}}</b-badge>
                                              </div>
                                              </h3> 
                                            </b-col>
                                           
                                        </b-container>
                                    </div>
                                    </b-row>                                  
                                  </b-card-body>
                                </b-card>
                                </b-col>
                              </b-row>
                        </b-card-body>
                      </b-card>
                      
                    </div>
                     -->
                </div>
                    
                  <template #modal-footer>  

                      <b-btn variant="primary" @click="bookOrder()" v-if="selectedPlaces.length!=0" class="float-left">
                        Bestellung zuweisen
                      </b-btn>
                      <b-button
                      class="float-right"
                      variant="default"
                      @click="setReserveModalShowState(false)"
                    >
                      Schließen
                      </b-button>                          
                  </template>     
            </b-modal>
          
</template>

<style scoped>
.selected {
  border-style: dotted;
  border-width: thick;
  border-color:black;
}
.placeElement{
  border:solid;
  border-radius:5px;
  margin-left:5px;
  
}

.rowelement{
  height:80px;
  vertical-align:left;
  

}


.disabled{
  opacity:0.5;
  
}

.primaryField{
background-color:blue;
width: 100%;
color:white;
text-align:center;
vertical-align:middle;
font-size:2rem;
font-weight:500;
}

.successField{
background-color:green;
width: 100%;
color:white;
text-align:center;
vertical-align:middle;
font-size:2rem;
font-weight:500;
}

.secondaryField{
background-color:grey;
width: 100%;
color:white;
text-align:center;
vertical-align:middle;
font-size:2rem;
font-weight:500;
}

.neutralField{
background-color:#40E0D0;
width: 100%;
color:white;
text-align:center;
vertical-align:middle;
font-size:2rem;
font-weight:500;
}



</style>

<script>



import {mapActions,mapGetters, mapMutations} from 'vuex'
import Vue from 'vue';
import BackendConnection from '../services/authorizedapi';
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: {},
  name: 'PickerReserveModal',
  methods:{
      
       ...mapActions(['showCustomer','showOrder','bookOrder']),
      ...mapMutations(['setReserveModalShowState','togglePlaceSelect','setOpenTraysBool']),
      isSelectable(place){
        if(place.order==null)
          return true 
        // if(tray.state.id==4||tray.state.id==3||(tray.state.id==5&&tray.activePlaceReserve.purchase==this.reserveModalActiveOrder))
        //   return true

        return false
      },
    async loadPlaceData(){
      this.isLoading=true
      const pickupType = this.getReserveModalPickupType
      await this.getPlacesByPickupType(pickupType)
      await this.getFutureTimeslotsByPickupType(pickupType)
      await this.getActiveTimeslotsByPickupType(pickupType)
      this.isLoading=false
    },
    async getPlacesByPickupType(pickupTypeId){
      var response = await BackendConnection.get("/places/pickupType/"+pickupTypeId)
          if(response.status!=200){
              Vue.swal('Achtung',"Places laden hat nicht funktioniert",'error')
              return
          }
      this.activePlaces= response.data

    },
     async getFutureTimeslotsByPickupType(pickupTypeId){
      var response = await BackendConnection.get("/timeslots/pickupTypes/"+pickupTypeId+"/future")
          if(response.status!=200){
              Vue.swal('Achtung',"Zukünftige Timeslots laden hat nicht funktioniert",'error')
              return
          }

     
      this.futureTimeslots= response.data
     },
     async getActiveTimeslotsByPickupType(pickupTypeId){
        var response = await BackendConnection.get("/timeslots/pickupTypes/"+pickupTypeId+"/active")
        if(response.status!=200){
            Vue.swal('Achtung',"Den Aktiven Timeslot laden hat nicht funktioniert",'error')
            return
        }
      this.activeTimeslot= response.data
     },

     getResForPlaceFromT(timeslot,placeId){
      const placeReservations = timeslot.placeReservations
      const filterReservations = placeReservations.filter(reservation=>reservation.place==placeId)
      if(filterReservations[0]==undefined)
        return {booked:false,order:undefined}
      return filterReservations[0]

     }

    
    },
  computed:{   
      ...mapGetters(['isReserveModalLoading','isReserveModalShown','reserveModalOptions','reserveModalActiveOrder','isPlaceSelected','openTraysBool','getReserveModalPickupType','selectedPlaces']),
        traysBool: {
          get () {
            return this.openTraysBool
          },
          set (newState) {
            this.setOpenTraysBool(newState)
          }
        }
  },
  data(){
      return {
        TypeConverter,
        selectedPickupType : null,
        activePlaces : [],
        activeTimeslot : null,
        futureTimeslots : [],
        isLoading:false,
        fields: [
            { key: "checkbox", label: "Erledigt",class:["d-none", "d-print-block"]},
            { key: "name", label: "Name", sortable: true},
            { key: "category", label: "Kategorie", sortable: true},
             { key: "tags", label: "Tags"},
            { key: "menge", label: "Menge"}            
           
        ],
      }
  },
  filters: {
    formatAmount (unit) {
      return parseFloat(unit.toString());
    },
    trayOpen(open){
      if(open==0)
        return "geschlossen"
      return "bereits geöffnet"
    }
  }  
}
</script>
