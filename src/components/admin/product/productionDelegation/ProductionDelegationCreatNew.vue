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
              <select class="form-control" v-model="selectedSupplier">
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

        <!--入库明细入库汇总-->
        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)">入库明细</a></li>
            <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)">入库汇总</a></li>
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
                  <td>￥{{entry.item_price}}</td>
                </tr>
                </tbody>
              </table>
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
  import LeftProduction from '../../common/LeftProduction'
  import DatePicker from  '../../../common/DatePicker'
  import Summary from '../../../common/Summary'
  import IntroduceData  from '../../../common/IntroduceData'
  import ListDelete  from '../../../common/ListDelete'
  import Count from '../../../common/Count'
  import Price from '../../../common/Price'
  import ErrorTip from '../../../common/ErrorTip'
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
    detailGoodsInfo,
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
      Count: Count,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ErrorTip: ErrorTip,
      ListDelete: ListDelete,
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
          val.purchase_price = ''
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
          val.purchase_amount = ''
          val.purchase_price = ''
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
//     提交委外生产
      uploadPurchase: function () {
        var self = this
        console.log( self.reference_type )
        var items = []
        var uploadFlag = true
//      委外生产请求地址
        var url = requestSystemUrl + '/backend-system/produce/outsource'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = val.reference_type
          obj.amount = val.purchase_amount
          obj.price = val.purchase_price
          if(val.purchase_amount == '' || val.purchase_price == ''){
            uploadFlag = false
          }
          items.push(obj)
        });
//      委外生产需要填写的数据
        var data = {
          items: items,
          note: this.note,
          operated_at: this.startTime,
          provider_id: this.selectedSupplier
        }
//       提交之前的判断
        if(this.startTime===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还添加时间！'
        }else if(this.selectedSupplier === ''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没有选择合作工厂！'
        }else if(items.length < 1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品！'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的生产数量和加工单价不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "#!/admin/production/delegationCreat"
          },function (err) {
            if (err.data.code == '220001') {
              self.modal.errModal = true
              self.modal.errInfo = '库存不足，已生产领料单，请前往领料单查看！'
            }
            console.log(err)
          })
        }
      },
//      添加商品
      addStockGoods: function ( ){
        this.modal.addGoodModal=true
      },
//     引入数据
      inclucdePurchaseData: function () {
        this.modal.parentIntroModal = true
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
      },
      //          汇总方法
      summary: function () {
        var self = this
        self.summaryPrice = 0
        this.summarystockGoods = []
        this.summarystockGoods =this.summarystockGoods.concat(self. renderstockGoods)
        $.each(this.summarystockGoods,function (index,val){
          val.item_amount = val.purchase_amount
        })
        this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
      },
//     汇总方法
      summaryMethod: function (ObjPropInArr, array){
        var hash={};
        var result=[];
        for(var i=0;i<array.length;i++){
          if(hash[array[i][ObjPropInArr]]){
            hash[array[i][ObjPropInArr]].item_amount=Number(array[i].item_amount) + Number( hash[array[i][ObjPropInArr]].item_amount)
          }else{
            hash[array[i][ObjPropInArr]]=array[i];
          }
        }
        for(var j in hash){
          result.push(hash[j])
        }
        return result
      }
    },
    data: function () {
      return {
//        入库明细
        detailModal: true,
//        入库汇总
        summaryModal: false,
        summaryPrice: [],
        startTime: '',
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
          order_quantity:"门店要货量",
          purchase_quantity:"生产数量",
          purchase_price:"加工单价",
          source_number: "来源要货单号"
        },
        gridColumns1: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          aruc: "总部库存",
          order_quantity:"门店要货量",
          purchase_quantity:"生产数量",
          source_number: "小计"
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
            "document_number": "要货单号",
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
        dataArray: []
      }
    }
  }
</script>
