/**
 * Created by ErnestWang on 2016/6/13.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRescource from 'vue-resource'
import VueValidator from 'vue-validator'
import {priceChange} from './filters/'
import App from './App'
import Order from 'components/website/order/Order'
import SiteLogin from './components/website/login/SiteLogin'
import Billing from 'components/website/billing/Billing'
import BillingHistory from 'components/website/billing/BillingHistory'
import MemberIndex from 'components/website/member/MemberIndex'
import MemberDetail from 'components/website/member/MemberDetail'
import InStock from 'components/website/instock/InStock'
import GoodsApply from 'components/website/instock/GoodsApply'
import GoodsApplyNum from 'components/website/instock/GoodsApplyNum'
import GoodsApplyNumDetail from 'components/website/instock/GoodsApplyNumDetail'
import Instok from 'components/website/instock/InStock'
import Allot from 'components/website/instock/Allot'
import AllotNum from 'components/website/instock/AllotNum'
import AllotNumDetail from 'components/website/instock/AllotNumDetail'
import Differences from 'components/website/instock/Differences'
import DifferencesDetail from 'components/website/instock/DifferencesDetail'
import Inventory from 'components/website/instock/Inventory'
import InventoryDetail from 'components/website/instock/InventoryDetail'
import InventoryCreate from 'components/website/instock/InventoryCreate'
import InventoryQuery from 'components/website/instock/InventoryQuery'
import InventoryQueryDetail from 'components/website/instock/InventoryQueryDetail'
import ProductionOutBills from 'components/website/instock/ProductionOutBills'
import ProductionOutBillsDetail from 'components/website/instock/ProductionOutBillsDetail'
import AllotOutBills from 'components/website/instock/AllotOutBills'
import AllotOutBillsDetail from 'components/website/instock/AllotOutBillsDetail'
import SaleOutBills from 'components/website/instock/SaleOutBills'
import SaleOutBillsDetail from 'components/website/instock/SaleOutBillsDetail'
import AllotOut from 'components/website/instock/AllotOut'
import TransactionQuery from 'components/website/transaction-query/TransactionQuery'
import Purchase from 'components/admin/purchase/Purchase'
import PurchaseDelivery from 'components/admin/purchase/PurchaseDelivery'
import CreateNewPurchase from 'components/admin/purchase/CreateNewPurchase'
import CreateNewPurchaseDelivery from 'components/admin/purchase/CreateNewPurchaseDelivery'
import PurchaseDetail from 'components/admin/purchase/PurchaseDetail'
import PurchaseDeliveryDetail from 'components/admin/purchase/PurchaseDeliveryDetail'
import Setting from 'components/admin/setting/Setting'
import SettingCreateNew from 'components/admin/setting/SettingCreateNew'
import SettingEditProduct from 'components/admin/setting/SettingEditProduct'
import SettingCategory from 'components/admin/setting/SettingCategory'
import SettingCoupon from 'components/admin/setting/SettingCoupon'
import SettingPartner from 'components/admin/setting/SettingPartner'
import SettingUserAccount from 'components/admin/setting/SettingUserAccount'
import SettingAdminAccount from 'components/admin/setting/SettingAdminAccount'
import Production from 'components/admin/product/Production'
import ProductionFactoryCreat from 'components/admin/product/ProductionFactoryCreat'
import ProductionDelegationCreat from 'components/admin/product/ProductionDelegationCreat'
import ProductionGetSupplies from 'components/admin/product/ProductionGetSupplies'
import ProductionCreatInstock from 'components/admin/product/ProductionCreatInstock'
import ProductionDelegationInstock from 'components/admin/product/ProductionDelegationInstock'
import ProductionCreatOrder from 'components/admin/product/ProductionCreatOrder'
import AdminMember from 'components/admin/member/MemberIndex'
import Retail from 'components/admin/retail/Retail'
import RetailManage from 'components/admin/retail/RetailManage'
import AdminInstock from 'components/admin/instock/InStock'
import AdminInstockDetail from 'components/admin/instock/InStockDetail'
import AdminInstockInventory from 'components/admin/instock/AdminInstockInventory'
import AdminInstockCreateInventory from 'components/admin/instock/AdminInstockCreateInventory'
import AdminInstockDifference from 'components/admin/instock/AdminInstockDifference'
import AdminInstockDifferenceDetail from 'components/admin/instock/AdminInstockDifferenceDetail'
import AdminInstockDispatching from 'components/admin/instock/AdminInstockDispatching'
import AdminCreateOutInstock from 'components/admin/instock/AdminCreateOutInstock'
import AdminInstockSale from 'components/admin/instock/AdminInstockSale'
import AdminInstockApply from 'components/admin/instock/AdminInstockApply'
import AdminInstockProduction from 'components/admin/instock/AdminInstockProduction'
import AdminMicroShopOrder from 'components/admin/micro-shop-order/MicroShopOrder'
import AdminLogin from 'components/admin/login/AdminLogin'
Vue.filter('priceChange', priceChange)
Vue.use(VueRouter)
Vue.use(VueRescource)
Vue.use(VueValidator)
Vue.config.debug = true
Vue.http.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
Vue.http.options.emulateJSON = true
// 全局验证方法
// 密码验证
Vue.validator('password', function (val) {
  return  /^[a-zA-Z]{1}([a-zA-Z0-9]|[._/@]){5,17}$/.test(val)
})
// 手机号码验证
Vue.validator('phone', function (val) {
  return /^1[3|4|5|7|8][0-9]{9}$/.test(val)
})
// 验证非零的正整数
Vue.validator('number', function (val) {
  return /^[0-9]*$/.test(val)
})
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
  '/site/order': {
    component: Order
  },
  '/site/login': {
    component: SiteLogin
  },
  '/site/member': {
    component: MemberIndex
  },
  '/site/member/:queryId': {
    name: 'member',
    component: MemberDetail
  },
  '/site/billing': {
    component: Billing
  },
  '/site/billing/BillingHistory': {
    component: BillingHistory
  },
  '/site/instock/GoodsApply': {
    component: GoodsApply
  },
  '/site/instock/GoodsApplyNum': {
    component: GoodsApplyNum
  },
  '/site/instock/GoodsApplyNum/:queryId': {
    name: 'GoodsApplyNum',
    component: GoodsApplyNumDetail
  },
  '/site/instock/Allot': {
    component: Allot
  },
  '/site/instock/AllotNum': {
    component: AllotNum
  },
  '/site/instock/AllotNum/:queryId': {
    name: 'AllotNum',
    component: AllotNumDetail
  },
  '/site/instock/Differences': {
    component: Differences
  },
  '/site/instock/Differences/:queryId': {
    name: 'Differences',
    component: DifferencesDetail
  },
  '/site/instock/Inventory': {
    component: Inventory
  },
  '/site/instock/Inventory/:queryId': {
    name: 'Inventory',
    component: InventoryDetail
  },
  '/site/instock/InventoryCreate': {
    component: InventoryCreate
  },
  '/site/instock/InventoryQuery': {
    component: InventoryQuery
  },
  '/site/instock/InventoryQuery/:queryId': {
    name: 'inventoryQuery',
    component: InventoryQueryDetail
  },
  '/site/instock/ProductionOutBills': {
    component: ProductionOutBills
  },
  '/site/instock/ProductionOutBills/:queryId': {
    name: 'ProductionOutBills',
    component: ProductionOutBillsDetail
  },
  '/site/instock/AllotOutBills': {
    component: AllotOutBills
  },
  '/site/instock/AllotOutBills/:queryId': {
    name: 'AllotOutBills',
    component: AllotOutBillsDetail
  },
  '/site/instock/SaleOutBills': {
    component: SaleOutBills
  },
  '/site/instock/SaleOutBills/:queryId': {
    name: 'SaleOutBills',
    component: SaleOutBillsDetail
  },
  '/site/instock/AllotOut': {
    component: AllotOut
  },
  '/site/instock': {
    component: InStock
  },
  '/admin/purchase/order/createNewPurchase': {
    component: CreateNewPurchase
  },
  '/site/tranquery': {
    component: TransactionQuery
  },
  '/admin/purchase': {
    component: Purchase
  },
  '/admin/purchase/order': {
    component: Purchase
  },
  '/admin/purchase/order/purchasedetail/:queryId': {
    component: PurchaseDetail
  },
  '/admin/purchase/delivery': {
    component: PurchaseDelivery
  },
  '/admin/purchase/delivery/deliverydetail/:queryId': {
    component: PurchaseDeliveryDetail
  },
  '/admin/purchase/delivery/createNewDelivery': {
    component: CreateNewPurchaseDelivery
  },
  '/admin/setting': {
    component: Setting
  },
  '/admin/setting/commodity': {
    component: Setting
  },
  '/admin/setting/commodity/createNew': {
    component: SettingCreateNew
  },
  '/admin/setting/settingEditProduct/:queryId': {
    component: SettingEditProduct
  },
  '/admin/setting/category': {
    component: SettingCategory
  },
  '/admin/setting/coupon': {
    component: SettingCoupon
  },
  '/admin/setting/partner': {
    component: SettingPartner
  },
  '/admin/setting/userAccount': {
    component: SettingUserAccount
  },
  '/admin/setting/adminAccount': {
    component: SettingAdminAccount
  },
  '/admin/production': {
    component: Production
  },
  '/admin/production/factoryCreat': {
    component: ProductionFactoryCreat
  },
  '/admin/production/delegationCreat': {
    component: ProductionDelegationCreat
  },
  '/admin/production/getSupplies': {
    component: ProductionGetSupplies
  },
  '/admin/production/creatInstock': {
    component: ProductionCreatInstock
  },
  '/admin/production/delegationInstock': {
    component: ProductionDelegationInstock
  },
  '/admin/production/creatOrder': {
    component: ProductionCreatOrder
  },
  '/admin/member': {
    component: AdminMember
  },
  '/admin/instock': {
    component: AdminInstock
  },
  '/admin/instock/inStockDetail/:queryId': {
    component: AdminInstockDetail
  },
  '/admin/instock/inventory': {
    component: AdminInstockInventory
  },
  '/admin/instock/createInventory': {
    component: AdminInstockCreateInventory
  },
  '/admin/instock/difference': {
    component: AdminInstockDifference
  },
  '/admin/instock/differenceDetail/:queryId': {
    component: AdminInstockDifferenceDetail
  },
  '/admin/instock/dispatching': {
    component: AdminInstockDispatching
  },
  '/admin/instock/createOutInstock': {
    component: AdminCreateOutInstock
  },
  '/admin/instock/sale': {
    component: AdminInstockSale
  },
  '/admin/instock/production': {
    component: AdminInstockProduction
  },
  '/admin/instock/apply': {
    component: AdminInstockApply
  },
  '/admin/retail': {
    component: Retail
  },
  '/admin/retail/manage': {
    component: RetailManage
  },
  '/admin/micromall': {
    component: AdminMicroShopOrder
  },
  '/admin/login': {
    component: AdminLogin
  }
})
router.redirect({
  '*': 'site/order'
})
router.beforeEach(function (transtion) {
  console.log('app启动')
  transtion.next()
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')
