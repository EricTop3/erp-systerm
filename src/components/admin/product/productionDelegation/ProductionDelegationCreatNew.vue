<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">委外生产单</li>
          <li class="active">新建委外生产单</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group ml10">
              <label>生产时间</label>
              <date-picker :value.sync="startTime"></date-picker>
            </div>
            <div class="form-group">
              <label>合作工厂</label>
              <select class="form-control" v-model="selectedFactory">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in supplierList" >{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 450px;" v-model="note">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default"  @click="modal.addGoodModal=true">添加商品</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ" @click="uploadPurchase">提交生产</span>
          </form>
        </div>

        <!--表格 -->
        <summary
          :table-header="gridColumns"
          :summary-data="renderstockGoods"
          :table-data="renderstockGoods"
          :page="page"
          :tab-flag="tabFlag"
          :operate="true"
        >
        </summary>
      </div>
    </div>
  </div>
  <!--引入原始数据-->
  <introduce-data
    :title="origenData.title"
    :url="origenData.dataUrl"
    :instroduce-data-modal.sync='modal.parentIntroModal'
    :instroduce-data-modal-size="modal.parentIntroModalSize"
    :first-data-title="origenData.firstDataTitle"
    :first-data.sync="origenData.firstData"
    :second-data-title="origenData.secondDataTitle"
    :second-data.sync="origenData.secondData">
  </introduce-data>
  <!--模态框-添加商品-->
  <stock-goods
    :get-render-data="rederSetGoods"
    :stock-add-good-modal.sync="modal.addGoodModal"
    :stock-add-good-modal-size="modal.addGoodModalSize"
    :page.sync="showPage"
    :add-data.sync="stockGoods"
    :goods-list-title="purchaseTabelHead"
    :product-url="request.productUrl"
    :category-url='request.categoryUrl'
    :request-data="request.productData">
  </stock-goods>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import StockGoods from '../../../common/StockGoodsOperate'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import IntroduceData  from '../../../common/IntroduceData'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftProduction from '../../common/LeftProduction'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest,
    postDataToApi,
    changeStatus } from '../../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods:StockGoods,
      DatePicker: DatePicker,
      LeftProduction: LeftProduction,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ErrorTip: ErrorTip
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
//      添加商品确认增加
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
          val.delegation_unit = val.specification_unit
          delete   val.specification_unit
          val.delegation_total_stock = ''
          val.delegation_require_goods = ''
          val.delegation_product_amount =  ''
          val.delegation_product_price = ''
          val.delegation_origen_source = ''

        })
      },
//      引入原始数据添加商品
      includeConfirmAdd: function () {
        var self = this
        var detailArrayFromApi = []
        $.each(this.origenData.secondData,function(index,val){
          var obj = {}
          obj.again = val.again
          obj.choice = val.choice
          obj.id = val.id
          obj.code = val.item_code
          obj.name = val.item_name
          obj.delegation_unit = val.unit_specification
          obj.delegation_total_stock = val.stock
          obj.delegation_require_goods = val.main_reference_value
          obj.delegation_product_amount = ''
          obj.delegation_product_price = ''
          obj.delegation_origen_source = ''
          obj.production_unit_name = val.unit_name
          delete val.unit_name
          detailArrayFromApi.push(obj)
        })
        console.log(detailArrayFromApi)
        this.stockGoods = this.stockGoods.concat(detailArrayFromApi)
        $.each(self.stockGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
        /*$.each(this.renderstockGoods,function(index,val){
          val.delegation_product_price =  ''
          val.delegation_product_amount = ''
        })*/
      },
//     删除商品
      deleteFromApi: function (id) {
        var self = this
        $.each(this.renderstockGoods, function (index, val) {
          if (val.id === id) {
            self.renderstockGoods.splice(index, 1)
          }
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
        var self = this
        var items = []
        var uploadFlag = true
//      采购请求地址
        var url = requestSystemUrl + '/backend-system/produce/outsource'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = 'ProductItem'
          obj.amount = val.delegation_product_amount
          obj.price = val.delegation_product_price
          items.push(obj)
        });
//      采购需要填写的数据
        var data = {
          items: items,
          note: this.note,
          operated_at: this.startTime,
          provider_id: this.selectedFactory
        }
//      判断采购数量和采购单价是否为空
        $.each(items,function(index,val){
          if(val.amount ==='' ||val.price ===''){
            uploadFlag = false
          }
        })
//       提交之前的判断
        if(this.startTime === ''){
          this.modal.errModal = true
          this.modal.errInfo = '你还没有选择时间！'
        } else if(this.selectedFactory===''){
          this.modal.errModal = true
          this.modal.errInfo = '你还没有选择合作工厂！'
        }else if(items.length<1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的采购数量和采购单价不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "?#!/admin/production/delegationCreat"
          })
        }
      },
//     引入数据
      inclucdePurchaseData: function () {
        this.modal.parentIntroModal = true
      },
    },
    data: function () {
      return {
        showPage: [],
        selectedFactory: '',
        startTime: '',
        note: '',
        supplierList: [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          order_quantity:"门店要货量",
          purchase_quantity:"生产数量",
          purchase_price:"加工单价",
          source_number: "来源要货单号"
        },
        renderstockGoods: [],
        currentUrl: '',
        purchaseTabelHead: {
          code: "货号",
          name: "品名",
          specification_unit: "单位规格",
          category: "商品分类"
        },
        request: {
          productUrl: requestSystemUrl +  '/backend-system/product/product',
          categoryUrl: requestSystemUrl + '/backend-system/product/category',
          productData: {
            product_type: 1
          }
        },
        origenData: {
          title: '原始门店要货单',
          dataUrl: requestSystemUrl + '/backend-system/reference-document/requisition',
          firstDataTitle: {
            "document_number": "货单号",
            "store_name": "要货仓库",
            "amount": "要货数量",
            "created_at": "配送日期",
            "creator_name": "制单人",
            "auditor_name": "审核人"
          },
          firstData: [],
          secondDataTitle: {
            "item_code": "货号",
            "item_name": "品名",
            "main_reference_value":"要货数量",
            "unit_name": "单位",
            "unit_specification": "单位规格"
          },
          secondData: []
        },
        modal:{
          addGoodModal: false,
          addGoodModalSize: 'modal-lg',
          parentIntroModal: false,
          parentIntroModalSize: 'modal-lg',
          errModal: false,
          errInfo: 'high!这是友情提醒'
        },
        category: '',
        baseUnit: '',
        setGoods: [],
        setGoodsPage: [],
        dataArray: [],
      }
    }
  }
</script>
