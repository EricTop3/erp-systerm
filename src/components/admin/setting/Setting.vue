<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <ul class="nav nav-stacked sidebar">
          <li class="active"><a v-link="{ path: '/admin/setting'}">商品设置</a></li>
          <li><a v-link="{ path: '/admin/setting/category'}">商品分类</a></li>
          <li><a v-link="{ path: '/admin/setting/coupon'}">优惠设置</a></li>
          <li><a v-link="{ path: '/admin/setting/partner'}">合作方设置</a></li>
          <li><a v-link="{ path: '/admin/setting/userAccount'}">门店账号</a></li>
          <li><a v-link="{ path: '/admin/setting/adminAccount'}">系统账号</a></li>
        </ul>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">商品设置</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>商品分类</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>销售状态</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品属性</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="">
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" placeholder="">
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>

            <a href="42.html"><span class="btn btn-info spanblocks fr">新建商品</span></a>
          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">编号</td>
            <td>品名</td>
            <td>货号</td>
            <td>零售价</td>
            <td>采购价</td>
            <td>规格单位</td>
            <td>分类</td>
            <td>商品属性</td>
            <td>价格属性</td>
            <td>销售状态</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">1652254556</td>
            <td>伊利牛奶</td>
            <td>15555221</td>
            <td>￥20.00/盒</td>
            <td>无</td>
            <td>1箱*24盒*250ml</td>
            <td>牛奶</td>
            <td>工厂产成品</td>
            <td>特价商品</td>
            <td>上架中</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#set-price-templ">价格波动</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#set-edit-templ">编辑</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#set-del-templ">删除</span>
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

  <!--模态框-历史价格波动-->
  <div class="modal fade" id="set-price-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">历史价格波动</h4>
          </div>
          <div class="modal-body">
            <!-- 表格 -->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <td class="text-left">修改日期</td>
                <td>历史零售单价</td>
                <td>历史采购单价</td>
                <td>编辑人</td>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-编辑-->
  <div class="modal fade" id="set-edit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">编辑</h4>
        </div>
        <div class="modal-body">
          <h4>编辑弹出</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <div class="modal fade" id="set-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">删除</h4>
        </div>
        <div class="modal-body">
          <h4>删除弹出</h4>
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
  import AdminNav from '../AdminNav'
  export default{
    components: {
      AdminNav: AdminNav
    }
  }
</script>
