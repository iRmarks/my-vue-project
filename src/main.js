import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入插件
import request from "./api/request";
// 在原型上扩展,这样不用在每个页面都导入request
Vue.prototype.request = request;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
