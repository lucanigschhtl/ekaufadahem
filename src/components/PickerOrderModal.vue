<template> 
<div>
  <PickerEditOrderModal ref="pickerEditOrderModal"></PickerEditOrderModal>
          <b-modal v-model="isOrderModalShown"  v-if="orderModalData!=null" scrollable  size="lg" @hide="setOrderModalShowState(false)"> 
              <template #modal-header>
                <h5>Bestellung</h5>
              </template>           
                <div v-if="isOrderModalLoading">
                   <b-row>
                     <b-col>                           
                          <b-skeleton animation="wave" width="20%"></b-skeleton>
                        </b-col>
                        <b-col>
                          <b-skeleton animation="wave" width="50%"></b-skeleton>
                        </b-col>
                  </b-row>
                  <b-row   class="mt-2">
                      <b-col>
                          <b-skeleton animation="wave" width="30%"></b-skeleton>
                          <b-skeleton animation="wave" width="50%"></b-skeleton>
                      </b-col>
                      <b-col>
                            <b-skeleton animation="wave" width="30%"></b-skeleton>
                            <b-skeleton animation="wave" width="50%"></b-skeleton>
                            <b-skeleton animation="wave" width="50%"></b-skeleton>
                      </b-col>
                  </b-row>
                  <b-row class="mt-2">
                      <b-col>
                           <b-skeleton animation="wave" width="50%"></b-skeleton>
                            <b-skeleton animation="wave" width="20%"></b-skeleton>        
                      </b-col>
                      <b-col>
                          <b-skeleton animation="wave" width="50%"></b-skeleton>
                          <b-skeleton animation="wave" width="10%"></b-skeleton>                        
                      </b-col>
                  </b-row> 
                  <b-row  cols="12" class="mt-2">
                    <b-col>
                      <b-skeleton animation="wave" width="30%"></b-skeleton>
                      <b-skeleton animation="wave" no-aspect height="150px"></b-skeleton>
                    </b-col>
                  </b-row> 
                   <h3>Produkte</h3> 
                    <b-skeleton-table
                    :rows="5"
                    :columns="4"                   
                  ></b-skeleton-table>
                </div>
              
                <div id="printMe" v-else>
                  <b-row >
                       <b-col>
                            <h1>#{{orderModalData.nr}}</h1>
                            <h3 class="d-none d-print-block">@{{orderModalData.user.nr}}  {{orderModalData.user.firstName}} {{orderModalData.user.lastName}}</h3>
                        </b-col>
                       
                        <b-col class="d-print-none">
                          <b-btn variant="outline-primary" @click="showCustomer(orderModalData.user._id)">{{orderModalData.user.firstName}} {{orderModalData.user.lastName}} <b-icon-box-arrow-in-up-right></b-icon-box-arrow-in-up-right></b-btn>
                        </b-col>
                  </b-row>
                  <b-row class="d-none d-print-block">
                    <b-col>
                        <b>Stand</b><br> {{$moment().format("LLLL")}}
                      </b-col>
                  </b-row>
                  <b-row class="mb-2 d-print-none">
                     <b-col>
                          <b-btn @click="showEditOrderModalWithData()">Bearbeiten</b-btn>
                        </b-col>
                  </b-row>
                  <b-row class="d-print-none">
                     <b-col>
                        <b-btn variant="primary" @click="print()" >Drucken</b-btn>
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
                                {{$moment(orderModalData.added).format("LLLL")}}
                            </b-form-group>
                        </b-col>
                        <b-col>
                              <b-form-group  label-size="lg" label="Abholfenster">
                                {{ $moment(orderModalData.selectedTimeslot.from).format("LLLL")}} bis <br> {{$moment(orderModalData.selectedTimeslot.to).format("LLLL")}}
                              </b-form-group>
                        </b-col>
                      </b-row>
                    </b-col>
                        <b-col class="d-none d-print-block">
                          <b-form-group  label-size="lg" label="Telefonnummer">
                            {{orderModalData.user.tel}}                          
                          </b-form-group>
                        </b-col>               
                  </b-row>
                  <b-row>
                      <b-col>
                      <b-row>
                        <b-col>
                              <b-form-group  label-size="lg" label="Status">
                                <b-badge :variant="TypeConverter.getOrderStatusTypeDetailsById(orderModalData.status).color">{{TypeConverter.getOrderStatusTypeDetailsById(orderModalData.status).title}}</b-badge>
                              </b-form-group>
                        </b-col>
                          <b-col >
                            <b-form-group  label-size="lg" label="Abholtyp">
                                <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(orderModalData.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(orderModalData.pickupType).title}}</b-badge>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col>
                        <b-row>
                          <b-col class="d-none d-print-block">
                            <b-form-group  label-size="lg" label="Ort">
                                  {{orderModalData.user.plz}} {{orderModalData.user.place}}                           
                                </b-form-group>
                          </b-col>
                          <b-col class="d-none d-print-block">
                            <b-form-group  label-size="lg" label="Straße">
                              {{orderModalData.user.street}}                       
                            </b-form-group>
                          </b-col>       
                        </b-row>
                      </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                        <b-form-group  label-size="lg" label="Zahlungsmethode">
                              <b-badge :variant="TypeConverter.getPaymentTypeDetailById(orderModalData.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(orderModalData.paymentMethod).title}}</b-badge>                   
                        </b-form-group>                          
                      </b-col>
                  </b-row> 
                  <b-row v-if="orderModalData.note!=''">
                    <b-col>
                      <b-form-group label-size="lg" label="Bemerkung">
                        {{orderModalData.note}}
                      </b-form-group>                          
                    </b-col>
                  </b-row> 
                              
                <h3>Produkte</h3> 
                   <b-table  :items="orderModalData.orderItems" :fields="fields" >
                    <template #cell(checkbox)>  
                           <b-icon-app></b-icon-app>                
                      </template>  
                      <template  #cell(name)="orderModalData">
                          <span>{{orderModalData.item.name}}</span>
                      </template>
                        <template #head(category)="orderModalData">
                        <span class="d-none d-lg-block">{{ orderModalData.label}}</span>
                      </template>
                      <template #cell(category)="orderModalData">
                          <span class="d-none d-lg-block">{{orderModalData.item.category.name}}</span>
                      </template>
                      <template #cell(menge)="orderModalData">
                          <span>{{orderModalData.item.cartItemAmount}} x {{orderModalData.item.productAmount | formatAmount}} {{orderModalData.item.unit.name}}</span>
                      </template>
                      <template #cell(tags)="orderModalData">                       
                              <h5><b-badge  class="m-1 d-none d-lg-block" v-for="tag in orderModalData.tags" pill variant="success" :key="tag.id">{{tag.name}}</b-badge></h5>                       
                      </template>                       
                    </b-table>
                 </div>
                  <template #modal-footer>  
                      <b-button
                      class="float-right"
                      variant="default"
                      @click="setOrderModalShowState(false)"
                    >
                      Schließen
                      </b-button>                          
                  </template>     
                        
            </b-modal> 
          </div>
</template>
<script>

import {mapActions,mapGetters, mapMutations} from 'vuex'
import { TypeConverter }  from "../utils/TypeConverter";
import PickerEditOrderModal from './PickerEditOrderModal.vue';

export default {
  components: {PickerEditOrderModal},
  name: 'PickerOrderModal',
  methods:{
       ...mapActions(['showCustomer']),
      ...mapMutations(['setOrderModalShowState','setEditOrderModalShowState']),
    async print () {
      await this.$htmlToPaper('printMe');
    },
    showEditOrderModalWithData(){
    this.$refs.pickerEditOrderModal.loadOrder(this.orderModalData);
    this.setEditOrderModalShowState(true)
    }
    },
  computed:{   
      ...mapGetters(['isOrderModalLoading','isOrderModalShown','orderModalData'])
  },
  data(){
      return {
        TypeConverter,
        fields: [
          { key: "checkbox", label: "Erledigt",class:["d-none", "d-print-block"]},
          { key: "amount", label: "Menge"},
          { key: "unit", label: "Einheit"},
          { key: "name", label: "Name", sortable: true},
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