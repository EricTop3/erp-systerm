/**
 * Created by ErnestWang on 2016/6/13.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRescource from 'vue-resource'
import {priceChange} from './filters/'
import App from './App'
import Login from './components/login/Login'
import Order from './components/order/Order'
import Billing from './components/billing/Billing'
import BillingHistory from './components/billing/BillingHistory'
import MemberIndex from './components/member/MemberIndex'
import Detail from './components/member/MemberDetail'
import InStock from './components/instock/InStock'
import GoodsApply from './components/instock/GoodsApply'
import GoodsApplyNum from './components/instock/GoodsApplyNum'
import GoodsApplyNumDetail from './components/instock/GoodsApplyNumDetail'
import Allot from './components/instock/Allot'
import AllotNum from './components/instock/AllotNum'
import AllotNumDetail from './components/instock/AllotNumDetail'
import Differences from './components/instock/Differences'
import DifferencesDetail from './components/instock/DifferencesDetail'
import Inventory from './components/instock/Inventory'
import InventoryDetail from './components/instock/InventoryDetail'
import InventoryCreate from './components/instock/InventoryCreate'
import InventoryQuery from './components/instock/InventoryQuery'
import InventoryQueryDetail from './components/instock/InventoryQueryDetail'
import ProductionOutBills from './components/instock/ProductionOutBills'
import ProductionOutBillsDetail from './components/instock/ProductionOutBillsDetail'
import AllotOutBills from './components/instock/AllotOutBills'
import AllotOutBillsDetail from './components/instock/AllotOutBillsDetail'
import SaleOutBills from './components/instock/SaleOutBills'
import SaleOutBillsDetail from './components/instock/SaleOutBillsDetail'
import AllotOut from './components/instock/AllotOut'
import TransactionQuery from './components/transaction-query/TransactionQuery'
import MicroShopOrder from './components/micro-shop-order/MicroShopOrder'
Vue.filter('priceChange', priceChange)
Vue.use(VueRouter)
Vue.use(VueRescource)
Vue.config.debug = true
Vue.http.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
Vue.http.options.emulateJSON = true
window.localStorage.setItem('token', '75207fdf8d926efcd2db52cd31e3073fff4f3cb2')
// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
var router = new VueRouter(
  {
    linkActiveClass: 'active'
  }
)
// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
// 稍后我们会讲解嵌套路由
router.map({
  '/': {
    component: Order
  },
  '/login': {
    component: Login
  },
  '/order': {
    component: Order
  },
  '/member': {
    component: MemberIndex
  },
  '/member/:memberId/detail': {
    name: 'member',
    component: Detail
  },
  '/billing': {
    component: Billing
  },
  '/billing/:queryId': {
    name: 'billing',
    component: BillingHistory
  },
  '/instock/GoodsApply': {
    component: GoodsApply
  },
  '/instock/GoodsApplyNum': {
    component: GoodsApplyNum
  },
  '/instock/GoodsApplyNum/:queryId': {
    name: 'GoodsApplyNum',
    component: GoodsApplyNumDetail
  },
  '/instock/Allot': {
    component: Allot
  },
  '/instock/AllotNum': {
    component: AllotNum
  },
  '/instock/AllotNum/:queryId': {
    name: 'AllotNum',
    component: AllotNumDetail
  },
  '/instock/Differences': {
    component: Differences
  },
  '/instock/Differences/:queryId': {
    name: 'Differences',
    component: DifferencesDetail
  },
  '/instock/Inventory': {
    component: Inventory
  },
  '/instock/Inventory/:queryId': {
    name: 'Inventory',
    component: InventoryDetail
  },
  '/instock/InventoryCreate': {
    component: InventoryCreate
  },
  '/instock/InventoryQuery': {
    component: InventoryQuery
  },
  '/instock/InventoryQuery/:queryId': {
    name: 'inventoryQuery',
    component: InventoryQueryDetail
  },
  '/instock/ProductionOutBills': {
    component: ProductionOutBills
  },
  '/instock/ProductionOutBills/:queryId': {
    name: 'ProductionOutBills',
    component: ProductionOutBillsDetail
  },
  '/instock/AllotOutBills': {
    component: AllotOutBills
  },
  '/instock/AllotOutBills/:queryId': {
    name: 'AllotOutBills',
    component: AllotOutBillsDetail
  },
  '/instock/SaleOutBills': {
    component: SaleOutBills
  },
  '/instock/SaleOutBills/:queryId': {
    name: 'SaleOutBills',
    component: SaleOutBillsDetail
  },
  '/instock/AllotOut': {
    component: AllotOut
  },
  '/instock': {
    component: InStock
  },
  '/tranquery': {
    component: TransactionQuery
  },
  '/microshoporder': {
    component: MicroShopOrder
  }
})
router.redirect({
  '*': '/order'
})

router.beforeEach(function (transtion) {
  console.log('app启动')
  transtion.next()
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')

