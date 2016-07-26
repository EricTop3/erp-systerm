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
              <input type="text" class="form-control" placeholder="">
            </div>
            <div class="form-group  ml10">
              <label>审核状态</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <a v-link="{path: '/admin/purchase/createNewPurchase'}" class="btn btn-info spanblocks fr">新建采购单</a>
            <div class="form-group ml10">
              <label>采购时间段</label>
              <input type="text" class="form-control date_picker" placeholder="开始时间"> -
              <input type="text" class="form-control date_picker" placeholder="结束时间">
            </div>
            <div class="form-group ml10">
              <label>供应商</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group mt20">
              <label>收货时间段</label>
              <input type="text" class="form-control date_picker" placeholder="开始时间"> -
              <input type="text" class="form-control date_picker" placeholder="结束时间">
            </div>
            <button type="submit" class="btn btn-primary  mt20">搜索</button>
            <span class="btn btn-warning  mt20">撤销搜索</span>
          </form>
        </div>
        <!-- 表格 -->
        <summary :table-data="list" :table-header="gridColumns" :page="page"></summary>
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
  import {requestUrl,requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../publicFunction/index'
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
          exchangeData(this.list)
        }, function (err) {
          console.log(err)
        })
      },
//     删除请求
      deleteFromApi: function (id) {
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/purchase/purchase/'+ id,function(response){
          console.log('deleted')
        })
      },
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest(requestSystemUrl + '/backend-system/purchase/purchase/' + id + '/checked',function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl + '/backend-system/purchase/purchase/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//    查看详情
      gotoDetail: function (id){
          window.location.href = '#!/admin/purchase/purchasedetail/'+ id
      }
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
      listData: function (page) {
        var self = this
        var url = requestUrl + '/backend-system/purchase/purchase'
        getDataFromApi(url,{},function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
          exchangeData(self.list)
        })
      }
    },
    data: function () {
      return {
        page: [],
        list: [],
        gridColumns: {
          document_number: '采购单号',
          checked: '状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          provider_name: '供应商',
          created_at: '制单日期',
          terminated_at: '到货日期',
          total_sum: '采购金额'
        }
      }
    }
  }
</script>
