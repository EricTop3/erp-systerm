<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购收货</li>
          <li class="active">新建</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>收货日期</label>
              <date-picker :value.sync="time"></date-picker>
            </div>
            <div class="form-group">
              <label>收货仓库</label>
              <select class="form-control" v-model="selectedAlotStock">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in alotStock">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>供应商</label>
              <select class="form-control" v-model="selectedWarehouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in supplierList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 450px;" v-model="note">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ" @click="uploadPurchase">提交收货</span>
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
                  <td>{{entry.unit_name}}</td>
                  <td>{{entry.unit_specification}}</td>
                  <td>{{entry.main_reference_value}}{{entry.unit_name}}</td>
                  <td><count :count.sync =entry.received_amount></count></td>
                  <td><count :count.sync =entry.additional_amount></count></td>
                  <td><count :count.sync =entry.refund_amount></count></td>
                  <td><price :price.sync =entry.purchase_price></price>元</td>
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
                  <td>{{entry.item_main_reference_value}}{{entry.unit_name}}</td>
                  <td>{{entry.item_amount}}{{entry.unit_name}}</td>
                  <td>{{entry.item_refund}}{{entry.unit_name}}</td>
                  <td>￥{{entry.item_price|priceChange}}</td>
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
    :instroduce-data-modal.sync='modal.parentIntroModal'
    :instroduce-data-modal-size="modal.parentIntroModalSize"
    :first-data-title="origenData.firstDataTitle"
    :first-data.sync="origenData.firstData"
    :second-data-title="origenData.secondDataTitle"
    :second-data.sync="origenData.secondData"
    :request-data="{id: selectedWarehouse }">
  </introduce-data>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
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
  import ErrorTip from '../../common/ErrorTip'
  import Count from '../../common/Count'
  import Price from '../../common/Price'
  import ListDelete from '../../common/ListDelete'
  import {requestSystemUrl, requestUrl,token, searchRequest,getDataFromApi,postDataToApi,detailGoodsInfo} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      Grid: Grid,
      Page: Page,
      StockGoods:StockGoods,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      Summary: Summary,
      IntroduceData: IntroduceData,
      ErrorTip: ErrorTip,
      DatePicker: DatePicker,
      Count: Count,
      Price: Price,
      ListDelete: ListDelete
    },
    ready: function () {
      var self = this
//    供应商请求接口
      var url = requestSystemUrl + '/backend-system/provider/provider'
//    获取仓库名称
      getDataFromApi( requestUrl + '/backend-system/warehouse-minimal-list',{type:2},function(response){
        self.alotStock = response.data.body.list
      })
//    获取供应商列表
      getDataFromApi(url,{},function(response){
        self.supplierList = response.data.body.list
      })
    },
    events: {
//      引入原始数据添加商品
      includeConfirmAdd: function () {
        var self = this
        var saveDataArray = []
        var detailArrayFromApi = []
        detailGoodsInfo(this.origenData.secondData,'Purchase')
        saveDataArray = this.stockGoods.concat(this.origenData.secondData)
        $.each(saveDataArray, function (index, val) {
          val.refund_amount = 0
          val.received_amount =val.main_reference_value
          val.additional_amount= 0
          val.purchase_price = (val.unit_price * 0.01).toFixed(2)
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)

          }
        })
        this.renderstockGoods = self.dataArray
      },

//      分页
      pagechange: function (currentpage) {
        this.current_page = currentpage
        this.localPage(this.old)
        this.rederSetGoods = this.old
      },
//     删除商品
      delete: function (id) {
        var self = this
        $.each(this.renderstockGoods, function (index, val) {
          if (val.id === id) {
            self.renderstockGoods.splice(index, 1)
          }
        })
      },
    },
    methods: {
//     提交采购
      uploadPurchase: function () {
        var self = this
        var items = []
        var uploadFlag = true
//      采购收货请求地址
        var url = requestSystemUrl + '/backend-system/purchase/receive'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id
          obj.reference_type = val.reference_type
          obj.additional_amount = val.additional_amount
          obj.refund_amount = val.refund_amount
          obj.received_amount = val.received_amount
          obj.price = val.purchase_price
          if(val.refund_amount ==='' ||val.received_amount ==='' || val.additional_amount==="" ||val.price){
            uploadFlag = false
          }
          items.push(obj)
        });
//      采购需要填写的数据
        var data = {
          items: items,
          operated_at: this.time,
          note: this.note,
          provider_id: this.selectedWarehouse,
          warehouse_id:  this.selectedAlotStock
        }
//       提交之前的判断
        if(this.time===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没有填收货日期哟'
        }else if(this.selectedWarehouse===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没有选择供应商哟'
        }else if(this.selectedAlotStock===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没有选择收货仓库哟'
        }else if(items.length<1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,收货数量,赠送数量,退货数量，采购单价都不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "#!/admin/purchase/delivery"
          })
        }
      },
//     引入数据
      inclucdePurchaseData: function () {
        this.modal.parentIntroModal = true
        this.$broadcast('getGoodsWhenClick')
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
//           汇总方法
      summary: function () {
        var self = this
        self.summaryPrice = 0
        this.summarystockGoods = []
        this.summarystockGoods =this.summarystockGoods.concat(self.renderstockGoods)
        $.each(this.summarystockGoods,function (index,val){
          val.item_amount = val.received_amount
          val.item_refund = val.refund_amount
          val.item_main_reference_value = val.main_reference_value
          val.item_additional_amount  = val.additional_amount
          console.log( val.item_additional_amount)
          console.log( val.received_amount)
          console.log( val.item_main_reference_value)
          val.item_price = Number (val.item_amount  * val.purchase_price * 100)
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
            hash[array[i][ObjPropInArr]].item_main_reference_value=Number(array[i].item_main_reference_value) + Number( hash[array[i][ObjPropInArr]].  item_main_reference_value)
            hash[array[i][ObjPropInArr]].item_amount=Number( hash[array[i][ObjPropInArr]].item_amount)+(Number(array[i].item_amount) + Number(array[i].item_additional_amount) - Number(array[i].item_refund))
            hash[array[i][ObjPropInArr]].item_refund=Number(array[i].item_refund) + Number( hash[array[i][ObjPropInArr]].item_refund)
            hash[array[i][ObjPropInArr]].item_price+=array[i].item_price
          }else{
            hash[array[i][ObjPropInArr]]=array[i];
          }
        }
        for(var j in hash){
          result.push(hash[j])
        }
        return result
      },
    },
    data: function () {
      return {
//        入库明细
        detailModal: true,
//        入库汇总
        summaryModal: false,
        showPage: [],
        time: '',
        selectedSupplier: '',
        selectedWarehouse:'',
        note: '',
        summaryPrice: 0,
        supplierList: [],
        selectedAlotStock: '',
        alotStock:  [],
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          unit_name:"单位",
          specification_unit:"单位规格",
          main_reference_value: "采购数量",
          received_amount:"收货数量",
          additional_amount:"赠送数量",
          refund_amount:"退货数量",
          purchase_price:"采购单价",
        },
        gridColumns1: {
          code: "货号",
          name: "品名",
          specification_unit:"单位规格",
          main_reference_value: "采购数量",
          received_amount:"实际收货数量",
          refund_amount:"退货数量",
          purchase_price:"小计",
        },
        renderstockGoods: [],
        summarystockGoods: [],
        stockGoods: [],
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
          title: '原始总部采购单',
          dataUrl: requestSystemUrl + '/backend-system/reference-document/purchase',
          firstDataTitle: {
            "document_number": "采购单号",
            "created_at": "采购日期",
            "total_sum": "采购金额",
            "provider": "供应商",
            "creator_name": "制单人",
            "auditor_name": "审核人"
          },
          firstData: [],
          secondDataTitle: {
            "item_code": "货号",
            "item_name": "品名",
            "demand_amount": "要货数量",
            "main_reference_value":"采购数量",
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
