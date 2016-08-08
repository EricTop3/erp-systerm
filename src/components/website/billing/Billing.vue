<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!--测试-->
    <!-- 表格 -->
    <table class="table table-striped table-border table-hover mt20" :data="todayGridData">
      <thead>
      <tr class="text-center">
        <td>结算日期</td>
        <td>合计收入额</td>
        <td>会员卡支付额</td>
        <td>现金支付额</td>
        <td>刷卡支付额</td>
        <td>微信支付额</td>
        <td>支付宝支付额</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td>{{todayGridData.date}}</td>
        <td>￥{{todayGridData.total_sum}}</td>
        <td>￥{{todayGridData.vip_money}}</td>
        <td>￥{{todayGridData.cash_money}}</td>
        <td>￥{{todayGridData.post_money}}</td>
        <td>￥{{todayGridData.weixin_money}}</td>
        <td>￥{{todayGridData.alipay_money}}</td>
        <td>
          <button id="todaySet" class="btn btn-primary btn-sm" :disabled="todayGridData.status" @click="settlementModal=true">今日结算</button>
          <span class="btn btn-info btn-sm" @click="detail($event)">结算历史</span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <grid :data="todayDetailGridData" :columns="todayDetailGridColumns"></grid>

    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>

  <!--模态框-今日结算-->
  <modal :show.sync="settlementModal" :modal-size="settlementModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="settlementModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">提示</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">确定结算？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" @click="yesSettlement($event)" data-dismiss="modal">确定</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal" @click="settlementModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->
</template>
<script>
  import $ from 'jquery'
  import Modal from '../../common/Modal'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import SiteNav from '../SiteNav'
  import {requestUrl, token, error} from '../../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      Grid: Grid,
      SiteNav: SiteNav
    },
    ready: function () {
//    渲染当日结算列表
      this.todayListData(1)
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.todayListData(currentpage)
      }
    },
    methods: {
//    渲染当日结算列表
      todayListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/settlement',
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
          this.todayGridData = response.data.body.item
          this.todayDetailGridData = response.data.body.list
          $.each(this.todayDetailGridData, function (index, value) {
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
          error(err)
        })
      },
//    确定结算
      yesSettlement: function (event) {
        this.$http.post(requestUrl + '/front-system/settlement/create', {
          headers: {'X-Overpowered-Token': token}
        }, function (response) {
          $('#todaySet').hide()
          this.settlementModal = false
          this.todayGridData.status = true
        }, function (error) {
          error(error)
        })
      },
      detail: function (event) {
        window.location.href = '#!/site/billing/BillingHistory'
      }
    },
    data: function () {
      return {
        page: [],
        settlementModal: false,
        settlementModalSize: 'modal-sm',
        todayGridData: {
          date: '',
          total_sum: '',
          vip_money: '',
          cash_money: '',
          post_money: '',
          weixin_money: '',
          alipay_money: '',
          status: ''
        },
        todayDetailGridData: [],
        todayDetailGridColumns: {
          document_number: '小票编号',
          create_at: '下单时间',
          total_sum: '合计金额',
          amount: '合计数量',
          pay_method: '支付方式',
          vip_card_number: '会员卡号',
          coupon_strategy_name: '优惠方式',
          document_number: '营业员'
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
