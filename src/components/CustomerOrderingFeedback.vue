<template>  
          <b-modal  centered  size="sm" v-model="isModalShown" header-class="p-2 border-bottom-0" footer-class="p-2 border-top-0" @hide="setFeedbackModalContent('')" > 
              <template #modal-header>
                <!-- Emulate built in modal header close button action -->           
                <h5></h5>
              </template>                   
                    {{getFeedbackModalContent}}
                    <template #modal-footer>  
                       <b-button   class="float-right" size="sm"  variant="primary"  @click="setFeedbackModalContent('')" >
                        Schließen
                       </b-button>                          
                    </template>
                </b-modal> 
</template>
<script>


import {mapActions, mapGetters} from 'vuex'

export default {
  components: {},
  name: 'OrderingFeedback',
  methods:{ 
      ...mapActions(['setFeedbackModalContent']),

    },
  computed:{   
    ...mapGetters(["getFeedbackModalContent"]),
    isModalShown:{
        get: function(){
            return this.getFeedbackModalContent.length==0 ?  false :  true
        }   
    }
  },  
  data(){
      return {
               }
  }  
}
</script>
