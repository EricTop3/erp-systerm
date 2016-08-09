<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：结算首页</li>
      <li class="active">结算历史</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline text-center">
        <div class="form-group">
          <label>时间段</label>
          <date-picker :value.sync="startTime" :time-text="timetext1" :timewidth="timewidth"></date-picker>
          -
          <date-picker :value.sync="endTime" :time-text="timetext2" :timewidth="timewidth"></date-picker>
        </div>
        <span type="submit" class="btn btn-info ml10" @click="setMentListData(1)">搜索</span>
        <span type="submit" class="btn btn-warning" @click="cancel">撤销搜索</span>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="historyGridData" :columns="historyGridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-warning btn-sm" @click="checkDetail($event)">结算明细</span>
      </div>
    </grid>

    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {requestUrl, token, error, requestSystemUrl, getDataFromApi} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.setMentListData(currentpage)
      }
    },
    ready: function () {
//    渲染结算历史列表
      this.setMentListData(1)
    },
    methods: {
//    渲染结算历史列表
      setMentListData: function (page) {
        var self = this
        var url = requestSystemUrl + '/front-system/settlement'
        var data = {
          startTime: this.startTime || '',
          endTime: this.endTime || '',
          page: page,
          per_page: 16
        }
        getDataFromApi(url, data, function (response) {
          self.page = response.data.body.pagination
          self.historyGridData = response.data.body.list
        })
      },
      checkDetail: function (event) {
        var id = $(event.currentTarget).parents('tr').attr('id')
        window.location.href = '/#!/site/billing/detail/' + id
      },
//    取消搜索
      cancel: function () {
        this.startTime = ''
        this.endTime = ''
        this.setMentListData(1)
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridOperate: true,
        startTime: '',
        endTime: '',
        page: [],
        historyGridData: [],
        historyGridColumns: {
          document_number: "结算编号",
          settled_at: "结算时间",
          total_sum: "合计收入额",
          cash_total_sum: "现金支付额",
          vip_total_sum: "会员卡支付额",
          pos_total_sum: "刷卡支付额",
          weixin_total_sum: "微信支付额",
          alipay_total_sum: "支付宝支付额"
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

