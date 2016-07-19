<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2"  role="navigation">
        <ul class="nav nav-stacked sidebar">
          <li class="active"><a v-link="{ path: '/admin/purchase'}">采购订单</a></li>
          <li><a v-link="{ path: '/admin/purchase/delivery'}">采购收货</a></li>
        </ul>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">采购订单</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="">
            </div>
            <div class="form-group  ml10">
              <label>审核状态</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <span class="btn btn-info spanblocks fr" data-toggle="modal" data-target="#">新建采购单</span>
            <div class="form-group ml10">
              <label>采购时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <div class="form-group ml10">
              <label>供应商</label>
              <select class="form-control">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group mt20">
              <label>收货时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间">
            </div>
            <button type="submit" class="btn btn-primary  mt20">搜索</button>
            <span class="btn btn-warning  mt20">撤销搜索</span>

          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">采购单号</td>
            <td>状态</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>供应商</td>
            <td>制单日期</td>
            <td>到货日期</td>
            <td>采购金额</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>未审核</td>
            <td>李四</td>
            <td>无</td>
            <td>两江食品</td>
            <td>2016-6-1</td>
            <td>2016-6-2</td>
            <td>￥80.00</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#procurement-audit-templ">审核</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#procurement-view-templ">查看</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#procurement-del-templ">删除</span>
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

  <!--模态框-审核-->
  <div class="modal fade" id="procurement-audit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">审核</h4>
        </div>
        <div class="modal-body">
          <h4>审核弹出</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-查看-->
  <div class="modal fade" id="procurement-view-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">查看</h4>
        </div>
        <div class="modal-body">
          <h4>查看弹出</h4>
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
  <div class="modal fade" id="procurement-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
    components:{
      AdminNav: AdminNav
    }
  }
</script>
