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
          <li class="active">查看委外生产入库单</li>
        </ol>

        <!--详情页面-->
        <summary-detail
          :table-header="gridColumns"
          :table-data="list"
          :grid-operate="gridOperate">
        </summary-detail>

        <!--有列表切换的时候的情况-->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
          <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
          <!-- 入库明细 -->
          <div role="tabpanel" class="tab-pane active" v-if="detailModal">
            <!--表格详情列表-->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <th v-for="value in gridColumns2">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.unit_specification}}</td>
                <td>{{entry.origin_stock_amount}}</td>
                <td>{{entry.reference_number}}</td>
                <td v-if="editFlag"><count :count.sync =entry.refund_amount></count></td>
                <td v-if="!editFlag">{{entry.refund_amount}}</td>
                <td v-if="editFlag"><price :price.sync =entry.unit_price></price>元</td>
                <td v-if="!editFlag">{{entry.unit_price}}元</td>
                <td >{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- 入库汇总 -->
          <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
            <!--表格详情列表-->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <th v-for="value in  gridColumns2">
                  {{value}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
                <td>{{entry.item_code}}</td>
                <td>{{entry.item_name}}</td>
                <td>{{entry.main_reference_value}}</td>
                <td>{{entry.received_amount}}</td>
                <td>{{entry.additional_amount}}</td>
                <td>{{entry.refund_amount}}</td>
                <td>{{entry.unit_price}}元</td>
                <td>{{entry.reference_number}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
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
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url:requestSystemUrl + '/backend-system/produce/outsource/',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//      删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl+ '/backend-system/produce/outsource/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl+ '/backend-system/produce/outsource/'+ id +'/checked',function(response){
          self.editFlag = false
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/produce/outsource/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//           编辑
      editGoods: function () {
        this.editFlag = true
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
          this.modal.errInfo = 'high,你的配送数量不能为空哟'
        }else{
          postDataToApi(url,data,function (response) {
//            window.location.href = "#!/admin/production/delegationInstock"
          })
        }
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
            this.$dispatch('detail')
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.$dispatch('summary')
        }
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
          d: "来源要货单号"
        },
        stockGoods: [],
        renderstockGoods: [],
        currentUrl: '',
        origenData: {
          title: '原始要货配料单',
          dataUrl: requestSystemUrl + '/backend-system/reference-document/requisition',
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
