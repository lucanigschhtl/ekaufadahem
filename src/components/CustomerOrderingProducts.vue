<template>
    <div>
        <h4>Produkteingabe</h4>  
          <b-table   responsive :fields="fields"  :items="getOrderItems" >   
            <template  #cell(amount)="data">
                    <span>{{data.item.amount }}</span>
            </template>             
            <template  #cell(name)="data">
                <span>{{data.value}}</span>
            </template>
            <template #cell(unit)="data">
                <span>{{data.value}}</span>
            </template>
            <template #cell(delete)="data">
                <b-btn @click="removeOrderItem(data.item.id)">Löschen</b-btn>
            </template>
        </b-table>
        <b-container  class="bv-example-row mt-2 mb-2">
          <b-row>
          <small>Neues Produkt hinzufügen</small>
         </b-row>
          <b-row>
         
            <b-col style="padding:0px"  cols=2>
              <b-form-input v-model="amount" style="border-radius:0px" type="text" placeholder="Menge"/>
            </b-col>
            <b-col style="padding:0px" cols=2>
               <b-form-input v-model="unit" style="border-radius:0px" type="text" placeholder="Einheit"></b-form-input>
            </b-col>
            <b-col style="padding:0px" cols=4>
              <b-form-input @keyup.enter="saveOrderItem()" v-model="name" style="border-radius:0px" @keyup="searchForProductRecommendations()" placeholder="Bezeichnung" list="recommendation-list"></b-form-input>
              <datalist id="recommendation-list">
                <option v-for="(recommendation, key) in recommendations" :key="key">{{ recommendation.name }}</option>
              </datalist>
            </b-col>
            <b-col style="padding:0px" cols=1>
             <b-button style="border-radius:0px" @click="saveOrderItem()">Hinzufügen</b-button>
            </b-col>
          </b-row>
        </b-container>
     </div>
</template>   
<script>
import { mapGetters,mapMutations} from 'vuex'
import BackendConnection from '../services/authorizedapi';

export default {  
  name: "OrderingProducts", 
  data(){
    return{
      amount:null,
      unit:null,
      name:null,
      recommendations:[],
      fields: [
            { key: "amount", label: "Menge"},
            { key: "unit", label: "Einheit"},
            { key: "name", label: "Name", sortable: true},
            { key: "delete", label: ""},
        ],
        units: ['GR', 'KG', 'Stk', 'LT','ML']   
    }   
  },  
  methods: {
    saveOrderItem(){
      this.addOrderItem({amount:this.amount,unit:this.unit,name:this.name})
      this.amount = null
      this.unit = null
      this.name = null
      this.recommendations = [];
    },
    ...mapMutations(["addOrderItem","removeOrderItem","updateOrderItem"]),
    async searchForProductRecommendations() {
      if (!this.recommendations.some(rec => rec.name === this.name)) {
        var response = await BackendConnection.get("/products/search/" + this.name);
        if(response.status!=200) return
        this.recommendations = [];
        this.recommendations = response.data;
      }
    }
  },
   computed:{   
    ...mapGetters(["getOrderItems"]),
  },
  filters: { 
    formatAmount (unit) {
      return parseFloat(unit.toString());
    }   
  },
};
</script>
