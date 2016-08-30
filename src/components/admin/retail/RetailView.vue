<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-retail></left-retail>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：零售首页</li>
          <li class="active">结算统计</li>
          <li class="active">查看详情</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1" :timewidth="timewidth"></date-picker> -
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2" :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click=getlistData(1)>搜索</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>

        <!-- 表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" @click="viewDetail($event)">结算明细</span>
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
    putDataToApi,
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
//      列表数据渲染 /backend-system/settlement/statistics/statistics
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/statistics/' + this.thisId
        var data = {
          start_time: this.searchData.start_time || this.$route.query.start_time,
          end_time: this.searchData.end_time || this.$route.query.end_time,
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//    对获取到的数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if(value.total_sum != '' && value.total_sum > 0 ){
            value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
          }
          if(value.vip_total_sum != '' && value.vip_total_sum > 0 ){
            value.vip_total_sum = '￥' + (value.vip_total_sum * 0.01).toFixed(2)
          }
          if(value.cash_total_sum != '' && value.cash_total_sum > 0 ){
            value.cash_total_sum = '￥' + (value.cash_total_sum * 0.01).toFixed(2)
          }
          if(value.pos_total_sum != '' && value.pos_total_sum > 0 ){
            value.pos_total_sum = '￥' + (value.pos_total_sum * 0.01).toFixed(2)
          }
          if(value.weixin_total_sum != '' && value.weixin_total_sum > 0 ){
            value.weixin_total_sum = '￥' + (value.weixin_total_sum * 0.01).toFixed(2)
          }
          if(value.alipay_total_sum != '' && value.alipay_total_sum > 0 ){
            value.alipay_total_sum = '￥' + (value.alipay_total_sum * 0.01).toFixed(2)
          }
          if(value.refund_total_sum != '' && value.refund_total_sum > 0 ){
            value.refund_total_sum = '￥' + (value.refund_total_sum * 0.01).toFixed(2)
          }
        })
      },
//      查看
      viewDetail: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/admin/retail/statistics/view/Detail/' + this.thisId
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
        this.$route.query.start_time = ''
        this.$route.query.end_time = ''
        this.getlistData(1)
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/settlement/statistics'
        var sTime = ''
        var eTime = ''
        if(this.searchData.start_time == ''){
          sTime = this.$route.query.start_time || ''
        }else{
          sTime = this.searchData.start_time|| ''
        }
        if(this.searchData.end_time == ''){
          eTime = this.$route.query.end_time || ''
        }else{
          eTime = this.searchData.end_time|| ''
        }
        var data =
          'start_time=' + sTime + '&' +
          'end_time=' + eTime
        return this.exportUrl = url + '/export-excel?store_id=' + this.$route.params.queryId + '?' + data
      }
    },
    data: function () {
      return {
        storeData: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridColumns: {
          store_name: "门店",
          settled_at: "结算日期",
          total_sum: "合计收入额",
          cash_total_sum: "现金支付额",
          vip_total_sum: "会员卡支付额",
          pos_total_sum: "刷卡支付额",
          weixin_total_sum: "微信支付额",
          alipay_total_sum: "支付宝支付额",
          refund_total_sum: "退货退款"
        },
        thisId: '',
        gridOperate: true,
        listdata: [],
        page: [],
        searchData: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
