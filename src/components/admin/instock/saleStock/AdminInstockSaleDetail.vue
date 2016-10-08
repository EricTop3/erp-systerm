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
          <li class="active">明细</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>销售时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click="searchListData()">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10" v-if="authority.export">导出</span></a>
          </form>
        </div>
        <!--详情页面单条数据-->
        <summary-detail
          :table-header="gridcolumns"
          :table-data="onedata"
          :grid-operate="gridOperate">
        </summary-detail>

        <!--详情页面列表数据-->
        <grid :data="listdata" :operate="gridOperate2" :columns="gridcolumns2"></grid>

        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
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
  import SummaryDetail from '../../../common/SummaryDetail'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest,
    putDataToApi,
    finishRequest,
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
      SummaryDetail: SummaryDetail
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
//      获取详情列表数据
      this.getlistData(1)
//      获取详情单条数据
      this.getOneData()
//      权限判断
      if(systermAuthority.indexOf('sale-out-list-export') > -1) {
        this.authority.export = true
      }
    },
    methods: {
//      (获取详情)列表数据渲染
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/sale/log/' + this.thisId
        var data = {
//          浏览器地址栏传过来的参数 this.$route.query.start_time
          start_time: this.searchData.start_time || this.$route.query.start_time,
          end_time: this.searchData.end_time || this.$route.query.end_time,
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var data = {
          start_time: this.searchData.start_time || this.$route.query.start_time,
          end_time: this.searchData.end_time || this.$route.query.end_time
        }
        var url = requestSystemUrl + '/backend-system/stock/sale/log/' + this.thisId + '/detail'
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body
        })
      },
//      搜索（传2个请求，单个和列表）
      searchListData: function () {
        this.getlistData(1)
        this.getOneData()
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.$route.query.start_time = ''
        this.$route.query.end_time = ''
        this.getlistData(1)
        this.getOneData()
      }
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/sale'
        var sTime = ''
        var eTime = ''
        if(this.searchData.start_time == ''){
          sTime = this.$route.query.start_time || ''
        }else{
          sTime = this.searchData.start_time|| ''
        }
        if(this.searchData.end_time == ''){
          eTime = this.$route.query.end_time || ''
        }else{
          eTime = this.searchData.end_time|| ''
        }
        var data =
          'start_time=' + sTime + '&' +
          'end_time=' + eTime
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId + '?' +data
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        thisId: '',
        listdata: [],
        onedata: [],
        page: [],
        gridOperate: false,
        authority: {
          export: false
        },
        gridcolumns: {
          store_name: '门店',
          goods_code: '货号',
          goods_name: '品名',
          amount: '零售出库量',
          unit_name: '零售单位',
          unit_specification: '单位规格',
          category_id: '商品分类'
        },
        gridOperate2: false,
        gridcolumns2: {
          created_at: '时间',
          goods_name: '品名',
          amount: '零售出库量',
          unit_name: '零售单位',
          creator_name: '操作人',
          document_number: '单号'
        },
        searchData: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>

