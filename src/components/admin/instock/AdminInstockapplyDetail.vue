<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-instock></left-instock>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">要货汇总</li>
          <li class="active">明细</li>
        </ol>

        <!--详情页面-->
        <summary-detail
          :detail-list="listdata"
          :table-header="gridColumns"
          :table-data="onedata"
          :second-table-header='gridColumnsList'
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
  import AdminNav from '../AdminNav'
  import LeftInstock from '../common/LeftInstock'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ListFinish from '../../common/ListFinish'
  import ErrorTip from '../../common/ErrorTip'
  import SummaryDetail from '../../common/SummaryDetail'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest,
    finishRequest
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip,
      ListFinish: ListFinish,
      SummaryDetail: SummaryDetail
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistdata(currentpage)
      },
//   ‘完成’调用
      finishFromApi: function (id) {
        console.log(id)
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/stock/enquiry/' + id + '/finished', function (response) {
          self.getlistData(1)
        })
      }
    },
    ready: function () {
      this.getlistData(1)
      this.getOneData()
    },
    methods: {
//      (获取详情)列表数据渲染
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/enquiry/' + this.thisId
        var data = {
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/enquiry/' + this.thisId + '/detail'
        getDataFromApi(url, {}, function (response) {
          self.onedata = response.data.body
          exchangeData(self.onedata)
        })
      }
    },
    data: function () {
      return {
        thisId: '',
        gridColumns: {
          order_number: "要货单号",
          checked: "单据状态",
          store_name: "要货门店",
          creator_name: "制单人",
          auditor_name: "审核人",
          created_at: "要货日期",
          operated_at: "送货日期",
          amount: "要货数量",
          distribution_amount: "配送数量"
        },
        gridOperate: false,
        gridColumnsList: {
          goods_code: '货号',
          goods_name: '品名',
          requisition_amount: '要货数量',
          distribution_amount: '配送数量',
          unit_name: '单位',
          unit_specification: '单位规格',
          distribution_code: '配送单号'
        },
        listdata: [],
        onedata: [],
        page: []
      }
    }
  }
</script>

