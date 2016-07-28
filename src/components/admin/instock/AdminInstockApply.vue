<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">要货汇总</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="请输入货号或品名" style="width: 140px;">
            </div>
            <div class="form-group ml10">
              <label>单据状态</label>
              <select class="form-control">
                <option>全部</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>要货时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间" style="width: 125px;"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间" style="width: 125px;">
            </div>
            <div class="form-group ml10">
              <label>送货时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间" style="width: 125px;"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间" style="width: 125px;">
            </div>
            <div class="form-group ml10">
              <label>要货门店</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>

          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">要货单号</td>
            <td>状态</td>
            <td>要货门店</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>制单日期</td>
            <td>送货日期</td>
            <td>要货数量</td>
            <td>配送数量</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>已审核</td>
            <td>两江店</td>
            <td>将大白</td>
            <td>李四</td>
            <td>2016-6-1</td>
            <td>2016-6-1</td>
            <td>1000</td>
            <td>800</td>
            <td>
              <span class="btn btn-primary btn-sm">完成</span>
              <span class="btn btn-default btn-sm">查看明细</span>
            </td>
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
    </div>
  </div>
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import LeftInstock from '../common/LeftInstock'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock
    }
  }
</script>
