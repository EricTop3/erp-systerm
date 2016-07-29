<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">差异汇总</li>
          <li class="active">差异明细</li>
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
              <label>时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>

          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>差异库存量</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>仓库</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>伊利牛奶</td>
            <td>5</td>
            <td>箱</td>
            <td>1箱*20盒*250ml</td>
            <td>两江店</td>
          </tr>
          </tbody>
        </table>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">盘点单号</td>
            <td>品名</td>
            <td>差异数量</td>
            <td>单位</td>
            <td>操作人</td>
            <td>时间</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>伊利牛奶</td>
            <td>5</td>
            <td>箱</td>
            <td>江小白</td>
            <td>2016-05-01 18:16:30</td>
          </tr>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>伊利牛奶</td>
            <td>5</td>
            <td>箱</td>
            <td>江小白</td>
            <td>2016-05-01 18:16:30</td>
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
  import LeftInstock from '../../common/LeftInstock'
  import AdminNav from '../../AdminNav'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock
    }
  }
</script>
