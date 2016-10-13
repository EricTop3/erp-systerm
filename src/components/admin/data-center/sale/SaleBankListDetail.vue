<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/sale/orderList'}"> 零售数据中心</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/sale/settlementList'}"> 零售单统计表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/sale/rankingList'}"> 零售排行榜</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/sale/bankList'}"> 收银账号统计表</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/sale/bankListDetail'}"> 收银账号明细表</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>门店</label>
              <select class="form-control" v-model="searchData.store_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in providerList">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>营业员</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in personList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" time-text=开始时间></date-picker> -
              <date-picker :value.sync="searchData.end_time"  time-text=结束时间></date-picker>
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
//      获取门店列表
      this.getProviderList()
//      获取营业员列表
      this.getPersonList()
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/order/bank-list/details'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          store_id: self.searchData.store_id,
          creator_id: self.searchData.creator_id,
          page: page
        }
        getDataFromApi(url,data,function(response){
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        },function(err){})
      },
//      获取门店列表
      getProviderList: function(){
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/store/get/store'
        getDataFromApi(url,data,function(response){
          self.providerList = response.data.body.list
        })
      },
//      获取营业员列表
      getPersonList: function(){
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/store/get/account'
        getDataFromApi(url,data,function(response){
          self.personList = response.data.body.list
        })
      },
//      搜索
      searchMethod: function(page){
        this.getListData(page)
      },
//      撤销搜索
      searchCancel: function(){
        var self = this
        self.searchData.start_time = ''
        self.searchData.end_time = ''
        self.searchData.store_id = ''
        self.searchData.creator_id = ''
        this.getListData(1)
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value){
          value.charge_price =  "￥" + (Number(value.charge_price) * 0.01).toFixed(2)
          if (value.alipay_total_sum != '') {
            value.alipay_total_sum = '￥' + (value.alipay_total_sum * (0.01)).toFixed(2)
          }
          if (value.cash_total_sum != '') {
            value.cash_total_sum = '￥' + (value.cash_total_sum * (0.01)).toFixed(2)
          }
          if (value.price != '') {
            value.price = '￥' + (value.price * (0.01)).toFixed(2)
          }
          if (value.vip_total_sum != '') {
            value.vip_total_sum = '￥' + (value.vip_total_sum * (0.01)).toFixed(2)
          }
          if (value.weixin_total_sum != '') {
            value.weixin_total_sum = '￥' + (value.weixin_total_sum * (0.01)).toFixed(2)
          }
          if (value.pos_total_sum != '') {
            value.pos_total_sum = '￥' + (value.pos_total_sum * (0.01)).toFixed(2)
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order/details
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/order/bank-list'
        var data =
          'store_id=' + this.searchData.store_id + '&' +
          'creator_id=' + this.searchData.creator_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
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
        categoryList: [],
        personList: [],
        gridColumns: {
          store_name: '门店',
          seller_name: '营业员',
          vip_total_sum: '会员储值卡',
          charge_price: '门店挂账',
          weixin_total_sum: '微信支付',
          cash_total_sum: '现金',
          alipay_total_sum: '支付宝支付',
          pos_total_sum: 'pos刷卡',
          price: '合计收银额'
        },
        productOperate: false,
        searchData: {
          start_time: '',
          end_time: '',
          store_id: '',
          creator_id: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
