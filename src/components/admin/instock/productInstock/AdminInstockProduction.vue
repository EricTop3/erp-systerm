<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">生产出库</li>
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
              <label>销售时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click=getlistData()>搜索</span>
            <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form><br>
          <span class="f12 c-erp">注：统计工厂产成品，委外产成品，门店产成品在生产中消耗的原材料库存量</span>
        </div>

        <!--表格-->
        <summary
          :table-header="gridColumns"
          :table-data="listdata"
          :page="page">
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
      //    查看详情
      gotoDetail: function (id) {
        window.location.href = '/#!/admin/instock/production/Detail/' + id
      }
    },
    ready: function () {
      this.getlistData(1)
      this.categoryListData()
      this.warehouseListData()
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/produce/consume/log'
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
        var url = requestSystemUrl + '/backend-system/product/category'
        getDataFromApi(url, {}, function (response) {
          self.categoryData = response.data.body.list
        })
      },
//      仓库列表数据渲染
      warehouseListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/store/warehouses-list'
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
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/produce'
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
        gridColumns: {
          warehouse_name: "门店",
          goods_code: "货号",
          goods_name: "品名",
          amount: "生产出库量",
          unit_name: "单位",
          unit_specification: "单位规格",
          category_name: "商品分类"
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

