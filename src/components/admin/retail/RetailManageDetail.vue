<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <Left-retail></Left-retail>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：零售首页</li>
          <li class="active">结算管理</li>
          <li class="active">结算明细</li>
        </ol>

        <!--表格1详情页面单条数据-->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">结算编号</td>
            <td>结算门店</td>
            <td>状态</td>
            <td>结算日期</td>
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
          <tr class="text-center">
            <td class="text-left">{{onedata.document_number}}</td>
            <td>{{onedata.store_name}}</td>
            <td>{{onedata.status}}</td>
            <td>{{onedata.settled_at}}</td>
            <td>{{onedata.total_sum}}</td>
            <td>{{onedata.cash_total_sum}}</td>
            <td>{{onedata.vip_total_sum}}</td>
            <td>{{onedata.pos_total_sum}}</td>
            <td>{{onedata.weixin_total_sum}}</td>
            <td>{{onedata.alipay_total_sum}}</td>
            <td>{{onedata.refund_total_sum}}</td>
            <td><span v-if="onedata.status=='未结账'" class="btn btn-primary btn-sm" @click="settlement()">结账</span></td>
          </tr>
          </tbody>
        </table>
        <!-- end表格1 -->
        <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr">导出</span></a>
        <!-- 表格2 详情页面列表数据-->
        <grid :data="listdata" :operate="gridOperate2" :columns="gridcolumns2"></grid>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>

      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftRetail from '../common/LeftRetail'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ListFinish from '../../common/ListFinish'
  import ErrorTip from '../../common/ErrorTip'
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
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftRetail: LeftRetail,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip,
      ListFinish: ListFinish
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
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
        var url = requestSystemUrl + '/backend-system/settlement/' + this.thisId
        getDataFromApi(url, {}, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//      获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/' + this.thisId + '/detail'
        getDataFromApi(url, {}, function (response) {
          self.onedata = response.data.body
          self.modifyGetedOneData(self.onedata)
        })
      },
//    列表数据处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.total_sum != '' && value.total_sum > 0) {
            value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
          }
          if (!value.document_number) {
            value.document_number = '会员卡充值'
          }
          switch (value.pay_method) {
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
        })
      },
//    对获取到的单条数据进行处理
      modifyGetedOneData: function (value) {
        if (value.total_sum != '' && value.total_sum > 0) {
          value.total_sum = '￥' + (value.total_sum * 0.01).toFixed(2)
        }
        if (value.vip_total_sum != '' && value.vip_total_sum > 0) {
          value.vip_total_sum = '￥' + (value.vip_total_sum * 0.01).toFixed(2)
        }
        if (value.cash_total_sum != '' && value.cash_total_sum > 0) {
          value.cash_total_sum = '￥' + (value.cash_total_sum * 0.01).toFixed(2)
        }
        if (value.pos_total_sum != '' && value.pos_total_sum > 0) {
          value.pos_total_sum = '￥' + (value.pos_total_sum * 0.01).toFixed(2)
        }
        if (value.weixin_total_sum != '' && value.weixin_total_sum > 0) {
          value.weixin_total_sum = '￥' + (value.weixin_total_sum * 0.01).toFixed(2)
        }
        if (value.alipay_total_sum != '' && value.alipay_total_sum > 0) {
          value.alipay_total_sum = '￥' + (value.alipay_total_sum * 0.01).toFixed(2)
        }
        if (value.refund_total_sum != '' && value.refund_total_sum > 0) {
          value.refund_total_sum = '￥' + (value.refund_total_sum * 0.01).toFixed(2)
        }
        if (value.status == '1') {
          value.status = "未结账"
        }
        if (value.status == '2') {
          value.status = "已结账"
        }
      },
//      结账
      settlement: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/settlement/' + this.thisId + '/terminate'
        putDataToApi(url, {}, function (response) {
          self.getOneData()
        })
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/settlement'
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        thisId: '',
        listdata: [],
        onedata: [],
        page: [],
        thisId: '',
        gridOperate2: false,
        gridcolumns2: {
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
