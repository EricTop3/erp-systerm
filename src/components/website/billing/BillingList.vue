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
        <span class="btn btn-info ml10" @click="setMentListData(1)">搜索</span>
        <span class="btn btn-warning" @click="cancel">撤销搜索</span>
      </form>
    </div>

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover mt20" :data="onedata">
      <tbody>
      <tr class="text-center">
        <td>合计收入额：{{onedata.total_sum}}</td>
        <td>会员卡支付额：{{onedata.vip_total_sum}}</td>
        <td>现金支付额：{{onedata.cash_total_sum}}</td>
        <td>刷卡支付额：{{onedata.pos_total_sum}}</td>
        <td>微信支付额：{{onedata.weixin_total_sum}}</td>
        <td>支付宝支付额：{{onedata.alipay_total_sum}}</td>
        <td>退款金额：{{onedata.refund_total_sum}}</td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">结算编号</td>
        <td>结算日期</td>
        <td>合计收入额</td>
        <td>现金支付额</td>
        <td>会员卡支付额</td>
        <td>刷卡支付额</td>
        <td>微信支付额</td>
        <td>支付宝支付额</td>
        <td>退款金额</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in historyGridData" :id="item.id">
        <td class="text-left">{{item.document_number}}</td>
        <td>{{item.settled_at}}</td>
        <td>{{item.total_sum}}</td>
        <td>{{item.cash_total_sum}}</td>
        <td>{{item.vip_total_sum}}</td>
        <td>{{item.pos_total_sum}}</td>
        <td>{{item.weixin_total_sum}}</td>
        <td>{{item.alipay_total_sum}}</td>
        <td>{{item.refund_total_sum}}</td>
        <td>
          <span class="btn btn-danger btn-sm" v-if="item.status=='0'" @click="settlement($event)">结算</span>
          <span class="btn btn-info btn-sm" @click="checkDetail($event)">结算明细</span>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page' v-if="historyGridData.length > 0"></page>
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
      <button type="button" class="btn btn-info" @click="confirmSettlement()">确定</button>
      <button type="button" class="btn btn-primary" @click="settlementModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import {requestUrl, token, error, requestSystemUrl, getDataFromApi, putDataToApi} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Modal: Modal,
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
          self.modifyGetedData(self.historyGridData)
          self.onedata = response.data.body.total
          self.modifyGetedOneData(self.onedata)
        })
      },
      checkDetail: function (event) {
        var id = $(event.currentTarget).parents('tr').attr('id')
        window.location.href = '/#!/site/billing/detail/' + id
      },
//      对获取的列表数据处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
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
            value.refund_total_sum = '￥' + (value.refund_total_sum * (-0.01)).toFixed(2)
          }
        })
      },
//      对获取的单条数据处理2
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
          value.refund_total_sum = '￥' + (value.refund_total_sum * (-0.01)).toFixed(2)
        }
      },
//      结算
      settlement: function (event) {
        this.settlementModal = true
        this.thisId = $(event.currentTarget).parents('tr').attr('id')
      },
//      确定结算
      confirmSettlement: function () {
        var self = this
        var url = requestSystemUrl + '/front-system/settlement/' + this.thisId + '/settle'
        putDataToApi(url, {}, function (response) {
          self.settlementModal = false
          self.setMentListData(1)
        })
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
        onedata: [],
        thisId: '',
        settlementModal: false,
        settlementModalSize: 'modal-sm',
        flag: true,
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        startTime: '',
        endTime: '',
        page: [],
        historyGridData: []
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

