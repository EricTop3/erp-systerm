<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-instock></left-instock>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">要货汇总</li>
          <li class="active">列表</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入单号" style="width: 140px;"
                     v-model="searchData.order_number">
            </div>
            <div class="form-group ml10">
              <label>单据状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option value="">请选择</option>
                <option value="2">已审核</option>
                <option value="3">已完成</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option value="">请选择</option>
                <option v-for="item in userNameListdata" track-by="$index" :value="item.id">{{item.name}}
                </option>
              </select>
            </div>
            <br>
            <div class="form-group ml10">
              <label>要货时间段</label>
              <date-picker :value.sync="searchData.requisition_start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.requisition_end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <div class="form-group ml10">
              <label>送货时间段</label>
              <date-picker :value.sync="searchData.distribution_start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.distribution_end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <div class="form-group ml10">
              <label>要货门店</label>
              <select class="form-control" v-model="searchData.store_id">
                <option value="">请选择</option>
                <option v-for="item in userAccountListdata" track-by="$index" :value="item.id">{{item.display_name}}
                </option>
              </select>
            </div>
            <span type="submit" class="btn btn-primary" @click="getlistData(1)">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
          </form>
        </div>

        <!--表格详情-->
        <summary
          :table-header="gridColumns"
          :table-data="listdata"
          :page="page"
          :check-url='checkUrl'
          :finish-url="checkUrl"
          :finish-flag="true">
        </summary>

      </div>
    </div>
  </div>
</template>
<style>
  .timewidth {
    width: 125px !important;
  }
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../../AdminNav'
  import LeftInstock from '../../common/LeftInstock'
  import Grid from '../../../common/Grid'
  import Modal from '../../../common/Modal'
  import Page from '../../../common/Page'
  import ListFinish from '../../../common/ListFinish'
  import DatePicker from '../../../common/DatePicker'
  import ErrorTip from '../../../common/ErrorTip'
  import Summary from '../../../common/Summary'
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
    error
  } from '../../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock,
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
      },
      finishToApi: function () {
        this.getlistData(1)
      },
      //    查看详情
      gotoDetail: function (id) {
        window.location.href = '/#!/admin/instock/apply/applyDetail/' + id
      }
    },
    ready: function () {
      this.getlistData(1)
      this.userNamelistData()
      this.userAccountlistData()
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/enquiry'
        var data = {
          checked: this.searchData.checked || '',
          order_number: this.searchData.order_number || '',
          store_id: this.searchData.store_id || '',
          creator_id: this.searchData.creator_id || '',
          requisition_start_time: this.searchData.requisition_start_time || '',
          requisition_end_time: this.searchData.requisition_end_time || '',
          distribution_start_time: this.searchData.distribution_start_time || '',
          distribution_end_time: this.searchData.distribution_end_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//      制单人（门店店员）列表数据渲染
      userNamelistData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store-account'
        getDataFromApi(url, {}, function (response) {
          self.userNameListdata = response.data.body.list
        })
      },
//      要货门店（门店账号）列表数据渲染
      userAccountlistData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store'
        getDataFromApi(url, {}, function (response) {
          self.userAccountListdata = response.data.body.list
        })
      },
//      对获取到的数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, val) {
          switch (val.checked) {
            case  1:
              val.checked = '未审核'
              break
            case  2:
              val.checked = '已审核'
              break
            case  3:
              val.checked = '已完成'
              break
          }
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      }
    },
    data: function () {
      return {
        checkUrl: requestSystemUrl + '/backend-system/stock/enquiry/',
        userAccountListdata: [],
        userNameListdata: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridColumns: {
          order_number: "要货单号",
          checked: "状态",
          store_name: "要货门店",
          creator_name: "制单人",
          auditor_name: "审核人",
          created_at: "制单日期",
          operated_at: "送货日期",
          amount: "要货数量",
          distribution_amount: "配送数量"
        },
        gridOperate: true,
        listdata: [],
        page: [],
        searchData: {
          checked: 0,
          order_number: '',
          store_id: '',
          creator_id: '',
          requisition_start_time: '',
          requisition_end_time: '',
          distribution_start_time: '',
          distribution_end_time: ''
        }
      }
    }
  }
</script>
