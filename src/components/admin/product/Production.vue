<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">工厂生产单</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="" style="width: 130px;">
            </div>
            <div class="form-group ml10">
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
            <div class="form-group ml10">
              <label>制单时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间" style="width: 130px;"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间" style="width: 130px;">
            </div>
            <div class="form-group ml10">
              <label>生产时间段</label>
              <input type="text"class="form-control date_picker" placeholder="开始时间" style="width: 130px;"> -
              <input type="text"class="form-control date_picker" placeholder="结束时间" style="width: 130px;">
            </div>
            <button type="submit" class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>
            <span v-link="{path:'/admin/production/factoryCreat'}" class="btn btn-info spanblocks fr">新建生产单</span>

          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">生产单号</td>
            <td>审核状态</td>
            <td>制单人</td>
            <td>审核人</td>
            <td>制单日期</td>
            <td>生产日期</td>
            <td>生产数量</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>未审核</td>
            <td>张三</td>
            <td>无</td>
            <td>2016-6-2</td>
            <td>2016-6-2</td>
            <td>300</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#production-audit-templ">审核</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-view-templ">查看</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-del-templ">删除</span>
            </td>
          </tr>
          <tr class="text-center">
            <td class="text-left">164643138431315</td>
            <td>已审核</td>
            <td>张三</td>
            <td>王二小</td>
            <td>2016-6-2</td>
            <td>2016-6-3</td>
            <td>300</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal">完成</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#production-view-templ">查看</span>
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
  <div class="modal fade" id="production-audit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
  <div class="modal fade" id="production-view-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
  <div class="modal fade" id="production-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
  import LeftProduction  from '../common/LeftProduction'
  export default{
    components:{
      AdminNav: AdminNav,
      LeftProduction: LeftProduction
    }
  }
</script>
