import Vue from 'vue';
import Vuex from 'vuex';
import VueVirtualScroller from 'vue-virtual-scroller';

import modules from './modules';

Vue.use(Vuex);
Vue.use(VueVirtualScroller);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
});
