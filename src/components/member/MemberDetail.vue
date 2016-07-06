<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：会员首页</li>
      <li class="active">会员明细</li>
    </ol>

    <!-- 表格 -->
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">会员卡号</td>
        <td>余额</td>
        <td>积分</td>
        <td>姓名</td>
        <td>手机号码</td>
        <td>生日</td>
        <td>等级</td>
        <td>开卡点</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">05238</td>
        <td>￥1000.00</td>
        <td>1000</td>
        <td>江小白</td>
        <td>18523565656</td>
        <td>06.01</td>
        <td>九折会员</td>
        <td>水星店</td>
        <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#chongzhi-member-templ">充值</span>
          <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ">编辑</span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">操作类型</td>
        <td>余额变更</td>
        <td>积分变更</td>
        <td>最新余额</td>
        <td>最新积分</td>
        <td>操作时间</td>
        <td>备注</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">微商城积分兑换</td>
        <td>0</td>
        <td>-30积分</td>
        <td>￥100.00</td>
        <td>0积分</td>
        <td>2015-11-02 14:00</td>
        <td>备注内容</td>
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
</template>
<script>
  export default {
    data: function () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'this is member vue'
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

