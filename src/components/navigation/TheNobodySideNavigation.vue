<template>    
    <b-card>  
            
        <div v-for="item in items" :key="item.name">            
            <div v-if="item.name!=currentRoute">
                <p>{{item.description}}</p>
                <b-btn :data-cy="item.name+'Btn'" class="mb-3" :href="item.path" variant="info">{{item.beautifulname}}</b-btn>                  
            </div>
        </div>
    </b-card>
</template>

<script>

export default {
  name: "SideNavigation", 
  data(){
    return{
      items:[                 
                {
                    name: 'Login',
                    beautifulname:'Login',
                    path: '/login',
                    description: 'Sie möchten sich einloggen?'                                                   
                },
                {
                    name: 'PasswordReset',
                    beautifulname:'Passwort Zurücksetzen',
                    path: '/password/reset',
                    description: 'Sie haben ihr Passwort vergessen?'
                }
                // {
                //     name: 'Register',
                //     path: '/#/register',
                //     beautifulname:'Neues Konto Erstellen',
                //     description: 'Sie möchten ein neues Konto erstellen?'
                // }         
            ],
        currentRoute: this.$router.currentRoute.name
        
    }    
  }  

};
</script>