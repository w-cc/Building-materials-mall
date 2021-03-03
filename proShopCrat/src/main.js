// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import { GoodsAction, GoodsActionIcon, GoodsActionButton, Pagination, Sku, Stepper, Swipe, SwipeItem, SubmitBar, Toast, Search } from 'vant';
import { Button, NavBar, Field, Dialog, Notify, Tab, Tabs, Tabbar, TabbarItem, Sidebar, SidebarItem } from 'vant';
import { Lazyload } from "vant";
Vue.use(Lazyload);

Vue.use(GoodsAction).use(Sidebar).use(SidebarItem).use(Pagination).use(Search).use(Swipe).use(SwipeItem);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon).use(Sku).use(Stepper).use(SubmitBar).use(Toast);
Vue.use(NavBar).use(Button).use(Field).use(Dialog).use(Notify).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
