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
          <li class="active">结算明细</li>
        </ol>

        <!-- 表格1 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td>门店</td>
            <td>结算日期</td>
            <td>合计收入额</td>
            <td>现金支付额</td>
            <td>会员卡支付额</td>
            <td>刷卡支付额</td>
            <td>微信支付额</td>
            <td>支付宝支付额</td>
            <td>退款</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td>{{onedata.store_name}}</td>
            <td>{{onedata.terminated_at}}</td>
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

        <a :href="exports" target="_blank" v-if="authority.exports"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
        <!-- 表格2 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <span class="btn btn-warning btn-sm" @click="orderDetail($event)">订单明细</span>
          </div>
        </grid>
        <!-- end表格2 -->
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>
  <!-- begin查看零售单 -->
  <modal :show.sync="viewModal" :modal-size.sync='viewModalSize'>
    <div slot="header">
      <button type="button" class="close" aria-label="Close"><span
        aria-hidden="true" @click="viewModal=false">&times;</span></button>
      <h4 class="modal-title">订单明细</h4>
    </div>
    <div slot="body">
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr>
          <td>品名</td>
          <td>原单价</td>
          <td>零售单价</td>
          <td>销售数量</td>
          <td>退货数量</td>
          <td>小计</td>
          <td>议价备注</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in listDetail">
          <td>{{item.product_name}}</td>
          <td>{{item.original_price}}</td>
          <td>{{item.actual_price}}</td>
          <td>{{item.total_sell}}</td>
          <td>{{item.total_refund}}</td>
          <td>{{item.total_sum}}</td>
          <td>{{ item.note==="" ? '无备注' : item.note }}</td>
        </tr>
        </tbody>
      </table>
      <div class="panel">
        <div class="panel-body">
          <p>优惠备注：{{coupon_note=== null ? '无备注' : coupon_note }}</p>

          <p>订单备注：{{order_note=== null ?  '无备注' : order_note }}</p>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </modal>
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
    systermAuthority,
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
//    权限判断
      if (systermAuthority.indexOf('settlement-total-list-export') > -1) {
        this.authority.exports = true
      }
    },
    methods: {
//      列表数据渲染 /backend-system/settlement/statistics/statistics
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/' + this.thisId + '/statistics'
        var data = {
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
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/' + this.thisId + '/information'
        var data = {}
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body
          self.modifyGetedOneData(self.onedata)
        })
      },
//    对获取到de列表数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if(value.total_sum != '' && value.total_sum > 0 ){
            if(value.pay_method == 'refund'){
              value.total_sum = '￥' + (value.total_sum * (-0.01)).toFixed(2)
            }else{
              value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
            }
          }
          switch(value.pay_method){
            case 'cash':
              value.pay_method = '现金支付'
              break;
            case 'vip':
              value.pay_method = '会员卡支付'
              break;
            case 'weixin':
              value.pay_method = '微信支付'
              break;
            case 'alipay':
              value.pay_method = '支付宝支付'
              break;
            case 'pos':
              value.pay_method = 'POS支付'
              break;
            case 'refund':
              value.pay_method = '退货退款'
              break;
          }
          if(!value.document_number){
            value.document_number = '会员卡充值'
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
        if(value.refund_total_sum != '' && value.refund_total_sum > 0 ){
          value.refund_total_sum = '￥' + (value.refund_total_sum * (-0.01)).toFixed(2)
        }
      },
//      订单明细数据处理
      modifyGetedOrderData: function (data) {
        $.each(data,function (index, value) {
          if(value.total_sum != '' && value.total_sum > 0 ){
            value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
          }
          if(value.actual_price != '' && value.actual_price > 0 ){
            value.actual_price = '￥' + (value.actual_price * 0.01).toFixed(2)
          }
          if(value.original_price != '' && value.original_price > 0 ){
            value.original_price = '￥' + (value.original_price * 0.01).toFixed(2)
          }
        })
      },
//      获取订单详情
      getOrderlistData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/statistics/' + self.thisCode + '/order'
        var data = {}
        getDataFromApi(url, data, function (response) {
          self.listDetail = response.data.body.list
          self.modifyGetedOrderData(self.listDetail)
        })
      },
//      查看订单明细
      orderDetail: function (event) {
        this.thisCode =$.trim($(event.currentTarget).parents('tr').children('td').eq(0).text())
        this.viewModal = true
        this.getOrderlistData()
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/settlement/export-excel/' + this.$route.params.queryId
        return this.exportUrl = url
      }
    },
    data: function () {
      return {
        listDetail: [],
        viewModal: false,
        viewModalSize: 'modal-lg',
        thisId: '',
        thisCode: '',
        gridColumns: {
          document_number: "小票编号",
          created_at: "下单时间",
          total_sum: "合计金额",
          amount: "合计数量",
          pay_method: "支付方式",
          vip_card_number: "会员卡号",
          coupon_strategy_name: "优惠方式",
          seller_name: "营业员"
        },
        gridOperate: true,
        listdata: [],
        onedata: [],
        page: [],
        searchData: {
          store_id: '',
          start_time: '',
          end_time: ''
        },
        authority: {
          exports: false
        }
      }
    }
  }
</script>
