<template>
 
    <b-container class="mt-3">
                 <h1>Reale Belegung</h1>
                   <b-row>

                   </b-row>
                    <div class="m-2" v-for="box in getAllBoxes" :key="box._id">
                      <b-card>
                        <b-card-title>{{box.name}}</b-card-title>
                        <b-card-sub-title>{{box.description}}</b-card-sub-title>
                        <b-card-body>   
                            <b-row>
                                <b-col  v-for="tray in box.trays" :key="tray._id">
                                    <b-card  class="mb-3" md="auto"  >
                                        <b-card-title> {{tray.col}}</b-card-title>
                                        <div>
                                             <b-card-sub-title > <br> {{tray.state | trayOpen}}</b-card-sub-title>
                                            <b-card-sub-title  class="mt-2" v-if="tray.shouldState==0&&tray.state==1" >Sollte sich gleich öffnen </b-card-sub-title>
                                             <b-btn size="sm" @click="openTray(tray._id)" class="mt-2" v-if="tray.state==1 && tray.shouldState!=0" variant="success">Öffnen</b-btn>
                                        </div>
                                       
                                        <b-card-body>     
                                            <b-row>                        
                                                <div class="mr-2">
                                                    <h3> 
                                                    <b-badge class="mt-2" v-if="tray.place.order==null" v-b-tooltip.hover.bottom title="Das Fach ist momentan frei." variant="success">Frei</b-badge>
                                                    <b-badge class="mt-2" v-else-if="tray.place.order"  variant="primary" v-b-tooltip.hover.bottom title="In diesem Fach befindet sich momentan eine Bestellung">#{{tray.place.order.nr}}</b-badge>
                                                    </h3> 
                                                </div>
                                            </b-row>                                  
                                        </b-card-body>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </b-card-body>
                      </b-card>
                    </div>
          
    </b-container> 

</template>
<script>

// import BackendConnection from '../services/authorizedapi';
import {mapActions, mapGetters, mapMutations} from 'vuex'
import { TypeConverter }  from "../utils/TypeConverter";

export default {
  components: {},
  name: "PickerRealView", 
  data(){
    return{
    TypeConverter,
        showModal:false,
        error:""     
    }   
  },  
  async created() {
    this.refreshBoxData()
    this.$once("hook:beforeDestroy", () => {
      this.stopPlaceRefresh()
    })
  },
  methods: {
    ...mapActions(['refreshBoxData','openTray','stopPlaceRefresh']),
    ...mapMutations(['_setShowState']),
  },
   computed:{   
    ...mapGetters(["isPickerRealViewLoadingPlaces","getAllBoxes"]),
  },
  filters: { 
    formatAmount (unit) {
      return parseFloat(unit.toString());
    },
     trayOpen(open){
      if(open==0)
        return "geöffnet"
      return "geschlossen"
    }   
  }
};
</script>
