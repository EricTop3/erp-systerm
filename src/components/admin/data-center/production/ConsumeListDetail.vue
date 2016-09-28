<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-datacenter></left-datacenter>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb breadcrumbs">
          <li><a v-link="{ path: '/admin/dataCenter/production/putInList'}"> 产成品入库单统计</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/production/consumeList'}"> 材料出库统计</a></li>
          <li class="active"><a v-link="{ path: '/admin/dataCenter/production/consumeListDetail'}"> 材料出库明细</a></li>
          <li><a v-link="{ path: '/admin/dataCenter/production/defectiveList'}"> 生产入库单次品统计</a></li>
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
              <label>分类</label>
              <select class="form-control" v-model="searchData.category_id">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in categoryList">{{item.display_name}}</option>
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
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入单号" v-model="searchData.document_number">
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
  import LeftDatacenter from '../../common/LeftDatacenter'
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
      this.getCategoryList()
    },
    methods: {
//      获取数据列表
      getListData: function(page){
        var self = this
        var url = requestSystemUrl + '/backend-system/data-center/produce/consume-list/details'
        var data = {
          start_time: self.searchData.start_time,
          end_time: self.searchData.end_time,
          item_code: self.searchData.item_code,
          item_name: self.searchData.item_name,
          store_id: self.searchData.store_id,
          category_id: self.searchData.category_id,
          document_number: self.searchData.document_number,
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
        var url = requestSystemUrl + '/backend-system/store/store'
        getDataFromApi(url,data,function(response){
          self.providerList = response.data.body.list
        })
      },
//      获取商品分类列表
      getCategoryList: function(){
        var self = this
        var data = {}
        var url = requestSystemUrl + '/backend-system/product/category'
        getDataFromApi(url,data,function(response){
          self.categoryList = response.data.body.list
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
        self.searchData.store_id = ''
        self.searchData.category_id = ''
        self.searchData.document_number = ''
        this.getListData(1)
      },
//    对获取到的数据进行处理1
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.unit_price != '') {
            value.unit_price = '￥' + (value.unit_price * (0.01)).toFixed(2)
          }
          if (value.price != '') {
            value.price = '￥' + (value.price * (0.01)).toFixed(2)
          }
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
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/data-center/produce/consume-list'
        var data =
          'item_name=' + this.searchData.item_name + '&' +
          'item_code=' + this.searchData.item_code + '&' +
          'store_id=' + this.searchData.store_id + '&' +
          'category_id=' + this.searchData.category_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time + '&' +
          'document_number=' + this.searchData.document_number
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
          created_at: '出库时间',
          document_number: '单号',
          store_name: '仓库',
          category_name: '分类',
          item_code: '货号',
          item_name: '品名',
          unit_name: '单位',
          unit_specification: '单位规格',
          amount: '生产出库量',
          unit_price: '单价',
          price: '金额',
          creator_name: '操作人'
        },
        productOperate: false,
        searchData: {
          start_time: '',
          end_time: '',
          store_id: '',
          category_id: '',
          item_code: '',
          item_name: '',
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
