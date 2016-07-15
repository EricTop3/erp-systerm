<template>
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
          <date-picker  :value.sync="startTime"></date-picker> -
          <date-picker  :value.sync="endTime"></date-picker>
        </div>
        <span type="submit" class="btn btn-info ml10" @click="search">搜索</span>
        <span type="submit" class="btn btn-warning" @click="cancel">撤销搜索</span>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="historyGridData" :columns="historyGridColumns" :filter-key="searchQuery" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-warning btn-sm">结算明细</span>
      </div>
    </grid>

    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import DatePicker from '../common/DatePicker'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      DatePicker: DatePicker
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
        this.$http({
          url: requestUrl + '/front-system/settlement/list',
          method: 'get',
          headers: {
            'X-Overpowered-Token': token
          },
          data: {
            page: page,
            per_page: 16
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.historyGridData = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        searchQuery: '',
        gridOperate: true,
        startTime: '',
        endTime: '',
        page: [],
        historyGridData: [],
        historyGridColumns: {
          settlement_code: "结算编号",
          settlement_date: "结算时间",
          total_sum: "合计收入额",
          cash_money: "现金支付额",
          vip_money: "会员卡支付额",
          post_money: "刷卡支付额",
          weixin_money: "微信支付额",
          alipay_money: "支付宝支付额"
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

