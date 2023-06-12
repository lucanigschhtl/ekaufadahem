<template>  
          <b-modal v-model="isShown" scrollable header="Hello" size="lg" @hide="_setShowState(false)"> 
              <template #modal-header>
                <!-- Emulate built in modal header close button action -->           
                <h5>Einkaufskorb</h5>
              </template>
                      <b-skeleton-table v-if="cartIsLoading"
                        :rows="6"
                        :columns="6"
                        :table-props="{ }"
                      ></b-skeleton-table>  
                      <b-table  v-else :hide="cartIsLoading" responsive :items="allCartItems" :fields="fields" >
                        <template #cell(amount)="data">
                          
                              <b-container style="width:200px">
                                <b-input-group >
                                  
                              
                                      <b-input-group-prepend class="d-none d-lg-block">
                                        <b-btn @click="updateCartItemAmount({newAmount: data.item.amount-1, cartItem: data.item})" variant="default" type="button">
                                            <b-icon icon= "dash"/>   
                                        </b-btn>
                                      </b-input-group-prepend>   
                                                     
                                      <b-form-input class="text-center"  @change="function(event){updateCartItemAmount({newAmount: parseInt(event),cartItem:data.item})}" :value="data.item.amount" type="number"/>                      
                                 
                                      <b-input-group-append  class="d-none d-lg-block">
                                          <b-btn variant="default" @click="updateCartItemAmount({newAmount: data.item.amount+1, cartItem: data.item})"  type="button">
                                            <b-icon icon="plus"/>
                                          </b-btn>
                                        </b-input-group-append>
                                
                                </b-input-group>
                                </b-container>
                        </template>                       
                        <template  #cell(name)="data">
                            <span>{{data.item.product.name}}</span>
                        </template>
                         <template #head(category)="data">
                          <span class="d-none d-lg-block">{{ data.label}}</span>
                        </template>
                        <template #cell(category)="data">
                            <span class="d-none d-lg-block">{{data.item.product.category.name}}</span>
                        </template>
                        <template #cell(unit)="data">
                            <span>{{data.item.product.amount | formatAmount}} {{data.item.product.unit.name}}</span>
                        </template>
                         <template #head(tags)="data">
                          <span class="d-none d-lg-block">{{ data.label}}</span>
                        </template>
                        <template #cell(tags)="data">                       
                                <h5><b-badge  class="m-1 d-none d-lg-block" v-for="tag in data.item.product.tags" pill variant="success" :key="tag.id">{{tag.name}}</b-badge></h5>                       
                        </template>   
                        <template #cell(delete)="data">   
                          <b-button variant="default" @click="removeCartItem(data.item)">                    
                             <b-icon color="black" icon="trash-fill"/>   
                          </b-button>                   
                        </template>             
                    </b-table>
                    <b-button v-if="allCartItems.length!=0" @click="$router.push({name:'CustomerOrdering'})" variant="primary">Bestellen</b-button>
                    <template #modal-footer>  
                       <b-button
                        class="float-right"
                        variant="default"
                        @click="_setShowState(false)"
                      >
                        Schließen
                       </b-button>                          
                    </template>
                </b-modal> 
</template>
<script>


import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  components: {},
  name: 'CartModal',
  methods:{ 
      ...mapActions(['fetchCartItems','updateCartItemAmount','removeCartItem']),
      ...mapMutations(['_setShowState'])
    },
  computed:{   
    ...mapGetters(["isShown","allCartItems","cartIsLoading"])
  },
  created(){     
        this.fetchCartItems()
        this._setShowState(false)
  },
  data(){
      return {
        fields: [
            { key: "amount", label: "Menge"},
            { key: "name", label: "Name", sortable: true},
            { key: "category", label: "Kategorie", sortable: true},
            { key: "unit", label: "Einheit"},
            { key: "tags", label: "Tags"},
            { key: "delete", label: ""}
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
