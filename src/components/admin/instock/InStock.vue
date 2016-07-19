<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2"  role="navigation">
        <ul class="nav nav-stacked sidebar">
          <li class="active"><a v-link="{ path: '/admin/instock}">库存查询</a></li>
          <li><a v-link="{ path: '/admin/instock/inventory'}">库存盘点</a></li>
          <li><a v-link="{ path: '/admin/instock/difference'}">差异汇总</a></li>
          <li><a v-link="{ path: '/admin/instock/dispatching'}">库存配送出库</a></li>
          <li><a v-link="{ path: '/admin/instock/sale'}">销售出库</a></li>
          <li><a v-link="{ path: '/admin/instock/production'}">生产出库</a></li>
          <li><a v-link="{ path: '/admin/instock/apply'}">要货汇总</a></li>
        </ul>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存查询</li>
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
              <input type="text" class="form-control" placeholder="请输入商品名或商品编号">
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <div class="form-group ml10">
              <label><input type="checkbox" class="checkbox">库存警戒中 </label>
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
            <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-detail-templ">出入库明细</span></td>
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
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav
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

