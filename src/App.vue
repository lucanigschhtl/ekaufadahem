<template>
    <div>
      <router-view  /> 
      <the-user-footer class="mt-5"/>
      <b-alert class="m-5" v-if="!backendStatus" variant="danger" show>Achtung, der Server wird gerade gewartet. Versuche es später nocheinmal.</b-alert> 
    </div>
</template>
<script>
  import TheUserFooter from './components/TheUserFooter.vue'
  import {HTTP} from './services/api';

  export default {
    components: { TheUserFooter },
    name: 'App',
    async created() {
      this.$store.watch(      
        state => state.toast.toastMessages,
        toastMessages => {        
          this.$bvToast.toast(toastMessages[0].title,toastMessages[0].options);        
        })
        
        try
        {
          var response = await HTTP.get("/ping")
        }
        catch(err)
        {
          this.backendStatus=false
        }

        if(response.status!=200)
          this.backendStatus=false
    },
    data:function () {
      return {
        backendStatus: true
      }
    }
  };
</script>
