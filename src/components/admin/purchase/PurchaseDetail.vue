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
          <li class="active">查看收货单</li>
        </ol>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">收货单号</td>
            <td>审核状态</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>供应商</td>
            <td>收货日期</td>
            <td>采购数量</td>
            <td>实际入库数量</td>
            <td>退货数量</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">WP51254668856654</td>
            <td>未审核</td>
            <td>李老三</td>
            <td>无</td>
            <td>两江食品</td>
            <td>2016-5-1</td>
            <td>300</td>
            <td>300</td>
            <td>0</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#procurement-audit-templ">审核</span>
              <a href="#"><span class="btn btn-default btn-sm">编辑</span></a>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#procurement-del-a-templ">删除</span>
            </td>
          </tr>
          </tbody>
        </table>

        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#detail"  data-toggle="tab">入库明细</a></li>
            <li role="presentation"><a href="#summary"  data-toggle="tab">入库汇总</a></li>
            <div class="spanblocks fr mr30 mt10 f16">合计：<span class="c-erp">￥3000.00</span> </div>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="detail">
              <!-- 表格 -->
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>单位</td>
                  <td>单位规格</td>
                  <td>采购数量</td>
                  <td>收货数量</td>
                  <td>赠送数量</td>
                  <td>退货数量</td>
                  <td>采购单价</td>
                  <td>操作</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>箱</td>
                  <td>1箱*20盒*250ml</td>
                  <td>5000</td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="5000"></td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="2000"></td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="10"></td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="10.00"></td>
                  <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#procurement-del-templ">删除</span></td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li class="active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>

            <div role="tabpanel" class="tab-pane" id="summary">
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>单位</td>
                  <td>单位规格</td>
                  <td>采购数量</td>
                  <td>实际入库数量</td>
                  <td>退货数量</td>
                  <td>小计采购额</td>
                  <td>小计退货额</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>箱</td>
                  <td>1箱*20盒*250ml</td>
                  <td>10</td>
                  <td>10</td>
                  <td>0</td>
                  <td>￥200.00</td>
                  <td>￥20.00</td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li class="active"><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>


  <!--模态框-查看-->
  <div class="modal fade" id="procurement-view-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">查看</h4>
        </div>
        <div class="modal-body">
          <h4>查看弹出</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->
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
  import {requestUrl,getDataFromApi,token,exchangeData,searchRequest,deleteRequest,checkRequest,finishRequest} from '../../../publicFunction/index'
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
      /*//     删除请求
       deleteFromApi: function (id) {
       var self = this
       deleteRequest('/backend-system/purchase/purchase/',id,function(response){
       console.log('deleted')
       })
       },*/
//     審核请求
      checkFromApi: function (id) {
        var self = this
        checkRequest('/backend-system/purchase/purchase/'+ id +'/checked',{},function(response){
          console.log('checked')
        })
      },
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest('/backend-system/purchase/purchase/'+ id +'/finished',{},function(response){
          console.log('finished')
        })
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
        detailUrl: '#!/admin/purchase/createNewPurchase',
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
