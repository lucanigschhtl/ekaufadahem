<template>
    <div name="picker">
      <the-picker-nav/>
      <h1 v-if="getAuthorization<3"> Du hast keinen Zugriff auf diese Seite!</h1>
      <router-view v-else></router-view>
    </div>    
</template>

<script>
import ThePickerNav from  '../../components/navigation/ThePickerNav'
import { mapGetters } from 'vuex';

export default {
  components: { ThePickerNav},
  name: 'PickerScreen',
  computed: mapGetters(["isUserLoggedIn","getAuthorization"]),
  created(){    
    if(!this.isUserLoggedIn){
            this.$router.push({name:'Login'})
        }  
  }
};
</script>
