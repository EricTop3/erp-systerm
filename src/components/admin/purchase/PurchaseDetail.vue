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
          <li class="active">查看收货单</li>
        </ol>
        <!--详情页面-->
        <summary-detail
          :tab-flag='tabFlag'
          :detail-list="detailList"
          :table-header="gridColumns"
          :table-data="list"
          :second-table-header='gridColumns2'
          :grid-operate="gridOperate"
          :page.sync="page">
        </summary-detail>
    </div>
  </div>
    </div>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import Modal from '../../common/Modal'
  import Summary from '../../common/Summary'
  import DatePicker from  '../../common/DatePicker'
  import LeftPurchase from '../common/LeftPurchase'
  import SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,changeStatus} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase,
      SummaryDetail: SummaryDetail
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url:requestSystemUrl + '/backend-system/purchase/purchase',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          changeStatus(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//      删除请求
       deleteFromApi: function (id) {
       var self = this
       deleteRequest(requestSystemUrl+ '/backend-system/purchase/purchase/'+ id,function(response){
       console.log('deleted')
       })
       },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl+ '/backend-system/purchase/purchase/'+ id +'/checked',function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/purchase/purchase/'+ id +'/finished',function(response){
          console.log('finished')
        })
      }
    },
    ready: function () {
      this.listData()
    },
    methods: {
      listData: function (page) {
        var currentId = this.$route.params.queryId
        var self = this
//        获取商品列表详情
        var url = requestSystemUrl + '/backend-system/purchase/purchase/' + currentId
//       获取采购列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/purchase/purchase/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
          $.each(self.detailList,function(indec,val){
            delete  val.unit_name
            val.required_amount= val.demand_amount
            val.pruchase_amount = val.main_reference_value
            delete val.main_reference_value
          })
        })
//        获取采购列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          changeStatus(self.list)
        })
      }
    },
    data: function () {
      return {
        page: [],
        list: {},
        detailList: [],
        tabFlag: true,
        gridOperate: true,
        gridColumns: {
          document_number: '采购单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          provider_name: '供应商',
          created_at: '制单日期',
          terminated_at: '到货日期',
          total_sum: '采购金额'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          purchase_unit_name: '采购单位',
          unit_specification:"单位规格",
          current_stock: "库存数量",
          demand_amount:"要货数量",
          main_reference_value:"采购数量",
          purchase_unit_price:"采购单价",
          reference_number: "来源要货单号"
        }
      }
    }
  }
</script>
