<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购订单</li>
          <li class="active">新建</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>供应商</label>
              <select class="form-control" v-model="selectedSupplier">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in supplierList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 450px;" v-model="note">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default"  @click="addGoodModal=true">添加商品</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ" @click="uploadPurchase">提交采购</span>
          </form>
        </div>
        <!--表格 -->
        <summary :table-header="gridColumns" :summary-data="renderstockGoods" :table-data="renderstockGoods" :page="page"  :detail-url="detailUrl" :tab-flag="tabFlag"></summary>
      </div>
    </div>
  </div>
  <!---->
  <introduce-data :instroduce-data-modal.sync='parentIntroModal' :instroduce-data-modal-size="parentIntroModalSize" :add-data.sync="stockGoods" :url="currentUrl"></introduce-data>
  <!--模态框-添加商品-->
  <stock-goods :get-render-data="rederSetGoods" :stock-add-good-modal.sync="addGoodModal" :stock-add-good-modal-size="addGoodModalSize" :page.sync="showPage" :add-data.sync="stockGoods" :goods-list-title="purchaseTabelHead" :url="productUrl"></stock-goods>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import StockGoods from '../../common/StockGoodsOperate'
  import LeftPurchase from '../common/LeftPurchase'
  import DatePicker from '../../common/DatePicker'
  import Summary from '../../common/Summary'
  import IntroduceData  from '../../common/IntroduceData'
  import {requestSystemUrl, token, searchRequest,getDataFromApi,postDataToApi} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods:StockGoods,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      Summary: Summary,
      IntroduceData: IntroduceData
    },
    ready: function () {
      var self = this
//    供应商请求接口
      var url = requestSystemUrl + '/backend-system/provider/provider'
//    获取供应商列表
      getDataFromApi(url,{},function(response){
        self.supplierList = response.data.body.list
      })
    },
    events: {
//      确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
        $.each(this.renderstockGoods,function(index,val){
          val.price =  ''
          val.amount = ''
        })
      },
//      分页
      pagechange: function (currentpage) {
        this.current_page = currentpage
        this.localPage(this.old)
        this.rederSetGoods = this.old
      }
    },
    methods: {
//     提交采购
      uploadPurchase: function () {
        var items = []
//      采购请求地址
        var url = requestSystemUrl + '/backend-system/purchase/purchase'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = 'ProductItem'
          obj.amount = val.amount
          obj.price = val.price
          items.push(obj)
        });
//      采购需要填写的数据
        var data = {
          items: items,
          note: this.note,
          provider_id: this.selectedSupplier
        }
        postDataToApi(url,data,function (response) {
           window.location.href = "#!/admin/purchase"
        })
      },
//     引入数据
      inclucdePurchaseData: function () {

      },
    },
    data: function () {
      return {
        showPage: [],
        selectedSupplier: '',
        note: '',
        supplierList: [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          a:"门店要货量",
          b:"采购数量",
          c:"采购单价",
          d: "来源要货单号",
        },
        renderstockGoods: [],
        currentUrl: '',
        purchaseTabelHead: {
          code: "货号",
          name: "品名",
          null: "库存数量",
          category: "分类",
          production_unit_name: "单位",
          specification_unit: "单位规格"
        },
        productUrl: requestSystemUrl +  '/backend-system/product/product',
        addGoodModal: false,
        addGoodModalSize: 'modal-lg',
        category: '',
        baseUnit: '',
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
      }
    }
  }
</script>
