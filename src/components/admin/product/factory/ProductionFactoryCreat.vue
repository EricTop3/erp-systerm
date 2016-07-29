<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2"  role="navigation">
        <left-production></left-production>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">库存配送出库</li>
          <li class="active">新建配送出库</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group ml10">
              <label>生产时间</label>
              <date-picker :value.sync="sendTime"></date-picker>
            </div>

            <div class="form-group ml10">
              <label>备注</label>
              <input type="text" class="form-control" v-model="note" style="width: 250px">
            </div>
            <span class="btn btn-primary" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default" @click="addStockGoods">添加商品</span>
            <span class="btn btn-default" @click="uploadPurchase">提交出库</span>
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
  import DatePicker from '../../../common/DatePicker'
  import Summary from '../../../common/Summary'
  import IntroduceData  from '../../../common/IntroduceData'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftProduction from '../../common/LeftProduction'
  import {
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi
  } from '../../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods:StockGoods,
      DatePicker: DatePicker,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ErrorTip: ErrorTip,
      LeftProduction: LeftProduction
    },
    ready: function () {
      var self = this
//    获取仓库列表
      getDataFromApi( requestSystemUrl + '/backend-system/warehouse-minimal-list',{},function(response){
        self.warehouseList = response.data.body.list
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
          val.factory_instock_unit = val.specification_unit
          delete   val.specification_unit
          val.factory_total_stock = ''
          val.factory_required_amount = ''
          val.factory_product_amount = ''
          val.factory_origen_number = ''
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
          obj.name = val.item_name
          obj.code = val.item_code
          obj.factory_total_stock = ''
          obj.factory_required_amount = val.main_reference_value
          obj.factory_product_amount = ''
          obj.factory_instock_unit =val.unit_specification
          obj.factory_origen_number = ''
          detailArrayFromApi.push(obj)
        })
        this.stockGoods = this.stockGoods.concat(detailArrayFromApi)
        $.each(self.stockGoods, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
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
//     提交配送出库
      uploadPurchase: function () {
        var self = this
        var items = []
        var uploadFlag = true
//      提交生产出库请求地址
        var url = requestSystemUrl + '/backend-system/produce/factory'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = self.reference_type
          obj.amount = val.factory_product_amount
          items.push(obj)
        });
//      提交配送出库需要填写的数据
        var data = {
          items: items,
          note: this.note,
          operated_at: this.sendTime
        }
//      判断配送出库和采购单价是否为空
        $.each(items,function(index,val){
          if(val.factory_product_amount ===''){
            uploadFlag = false
          }
        })
//       提交之前的判断
       if(this.sendTime===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写配送时间'
        }else if(items.length<1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的生产数量不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "#!/admin/production"
          })
        }
      },
//      添加商品
      addStockGoods: function ( ){
        this.reference_type = 'Requisition'
        this.modal.addGoodModal=true
      },
//     引入数据
      inclucdePurchaseData: function () {
        this.reference_type = 'ProductItem'
        this.modal.parentIntroModal = true
      },
    },
    data: function () {
      return {
        showPage: [],
        reference_type: 'Requisition',
        sendTime: '',
        selectedOutHouse: '',
        selectedInHouse: '',
        note: '',
        warehouseList: [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          order_quantity:"要货数量",
          purchase_quantity:"生产数量",
          origen_number: "来源要货单号"
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
          errInfo: 'high。这是友情提醒'
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
