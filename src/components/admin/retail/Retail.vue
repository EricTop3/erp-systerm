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
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1" :timewidth="timewidth"></date-picker> -
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2" :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click=search()>搜索</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>

        <!-- 表格1 -->
        <table class="table table-striped table-border table-hover" v-if="isflag">
          <thead>
          <tr class="text-center">
            <td>门店</td>
            <td>合计收入额</td>
            <td>现金支付额</td>
            <td>会员卡支付额</td>
            <td>刷卡支付额</td>
            <td>微信支付额</td>
            <td>支付宝支付额</td>
            <td>退货退款</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td>全部</td>
            <td>{{onedata.total_sum}}</td>
            <td>{{onedata.cash_total_sum}}</td>
            <td>{{onedata.vip_total_sum}}</td>
            <td>{{onedata.pos_total_sum}}</td>
            <td>{{onedata.weixin_total_sum}}</td>
            <td>{{onedata.alipay_total_sum}}</td>
            <td>{{onedata.refund_total_sum}}</td>
          </tr>
          </tbody>
        </table>
        <!-- end表格1 -->

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td>门店</td>
            <td>开始日期</td>
            <td>结束日期</td>
            <td>合计收入额</td>
            <td>现金支付额</td>
            <td>会员卡支付额</td>
            <td>刷卡支付额</td>
            <td>微信支付额</td>
            <td>支付宝支付额</td>
            <td>退货退款</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata" :id="[item.store_id ? item.store_id : '']">
            <td>{{item.store_name}}</td>
            <td>{{item.created_at}}</td>
            <td>{{item.terminated_at}}</td>
            <td>{{item.total_sum}}</td>
            <td>{{item.cash_total_sum}}</td>
            <td>{{item.vip_total_sum}}</td>
            <td>{{item.pos_total_sum}}</td>
            <td>{{item.weixin_total_sum}}</td>
            <td>{{item.alipay_total_sum}}</td>
            <td>{{item.refund_total_sum}}</td>
            <td>
              <span class="btn btn-info btn-sm" @click="view($event)">查看</span>
            </td>
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
      this.getOneData()
      this.storeListData()
    },
    methods: {
//      列表数据渲染 /backend-system/settlement/statistics/statistics
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/statistics'
        var data = {
          store_id: this.searchData.store_id || '',
          start_time: this.searchData.start_time || '',
          end_time: this.searchData.end_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//      单条数据渲染
      getOneData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/total'
        var data = {
          start_time: this.searchData.start_time || '',
          end_time: this.searchData.end_time || ''
        }
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body
          self.modifyGetedOneData(self.onedata)
        })
      },
//    对获取到de列表数据进行处理
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
//    对获取到的单条数据进行处理
      modifyGetedOneData: function (value) {
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
      },
//      查看
      view: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/admin/retail/statistics/view/' + this.thisId + '?start_time=' + this.searchData.start_time + '&end_time=' + this.searchData.end_time
      },
//      门店列表数据渲染
      storeListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store'
        getDataFromApi(url, {}, function (response) {
          self.storeData = response.data.body.list
        })
      },
//    搜索
      search: function () {
        if(this.searchData.store_id){
          this.isflag = false
        }else{
          this.isflag = true
        }
        this.getOneData()
        this.getlistData(1)
      },
//      取消搜索
      cancelSearch: function () {
        this.isflag = true
        this.searchData = {}
        this.getOneData()
        this.getlistData(1)
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/settlement/statistics'
        var data =
          'store_id=' + this.searchData.store_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        isflag: true,
        storeData: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridColumns: {
          store_name: "门店",
          created_at: "开始日期",
          terminated_at: "结束日期",
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
        onedata: [],
        page: [],
        searchData: {
          store_id: '',
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
