<template>
  <div class="container-fluid">
    <!--测试-->



    <!-- 表格 -->
    <table class="table table-striped table-border table-hover mt20">
      <thead>
      <tr class="text-center">
        <td>结算日期</td>
         <td>合计收入额</td>
        <td>现金支付额</td>
        <td>刷卡支付额</td>
        <td>微信支付额</td>
        <td>支付宝支付额 </td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td>2015-05-01</td>
        <td>￥50000.00</td>
        <td>￥10000.00</td>
        <td>￥10000.00</td>
        <td>￥10000.00</td>
        <td>￥10000.00</td>
        <td>
          <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#settlement-templ">今日结算</span>
          <span class="btn btn-info btn-sm">今日历史</span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <table class="table table-striped table-border table-hover">
      <thead>
      <tr class="text-center">
        <td>小票编号</td>
        <td>下单时间</td>
        <td>合计金额</td>
        <td>合计数量</td>
        <td>支付方式</td>
        <td>会员卡号</td>
        <td>优惠方式</td>
        <td>营业员</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td>会员充值</td>
        <td>2015-05-01 18:00:00</td>
        <td>￥1800.00</td>
        <td>10</td>
        <td>现金支付</td>
        <td>1234567890</td>
        <td>无</td>
        <td>张三</td>
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

  <!--模态框-删除-->
  <div class="modal fade" id="settlement-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">提示</h4>
        </div>
        <div class="modal-body">
          <h4 class="text-center">确定结算？</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">确定</button>
          <button type="button" class="btn btn-primary">取消</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->
</template>
<script>
  export default {
    data: function () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'this is billing vue'
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

