<template>  
          <b-modal v-if="isOrderShown!=false" v-model="isOrderShown" id="maincontent" scrollable size="lg" @hide="_setOrderShowState(false)"> 
              <template #modal-header>
                <h5>Bestellung</h5>
              </template>
                <h3>Details</h3> 
                <div v-if="!isOrderLoading" >
                  <div v-if="activeOrder.orderCode!=undefined">
                    <b-btn variant="primary" @click="showQrCode(activeOrder.orderCode.code)">Qr-Code anzeigen</b-btn>
                  </div>
                </div>
                <b-row>
                    <b-col>
                       <b-form-group v-if="isOrderLoading" label-size="lg" label="Aufgabedatum">
                             <b-skeleton animation="wave" width="75%"></b-skeleton>
                         </b-form-group>
                         <b-form-group v-else label-size="lg" label="Aufgabedatum">
                            {{$moment(activeOrder.added).format("LLLL")}}
                         </b-form-group>
                    </b-col>
                    <b-col>
                          <b-form-group v-if="isOrderLoading"  label-size="lg" label="Abholfenster">
                               <b-skeleton animation="wave" width="80%"></b-skeleton>
                              <b-skeleton animation="wave" width="70%"></b-skeleton>
                          </b-form-group>
                          <b-form-group v-else  label-size="lg" label="Abholfenster">
                            {{ $moment(activeOrder.selectedTimeslot.from).format("LLLL")}} bis <br> {{$moment(activeOrder.selectedTimeslot.to).format("LLLL")}}
                          </b-form-group>
                    </b-col>
                </b-row>
                  <b-row>
                    <b-col>
                       <b-form-group v-if="isOrderLoading" label-size="lg" label="Abholtyp">
                            <b-skeleton animation="wave" width="40%"></b-skeleton>
                          </b-form-group>
                          <b-form-group v-else label-size="lg" label="Abholtyp">
                            <b-badge :variant="TypeConverter.getOrderPickupTypeDetailById(activeOrder.pickupType).color">{{TypeConverter.getOrderPickupTypeDetailById(activeOrder.pickupType).title}}</b-badge>
                          </b-form-group>
                    </b-col>
                </b-row> 
                <b-row>
                    <b-col>
                       <b-form-group v-if="isOrderLoading" label-size="lg" label="Status">
                            <b-skeleton animation="wave" width="40%"></b-skeleton>
                          </b-form-group>
                          <b-form-group v-else label-size="lg" label="Status">
                            <b-badge :variant="TypeConverter.getOrderStatusTypeDetailsById(activeOrder.status).color">{{TypeConverter.getOrderStatusTypeDetailsById(activeOrder.status).title}}</b-badge>
                          </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group v-if="isOrderLoading" label-size="lg" label="Zahlungsmethode">
                            <b-skeleton animation="wave" width="60%"></b-skeleton>                 
                        </b-form-group>  
                        <b-form-group  v-else label-size="lg" label="Zahlungsmethode">
                            <b-badge variant="primary">{{TypeConverter.getPaymentTypeDetailById(activeOrder.paymentMethod).title}}</b-badge>                           
                        </b-form-group> 
                    </b-col>
                </b-row> 
                <b-row >
                  <b-col>
                      <b-form-group v-if="!isOrderLoading&&activeOrder.note!=''"  label-size="lg" label="Bemerkung">
                        <b-form-textarea  :value="activeOrder.note" readonly rows="1"/>
                      </b-form-group  >  
                  </b-col>  
                </b-row> 
                <h3>Produkte</h3>
                <b-skeleton-table v-if="isOrderLoading"  >
                  :rows="5"
                  :columns="4"
                  :table-props="{ bordered: true, striped: true }"
                ></b-skeleton-table>              
                <b-table v-else :items="activeOrder.orderItems" :fields="fields" >
                  <template  #cell(amount)="data">
                      <span>{{data.item.amount }} {{data.item.unit}}</span>
                  </template>
                  <template  #cell(name)="data">
                      <span>{{data.item.name}}</span>
                  </template>
                </b-table>
              
                <template #modal-footer>  
                    <b-button
                    class="float-right"
                    variant="default"
                    @click="_setOrderShowState(false)"
                  >
                    Schließen
                    </b-button>                          
                </template>     

            </b-modal> 
</template>
<script>


import { mapActions, mapGetters, mapMutations} from 'vuex'
import { TypeConverter }  from "../utils/TypeConverter";
export default {
  components: {},
  name: 'OrderModal',
  methods:{ 
      ...mapMutations(['_setOrderShowState']),
      ...mapActions(['addProduct']),
      showQrCode(orderCode) {
         const h = this.$createElement
        // Using HTML string
        const messageVNode = h('div', [
          h('b-img', {
            props: {
              src: "https://api.qrserver.com/v1/create-qr-code/?size=800x800&data="+orderCode,
              thumbnail: true,
              center: true,
              fluid: true
            }
          })
        ])
        // We must pass the generated VNodes as arrays
        this.$bvModal.msgBoxOk([messageVNode], {
          buttonSize: 'sm',
          centered: true, size: 'xl'
        })
      }
    },
  computed:{   
    ...mapGetters(["isOrderShown","activeOrder","isOrderLoading"])
  },
  created(){     
        this._setOrderShowState(false)
  },
  data(){
      return {
        TypeConverter,
        fields: [
            { key: "amount", label: "Menge"},
            { key: "name", label: "Name", sortable: true},
        ],
              
      }
  },
  filters: {
    formatAmount (unit) {
      return parseFloat(unit.toString());
    }
  }
}
</script>
