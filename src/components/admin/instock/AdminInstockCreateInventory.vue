<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存盘点</li>
          <li class="active">新建库存盘点</li>
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
            <div class="form-group  ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 450px;">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#products-add-templ">选择盘点商品</span>
            <span class="btn btn-default" data-toggle="modal" data-target="#">盘点所有商品</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#">提交盘点</span>
          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>系统库存量</td>
            <td>实际库存量</td>
            <td>差异库存量</td>
            <td>单位</td>
            <td>单位规格</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>伊利牛奶</td>
            <td>105</td>
            <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="100"></td>
            <td>-5</td>
            <td>箱</td>
            <td>1箱*20盒*250ml</td>
            <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ">删除</span></td>
          </tr>
          <tr class="text-center">
            <td class="text-left">1654679184236564</td>
            <td>伊利牛奶</td>
            <td>105</td>
            <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="100"></td>
            <td>-5</td>
            <td>箱</td>
            <td>1箱*20盒*250ml</td>
            <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ">删除</span></td>
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
  <div class="modal fade" id="inventory-audit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
  <div class="modal fade" id="inventory-view-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
  <div class="modal fade" id="inventory-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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

  <!--模态框-添加商品-->
  <div class="modal fade" id="products-add-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">添加商品</h4>
        </div>
        <div class="modal-body">
          <!-- 页头 -->
          <div class="page-header">
            <form action="" method="post" class="form-inline">
              <div class="form-group">
                <label><input type="checkbox">库存警戒中</label>
              </div>
              <div class="form-group ml10">
                <input type="text" class="form-control" placeholder="请输入商品名或商品编号">
              </div>
              <span class="btn btn-primary">搜索</span>
              <span class="btn btn-warning">撤销搜索</span>
            </form>
          </div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-2" role="navigation" style="padding:0;">
                <ul class="nav nav-stacked dialog-sidebar">
                  <li class="header">商品分类</li>
                  <li class="active"><a href="#">全部<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">包装材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">咖啡原材料<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">面包<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                  <li><a href="#">饼干<span class="glyphicon glyphicon-chevron-right"></span></a></li>
                </ul>
              </div>
              <div class="col-sm-10" style="padding-right: 0;height:580px;overflow:auto;">
                <table class="table table-striped table-border table-hover">
                  <thead>
                  <tr>
                    <td><label><input type="checkbox"> 全选</label></td>
                    <td>货号</td>
                    <td>品名</td>
                    <td>日均销量</td>
                    <td>当前库存</td>
                    <td>单位</td>
                    <td>单位规格</td>
                    <td>商品分类</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr><tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr><tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr><tr>
                    <td><input type="checkbox"></td>
                    <td>WB2545236584</td>
                    <td>伊利牛奶</td>
                    <td>100</td>
                    <td>102</td>
                    <td>箱</td>
                    <td>1箱*20盒*250ml</td>
                    <td>咖啡原材料</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">确定添加</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

</template>
<style>
</style>
<script>
  import LeftInstock from '../common/LeftInstock'
  import AdminNav from '../AdminNav'
  export default{
    components: {
      LeftInstock: LeftInstock,
      AdminNav: AdminNav
    }
  }
</script>
