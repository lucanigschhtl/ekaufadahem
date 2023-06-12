<template>
       
   <b-table :items="orders" :sort-by.sync="sortBy"   :sort-desc.sync="sortDesc" :fields="fields">        
                                   
                   <template  #cell(timeslot)="data">     
                        <b-btn v-if="data.value.from.isSame(data.value.to,'date')" @click="showCustomerOrder(data.item._id)"  variant="outline-success">
                          {{data.value.from.format('dddd, Do MMMM')}} <strong><br> {{data.value.from.format('HH:mm')}} - {{data.value.to.format('HH:mm')}}</strong>
                        </b-btn>              
                        <b-btn v-else @click="showCustomerOrder(data.item._id)"  variant="outline-success">
                          {{data.value.from.format('dddd HH:mm')}} - {{data.value.to.format('dddd HH:mm')}}
                        </b-btn>                  
                    </template>  
                               
                    <template #cell(status)="data">
                      <b-col >
                        <b-badge :variant="TypeConverter.getOrderStatusTypeDetailsById(data.item.status).color">{{TypeConverter.getOrderStatusTypeDetailsById(data.item.status).title}}</b-badge>
                        </b-col>
                    </template>
                    <template #cell(items)="data">
                      <b-col>
                        <b-badge>{{data.item.orderItems.length}} Produkte</b-badge>
                        </b-col>
                    </template>
                    <template #cell(pickupType)="data">
                      <b-col >
                        <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(data.item.pickupType).title}}</b-badge>
                        </b-col>
                    </template>
                     <template #cell(paymentMethod)="data">
                      <b-col>
                        <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).color">{{TypeConverter.getPaymentTypeDetailById(data.item.paymentMethod).title}}</b-badge>
                        </b-col>
                    </template>
            </b-table>
            
</template>

<script>
import { mapActions} from "vuex";
import { TypeConverter }  from "../utils/TypeConverter";
export default {
    props: {
    orders: Array,
  },
  data() {
    return {
      sortBy: 'status',
      sortDesc: true,
      TypeConverter,
      fields: [
        { key: "timeslot",
          label: "Abholzeitpunkt",
           formatter: (key,value,item) => {
              return {
                      "from":this.$moment(item.selectedTimeslot.from),
                      "to":this.$moment(item.selectedTimeslot.to)
                    }
            }        
        },
         
        { key: "status", label: "Status" },
        { key: "items", label: "Produkte" },
        { key: "pickupType", label: "Abholtyp" },
        { key: "paymentMethod", label: "Bezahlmethode" },
      ],
    };
  },
  methods: {
            ...mapActions(["showCustomerOrder"]),
        } 
}
</script>

<style>

</style>