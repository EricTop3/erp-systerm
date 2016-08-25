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
          <li class="active">明细</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>时间段</label>
              <date-picker :value.sync="searchData.start_time" :time-text="timetext1"
                           :timewidth="timewidth"></date-picker>
              <date-picker :value.sync="searchData.end_time" :time-text="timetext2"
                           :timewidth="timewidth"></date-picker>
            </div>
            <span class="btn btn-primary" @click="searchListData()">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
          </form>
        </div>

        <!--详情页面单条数据-->
        <summary-detail
          :table-header="gridcolumns"
          :table-data="onedata"
          :grid-operate="gridOperate">
        </summary-detail>
        <!--详情页面列表数据-->
        <a :href="exports" target="_blank" style="float:right;"><span class="btn btn-info spanblocks fr">导出</span></a>
        <grid :data="listdata" :operate="gridOperate2" :columns="gridcolumns2"></grid>


        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>
</template>
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
    finishRequest
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
//      获取仓库列表
      this.warehouseListData()
    },
    computed: {
//      导出
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/stock/difference'
        return this.exportUrl = url + '/export-excel/' + this.$route.params.queryId
      }
    },
    methods: {
//      (获取详情)列表数据渲染
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/difference/' + this.thisId
        var data = {
          start_time: this.searchData.start_time,
          end_time: this.searchData.end_time,
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
          start_time: this.searchData.start_time,
          end_time: this.searchData.end_time
        }
        var url = requestSystemUrl + '/backend-system/stock/difference/' + this.thisId  + '/detail'
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body
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
//      搜索（传2个请求，单个和列表）
      searchListData: function () {
        this.getlistData(1)
        this.getOneData()
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
        this.getOneData()
      }
    },
    data: function () {
      return {
        timewidth: "timewidth",
        timetext1: "开始时间",
        timetext2: "结束时间",
        warehouseData: [],
        thisId: '',
        listdata: [],
        onedata: [],
        page: [],
        gridOperate: false,
        gridcolumns: {
          item_code: '货号',
          item_name: '品名',
          difference: '差异库存量',
          unit_name: '单位',
          unit_specification: '单位规格',
          warehouse_name: '仓库'
        },
        gridOperate2: false,
        gridcolumns2: {
          created_at: '时间',
          item_name: '品名',
          difference: '差异数量',
          unit_name: '单位',
          creator_name: '操作人',
          document_number: '盘点单号'
        },
        searchData: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>

