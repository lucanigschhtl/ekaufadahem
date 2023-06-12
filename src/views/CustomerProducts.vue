<template>
  <div>
    <cart-modal />
    <b-container>
      <b-row align-v="center" align-h="center" cols="2"  class="text-center" style="height:6em">
        <b-col >  
          <b-form-input placeholder="Suchbegriff" size="lg" width="60%" debounce="500" @input="function(event){searchProducts(event)}"></b-form-input>
        </b-col>
      </b-row>
      <b-skeleton-table v-if="productsIsLoading"
                        :rows="10"
                        :columns="4"
                        :table-props="{ }"
                      ></b-skeleton-table>  
      <b-table v-else :items="allProducts" :fields="fields">
        <template #cell(name)="data">
          <span>{{ data.value }}</span>
        </template>
        <template #cell(category)="data">
          <span>{{ data.value.name }}</span>
        </template>
        <template #cell(unit)="data">
          <span
            >{{ data.item.amount | formatAmount }}
            {{ data.item.unit.name }}</span
          >
        </template> 
        <template #head(tags)="data">
        <span class="d-none d-lg-block">{{ data.label}}</span>
      </template>
        <template #cell(tags)="data">                       
                <h5><b-badge  class="m-1 d-none d-lg-block" v-for="tag in data.tags" pill variant="success" :key="tag.id">{{tag.name}}</b-badge></h5>                       
        </template>          
        <template #cell(addtocart)="data">
          <b-button variant="success" @click="addProduct(data.item)">Zum Warenkorb hinzufügen</b-button>
        </template>
      </b-table>
      <div v-if="!productsIsLoading">
        <div v-if="isEndReached">
          <p v-if="noResults">Zu diesem Suchbegriff konnten keine Produkte gefunden werden.</p>
          <p v-else> Das sind leider alle Produkte.</p>
        </div>
        <b-btn v-else @click="fetchProducts()" variant="success">Lade mehr Produkte</b-btn>
      </div>
    </b-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CartModal from "../components/CustomerCartModal.vue";

export default {
  components: { CartModal },
  name: "Products",
  methods: {
    ...mapActions(["searchProducts", "addProduct","fetchProducts"]),   
    getNextPage() {
      
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight-10;
       
        if (bottomOfWindow) {
          // this.fetchProducts()        
        }
      }
    }
      
  },
  computed: mapGetters(["allProducts","productsIsLoading","isEndReached","noResults"]),
  created() {
    this.searchProducts("");
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "category", label: "Kategorie" },
        { key: "unit", label: "Einheit" },
        { key: "tags", label: "Tags"},
        { key: "addtocart", label: "" },
      ],
    };
  },
  filters: {
    formatAmount(unit) {
      return parseFloat(unit.toString());
    },
  },
  mounted() {
    this.getNextPage();
  }
};
</script>
