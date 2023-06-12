<template>
    <div class="container mt-5">  
        <b-navbar toggleable="lg" type="dark"  style="background: linear-gradient(to bottom, #55af32 0%, #40822b 100%); -webkit-box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);" class="navbar navbar-expand-lg col-lg-12 main-navigation-list-wrap clearfix">
            <b-navbar-brand href="#">Konsumverein Sonntag</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
             <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                  <!--  <b-nav-item :to="getRouterPathByName('CustomerProducts')"  >Produktkatalog</b-nav-item>-->
                    <b-nav-item  :to="getRouterPathByName('CustomerOrders')" >Meine Bestellungen</b-nav-item>
                <!--    <b-nav-item :to="getRouterPathByName('CustomerAccount')" >Mein Profil</b-nav-item>-->
                    <b-nav-item :to="getRouterPathByName('CustomerOrdering')" >Neue Bestellaufgabe</b-nav-item>
                     <b-btn variant="success" data-cy="logout" @click="logOutUser()">Ausloggen</b-btn>
                </b-navbar-nav>
              
            </b-collapse>
        </b-navbar>
    </div>   
</template>

<style lang="css">
    .router-link-exact-active {
        color:white !important;
        border-bottom:1px solid  white;
    }
</style>

<script>
    
    import {mapActions, mapMutations} from 'vuex'
    export default {
        name: 'TheUserNav',
          methods:{ 
             ...mapActions(['fetchCartItems','logOutUser']),
             ...mapMutations(['_setShowState','setUserLoggedIn']),
              getRouterPathByName(routeName){
                return this.$router.resolve({name:routeName}).route.fullPath
            }
          },
       
        
        

   
        
    
    }
    
</script>


