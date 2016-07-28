<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存查询</li>
          <li class="active">明细</li>
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
              <label>操作类型</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>盘点时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <button type="submit" class="btn btn-primary">查询</button>
          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>仓库</td>
            <td>期初库存量</td>
            <td>期间入库量</td>
            <td>期间出库量</td>
            <td>期末库存量</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">WP51254668856654</td>
            <td>伊利牛奶</td>
            <td>总部仓库</td>
            <td>100</td>
            <td>200</td>
            <td>150</td>
            <td>150</td>
            <td>箱</td>
            <td>1箱*20盒*250ml</td>
            <td></td>
          </tr>
          </tbody>
        </table>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">单号</td>
            <td>出库量</td>
            <td>入库量</td>
            <td>即时库存</td>
            <td>单位</td>
            <td>操作类型</td>
            <td>操作人</td>
            <td>时间</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>4</td>
            <td>100</td>
            <td>196</td>
            <td>箱</td>
            <td>零售出库</td>
            <td>张三</td>
            <td>2016-6-1  18:16:30</td>
          </tr>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>4</td>
            <td>100</td>
            <td>196</td>
            <td>箱</td>
            <td>零售出库</td>
            <td>张三</td>
            <td>2016-6-1  18:16:30</td>
          </tr>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>4</td>
            <td>100</td>
            <td>196</td>
            <td>箱</td>
            <td>零售出库</td>
            <td>张三</td>
            <td>2016-6-1  18:16:30</td>
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

<script>
  import AdminNav from '../AdminNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import LeftInstock from '../common/LeftInstock'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      LeftInstock: LeftInstock
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
    },
    methods: {},
    data: function () {
      return {}
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

