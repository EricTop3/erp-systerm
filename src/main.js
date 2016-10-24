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
import BillingToday from 'components/website/billing/BillingToday'
import BillingList from 'components/website/billing/BillingList'
import BillingHistoryDetail from 'components/website/billing/BillingHistoryDetail'
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
import dataCenter from 'components/admin/data-center/purchase/OrderStatistics'
import OrderStatistics from 'components/admin/data-center/purchase/OrderStatistics'
import OrderStatisticsDetail from 'components/admin/data-center/purchase/OrderStatisticsDetail'
import ReceivingStatistics from 'components/admin/data-center/purchase/ReceivingStatistics'
import ReceivingStatisticsDetail from 'components/admin/data-center/purchase/ReceivingStatisticsDetail'
import AllocateList from 'components/admin/data-center/instock/AllocateList'
import AllocateListDetail from 'components/admin/data-center/instock/AllocateListDetail'
import RequisitionList from 'components/admin/data-center/instock/RequisitionList'
import RequisitionListDetail from 'components/admin/data-center/instock/RequisitionListDetail'
import DistributionList from 'components/admin/data-center/instock/DistributionList'
import DistributionListDetail from 'components/admin/data-center/instock/DistributionListDetail'
import AllList from 'components/admin/data-center/instock/AllList'
import RemainderList from 'components/admin/data-center/instock/RemainderList'
import RemainderListDetail from 'components/admin/data-center/instock/RemainderListDetail'
import OrderSaleList from 'components/admin/data-center/instock/OrderSaleList'
import OrderSaleListDetail from 'components/admin/data-center/instock/OrderSaleListDetail'
import PutInList from 'components/admin/data-center/production/PutInList'
import PutInListDetail from 'components/admin/data-center/production/PutInListDetail'
import RechargeList from 'components/admin/data-center/member/RechargeList'
import RechargeListDetail from 'components/admin/data-center/member/RechargeListDetail'
import ConsumptionList from 'components/admin/data-center/member/ConsumptionList'
import InformationList from 'components/admin/data-center/member/InformationList'
import ConsumeList from 'components/admin/data-center/production/ConsumeList'
import ConsumeListDetail from 'components/admin/data-center/production/ConsumeListDetail'
import DefectiveList from 'components/admin/data-center/production/DefectiveList'
import DefectiveListDetail from 'components/admin/data-center/production/DefectiveListDetail'
import CheckList from 'components/admin/data-center/instock/CheckList'
import CheckListDetail from 'components/admin/data-center/instock/CheckListDetail'
import SaleOrderList from 'components/admin/data-center/sale/SaleOrderList'
import SaleSettlementList from 'components/admin/data-center/sale/SaleSettlementList'
import SaleRankingList from 'components/admin/data-center/sale/SaleRankingList'
import SaleBankList from 'components/admin/data-center/sale/SaleBankList'
import SaleBankListDetail from 'components/admin/data-center/sale/SaleBankListDetail'
import SettingCreateNew from 'components/admin/setting/SettingCreateNew'
import SettingEditProduct from 'components/admin/setting/SettingEditProduct'
import SettingCategory from 'components/admin/setting/SettingCategory'
import SettingCoupon from 'components/admin/setting/SettingCoupon'
import SettingPartner from 'components/admin/setting/SettingPartner'
import SettingUserAccount from 'components/admin/setting/SettingUserAccount'
import SettingAdminAccount from 'components/admin/setting/SettingAdminAccount'
import Production from 'components/admin/product/factory/Production'
import ProductionFactoryCreat from 'components/admin/product/factory/ProductionFactoryCreat'
import FactoryProductDetail from 'components/admin/product/factory/FactoryProductDetail'
import ProductionDelegationCreat from 'components/admin/product/productionDelegation/ProductionDelegationCreat'
import ProductionDelegationCreatNew from 'components/admin/product/productionDelegation/ProductionDelegationCreatNew'
import ProductionDelegationCreateDetail from 'components/admin/product/productionDelegation/ProductionDelegationCreateDetail'
import ProductionGetSupplies from 'components/admin/product/productionGetSupplies/ProductionGetSupplie'
import ProductionGetSuppliesDetail from 'components/admin/product/productionGetSupplies/ProductionGetSuppliesDetail'
import InstockList from 'components/admin/product/productFactoryInstock/InstockList'
import CreateInstock from 'components/admin/product/productFactoryInstock/CreateInstock'
import InstockDetail from 'components/admin/product/productFactoryInstock/InstockDetail'
import ProductionDelegationInstock from 'components/admin/product/productionDelegationInstock/ProductionDelegationInstock'
import ProductionDelegationInstockNew from 'components/admin/product/productionDelegationInstock/ProductionDelegationInstockNew'
import ProductionDelegationInstockDetail from 'components/admin/product/productionDelegationInstock/ProductionDelegationInstockDetail'
import ProductionCreatOrder from 'components/admin/product/productionOrder/ProductionCreatOrder'
import AdminMember from 'components/admin/member/MemberIndex'
import AdminMemberDetail from 'components/admin/member/MemberDetail'
import Retail from 'components/admin/retail/Retail'
import RetailView from 'components/admin/retail/RetailView'
import RetailViewDetail from 'components/admin/retail/RetailViewDetail'
import RetailManage from 'components/admin/retail/RetailManage'
import RetailManageDetail from 'components/admin/retail/RetailManageDetail'
import AdminInstock from 'components/admin/instock/queryInstock/InStock'
import AdminInstockDetail from 'components/admin/instock/queryInstock/InStockDetail'
import AdminInstockInventory from 'components/admin/instock/inventoryStock/AdminInstockInventory'
import AdminInstockCreateInventory from 'components/admin/instock/inventoryStock/AdminInstockCreateInventory'
import AdminInstockInventoryDetail from 'components/admin/instock/inventoryStock/AdminInstockInventoryDetail'
import AdminInstockDifference from 'components/admin/instock/differenceInstock/AdminInstockDifference'
import AdminInstockDifferenceDetail from 'components/admin/instock/differenceInstock/AdminInstockDifferenceDetail'
import AdminInstockDispatching from 'components/admin/instock/dispatchOutStock/AdminInstockDispatching'
import AdminCreateOutInstock from 'components/admin/instock/dispatchOutStock/AdminCreateOutInstock'
import DispatchStockDetail from 'components/admin/instock/dispatchOutStock/DispatchStockDetail'
import AdminInstockSale from 'components/admin/instock/saleStock/AdminInstockSale'
import AdminInstockSaleDetail from 'components/admin/instock/saleStock/AdminInstockSaleDetail'
import AdminInstockApply from 'components/admin/instock/requireGoodSummary/AdminInstockApply'
import AdminInstockapplyDetail from 'components/admin/instock/requireGoodSummary/AdminInstockapplyDetail'
import AdminInstockProduction from 'components/admin/instock/productInstock/AdminInstockProduction'
import AdminInstockProductionDetail from 'components/admin/instock/productInstock/AdminInstockProductionDetail'
import AdminMicroShopOrder from 'components/admin/micro-shop-order/MicroShopOrder'
import AdminLogin from 'components/admin/login/AdminLogin'
import Error404  from 'components/common/Error404.vue'
import Error403  from 'components/common/Error403.vue'
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
    component: BillingToday
  },
  '/site/billing/list': {
    component: BillingList
  },
  '/site/billing/detail/:queryId': {
    name: 'billing',
    component: BillingHistoryDetail
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
  '/admin/dataCenter': {
    component: dataCenter
  },
  '/admin/dataCenter/purchase': {
    component: dataCenter
  },
  '/admin/dataCenter/purchase/orderStatistics': {
    component: OrderStatistics
  },
  '/admin/dataCenter/purchase/orderStatistics/detail': {
    component: OrderStatisticsDetail
  },
  '/admin/dataCenter/purchase/receivingStatistics': {
    component: ReceivingStatistics
  },
  '/admin/dataCenter/purchase/receivingStatistics/detail': {
    component: ReceivingStatisticsDetail
  },
  '/admin/dataCenter/instock': {
    component: CheckList
  },
  '/admin/dataCenter/instock/checkList': {
    component: CheckList
  },
  '/admin/dataCenter/instock/checkListDetail': {
    component: CheckListDetail
  },
  '/admin/dataCenter/instock/allocateList': {
    component: AllocateList
  },
  '/admin/dataCenter/instock/allocateListDetail': {
    component: AllocateListDetail
  },
  '/admin/dataCenter/instock/requisitionList': {
    component: RequisitionList
  },
  '/admin/dataCenter/instock/requisitionListDetail': {
    component: RequisitionListDetail
  },
  '/admin/dataCenter/instock/distributionList': {
    component: DistributionList
  },
  '/admin/dataCenter/instock/distributionListDetail': {
    component: DistributionListDetail
  },
  '/admin/dataCenter/instock/allList': {
    component: AllList
  },
  '/admin/dataCenter/instock/remainderList': {
    component: RemainderList
  },
  '/admin/dataCenter/instock/remainderListDetail': {
    component: RemainderListDetail
  },
  '/admin/dataCenter/instock/orderSaleList': {
    component: OrderSaleList
  },
  '/admin/dataCenter/instock/orderSaleListDetail': {
    component: OrderSaleListDetail
  },
  '/admin/dataCenter/production': {
    component: PutInList
  },
  '/admin/dataCenter/production/putInList': {
    component: PutInList
  },
  '/admin/dataCenter/production/putInListDetail': {
    component: PutInListDetail
  },
  '/admin/dataCenter/production/consumeList': {
    component: ConsumeList
  },
  '/admin/dataCenter/production/consumeListDetail': {
    component: ConsumeListDetail
  },
  '/admin/dataCenter/production/defectiveList': {
    component: DefectiveList
  },
  '/admin/dataCenter/production/defectiveListDetail': {
    component: DefectiveListDetail
  },
  '/admin/dataCenter/sale': {
    component: SaleOrderList
  },
  '/admin/dataCenter/sale/orderList': {
    component: SaleOrderList
  },
  '/admin/dataCenter/sale/settlementList': {
    component: SaleSettlementList
  },
  '/admin/dataCenter/sale/rankingList': {
    component: SaleRankingList
  },
  '/admin/dataCenter/sale/bankList': {
    component: SaleBankList
  },
  '/admin/dataCenter/sale/bankListDetail': {
    component: SaleBankListDetail
  },
  '/admin/dataCenter/member': {
    component: RechargeList
  },
  '/admin/dataCenter/member/rechargeList': {
    component: RechargeList
  },
  '/admin/dataCenter/member/rechargeListDetail': {
    component: RechargeListDetail
  },
  '/admin/dataCenter/member/informationList': {
    component: InformationList
  },
  '/admin/dataCenter/member/consumptionList': {
    component: ConsumptionList
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
  '/admin/production/factoryProduction': {
    component: Production
  },
  '/admin/production/factoryProduction/factoryCreat': {
    component: ProductionFactoryCreat
  },
  '/admin/production/factoryProduction/detail/:queryId': {
    component: FactoryProductDetail
  },
  '/admin/production/delegationCreat': {
    component: ProductionDelegationCreat
  },
  '/admin/production/delegationCreat/New': {
    component: ProductionDelegationCreatNew
  },
  '/admin/production/delegationCreat/Detail/:queryId': {
    component: ProductionDelegationCreateDetail
  },
  '/admin/production/getSupplies': {
    component: ProductionGetSupplies
  },
  '/admin/production/getSupplies/Detail/:queryId': {
    component: ProductionGetSuppliesDetail
  },
  '/admin/production/factoryInstock': {
    component: InstockList
  },
  '/admin/production/factoryInstock/createInstock': {
    component: CreateInstock
  },
  '/admin/production/factoryInstock/detail/:queryId': {
    component: InstockDetail
  },
  '/admin/production/delegationInstock': {
    component: ProductionDelegationInstock
  },
  '/admin/production/delegationInstock/ProductionDelegationInstockNew': {
    component: ProductionDelegationInstockNew
  },
  '/admin/production/delegationInstock/ProductionDelegationInstockDetail/:queryId': {
    component: ProductionDelegationInstockDetail
  },
  '/admin/production/creatOrder': {
    component: ProductionCreatOrder
  },
  '/admin/member': {
    component: AdminMember
  },
  '/admin/member/detail/:queryId': {
    component: AdminMemberDetail
  },
  '/admin/instock': {
    component: AdminInstock
  },
  '/admin/instock/query': {
    component: AdminInstock
  },
  '/admin/instock/query/Detail/:queryId': {
    component: AdminInstockDetail
  },
  '/admin/instock/inventory': {
    component: AdminInstockInventory
  },
  '/admin/instock/inventory/create': {
    component: AdminInstockCreateInventory
  },
  '/admin/instock/inventory/Detail/:queryId': {
    component: AdminInstockInventoryDetail
  },
  '/admin/instock/difference': {
    component: AdminInstockDifference
  },
  '/admin/instock/difference/Detail/:queryId': {
    component: AdminInstockDifferenceDetail
  },
  '/admin/instock/dispatching': {
    component: AdminInstockDispatching
  },
  '/admin/instock/dispatching/create': {
    component: AdminCreateOutInstock
  },
  '/admin/instock/dispatching/Detail/:queryId': {
    component: DispatchStockDetail
  },
  '/admin/instock/sale': {
    component: AdminInstockSale
  },
  '/admin/instock/sale/Detail/:queryId': {
    component: AdminInstockSaleDetail
  },
  '/admin/instock/production': {
    component: AdminInstockProduction
  },
  '/admin/instock/production/Detail/:queryId': {
    component: AdminInstockProductionDetail
  },
  '/admin/instock/apply': {
    component: AdminInstockApply
  },
  '/admin/instock/apply/applyDetail/:queryId': {
    component: AdminInstockapplyDetail
  },
  '/admin/retail': {
    component: Retail
  },
  '/admin/retail/statistics': {
    component: Retail
  },
  '/admin/retail/statistics/view/:queryId': {
    component: RetailView
  },
  '/admin/retail/statistics/view/Detail/:queryId': {
    component: RetailViewDetail
  },
  '/admin/retail/manage': {
    component: RetailManage
  },
  '/admin/retail/manage/Detail/:queryId': {
    component: RetailManageDetail
  },
  '/admin/micromall': {
    component: AdminMicroShopOrder
  },
  '/admin/login': {
    component: AdminLogin
  },
  '/admin/404': {
    component: Error404
  },
  '/admin/403': {
    component: Error403
  }
})
router.redirect({
  '*': 'site/login'
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')
