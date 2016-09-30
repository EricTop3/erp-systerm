<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/instock/checkList'}"> 盘点单统计</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/instock/checkListDetail'}"> 盘点单明细</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/allocateList'}"> 调拨单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/requisitionList'}"> 要货单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/distributionList'}"> 配送单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/allList'}"> 收发存汇总表</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/remainderList'}"> 存货总账</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/instock/orderSaleList'}"> 零售出库单统计</a></li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in providerList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>货号</label>
              <input type="text" class="form-control" placeholder="请输入货号" v-model="searchData.item_code">
            </div>
            <div class="form-group  ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="请输入商品名称" v-model="searchData.item_name">
            </div>
            <div class="form-group  ml10">
              <label>制单人</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in personList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group  ml10">
              <label>盘点单号</label>
              <input type="text" class="form-control" placeholder="请输入单号" v-model="searchData.document_number">
            </div>
            <div class="form-group ml10">
              <label>状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option value="">请选择</option>
                <option value="2">已完成</option>
                <option value="1">已审核</option>
                <option value="0">未审核</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单日期</label>
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
//      获取仓库列表
      this.getProviderList()
//      获取制单人列表
      this.getPersonList()
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/stock/check-list/details'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          item_code: self.searchData.item_code,
          item_name: self.searchData.item_name,
          warehouse_id: self.searchData.warehouse_id,
          creator_id: self.searchData.creator_id,
          checked: self.searchData.checked,
          document_number: self.searchData.document_number,
          page: page
        }
        getDataFromApi(url,data,function(response){
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        },function(err){})
      },
//      获取仓库列表
      getProviderList: function(){
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
        getDataFromApi(url,data,function(response){
          self.providerList = response.data.body.list
        })
      },
//      获取制单人列表
      getPersonList: function() {
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/store/account'
        getDataFromApi(url, data, function (response) {
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
        self.searchData.item_code = ''
        self.searchData.item_name = ''
        self.searchData.warehouse_id = ''
        self.searchData.creator_id = ''
        self.searchData.checked = ''
        self.searchData.document_number = ''
        this.getListData(1)
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          switch (value.checked) {
            case  1:
              value.checked = '未审核'
              break
            case  2:
              value.checked = '已审核'
              break
            case  3:
              value.checked = '已完成'
              break
          }
        })
      }
    },
    computed: {
//      导出 /backend-system/data-center/purchase/order/details
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/stock/check-list'
        var data =
          'item_name=' + this.searchData.item_name + '&' +
          'item_code=' + this.searchData.item_code + '&' +
          'warehouse_id=' + this.searchData.warehouse_id + '&' +
          'creator_id=' + this.searchData.creator_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time + '&' +
          'checked=' + this.searchData.checked + '&' +
          'document_number=' + this.searchData.document_number
        return this.exportUrl = url + '/export-excel/1?' + data
      }
    },
    data: function () {
      return {
        exportUrl: '',
        page: [],
        listdata: [],
        onedata: [],
        providerList: [],
        personList: [],
        gridColumns: {
          warehouse: '仓库',
          created_at: '制单日期',
          document_number: '盘点单号',
          creator_name: '制单人',
          auditor_name: '审核人',
          checked: '状态',
          item_code: '货号',
          item_name: '品名',
          unit_name: '单位',
          unit_specification: '单位规格',
          system_stock: '系统库存量',
          main_reference_value: '实际库存量',
          difference: '差异库存'
        },
        productOperate: false,
        searchData: {
          start_time: '',
          end_time: '',
          warehouse_id: '',
          creator_id: '',
          item_code: '',
          item_name: '',
          checked: '',
          document_number: ''
        },
        modal: {
          errModal: false,
          errInfo: ''
        }
      }
    }
  }
</script>
