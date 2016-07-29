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
          <li class="active">查看委外生产单</li>
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
    detailNull,
    changeStatus } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftProduction: LeftProduction,
      SummaryDetail: SummaryDetail
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
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/produce/outsource/'+ id +'/finished',function(response){
          console.log('finished')
        })
      }
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
      listData: function (page) {
        var currentId = this.$route.params.queryId
        var self = this
//        获取商品列表详情
        var url = requestSystemUrl + '/backend-system/produce/outsource/' + currentId
//       获取列表详情
        var purchaseUrl  = requestSystemUrl + '/backend-system/produce/outsource/' + currentId + '/get'
//       获取商品列表详情
        getDataFromApi(url,{},function(response){
          self.detailList = response.data.body.list
          $.each(self.detailList,function(index,val){
            detailNull(val)
            val.delegation_unit= val.unit_specification
            delete val.unit_specification
            val.delegation_total_stock = val.origin_stock_amount
            delete val.origin_stock_amount
            val.delegation_required_amount= val.demand_amount
            delete val.demand_amount
            val.delegation_product_amount= val.main_reference_value
            delete val.main_reference_value
            val.delegation_unit_price= val.unit_price
            delete val.unit_price
            val.delegation_origen_number = val.reference_number
            delete val.reference_number
          })
        })
//        获取列表详情
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
        gridColumns: {
          document_number: '生产单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          outsource_name: '合作工厂',
          created_at: '制单日期',
          operated_at: '生产日期',
          amount: '加工费用'
        },
        gridColumns2: {
          code: "货号",
          name: "品名",
          unit_space: '单位规格',
          total_stock: '总部库存',
          required_amount: "门店要货量",
          product_amount:'生产数量',
          unit_price:"加工单价",
          origen_number:"来源要货单号"
        }
      }
    }
  }
</script>
