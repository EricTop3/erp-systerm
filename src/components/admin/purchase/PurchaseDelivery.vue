<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-purchase></left-purchase>
        <div class="col-lg-10">
          <!-- 路径导航 -->
          <ol class="breadcrumb">
            <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
            <li class="active">采购收货</li>
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
              <div class="form-group ml10">
                <label>收货时间段</label>
                <input type="text"class="form-control date_picker" placeholder="开始时间"> -
                <input type="text"class="form-control date_picker" placeholder="结束时间">
              </div>
              <div class="form-group ml10">
                <label>供应商</label>
                <select class="form-control">
                  <option>请选择</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">搜索</button>
              <span class="btn btn-warning">撤销搜索</span>
              <a  v-link="{path: '/admin/purchase/delivery/createNewDelivery'}"  class="btn btn-info spanblocks fr">新建收货单</a>
            </form>
          </div>
          <!--表格 -->
          <summary :table-header="gridColumns" :table-data="list" :page="page" :detail-url="detailUrl"></summary>
        </div>
    </div>
    </div>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftPurchase from '../common/LeftPurchase'
  import Summary from '../../common/Summary'
  import {requestSystemUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftPurchase: LeftPurchase,
      Summary: Summary
    },
    ready: function (){
      this.fetlistFormApi()
    },
    data: function () {
      return {
        gridColumns: {
          "document_number": "货号",
          "checked": "审核状态",
          "creator_name": "制单人",
          "auditor_name": "审核人",
          "provider_name": "供应商",
          "operated_at": "收货日期",
          "actual_amount": "实际入库量",
          "purchase_amount": '采购数量',
          "refund_amount": '退货数量'
        },
        list: [],
        page: {},
      }
    },
    methods:  {
      fetlistFormApi: function (){
        var url = requestSystemUrl +  '/backend-system/purchase/receive'
        var self = this
        getDataFromApi(url,{},function(response){
          self.list = response.data.body.list
          self.page = response.data.body.pagination
        })
      }
    }
  }
</script>
