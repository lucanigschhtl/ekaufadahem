<template>  
          <b-modal v-if="customerModalData!=null" v-model="isCustomerModalShown" scrollable header="Hello" size="lg" @hide="setCustomerModalShowState(false)"> 
              <template #modal-header>
                <h5>Kunde</h5>
              </template> 
              <PickerCreateEmptyOrderModal :customerId="customerModalData.user._id"></PickerCreateEmptyOrderModal>
              <div v-if="isCustomerModalLoading">
                   <b-row>
                     <b-col>
                            <b-skeleton animation="wave" width="30%"></b-skeleton>
                        </b-col>
                  </b-row>
                  <b-row class="mt-3">
                      <b-col>
                          <b-skeleton animation="wave" width="20%"></b-skeleton>
                          <b-skeleton animation="wave" width="50%"></b-skeleton>
                      </b-col>
                      <b-col>
                           <b-skeleton animation="wave" width="20%"></b-skeleton>
                           <b-skeleton animation="wave" width="50%"></b-skeleton>
                      </b-col>
                  </b-row>
                  <b-row class="mt-3">
                      <b-col>
                           <b-skeleton animation="wave" width="20%"></b-skeleton>
                           <b-skeleton animation="wave" width="50%"></b-skeleton>
                      </b-col>
                      <b-col>
                          <b-skeleton animation="wave" width="20%"></b-skeleton> 
                          <b-skeleton animation="wave" width="50%"></b-skeleton>                     
                      </b-col>
                  </b-row> 
                  <b-row class="mt-3">
                    <b-col>
                      <b-skeleton animation="wave" width="20%"></b-skeleton>                        
                      <b-skeleton animation="wave" width="50%"></b-skeleton>
                    </b-col>
                  </b-row>                  
                </div>
                <div v-else>
                  <b-row>
                     <b-col>
                            <h1> @{{customerModalData.user.nr}} <br> {{customerModalData.user.firstName}} {{customerModalData.user.lastName}} </h1> 
                        </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                            <b-form-group  label-size="lg" label="Telefonnummer">
                              {{customerModalData.user.tel}}
                            </b-form-group>
                      </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                            <b-form-group  label-size="lg" label="Ort">
                              {{customerModalData.user.plz}} {{customerModalData.user.place}}
                            </b-form-group>
                      </b-col>
                      <b-col>
                          <b-form-group  label-size="lg" label="Straße">
                             {{customerModalData.user.street}} {{customerModalData.user.housenumber}}          
                          </b-form-group>                          
                      </b-col>
                  </b-row> 
                </div>
                <h3>Bestellungen</h3> 
                <b-btn class="mb-2" @click="setCreateEmptyOrderModalShowState(true)">Neue Bestellung anlegen</b-btn>
                <div v-if="isCustomerModalLoading">
                    <b-skeleton-table
                    :rows="4"
                    :columns="4"                   
                  ></b-skeleton-table>
                </div>
                <div v-else>    
                      <b-table  :items="customerModalData.orders" :fields="fields" :sort-by.sync="sortBy" >
                     <template #cell(nr)="data">
                            <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value }}</b-btn>
                        </template>
                        <template #cell(status)="data">
                           <b-col>
                               <b-badge :variant="TypeConverter.getOrderStatusTypeDetailsById(data.value).color">{{TypeConverter.getOrderStatusTypeDetailsById(data.value).title}}</b-badge>
                           </b-col> 
                        </template>
                        <template #cell(selectedTimeslot)="data">
                          <div v-if="data.item.timeslot=='no timeslot'">
                            <p>Kein Abholzeitpunkt vorhanden</p>
                          </div>
                          <div v-else>
                            <p v-if="data.value.from.isSame(data.value.to,'date')"  variant="outline-success">
                              {{data.value.from.format('dddd, Do MMMM')}} <strong><br> {{data.value.from.format('hh:mm')}} - {{data.value.to.format('hh:mm')}}</strong>
                            </p>             
                            <p v-else variant="outline-success">
                              {{data.value.from.format('dddd hh:mm')}} - {{data.value.to.format('dddd hh:mm')}}
                            </p>   
                          </div>     
                          
                        </template>
                       
                         <template  #cell(paymentMethod)="data">
                                <b-badge variant="primary">{{TypeConverter.getPaymentTypeDetailById(data.value).title}}</b-badge>                           
                       
                        </template>
                        
                    </b-table>
                  </div> 
                    <template #modal-footer>  
                       <b-button
                        class="float-right"
                        variant="default"
                        @click="setCustomerModalShowState(false)"
                      >
                        Schließen
                       </b-button>                          
                    </template>     
                        
            </b-modal> 
            
</template>
<script>

import {mapActions,mapGetters, mapMutations} from 'vuex'
import PickerCreateEmptyOrderModal from './PickerCreateEmptyOrderModal.vue'
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: {PickerCreateEmptyOrderModal},
  name: 'PickerCustomerModal',
  methods:{
      ...mapActions(['showOrder']),
      ...mapMutations(['setCustomerModalShowState','setCreateEmptyOrderModalShowState'])
    },
  computed:{   
      ...mapGetters(['isCustomerModalLoading','isCustomerModalShown','customerModalData'])
  },
  data(){
      return {
        TypeConverter,
        sortBy: 'status.rank',
        fields: [
            { key: "nr", label: "Nr"},
            { key: "status", label: "Status"},
            { key: "selectedTimeslot",
             label: "Abholzeitpunkt",
              formatter: (key,value,item) => {
              if(item.selectedTimeslot!="no timeslot")
                {
                 
                return {
                        "from":this.$moment(item.selectedTimeslot.from),
                        "to":this.$moment(item.selectedTimeslot.to)
                      }
                }
              },       
             },
            { key: "paymentMethod", label: "Bezahlungsmethode", sortable: true ,class:"d-none d-md-table-cell"}         
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

