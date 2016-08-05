<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2"  role="navigation">
        <Left-retail></Left-retail>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：零售首页</li>
          <li class="active">结算管理</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>门店</label>
              <select class="form-control"  v-model="searchData.store_id">
                <option value="">请选择</option>
                <option v-for="item in storeData" track-by="$index" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>状态</label>
              <select class="form-control" v-model="searchData.status">
                <option value="">请选择</option>
                <option value="1">未结账</option>
                <option value="2">已结账</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1" :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2" :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click=getlistData(1)>搜索</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
          </form>
        </div>

        <!-- 表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" @click="settlement($event)">结账</span>
            <span class="btn btn-default btn-sm" @click="view($event)">查看</span>
          </div>
        </grid>


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
  import AdminNav from '../AdminNav'
  import LeftRetail from '../common/LeftRetail'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ListFinish from '../../common/ListFinish'
  import DatePicker from '../../common/DatePicker'
  import ErrorTip from '../../common/ErrorTip'
  import Summary from '../../common/Summary'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest,
    finishRequest,
    error
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftRetail: LeftRetail,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip,
      ListFinish: ListFinish,
      DatePicker: DatePicker,
      Summary: Summary
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
      this.getlistData(1)
      this.storeListData()
    },
    methods: {
//      列表数据渲染 /backend-system/stock/sale/log
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement'
        var data = {
          store_id: this.searchData.store_id || '',
          status: this.searchData.status || '',
          start_time: this.searchData.start_time || '',
          end_time: this.searchData.end_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      结账
      settlement: function (evnet) {
//        var self = this
//        var url = requestSystemUrl + ''
//        putDataToApi(url,{}, function (response) {
//          self.getlistData(1)
//        })
      },
//      查看
      view: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/admin/retail/manage/Detail/' + this.thisId
      },
//      门店列表数据渲染
      storeListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store'
        getDataFromApi(url, {}, function (response) {
          self.storeData = response.data.body.list
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      }
    },
    data: function () {
      return {
        storeData: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridColumns: {
          document_number: "结算编号",
          store_name: "结算门店",
          status: "状态",
          settled_at: "结算日期",
          total_sum: "合计收入额",
          cash_total_sum: "现金支付额",
          vip_total_sum: "会员卡支付额",
          pos_total_sum: "刷卡支付额",
          weixin_total_sum: "微信支付额",
          alipay_total_sum: "支付宝支付额"
        },
        thisId: '',
        gridOperate: true,
        listdata: [],
        page: [],
        searchData: {
          store_id: '',
          status: '',
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
