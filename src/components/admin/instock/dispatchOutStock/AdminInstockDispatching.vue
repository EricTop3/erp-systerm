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
          <li class="active">库存配送出库</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="" v-model="searchData.document_number">
            </div>
            <div class="form-group ml10">
              <label>审核状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option value="0">全部</option>
                <option value="1">未审核</option>
                <option value="2">已审核</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>调入仓库</label>
              <select class="form-control" v-model="searchData.provider_id">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>出货仓库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option>请选择</option>
              </select>
            </div>
            <br/>
            <div class="form-group ml10 mt20">
              <label>配送时间段</label>
              <date-picker :value.sync="time.startTime"></date-picker> -
              <date-picker :value.sync="time.endTime"></date-picker>
            </div>
            <button type="submit" class="btn btn-primary mt20" @click="getlistData(1)">搜索</button>
            <span class="btn btn-warning mt20" @click="cancelSearch()">撤销搜索</span>

            <span class="btn fr btn-info">导出excel</span>
            <span class="btn btn-info spanblocks fr mr10" v-link="{ path: '/admin/instock/createOutInstock',exact: true}">新建配送出库单</span>
          </form>
        </div>

        <!-- 表格 -->
        <summary
          :table-data="list"
          :table-header="gridColumns"
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
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftInstock from '../../common/LeftInstock'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    exchangeData,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest,
    changeStatus} from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftInstock: LeftInstock
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url: requestUrl + '/backend-system/stock/distribution',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          changeStatus(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/stock/distribution/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl + '/backend-system/stock/distribution/' + id + '/checked',function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/stock/distribution/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//    查看详情
      gotoDetail: function (id){
        window.location.href = '#!/admin/purchase/order/purchasedetail/'+ id
      }
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
//      列表数据渲染
      listData: function (page) {
        var self = this
        var url = requestUrl + '/backend-system/stock/distribution'
        getDataFromApi(url,{},function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          changeStatus(self.list)
        })
      },
/*      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/distribution'
        var data = {
          document_number: this.searchData.document_number || '',
          checked: this.searchData.checked || '',
          provider_id: this.searchData.provider_id || '',
          warehouse_id: this.searchData.warehouse_id || '',
          creator_id: this.searchData.creator_id || '',
          start_receive_time: this.searchData.start_receive_time || '',
          end_receive_time: this.searchData.end_receive_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      }*/
    },
    data: function () {
      return {
        page: [],
        list: [],
        time:{
          startTime:'',
          startTime1:'',
          endTime:'',
          endTime1:'',
        },
        gridColumns: {
          order_number: '配送单号',
          checked: '审核状态',
          stream_origin_name: '出货仓库',
          warehouse_name: '调入仓库',
          creator_name: '制单人',
          auditor_name: '审核人',
          operated_at: '配送时间',
          amount: '配送数量'
        },
        /*gridColumns: {
          document_number: "配送单号",
          checked: "审核状态",
          warehouse_name: "调入仓库",
          creator_name: "制单人",
          auditor_name: "审核人",
          operated_at: "配送时间",
          amount: "配送数量"
        },*/
//        gridOperate: false,
//        listdata: [],
        searchData: {
          document_number: '',
          checked: 0,
          provider_id: '',
          warehouse_id: '',
          creator_id: '',
          start_receive_time: '',
          end_receive_time: ''
        }
      }
    }
  }
</script>
