<template>
 
    <b-container class="mt-3">
       <PickerOrderModal></PickerOrderModal>
       <PickerCustomerModal></PickerCustomerModal>
       <PickerReserveModal></PickerReserveModal>
    <h1>Bestellungen</h1>
       <div>
            <b-card no-body>
                <b-tabs pills card>
                <b-tab title="Bestellanfragen" @click="fetchStatus(1)" active>
                    <b-card-text>
                        <b-skeleton-table v-if="areOrdersLoading"
                        :rows="6"
                        :columns="4"                       
                        ></b-skeleton-table>                        
                         <div v-else>                       
                            <b-table  v-if="getOrdersByStatusGroup(1).length!=0" :items="getOrdersByStatusGroup(1)" :fields="fields">             
                                <template #cell(nr)="data">
                                    <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>
                                </template>
                                <template #cell(user)="data">
                                    <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">{{data.value.firstName}} {{data.value.lastName}}</b-btn>
                                </template>   
                                <template  #cell(selectedTimeslot)="data">     
                                    {{data.value.format('dddd, Do MMMM YYYY')}}
                                </template>            
                                 <template #cell(pickupType)="data">
                                    <b-col >
                                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                                    </b-col>
                                </template>
                                <template #cell(paymentMethod)="data">
                                      <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                                </template>
                                <template #cell(nextState)="data">
                                    <b-button @click="moveToState({orderId:data.item._id,newStatusId:2,preStatusId:1})" variant="success">Annehmen</b-button>  
                                </template>
                                 <template #cell(rejectOrder)="data">
                                    <b-button @click="moveToState({orderId:data.item._id,newStatusId:0,preStatusId:1})" variant="danger">Ablehnen</b-button>  
                                </template>
                            </b-table>
                            <p v-else>Im Moment sind keine neuen Bestellungen vorhanden</p>
                        </div> 
                    </b-card-text>
                </b-tab>
                <b-tab @click="fetchStatus(2)" title="Bereit zum Zusammenrichten ">
                    <b-card-text>
                        <b-skeleton-table v-if="areOrdersLoading"
                        :rows="6"
                        :columns="4"                       
                        ></b-skeleton-table>
                        <div v-else>                       
                            <b-table v-if="getOrdersByStatusGroup(2).length!=0" :items="getOrdersByStatusGroup(2)" :fields="fields">
                                 <template #cell(nr)="data">
                                    <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>
                                </template>
                                <template #cell(user)="data">
                                    <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">{{data.value.firstName}} {{data.value.lastName}}</b-btn>
                                </template>   
                                <template  #cell(selectedTimeslot)="data">     
                                    {{data.value.format('dddd, Do MMMM YYYY')}}
                                </template>            
                                 <template #cell(pickupType)="data">
                                    <b-col >
                                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                                    </b-col>
                                </template>
                                <template #cell(paymentMethod)="data">
                                      <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                                </template>
                                <template #cell(previousState)="data">
                                    <b-button  @click="moveToState({orderId:data.item._id,newStatusId:1,preStatusId:2})" variant="secondary">Zurück</b-button>  
                                </template> 
                                <template #cell(nextState)="data">
                                    <b-button @click="showReserveOptions(data.item)" variant="success">Platz zuweisen</b-button>  
                                </template>
                            </b-table>
                            <p v-else>Im Moment sind keine Bestellungen in Bearbeitung.</p>
                        </div> 
                    </b-card-text>
                </b-tab>
                <b-tab @click="fetchStatus(3)" title="Bereit zur Abholung">
                    <b-card-text>
                        <b-skeleton-table v-if="areOrdersLoading"
                        :rows="6"
                        :columns="4"                       
                        ></b-skeleton-table>                        
                        <div v-else>                       
                            <b-table v-if="getOrdersByStatusGroup(3).length!=0" :items="getOrdersByStatusGroup(3)" :fields="fields">             
                                 <template #cell(nr)="data">
                                    <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>
                                </template>
                                <template #cell(user)="data">
                                    <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">{{data.value.firstName}} {{data.value.lastName}}</b-btn>
                                </template>   
                                <template  #cell(selectedTimeslot)="data">     
                                    {{data.value.format('dddd, Do MMMM YYYY')}}
                                </template>            
                                 <template #cell(pickupType)="data">
                                    <b-col >
                                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                                    </b-col>
                                </template>
                                <template #cell(paymentMethod)="data">
                                      <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                                </template>
                                <template #cell(previousState)="data">
                                    <b-button  @click="moveToState({orderId:data.item._id,newStatusId:2,preStatusId:3})" variant="secondary">Zurück</b-button>  
                                </template> 
                                <template #cell(nextState)="data">
                                    <b-button @click="moveToState({orderId:data.item._id,newStatusId:4,preStatusId:3})" variant="success">Weiter</b-button>  
                                </template>
                            </b-table>
                            <p v-else>Im Moment sind keine Bestellungen bereit zur Abholung.</p>
                        </div> 
                    </b-card-text>
                </b-tab>
                <b-tab @click="fetchStatus(4)" title="Abgeschlossen">
                    <b-card-text>
                        <b-skeleton-table v-if="areOrdersLoading"
                        :rows="6"
                        :columns="4"                       
                        ></b-skeleton-table>                        
                         <div v-else>                       
                            <b-table v-if="getOrdersByStatusGroup(4).length!=0" :items="getOrdersByStatusGroup(4)" :fields="fields">  
                                 <template #cell(nr)="data">
                                    <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>
                                </template>
                                <template #cell(user)="data">
                                    <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">{{data.value.firstName}} {{data.value.lastName}}</b-btn>
                                </template>   
                                <template  #cell(selectedTimeslot)="data">     
                                    {{data.value.format('dddd, Do MMMM YYYY')}}
                                </template>            
                                 <template #cell(pickupType)="data">
                                    <b-col >
                                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                                    </b-col>
                                </template>
                                <template #cell(paymentMethod)="data">
                                      <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                                </template>
                                <template #cell(previousState)="data">
                                    <b-button  @click="moveToState({orderId:data.item._id,newStatusId:2,preStatusId:4})" variant="secondary">Zurück</b-button>  
                                </template> 
                            </b-table>
                            <p v-else>Im Moment sind keine Bestellungen abgeschlossen!</p>
                        </div> 
                    </b-card-text>
                </b-tab>
                 <b-tab @click="fetchStatus(0)" title="Abgelehnt">
                    <b-card-text>
                        <b-skeleton-table v-if="areOrdersLoading"
                        :rows="6"
                        :columns="4"                       
                        ></b-skeleton-table>                        
                         <div v-else>                       
                            <b-table v-if="getOrdersByStatusGroup(0).length!=0" :items="getOrdersByStatusGroup(0)" :fields="fields">  
                                 <template #cell(nr)="data">
                                    <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>
                                </template>
                                <template #cell(user)="data">
                                    <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">{{data.value.firstName}} {{data.value.lastName}}</b-btn>
                                </template>   
                                <template  #cell(selectedTimeslot)="data">     
                                    {{data.value.format('dddd, Do MMMM YYYY')}}
                                </template>            
                                 <template #cell(pickupType)="data">
                                    <b-col >
                                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                                    </b-col>
                                </template>
                                <template #cell(paymentMethod)="data">
                                      <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                                </template>
                                <template #cell(previousState)="data">
                                    <b-button  @click="moveToState({orderId:data.item._id,newStatusId:1,preStatusId:0})" variant="secondary">Zurück</b-button>  
                                </template> 
                            </b-table>
                            <p v-else>Im Moment sind keine Bestellungen abgelehnt!</p>
                        </div> 
                    </b-card-text>
                </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </b-container> 
</template>
<script>

import PickerOrderModal from '../components/PickerOrderModal.vue';
import { mapActions,mapGetters } from 'vuex'
import PickerCustomerModal from '../components/PickerCustomerModal.vue';
import PickerReserveModal from '../components/PickerReserveModal.vue';
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: { PickerOrderModal, PickerCustomerModal,PickerReserveModal },
  name: "PickerOrders", 
  data(){
    return{       
        TypeConverter,
        error:"",  
        statusGroups : [],
        isLoading:false,
        fields: [     
        { key: "nr", label: "Nr" },
        { key: "user", label: "Kunde",class:"d-none d-sm-table-cell"},
        { key: "selectedTimeslot",
          label: "Abholzeitpunkt",
           formatter: (key,value,item) => {
            return  this.$moment(item.selectedTimeslot.from)   
            },
            class:"d-none d-sm-table-cell"        
        },
        { key: "pickupType", label: "Abholtyp",class:"d-none d-sm-table-cell"},
        { key: "paymentMethod", label: "Bezahlmethode",class:"d-none d-sm-table-cell" },
        { key: "previousState", label: ""},
        { key: "rejectOrder",label:"" },
        { key: "nextState",label:"" }
      ],  
    }   
  },  
  methods: {
      ...mapActions(['showOrder','showCustomer','showReserveOptions','moveToState','fetchStatus','moveOrder']),
    },
 computed:{
     ...mapGetters(['getOrdersByStatusGroup','getStatusGroupById','areOrdersLoading'])
 },
  async created() {
         await this.fetchStatus(0)
  }
  
};
</script>
