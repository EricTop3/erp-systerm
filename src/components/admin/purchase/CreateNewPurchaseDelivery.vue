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
          <li class="active">新建</li>
        </ol>
          <!-- 页头 -->
          <div class="page-header">
            <form class="form-inline">
              <div class="form-group">
                <label>供应商</label>
                <select class="form-control">
                  <option>请选择</option>
                </select>
              </div>
              <div class="form-group  ml10">
                <label>备注</label>
                <input type="text" class="form-control" placeholder="" style="width: 450px;">
              </div>
              <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ" @click="parentIntroModal=true">引用原始单据</span>
              <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ">提交收货</span>
            </form>
          </div>
        <!--表格 -->
        <summary :table-header="gridColumns" :table-data="list" :page="page" :detail-url="detailUrl" :tabFlag="tabFlag"></summary>
        <!--引用原始总部采购单-->
        <introduce-data :instroduce-data-modal.sync='parentIntroModal' :instroduce-data-modal-size="parentIntroModalSize" :add-data.sync="stockGoods" :url="currentUrl" :first-data-title="firstDataTitle"  :second-data-title="secondDataTitle"></introduce-data>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftPurchase from '../common/LeftPurchase'
  import IntroduceData  from '../../common/IntroduceData'
  import {requestSystemUrl} from '../../../publicFunction/index'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftPurchase: LeftPurchase,
      IntroduceData: IntroduceData
    },
    data: function () {
      return {
        tabFlag: true,
        parentIntroModal: false,
        currentUrl:  requestSystemUrl  + '/backend-system/purchase-items',
        parentIntroModalSize: 'modal-lg',
        firstDataTitle: {
          "document_number": "货号",
          "created_at": "采购日期",
          "terminated_at": "到货日期",
          "total_sum": "采购金额",
          "provider": "供应商",
          "creator_name": "制单人",
          "auditor_name": "审核人",
        },
        secondDataTitle: {
          "item_code": "货号",
          "item_name": "品名",
          "main_reference_value": "采购数量",
          "demand_amount": "要货数量",
          "unit_name": "单位",
          "unit_specification": "单位规格"
        },
        stockGoods: [],
        gridColumns: {
        }
      }
    }
  }
</script>
