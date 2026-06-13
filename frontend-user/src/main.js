import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入 Mock
import './mock'

// 引入 Vant 组件
import {
  Button, Field, Form, Toast, Swipe, SwipeItem, Lazyload,
  Icon, Tabbar, TabbarItem, NavBar, Search, Tag, Card,
  Checkbox, CheckboxGroup, Stepper, SwipeCell, SubmitBar,
  Cell, CellGroup, Image as VanImage, Grid, GridItem,
  Dialog, ActionSheet, Sku, Tab, Tabs, Loading, Empty,
  PullRefresh, List, Divider, Badge, Popup, Overlay
} from 'vant'
import 'vant/lib/index.css'

// 注册 Vant 组件
const components = [
  Button, Field, Form, Swipe, SwipeItem, Icon, Tabbar, TabbarItem,
  NavBar, Search, Tag, Card, Checkbox, CheckboxGroup, Stepper,
  SwipeCell, SubmitBar, Cell, CellGroup, VanImage, Grid, GridItem,
  ActionSheet, Tab, Tabs, Loading, Empty, PullRefresh, List,
  Divider, Badge, Popup, Overlay
]
components.forEach(c => Vue.use(c))
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Lazyload)

// 全局样式
import './styles/global.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
