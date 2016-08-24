<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">委外生产入库单</li>
          <li class="active">新建委外生产入库单</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>收货日期</label>
              <date-picker :value.sync="sendTime"></date-picker>
            </div>
            <div class="form-group">
              <label>合作工厂</label>
              <select class="form-control" v-model="selectedFactory">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in cooperativeFactory">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>调入仓库</label>
              <select class="form-control" v-model="selectedInHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>备注</label>
              <input type="text" class="form-control" v-model="note" style="width: 250px">
            </div>
            <span class="btn btn-primary" @click="inclucdePurchaseData">引用原始单据</span>
            <span class="btn btn-default" @click="uploadPurchase">提交收货</span>
          </form>
        </div>

        <!--入库明细入库汇总-->
        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">出库明细</a></li>
            <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">出库汇总</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- 出库明细 -->
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
                  <td>{{entry.main_reference_value}}</td>
                  <td><count :count.sync =entry.distribution_amount></count>{{entry.unit_name}}</td>
                  <td><count :count.sync =entry.defective_amount></count>{{entry.unit_name}}</td>
                  <td>￥{{entry.unit_price|priceChange}}</td>

                  <td>{{entry.unit_specification}}</td>
                  <td>
                    <slot name="operate">
                      <list-delete :delete-data.sync="tableData" ></list-delete>
                    </slot>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 出库汇总 -->
            <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                <tr class="text-center">
                  <th v-for="value in  gridColumns">
                    {{value}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
                  <td>{{entry.item_code}}</td>
                  <td>{{entry.item_name}}</td>
                  <td>{{entry.item_stock}}</td>
                  <td>{{entry.item_main_reference_value}}</td>
                  <td>{{entry.item_distribution_amount}}</td>
                  <td>{{entry.unit_name}}</td>
                  <td>{{entry.unit_specification}}</td>
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
    :second-data.sync="origenData.secondData"
    :request-data="{stream_origin_id:selectedFactory,stream_target_id:selectedInHouse}"
  >
  </introduce-data>

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
  import ListDelete from '../../../common/ListDelete'
  import Count from '../../../common/Count'
  import {
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    detailGoodsInfo
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
      LeftProduction: LeftProduction,
      ListDelete: ListDelete,
      Count: Count
    },
    ready: function () {
      var self = this
//    仓库请求接口
      var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
//    获取仓库列表
      getDataFromApi(url,{},function(response){
        self.warehouseList = response.data.body.list
      })
//      获取合作工厂cooperativeFactory
      getDataFromApi(requestSystemUrl + '/backend-system/provider/provider', {}, function (response) {
        self.cooperativeFactory = response.data.body.list
      })
    },
    events: {
//      引入原始数据添加商品
      includeConfirmAdd: function () {
        var self = this
        var saveDataArray = []
        var detailArrayFromApi = []
        detailGoodsInfo(this.origenData.secondData,'pick')
        saveDataArray = this.stockGoods.concat(this.origenData.secondData)
        $.each(saveDataArray, function (index, val) {
          val.distribution_amount = val.main_reference_value || 0
          val.defective_amount  = 0
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
            val.again = false
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
//     提交委外生产入库
      uploadPurchase: function () {
        var self = this
        var items = []
        var uploadFlag = true
//      提交委外生产入库请求地址
        var url = requestSystemUrl + '/backend-system/production/outsource'
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj.reference_id = val.id //	收货商品ID
//          obj.reference_type = val.reference_type
          obj.amount = val.distribution_amount //	实际入库量
          obj.stock_amount = val.main_reference_value //	生产数量
          obj.defective_amount = val.defective_amount //次品数量
          obj.price = Number(val.stock * val.distribution_amount) //加工费用
          if(val.distribution_amount === ''){
            uploadFlag = false
          }
          items.push(obj)
        });
//      提交配送出库需要填写的数据
        var data = {
          items: items,
          note: this.note,
          operated_at: this.sendTime,
          provider_id: this.selectedFactory,
          warehouse_id: this.selectedInHouse
        }
//      判断配送出库和采购单价是否为空
        $.each(items,function(index,val){
        })
//       提交之前的判断
        if(this.selectedFactory===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写合作工厂'
        } else if(this.selectedInHouse===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写调入厂库'
        }else if(this.sendTime===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写配送时间'
        }else if(items.length<1){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你还没有添加商品哟'
        }else if(!uploadFlag){
          this.modal.errModal = true
          this.modal.errInfo = 'high,你的入库数量和次品数量不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
            window.location.href = "#!/admin/production/delegationInstock"
          })
        }
      },
//     引入数据
      inclucdePurchaseData: function (){
        if(this.selectedFactory===''){
           this.modal.errModal = true
           this.modal.errInfo = 'high，你还没填写合作工厂'
        } else if(this.selectedInHouse===''){
          this.modal.errModal = true
          this.modal.errInfo = 'high，你还没填写调入厂库'
        }else{
          this.modal.parentIntroModal = true
          this.$broadcast('getGoodsWhenClick')  }
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
//      汇总方法
      summary: function () {
        var self = this
        this.summarystockGoods = []
        this.summarystockGoods = this.summarystockGoods.concat(self.renderstockGoods)
        $.each(this.summarystockGoods, function (index, val) {
          val.item_stock = val.stock
          val.item_main_reference_value = val.main_reference_value
          val.item_distribution_amount = val.distribution_amount
        })
        this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
      },
//     汇总方法
      summaryMethod: function (ObjPropInArr, array) {
        var hash = {};
        var result = [];
        for (var i = 0; i < array.length; i++) {
          if (hash[array[i][ObjPropInArr]]) {
            hash[array[i][ObjPropInArr]].item_stock = Number(array[i].item_stock) + Number(hash[array[i][ObjPropInArr]].item_stock)
            hash[array[i][ObjPropInArr]].item_main_reference_value = Number(array[i].item_main_reference_value) + Number(hash[array[i][ObjPropInArr]].item_main_reference_value)
            hash[array[i][ObjPropInArr]].item_distribution_amount = Number(array[i].item_distribution_amount) + Number(hash[array[i][ObjPropInArr]].item_distribution_amount)
          } else {
            hash[array[i][ObjPropInArr]] = array[i]
          }
        }
        for (var j in hash) {
          result.push(hash[j])
        }
        return result
      }
    },
    data: function () {
      return {
        selectedFactory: '',
        sendTime: '',
        cooperativeFactory: [],
//        出库明细
        detailModal: true,
//        入库汇总
        summaryModal: false,
        reference_type: 'pick',
        warehouseList: [],
        selectedInHouse: '',
        note: '',
        tabFlag: true,
        gridColumns: {
          code: "货号",
          name: "品名",
          main_reference_value: "生产数量",
          b: "入库数量",
          c: "次品数量",
          purchase_price:"加工单价",
          unit_specification: "单位规格",
        },
        stockGoods: [],
        renderstockGoods: [],
        currentUrl: '',
        origenData: {
          title: '原始要货配料单',
          dataUrl: requestSystemUrl + '/backend-system/reference-document/produce-out',
          firstDataTitle: {
            "document_number": "生产货单号",
            "created_at": "生产日期",
            "amount": "生产数量",
            "store_name": "生产工厂",
            "creator_name": "制单人",
            "auditor_name": "审核人"
          },
          firstData: [],
          secondDataTitle: {
            "item_code": "货号",
            "item_name": "品名",
            "main_reference_value":"生产数量",
            "unit_name": "单位",
            "unit_specification": "单位规格"
          },
          secondData: []
        },
        modal:{
          parentIntroModal: false,
          parentIntroModalSize: 'modal-lg',
          errModal: false,
          errInfo: 'high。这是友情提醒'
        },
        setGoods: [],
        setGoodsPage: [],
        dataArray: []
      }
    }
  }
</script>
