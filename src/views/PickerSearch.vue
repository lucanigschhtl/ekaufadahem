<template>
  <div>
    <PickerOrderModal></PickerOrderModal>
    <PickerCustomerModal></PickerCustomerModal> 
    <PickerCreateCustomerModal></PickerCreateCustomerModal>
   
    <b-container>
      <b-card>
        <h1>Suche</h1>
        <b-form-input @change="function(event){fetchPickerSearch(event)}"></b-form-input>
      </b-card>
      <div>       
          
            <b-row class="mt-3">
                <b-col>
                <h3>Kunden</h3>
                <b-btn class="mb-2" @click="setCreateCustomerModalShowState(true)">Neuer Kunde</b-btn>
                 <b-skeleton-table v-if="isPickerSearchLoading"
                        :rows="3"
                        :columns="5"
                        :table-props="{ }"
                      ></b-skeleton-table>   
                <b-table v-else :items="pickerSearchCustomers" :fields="customerFields">  
                  <template #cell(nr)="data">
                    <b-btn variant="outline-primary" @click="showCustomer(data.item._id)"> @{{data.item.nr}}</b-btn>
                  </template> 
                </b-table>
                <p v-if="pickerSearchCustomers.length==0">Es wurden keine Kunden gefunden, die zu diesem Suchbegriff passen.</p>
                </b-col>
              </b-row>  
              <b-row class="mt-3">
                <b-col>
                  <h3>Bestellungen</h3>
                    <b-skeleton-table v-if="isPickerSearchLoading"
                        :rows="3"
                        :columns="6"
                        :table-props="{ }"
                      ></b-skeleton-table> 
                    <b-table v-else :items="pickerSearchOrders" :fields="orderFields">
                      <template #cell(nr)="data">
                          <b-btn variant="outline-primary" @click="showOrder(data.item._id)">#{{data.value}}</b-btn>  
                      </template>
                      <template #cell(user)="data">                 
                          <b-btn variant="outline-primary" @click="showCustomer(data.value._id)">@{{data.value.nr}}  {{data.value.firstName}} {{data.value.lastName}}</b-btn>          
                      </template>    
                      <template  #cell(selectedTimeslot)="data">     
                                      {{data.value.to.format('dddd, Do MMMM YYYY')}}
                      </template>                 
                      <template #cell(status)="data">
                          <b-col>
                                    <b-badge :variant="TypeConverter.getOrderStatusTypeDetailsById(data.value).color">{{TypeConverter.getOrderStatusTypeDetailsById(data.value).title}}</b-badge>
                          </b-col>
                      </template>
                      <template #cell(paymentMethod)="data">
                            <b-badge :variant="TypeConverter.getPaymentTypeDetailById(data.value).color">{{TypeConverter.getPaymentTypeDetailById(data.value).title}}</b-badge>
                      </template>
                       <template #cell(pickupType)="data">
                            <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(data.value).color">{{TypeConverter.getOrderPickupTypeDetailById(data.value).title}}</b-badge>
                      </template>
                    </b-table>
                    <p v-if="pickerSearchCustomers.length==0">Es wurden keine Bestellungen gefunden, die zu diesem Suchbegriff passen.</p>
                </b-col>
              </b-row>  
      </div>
    </b-container>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import PickerCustomerModal from "../components/PickerOrderModal.vue";
import PickerOrderModal from '../components/PickerCustomerModal.vue';
import PickerCreateCustomerModal from '../components/PickerCreateCustomerModal.vue';
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: { PickerOrderModal, PickerCustomerModal, PickerCreateCustomerModal },
  name: "PickerSearch",
  methods: {
    ...mapActions(["fetchPickerSearch","getOrder",'showCustomer','showOrder']),
    ...mapMutations(["_setOrderShowState","_setOrder","setCreateCustomerModalShowState","setCreateEmptyOrderModalShowState"])   
  },
  computed: mapGetters(["pickerSearchCustomers","pickerSearchOrders","isPickerSearchLoading"]),
  data() {
    return {
      TypeConverter,
      sortBy: 'status.rank',
      orderFields: [
        
        { key: "nr", label: "OrderId" },
        { key: "user", label: "Kunde",class:"d-none d-md-table-cell" },
        { key: "selectedTimeslot",
          label: "Abholen Ab",
           formatter: (key,value,item) => {
              return {
                      "from":this.$moment(item.from),
                      "to":this.$moment(item.to)
                    }
            }        
        },      
        { key: "status", label: "Status" },
        { key: "pickupType", label: "AbholTyp",class:"d-none d-md-table-cell" },
        { key: "paymentMethod", label: "Bezahlmethode",class:"d-none d-md-table-cell" },
      ],
      customerFields: [
        { key: "nr", label: "Id"},
        { key: "firstName", label: "Vorname" },
        { key: "lastName", label: "Nachname" },
        { key: "email", label: "Email-Adresse",class:"d-none d-md-table-cell" },
        { key: "tel", label: "Telefonnummer", class:"d-none d-md-table-cell"}
      ],
      inputData:""
    };
  },  
  created(){
    this.fetchPickerSearch("")
  }
};
</script>
