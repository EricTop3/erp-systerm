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
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftPurchase from '../common/LeftPurchase'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftPurchase: LeftPurchase
    }
  }
</script>
