<template>
  <div class="container-fluid">
    <!--测试-->


    <!-- 表格 -->
    <table class="table table-striped table-border table-hover mt20" :data="gridData">
      <thead>
      <tr class="text-center">
        <td>结算日期</td>
        <td>合计收入额</td>
        <td>会员卡支付额</td>
        <td>现金支付额</td>
        <td>刷卡支付额</td>
        <td>微信支付额</td>
        <td>支付宝支付额</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td>{{gridData.settlement_date}}</td>
        <td>￥{{gridData.total_sum}}</td>
        <td>￥{{gridData.vip_money}}</td>
        <td>￥{{gridData.cash_money}}</td>
        <td>￥{{gridData.post_money}}</td>
        <td>￥{{gridData.weixin_money}}</td>
        <td>￥{{gridData.alipay_money}}</td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <grid :data="detailGridData" :columns="detailGridColumns"></grid>

    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>

  <!--模态框HTML-->
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import {requestUrl, token} from '../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      Grid: Grid
    },
    ready: function () {
//    渲染历史明细结算列表
      this.listData(1)
//      渲染单条
      this.oneListData()
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    methods: {
//      渲染单条
      oneListData: function () {
        var str = window.location.href
        var num = str.indexOf('BillingHistoryDetail') + 21
        var detailId = str.substr(num)

        this.$http({
          url: requestUrl + '/front-system/settlement/history/' + detailId,
          method: 'get',
          headers: { 'X-Overpowered-Token': token }
        }).then(function (response) {
          this.gridData = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//    渲染历史明细结算列表
      listData: function (page) {
        var str = window.location.href
        var num = str.indexOf('BillingHistoryDetail') + 21
        var detailId = str.substr(num)

        this.$http({
          url: requestUrl + '/front-system/settlement/' + detailId,
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
          this.detailGridData = response.data.body.list
          $.each(this.detailGridData, function (index, value) {
            if (value.pay_method == 'cash') {
              this.pay_method = '现金支付'
            }
            if (value.pay_method == 'alipay') {
              this.pay_method = '支付宝支付'
            }
            if (value.pay_method == 'weixin') {
              this.pay_method = '微信支付'
            }
            if (value.pay_method == 'vip') {
              this.pay_method = '会员卡支付'
            }
          })

        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        page: [],
        gridData: {
          settlement_date: '',
          total_sum: '',
          vip_money: '',
          cash_money: '',
          post_money: '',
          weixin_money: '',
          alipay_money: '',
          status: ''
        },
        detailGridData: [],
        detailGridColumns: {
          number: "小票编号",
          created_at: "下单时间",
          total_sum: "合计金额",
          total_amount: "合计数量",
          pay_method: "支付方式",
          member_card_number: "会员卡号",
          coupon_name: "优惠方式",
          creator_name: "营业员"
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

