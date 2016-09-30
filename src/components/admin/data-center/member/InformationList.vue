<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/member/rechargeList'}"> 会员充值统计表</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/member/informationList'}"> 会员基本信息统计表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/member/consumptionList'}"> 会员消费明细表</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>会员卡号</label>
              <input type="text" class="form-control" placeholder="请输入卡号" v-model="searchData.card_number">
            </div>
            <div class="form-group  ml10">
              <label>会员姓名</label>
              <input type="text" class="form-control" placeholder="请输入姓名" v-model="searchData.name">
            </div>
            <div class="form-group ml10">
              <label>门店</label>
              <select class="form-control" v-model="searchData.store_id">
                <option value="">请选择</option>
                <option :value="item.code" v-for="item in providerList">{{item.display_name}}</option>
              </select>
            </div>
            <span class="btn btn-primary " @click="searchMethod(1)">搜索</span>
            <span class="btn btn-warning" @click="searchCancel()">撤销搜索</span>

            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>

        <!-- 列表渲染表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="productOperate"></grid>

        <!--翻页-->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page'
              v-if="listdata.length>0"></page>

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
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest
  } from '../../../../publicFunction/index'
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
      getListData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/member/information-list'
        var data = {
          store_id: self.searchData.store_id,
          card_number: self.searchData.card_number,
          name: self.searchData.name,
          page: page
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        }, function (err) {
        })
      },
//      搜索
      searchMethod: function (page) {
        this.getListData(page)
      },
//      撤销搜索
      searchCancel: function () {
        var self = this
        self.searchData.store_id = ''
        self.searchData.card_number = ''
        self.searchData.name = ''
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
          if (value.balance != '') {
            value.balance = '￥' + (value.balance * (0.01)).toFixed(2)
          }
          if (value.total_price != '') {
            value.total_price = '￥' + (value.total_price * (0.01)).toFixed(2)
          }
          if (value.consume_price != '') {
            value.consume_price = '￥' + (value.consume_price * (0.01)).toFixed(2)
          }
          if (value.status == 1) {
            value.status = '启用'
          } else {
            value.status = '禁用'
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/member/information-list'
        var data =
          'store_id=' + this.searchData.store_id + '&' +
          'name=' + this.searchData.name + '&' +
          'card_number=' + this.searchData.card_number
        return this.exportUrl = url + '/export-excel?' + data
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
          card_number: '会员卡号',
          member_type: '会员类型',
          name: '会员姓名',
          status: '会员状态',
          register_store_name: '开卡门店',
          mobile_phone: '联系电话',
          last_consume_time: '最近一次消费',
          score: '累计积分',
          consume_price: '累计消费金额',
          balance: '会员卡余额',
          total_price: '累计充值金额',
          total_count: '充值次数'
        },
        productOperate: false,
        searchData: {
          store_id: '',
          card_number: '',
          name: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
