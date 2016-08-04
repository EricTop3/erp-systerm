<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购订单</li>
          <li class="active">列表</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入采购单号" v-model="search.code">
            </div>
            <div class="form-group  ml10">
              <label>审核状态</label>
              <select class="form-control" v-model="search.selectedStatus">
                <option value="">请选择</option>
                <option value="0">未审核</option>
                <option value="1">已审核</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control" v-model="search.selectedMaker">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.orderMaker" >{{item.name}}</option>
              </select>
            </div>
            <a v-link="{path: '/admin/purchase/order/createNewPurchase'}" class="btn btn-info spanblocks fr">新建采购单</a>
            <div class="form-group ml10">
              <label>制单时间段</label>
              <date-picker :value.sync="time.startTime"></date-picker> -
              <date-picker :value.sync="time.endTime"></date-picker>
            </div>
            <div class="form-group ml10">
              <label>供应商</label>
              <select class="form-control" v-model="search.selectedSuppier">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.providerList">{{item.name}}</option>
              </select>
            </div>
            <span type="submit" class="btn btn-primary " @click="searchMethod">搜索</span>
            <span class="btn btn-warning  " @click="cancelSearch">撤销搜索</span>
          </form>
        </div>
        <!-- 表格 -->
        <summary
          :table-data="list"
          :table-header="gridColumns"
          :page="page"
          :check-url="checkUrl"
          :finish-url = "checkUrl"
          :finish-flag = "true"
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
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import Modal from '../../common/Modal'
  import Summary from '../../common/Summary'
  import DatePicker from  '../../common/DatePicker'
  import LeftPurchase from '../common/LeftPurchase'
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest,changeStatus} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftPurchase: LeftPurchase
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url: requestUrl + '/backend-system/purchase/purchase',
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
        deleteRequest(requestSystemUrl + '/backend-system/purchase/purchase/'+ id,function(response){
          self.listData({})
        })
      },
//    查看详情
      gotoDetail: function (id){
          window.location.href = '#!/admin/purchase/order/purchasedetail/'+ id
      }
    },
    ready: function () {
      var self = this
//    获取制单人
      getDataFromApi( requestUrl + '/backend-system/store/store-account',{},function(response){
        self.search.orderMaker = response.data.body.list
      })
//    获取合作工厂
      getDataFromApi(requestUrl + '/backend-system/provider/provider',{},function(response){
        self.search.providerList = response.data.body.list
      })
      this.listData({})
    },
    methods: {
      listData: function (data) {
        var self = this
        var url = requestUrl + '/backend-system/purchase/purchase'
        getDataFromApi(url,data,function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          changeStatus(self.list)
        })
      },
      searchMethod: function(){
        var data = {
          created_id: this.search.selectedMaker,
          document_number: this.search.code,
          checked: this.search.selectedStatus,
          start_time: this.time.startTime,
          provider_id: this.search.selectedSuppier,
          end_time: this.time.endTime,
          start_receive_time: this.time.startTime1,
          end_receive_time: this.time.endTime1,
        }
        this.listData(data)
      },
      cancelSearch: function () {
        this.listData({})
      }
    },
    data: function () {
      return {
        page: [],
        list: [],
        checkUrl: requestSystemUrl + '/backend-system/purchase/purchase/',
        time:{
          startTime:'',
          startTime1:'',
          endTime:'',
          endTime1:'',
        },
        search: {
          selectedStatus: '',
          selectedMaker: '',
          selectedSuppier: '',
          code: '',
          orderMaker: [],
          providerList: [],
        },
        gridColumns: {
          document_number: '采购单号',
          checked: '状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          provider_name: '供应商',
          created_at: '制单日期',
          total_sum: '采购金额'
        }
      }
    }
  }
</script>
