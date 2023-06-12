import Vue from 'vue'
import VueRouter from 'vue-router'
// import Products from '../views/CustomerProducts.vue'
import Orders from '../views/CustomerOrders.vue'
import Login from '../views/NobodyLogin.vue'
// import Account from '../views/CustomerAccount.vue'
import PasswordReset from '../views/NobodyPasswordReset.vue'
import PasswordResetConfirm from '../views/NobodyPasswordResetConfirm.vue'
import Ordering from '../views/CustomerOrdering.vue'
import store from '../store'
import PickerOrders from '../views/PickerOrders.vue'
import PickerScreen from '../views/screens/PickerScreen.vue'
import PickerSearch from '../views/PickerSearch.vue'

import CustomerScreen from '../views/screens/CustomerScreen.vue'
import PickerRealView from '../views/PickerRealView.vue'
import PickerTimePlanning from '../views/PickerTimePlanning.vue'
Vue.use(VueRouter)

const routes = [
  { path: '*', 
    beforeEnter: (to, from, next) => { next({name:"CustomerOrders"}) } },
  {
    path: '/login',
    name: 'Login',
    component: Login    
  },  
  {
    path: '/password/reset',
    name: 'PasswordReset',
    component:PasswordReset
  },
  {
    path: '/password/reset/confirm',
    name: 'PasswordResetConfirm',
    component:PasswordResetConfirm   
  },
  {
    
    path: '/customer',
    redirect:{ name: 'CustomerOrdering' },
    component: CustomerScreen,
    beforeEnter:isAuthenticated,
    children: [ 
      {
        path: 'orders',
        name: 'CustomerOrders',
        component:Orders
      },     
      {
        path: 'ordering',
        name: 'CustomerOrdering',
        component:Ordering
      }
    ]
  },
  {
    path: '/picker',
    redirect:{ name: 'PickerOrders' },
    component: PickerScreen,
    beforeEnter:isAuthenticated,
    children: [ 
       {
        path: 'orders',
        name: 'PickerOrders',
        component:PickerOrders,
        },
        {
          path: 'search',
          name: 'PickerSearch',
          component:PickerSearch,
          },
          {
            path: 'liveview',
            name: 'PickerRealView',
            component:PickerRealView,
            },
            {
              path: 'timeplanning',
              name: 'PickerTimePlanning',
              component:PickerTimePlanning,
              }
    ]
  }
] 


function isAuthenticated(to,from,next){
  if(!store.getters.isUserLoggedIn)
  {
    next({ name: 'Login' })    
    return
  }
  next()
  
}


const router = new VueRouter({
  mode: 'history',
  routes  
})

export default router
