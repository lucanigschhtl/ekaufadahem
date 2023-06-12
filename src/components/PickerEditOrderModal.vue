
<template>  
          <b-modal  v-model="isEditOrderModalShown" v-if="tempOrderModalData!=null" scrollable  size="lg" @hide="setEditOrderModalShowState(false)"> 
              <template #modal-header>
                <h5>Bestellung bearbeiten</h5>
              </template>           
                  <b-row>
                       <b-col>
                            <h1>#{{tempOrderModalData.nr}}</h1>
                            <h3 class="d-none d-print-block">@{{tempOrderModalData.user._id}}  {{tempOrderModalData.user.firstName}} {{tempOrderModalData.user.lastName}}</h3>
                        </b-col>
                  </b-row>
                  <b-row class="d-none d-print-block">
                    <b-col>
                        <b>Stand</b><br> {{$moment().format("LLLL")}}
                      </b-col>
                  </b-row>
                  <div class="d-none d-print-block mt-3">
                    <b-row >
                        <b-col>
                        <h4> Bestelldetails</h4>
                        </b-col>
                        <b-col>
                          <h4>Kundendetails</h4>
                        </b-col>
                    </b-row>
                  </div>
                
                  <b-row class="mt-3">
                  <b-col>
                    <b-row>
                        <b-col>
                            <b-form-group label-size="lg" label="Aufgabedatum">
                                {{$moment(tempOrderModalData.added).format("LLLL")}}
                            </b-form-group>
                        </b-col>
                        <b-col>
                        <b-form-group label-size="lg" label="Ausgewählter Zeitbereich">
                              Beginn: {{ $moment(tempOrderModalData.selectedTimeslot.from).format("LLLL")}} <br>
                              Ende:   {{$moment(tempOrderModalData.selectedTimeslot.to).format("LLLL")}}
                        </b-form-group>
                          <b-card header=" Reservierungen in diesem Timeslot:">
                           <b-list-group>
                            <div v-for="(place,index) in tempOrderModalData.selectedTimeslot.placeReservations" :key="index"> 
                                  <b-list-group-item active button @click="togglePlaceSelect(index)" v-if="place.booked&&place.order._id==tempOrderModalData._id" >
                                    Platz-Id:  {{place._id}}<br>
                                    Gebucht: {{place.booked}}<br>
                                    Bestellung: #{{place.order.nr}}
                                  </b-list-group-item>

                                  <b-list-group-item disabled v-else-if="place.booked&&place.order._id!=tempOrderModalData._id">
                                    Platz-Id:  {{place._id}}<br>
                                    Gebucht: {{place.booked}}<br>
                                    Bestellung: #{{place.order.nr}}
                                  </b-list-group-item>

                                  <b-list-group-item  button @click="togglePlaceSelect(index)" v-else>
                                    Platz-Id:  {{place._id}}<br>
                                    Gebucht: {{place.booked}}
                                  </b-list-group-item>
                              </div>
                            </b-list-group>
                            </b-card>
                        </b-col>
                      </b-row> 
                    </b-col>
                  </b-row> 
                       
                <h3>Produkte</h3> 
                   <b-table  :items="tempOrderModalData.orderItems" :fields="fields" >
                    <template #cell(checkbox)>  
                           <b-icon-app></b-icon-app>                
                      </template>  
                      <template  #cell(name)="data">
                      <b-form-input  type="text" v-model="data.item.name"></b-form-input>
                      </template>
                        <template #cell(amount)="data">
                        <b-form-input  type="text" v-model="data.item.amount"></b-form-input>
                      </template>
                      <template #cell(unit)="data">
                          <b-form-input type="text" v-model="data.item.unit"></b-form-input>
                      </template>
                       <template #cell(delete)="data">
                          <b-btn @click="tempOrderModalData.orderItems.splice(data.index,1)">Löschen</b-btn>
                      </template>
                    </b-table>
                    <b-btn @click="tempOrderModalData.orderItems.push({name:'',amount:'',unit:''})">Produkt hinzufügen</b-btn>
                  <template #modal-footer>  
                      <b-button
                      class="float-right"
                      variant="default"
                      @click="setEditOrderModalShowState(false)"
                    >
                      Schließen
                    </b-button>   
                       <b-button
                      class="float-left"
                      variant="primary"
                      @click="saveUpdatedOrder(false)"
                    >
                      Speichern
                      </b-button>                          
                  </template>     
                        
            </b-modal> 
</template>
<script>

import {mapGetters, mapMutations,mapActions} from 'vuex'
import { TypeConverter }  from "../utils/TypeConverter";
import BackendConnection from '../services/authorizedapi';
import Vue from 'vue';
export default {
  components: {},
  name: 'PickerEditOrderModal',
  methods:{
      loadOrder(orderModalData){
        this.tempOrderModalData = orderModalData
      },
      ...mapMutations(['setEditOrderModalShowState']),
      ...mapActions(['showOrder']),
    togglePlaceSelect(index){
      let placeReservation = this.tempOrderModalData.selectedTimeslot.placeReservations[index]
      
      if(placeReservation.booked){
        placeReservation.booked=false
        placeReservation.order=null
        return
      }

      placeReservation.booked=true
      let newPlaceReservation = {
        _id:this.tempOrderModalData._id,
        nr:this.tempOrderModalData.nr
      }
    
      placeReservation.order=newPlaceReservation

    },
    async saveUpdatedOrder(){
       var response = await BackendConnection.put("/orders/"+this.tempOrderModalData._id,this.tempOrderModalData)

        if(response.status!=200){
            Vue.swal('Achtung','Bestellung laden hat nicht funktionert','error')
            return
        }

        await this.showOrder(this.tempOrderModalData._id)
        this.setEditOrderModalShowState(false)
    }
  },
  computed:{   
      ...mapGetters(['isEditOrderModalShown'])
  },
  data(){
      return {
        TypeConverter,
        tempOrderModalData:null,
        fields: [
          { key: "checkbox", label: "Erledigt",class:["d-none", "d-print-block"]},
          { key: "amount", label: "Menge"},
          { key: "unit", label: "Einheit"},
          { key: "name", label: "Name", sortable: true},
          { key: "delete", label: "Löschen"},
        ]       
      }
  },
  filters: {
    formatAmount (unit) {
      return parseFloat(unit.toString());
    }
  }
}
</script>
