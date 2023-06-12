import Vuex from 'vuex';
import Vue from 'vue';
import products from './modules/products';
import cart from './modules/cart';
import toast from './modules/toast';
import user from './modules/user';
import orders from './modules/orders';
import order from './modules/order';
import ordering from './modules/ordering';
import PickerOrders from './modules/PickerOrders';
import PickerSearch from './modules/PickerSearch';
import ManagerRealView from './modules/ManagerRealView'
import createPersistedState from 'vuex-persistedstate'
// Load Vuex
Vue.use(Vuex);


const loginState = createPersistedState({
  paths: ['user.accessToken', 'user.refreshToken','user.authorization']
});


export default new Vuex.Store({
  modules: {
    toast,
    cart,
    products,
    user,
    orders,
    order,
    ordering,
    PickerOrders,
    PickerSearch,
    ManagerRealView
  },
  plugins: [loginState]
});