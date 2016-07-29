<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存</li>
          <li class="active">配送出库</li>
          <li class="active">查看库存</li>
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
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftProduction from '../../common/LeftProduction'
  import SummaryDetail from '../../../common/SummaryDetail'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,detailNull,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftProduction:LeftProduction,
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
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//      删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl+ '/backend-system/produce/factory/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl+ '/backend-system/produce/factory/'+ id +'/checked',function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/produce/factory/'+ id +'/finished',function(response){
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
        var url = requestSystemUrl + '/backend-system/produce/factory/' + currentId
//       获取单个列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/produce/factory/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
          console.log(null == null)
          $.each(self.detailList,function(indec,val){
            detailNull(val)
            val.factory_required_amount= val.demand_amount
            val.factory_product_amount= val.main_reference_value
            delete val.main_reference_value
            val.factory_unit= val.unit_specification
            delete val.unit_specification
            val.factory_total_stock = val.origin_stock_amount
            val.factory_origen_number = val.reference_number
            delete val.reference_number
          })
        })
//        获取采购列表详情
        getDataFromApi(purchaseUrl,{},function(response){
          self.list = response.data.body
          exchangeData(self.list)
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
          document_number: '生产单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          operated_at: '制单日期',
          operated_at: '生产日期',
          amount: '生产数量'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          unit_space: '单位规格',
          total_stock: '总部库存',
          required_amount: '门店要货量',
          product_amount: '生产数量',
          origen_number: '来源要货单号',

        }
      }
    }
  }
</script>
