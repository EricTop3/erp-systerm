<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">差异汇总</li>
          <li class="active">列表</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option value="">请选择</option>
                <option v-for="item in warehouseData" track-by="$index" :value="item.id">{{item.name}}</option>
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
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary"  @click=getlistData()>查询</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销查询</span>
            <a :href="exports" target="_blank" v-if="authority.export"><span class="btn btn-info spanblocks fr mr10" >导出</span></a>
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
        window.location.href = '/#!/admin/instock/difference/Detail/' + id
      }
    },
    ready: function () {
      this.getlistData(1)
      this.categoryListData()
      this.warehouseListData()
//     权限判断
      if(systermAuthority.indexOf('stock-difference-list-index')> -1) {
        this.authority.look = true
      }
      if(systermAuthority.indexOf('stock-difference-list-export')> -1) {
        this.authority.export = true
      }
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/difference'
        var data = {
          name: this.searchData.name || '',
          category_id: this.searchData.category_id || '',
          warehouse_id: this.searchData.warehouse_id || '',
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
//      仓库列表数据渲染
      warehouseListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/get/store/warehouses-list'
        getDataFromApi(url, {}, function (response) {
          self.warehouseData = response.data.body
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/difference'
        var data =
          'name=' + this.searchData.name + '&' +
          'category_id=' + this.searchData.category_id + '&' +
          'warehouse_id=' + this.searchData.warehouse_id + '&' +
          'start_time=' + this.searchData.start_time + '&' +
          'end_time=' + this.searchData.end_time
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        categoryData: [],
        warehouseData: [],
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        authority: {
          export: false,
          look: false
        },
        gridColumns: {
          item_code: "货号",
          item_name: "品名",
          difference: "差异库存量",
          unit_name: "单位",
          unit_specification: "单位规格",
          warehouse_name: "仓库"
        },
        gridOperate: true,
        listdata: [],
        page: [],
        searchData: {
          name: '',
          category_id: '',
          warehouse_id: '',
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
