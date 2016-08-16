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
            <span class="btn btn-default"  @click="addStockGoods">添加商品</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ" @click="uploadPurchase">提交采购</span>
          </form>
        </div>
        <!--入库明细入库汇总-->
        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
            <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
            <li class="summaryCount" v-if="summaryModal"><a href="javascript:void(0)">合计：￥{{summaryPrice|priceChange}}</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- 入库明细 -->
            <div role="tabpanel" class="tab-pane active" v-if="detailModal">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                <tr class="text-center">
                  <th v-for="value in  gridColumns">
                    {{value}}
                  </th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in renderstockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
                   <td>{{entry.item_code}}</td>
                   <td>{{entry.item_name}}</td>
                   <td>{{entry.unit_specification}}</td>
                   <td>{{entry.stock}}{{entry.unit_name}}</td>
                   <td>{{entry.required_amount}}{{entry.unit_name}}</td>
                   <td><count :count.sync =entry.purchase_amount></count>{{entry.unit_name}}</td>
                   <td><price :price.sync =entry.purchase_price></price>元/{{entry.unit_name}}</td>
                   <td>{{entry.refence_number}}</td>
                  <td>
                    <slot name="operate">
                      <list-delete :delete-data.sync="tableData" ></list-delete>
                    </slot>
                  </td>
                </tr>
                </tbody>
              </table>
              <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
              <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
              <!--:last-page="page.last_page"></page>-->
            </div>

            <!-- 入库汇总 -->
            <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                <tr class="text-center">
                  <th v-for="value in  gridColumns1">
                    {{value}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
                  <td>{{entry.item_code}}</td>
                  <td>{{entry.item_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                  <td>{{entry.stock}}{{entry.unit_name}}</td>
                  <td>{{entry.required_amount}}{{entry.unit_name}}</td>
                  <td>{{entry.item_amount}}{{entry.unit_name}}</td>
                  <td>￥{{entry.item_price | priceChange}}</td>
                </tr>
                </tbody>
              </table>
              <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
              <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
              <!--:last-page="page.last_page"></page>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--引入原始数据-->
  <introduce-data
    :title="origenData.title"
    :url="origenData.dataUrl"
    :second-url="origenData.secondUrl"
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
  .nav-tabs  .summaryCount{
    float: right;
    color: #f54040;
    line-height:1.4;
    font-size: 18px;
  }
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
  import ListDelete  from '../../common/ListDelete'
  import Count from '../../common/Count'
  import Price from '../../common/Price'
  import ErrorTip from '../../common/ErrorTip'
  import {requestSystemUrl, token, searchRequest,getDataFromApi,postDataToApi,detailGoodsInfo} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods:StockGoods,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      Count: Count,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ListDelete: ListDelete,
      ErrorTip: ErrorTip,
      Price: Price
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
        detailGoodsInfo(self.stockGoods,'ProductItem')
        $.each(self.stockGoods, function (index, val) {
          val.purchase_amount = ''
          val.purchase_price = (val.apuc*0.01).toFixed(2)
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
       this.renderstockGoods = self.dataArray
      },
//      引入原始数据添加商品
      includeConfirmAdd: function () {
        var self = this
        var saveDataArray = []
        var detailArrayFromApi = []
        detailGoodsInfo(this.origenData.secondData,'Requisition')
        saveDataArray = this.stockGoods.concat(this.origenData.secondData)
        $.each(saveDataArray, function (index, val) {
          val.purchase_amount ===''
          val.purchase_price ===''
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        this.renderstockGoods = self.dataArray
      },
//     删除商品
      delete: function (id) {
        var self = this
        $.each(this.renderstockGoods, function (index, val) {
          if (val.id === id) {
            self.renderstockGoods.splice(index, 1)
            val.choice = false
            val.again =  false
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
        var url = requestSystemUrl + '/backend-system/purchase/purchase'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = val.type
          obj.amount = val.purchase_amount
          obj.price = val.purchase_price
          if(val.purchase_amount ==='' ||val.purchase_price ===''){
            uploadFlag = false
          }
          items.push(obj)
        });
//      采购需要填写的数据
        var data = {
          items: items,
          note: this.note,
          provider_id: this.selectedSupplier
        }
//       提交之前的判断
        if(this.selectedSupplier===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没有选择供应商哟'
        }else if(items.length<1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的采购数量和采购单价不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "#!/admin/purchase/order"
          })
        }
      },
//      添加商品
      addStockGoods: function ( ){
        this.modal.addGoodModal = true
      },
//     引入数据
      inclucdePurchaseData: function () {
         this.modal.parentIntroModal = true
      },
//      汇总方法
      summary: function () {
        var self = this
        self.summaryPrice = 0
        this.summarystockGoods = []
        this.summarystockGoods =this.summarystockGoods.concat(self.renderstockGoods)
        $.each(this.summarystockGoods,function (index,val){
          val.item_amount = val.purchase_amount
          val.item_price = Number(val.item_amount  * val.purchase_price * 100)
          self.summaryPrice += val.item_price
        })
        this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
      },
//       汇总方法
      summaryMethod: function  (ObjPropInArr, array){
        var hash={};
        var result=[];
        for(var i=0;i<array.length;i++){
          if(hash[array[i][ObjPropInArr]]){
            hash[array[i][ObjPropInArr]].item_amount=Number(array[i].purchase_amount) + Number( hash[array[i][ObjPropInArr]].item_amount)
            hash[array[i][ObjPropInArr]].item_price+=array[i].item_price;
          }else{
            hash[array[i][ObjPropInArr]]=array[i];
          }
        }
        for(var j in hash){
          result.push(hash[j])
        }
        return result
      },
//      入库明细与入库汇总切换
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))){
          case 1:
            this.detailModal = true
            this.summaryModal = false
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.summary()
        }
      }
    },
    data: function () {
      return {
//        入库明细
        detailModal: true,
//        入库汇总
        summaryModal: false,
        showPage: [],
        a: [],
        summaryPrice: 0,
        selectedSupplier: '',
        note: '',
        supplierList: [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          order_quantity:"门店要货量",
          purchase_quantity:"采购数量",
          purchase_price:"采购单价",
          source_number: "来源要货单号"
        },
        gridColumns1: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          order_quantity:"门店要货量",
          purchase_quantity:"采购数量",
          source_number: "小计"
        },
        summarystockGoods: [],
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
            product_type: 2
          }
        },
        origenData: {
          title: '原始门店要货单',
          dataUrl:  requestSystemUrl + '/backend-system/reference-document/requisition',
          secondUrl: requestSystemUrl + '/backend-system/reference-document/pick',
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
<style>
  table thead tr th{
    text-align: center;
  }
</style>
