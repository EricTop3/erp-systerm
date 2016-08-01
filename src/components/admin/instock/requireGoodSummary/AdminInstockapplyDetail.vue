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

        <!--详情页面单条数据-->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">要货单号</td>
            <td>单据状态</td>
            <td>要货门店</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>要货日期</td>
            <td>送货日期</td>
            <td>要货数量</td>
            <td>配送数量</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">{{onedata.order_number}}</td>
            <td>{{onedata.checked}}</td>
            <td>{{onedata.store_name}}</td>
            <td>{{onedata.creator_name}}</td>
            <td>{{onedata.auditor_name}}</td>
            <td>{{onedata.created_at}}</td>
            <td>{{onedata.operated_at}}</td>
            <td>{{onedata.amount}}</td>
            <td>{{onedata.distribution_amount}}</td>
            <td><span v-if="onedata.checked=='已审核'" class="btn btn-primary btn-sm" @click="finish()">完成</span></td>
          </tr>
          <tr><td colspan="10">备注：{{onedata.note}}</td> </tr>
          </tbody>
        </table>

        <!--详情页面列表数据-->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>要货数量</td>
            <td>配送数量</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>配送单号</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata">
            <td class="text-left">{{item.goods_code}}</td>
            <td>{{item.goods_name}}</td>
            <td>{{item.requisition_amount}}</td>
            <td>{{item.distribution_info.amount}}</td>
            <td>{{item.unit_name}}</td>
            <td>{{item.unit_specification}}</td>
            <td>{{item.distribution_info.code}}</td>
          </tr>
          </tbody>
        </table>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../../AdminNav'
  import LeftInstock from '../../common/LeftInstock'
  import Grid from '../../../common/Grid'
  import Modal from '../../../common/Modal'
  import Page from '../../../common/Page'
  import ListFinish from '../../../common/ListFinish'
  import ErrorTip from '../../../common/ErrorTip'
  import SummaryDetail from '../../../common/SummaryDetail'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest,
    putDataToApi,
    finishRequest
  } from '../../../../publicFunction/index'
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
//   '完成'调用
      finishFromApi: function (id) {
        console.log(id)
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/enquiry/' + this.thisId + '/finished'
        putDataToApi(url,{},function (response) {
          self.getOneData()
        })
      },
    },
    ready: function () {
//      获取详情列表数据
      this.getlistData(1)
//      获取详情单条数据
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
        listdata: [],
        onedata: [],
        page: []
      }
    }
  }
</script>

