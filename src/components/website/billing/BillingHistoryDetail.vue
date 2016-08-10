<template>
  <site-nav></site-nav>
  <div class="container-fluid">

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover mt20" :data="onedata">
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
        <td>{{onedata.settled_at}}</td>
        <td>{{onedata.total_sum}}</td>
        <td>{{onedata.vip_total_sum}}</td>
        <td>{{onedata.cash_total_sum}}</td>
        <td>{{onedata.pos_total_sum}}</td>
        <td>{{onedata.weixin_total_sum}}</td>
        <td>{{onedata.alipay_total_sum}}</td>
        <td>
          <span v-if="onedata.settled_at==''" id="todaySet" class="btn btn-primary btn-sm" @click="settlementModal=true">结算</span>
          <span class="btn btn-info btn-sm" v-link="{path: '/site/billing/list' }">结算历史</span>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 表格 -->
    <grid :data="todayDetailGridData" :columns="todayDetailGridColumns"></grid>
    <!--分页-->
    <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
          :last-page="page.last_page" v-if="todayDetailGridData.length > 0">
    </page>
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
  import {requestUrl, token, error, requestSystemUrl, getDataFromApi, postSiteDataToApi, putDataToApi} from '../../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      Grid: Grid,
      SiteNav: SiteNav
    },
    ready: function () {
      this.getOneData()
      this.todayListData(1)
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.todayListData(currentpage)
      }
    },
    methods: {
//    确定结算
      yesSettlement: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/front-system/settlement/' + this.thisId + '/settle'
        putDataToApi(url, {}, function (response) {
          self.settlementModal = false
          self.todayGridData.status = true
          self.todayListData(1)
        })
      },
//    获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/front-system/settlement/' + this.thisId + '/detail'
        getDataFromApi(url, {}, function (response) {
          self.onedata = response.data.body
          self.modifyGetedOneData(self.onedata)
        })
      },
//    渲染当日结算列表
      todayListData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/front-system/settlement/' + this.thisId
        var data = {
            page: page
          }
        getDataFromApi(url, data, function (response) {
          self.todayDetailGridData = response.data.body.list
          self.modifyGetedData(self.todayDetailGridData)
          self.page = response.data.body.pagination
          self.thisId = self.$route.params.queryId
        })
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
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
          if(value.total_sum != '' && value.total_sum > 0 ){
            value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
          }
        })
      },
//      对获取的单条数据处理2
      modifyGetedOneData: function (data){
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
        })
      },
//    确定结算
      yesSettlement: function () {
        var self = this
        var url = requestSystemUrl + '/front-system/settlement/' + this.thisId + '/settle'
        putDataToApi(url, {}, function (response) {
          self.settlementModal = false
          self.todayGridData.status = true
          self.todayListData()
        })
      }
    },
    data: function () {
      return {
        thisId: '',
        onedata: [],
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
          created_at: '下单时间',
          total_sum: '合计金额',
          amount: '合计数量',
          pay_method: '支付方式',
          vip_card_number: '会员卡号',
          coupon_strategy_name: '优惠方式',
          seller_name: '营业员'
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
