<template>
    <div>
        <h4>Bemerkung</h4>                            
         <b-form-textarea @change="setComment"   rows="5"   max-rows="10" >
        </b-form-textarea>
    </div>    
</template>  


<script>
import {mapActions} from 'vuex'

export default {  
  name: "OrderingComment", 
  data(){
    return{
                      
    }   
  },    
  methods: {             
    
       ...mapActions(['setComment']),
   
  },
   computed:{         
    

  },
  filters: { 
   
  }  
};
</script>
