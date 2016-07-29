<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">生产出库</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control">
                <option>水星店</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <input type="text" class="form-control" placeholder="请输入商品名或货号">
            </div>
            <div class="form-group ml10">
              <label>销售时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <button type="submit" class="btn btn-warning">撤销搜索</button>
          </form><br>
          <span class="f12 c-erp">注：统计工厂产成品，委外产成品，门店产成品在生产中消耗的原材料库存量</span>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">门店</td>
            <td>货号</td>
            <td>品名</td>
            <td>生产出库量</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>商品分类</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">两江店</td>
            <td>WP51254668856654</td>
            <td>伊利牛奶</td>
            <td>1000</td>
            <td>箱</td>
            <td>1箱*20盒*250ml</td>
            <td>咖啡原材料</td>
            <td><a href="#"><span class="btn btn-default">生产明细</span></a></td>
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
  import AdminNav from '../../AdminNav'
  import LeftInstock from '../../common/LeftInstock'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock
    }
  }
</script>
