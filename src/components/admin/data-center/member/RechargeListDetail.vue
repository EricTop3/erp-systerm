<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/member/rechargeList'}"> 会员充值统计表</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/member/rechargeListDetail'}"> 会员充值明细</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/member/informationList'}"> 会员基本信息统计表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/member/consumptionList'}"> 会员消费明细表</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>会员卡号</label>
              <input type="text" class="form-control" placeholder="请输入卡号" v-model="searchData.vip_card_number">
            </div>
            <div class="form-group  ml10">
              <label>会员姓名</label>
              <input type="text" class="form-control" placeholder="请输入姓名" v-model="searchData.name">
            </div>
            <div class="form-group ml10">
              <label>充值日期</label>
              <date-picker :value.sync="searchData.startTime" time-text=开始时间></date-picker> -
              <date-picker :value.sync="searchData.endTime"  time-text=结束时间></date-picker>
            </div>
            <span class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="searchCancel()">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>

        <!-- 列表渲染表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="productOperate"></grid>

        <!--翻页-->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page' v-if="listdata.length>0"></page>

      </div>
    </div>
  </div>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<style>

</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import ErrorTip from '../../../common/ErrorTip'
  import LeftDatacenter from '../../common/LeftDataCenters'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      ErrorTip: ErrorTip,
      LeftDatacenter: LeftDatacenter
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getListData(currentpage)
      }
    },
    ready: function () {
//      获取列表数据
      this.getListData(1)
//      获取门店数据
      this.getProviderList()
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/member/recharge-list/details'
        var data = {
          store_id: self.searchData.store_id,
          vip_card_number: self.searchData.vip_card_number,
          start_time: self.searchData.startTime,
          end_time: self.searchData.end_time,
          name: self.searchData.name,
          page: page
        }
        getDataFromApi(url,data,function(response){
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        },function(err){})
      },
//      搜索
      searchMethod: function(page){
        this.getListData(page)
      },
//      撤销搜索
      searchCancel: function(){
        var self = this
        self.searchData.vip_card_number = ''
        self.searchData.store_id = ''
        self.searchData.name = ''
        self.searchData.startTime = ''
        self.searchData.endTime = ''
        this.getListData(1)
      },
//      获取门店列表（/backend-system/store/get/store）,仓库列表（/backend-system/warehouse-minimal-list）
      getProviderList: function () {
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/store/get/store'
        getDataFromApi(url, data, function (response) {
          self.providerList = response.data.body.list
        })
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          switch(value.pay_method){
            case 'cash':
              value.pay_method ="现金"
              return
            case 'weixin':
              value.pay_method ="微信"
              return
            case 'alipay':
              value.pay_method ="支付宝"
              return
            case 'vip':
              value.pay_method ="会员卡余额"
              return
            case 'pos':
              value.pay_method ="pos刷卡"
              return
          }
          if (value.total_sum != '') {
            value.total_sum = '￥' + (value.total_sum * (0.01)).toFixed(2)
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/member/recharge-list'
        var data =
          'name=' + this.searchData.name + '&' +
          'vip_card_number=' + this.searchData.vip_card_number + '&' +
          'store_id=' + this.searchData.store_id
        return this.exportUrl = url + '/export-excel/all?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        listdata: [],
        onedata: [],
        providerList: [],
        gridColumns: {
          store_name: '门店',
          vip_card_number: '会员卡号',
          name: '会员姓名',
          type: '会员类型',
          created_at: '充值日期',
          document_number: '充值单号',
          total_sum: '充值金额',
          pay_method: '支付方式',
          seller_name: '记账人'
        },
        productOperate: false,
        searchData: {
          vip_card_number: '',
          name: '',
          startTime: '',
          endTime: '',
          store_id: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
