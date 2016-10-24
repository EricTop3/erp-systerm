<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">销售出库</li>
          <li class="active">列表</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>门店</label>
              <select class="form-control" v-model="searchData.store_id">
                <option value="">请选择</option>
                <option v-for="item in storeData" track-by="$index" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control" v-model="searchData.category_id">
                <option value="">请选择</option>
                <option v-for="item in categoryData" track-by="$index" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <input type="text" class="form-control" placeholder="请输入商品名或货号" v-model="searchData.name">
            </div>
            <div class="form-group ml10">
              <label>销售时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click=getlistData()>搜索</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>
        <!--表格-->
        <summary
          :table-header="gridColumns"
          :table-data="listdata"
          :page="page"
          :has-look-authority = "authority.look"
        >
        </summary>
      </div>
    </div>
  </div>
</template>
<style>
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
    error,
    systermAuthority
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
      //    查看详情
      gotoDetail: function (id) {
        window.location.href = '/#!/admin/instock/sale/Detail/' + id + '?start_time=' + this.searchData.start_time +'&end_time=' + this.searchData.end_time
      }
    },
    ready: function () {
      this.getlistData(1)
      this.categoryListData()
      this.storeListData()
//    权限判断
      if(systermAuthority.indexOf('sale-out-list-index') > -1) {
        this.authority.look = true
      }
      if(systermAuthority.indexOf('sale-out-list-export') > -1) {
        this.authority.export = true
      }
    },
    methods: {
//      列表数据渲染 /backend-system/stock/sale/log
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/sale/log'
        var data = {
          name: this.searchData.name || '',
          category_id: this.searchData.category_id || '',
          store_id: this.searchData.store_id || '',
          start_time: this.searchData.start_time || '',
          end_time: this.searchData.end_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      分类列表数据渲染
      categoryListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/product/get/category'
        getDataFromApi(url, {}, function (response) {
          self.categoryData = response.data.body.list
        })
      },
//      门店列表数据渲染
      storeListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/get/store'
        getDataFromApi(url, {}, function (response) {
          self.storeData = response.data.body.list
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData.name = ''
        this.searchData.category_id = ''
        this.searchData.store_id = ''
        this.searchData.start_time = ''
        this.searchData.end_time = ''
        this.getlistData(1)
      }
    },
    computed: {
//      导出/backend-system/stock/sale/log
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/sale'
        var data =
          'name=' + this.searchData.name + '&' +
          'category_id=' + this.searchData.category_id + '&' +
          'store_id=' + this.searchData.store_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        categoryData: [],
        storeData: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        gridColumns: {
          store_name: "门店",
          goods_code: "货号",
          goods_name: "品名",
          amount: "零售出库量",
          unit_name: "零售单位",
          unit_specification: "单位规格",
          category_name: "商品分类"
        },
        authority: {
          export: false,
          look: false
        },
        gridOperate: true,
        listdata: [],
        page: [],
        searchData: {
          name: '',
          category_id: '',
          store_id: '',
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
