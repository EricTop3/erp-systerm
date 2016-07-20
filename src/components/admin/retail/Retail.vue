<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-retail></left-retail>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：零售首页</li>
          <li class="active">结算统计</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>门店</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <input type="text" class="date_picker form-control"> -
              <input type="text" class="date_picker form-control">
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>
          </form>
        </div>

        <!-- 表格1 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td>门店</td>
            <td>合计收入额</td>
            <td>现金支付额</td>
            <td>会员卡支付额</td>
            <td>刷卡支付额</td>
            <td>微信支付额</td>
            <td>支付宝支付额</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td>JZ51254668856654</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
          </tr>
          </tbody>
        </table>
        <!-- end表格1 -->

        <!-- 表格2 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td>门店</td>
            <td>开始日期</td>
            <td>结束日期</td>
            <td>合计收入额</td>
            <td>现金支付额</td>
            <td>会员卡支付额</td>
            <td>刷卡支付额</td>
            <td>微信支付额</td>
            <td>支付宝支付额</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td>164643138431315</td>
            <td>2016-6-1</td>
            <td>2016-6-1</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>￥2000.00</td>
            <td>
              <span class="btn btn-default">结算明细</span>
            </td>
          </tr>
          </tbody>
        </table>
        <!-- end表格2 -->

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
    </div>
  </div>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftRetail  from '../common/LeftRetail'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftRetail:  LeftRetail
    }
  }
</script>
