<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="mt20">
      <!-- 页头 -->
      <div class="page-header">
        <form class="form-inline">
          <div class="form-group">
            <label>会员卡号</label>
            <input class="form-control">
          </div>
          <div class="form-group">
            <label>会员姓名</label>
            <input class="form-control">
          </div>
          <div class="form-group">
            <label>会员手机</label>
            <input class="form-control">
          </div>
          <div class="form-group">
            <label>会员生日</label>
            <input class="form-control">
          </div>
          <div class="form-group ml10">
            <label>开卡点</label>
            <select class="form-control" style="width: 200px;">
              <option>水星店</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">搜索</button>
          <span class="btn btn-warning">撤销搜索</span>

          <span class="btn btn-info spanblocks fr" data-toggle="modal" data-target="#vip-newVip-templ">新会员办理</span>
        </form>
      </div>


      <!-- 表格 -->
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-center">
          <td>会员卡号</td>
          <td>余额</td>
          <td>积分</td>
          <td>姓名</td>
          <td>手机号码</td>
          <td>生日</td>
          <td>等级</td>
          <td>开卡点</td>
          <td>状态</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center">
          <td>164643138431315</td>
          <td>￥2514.00</td>
          <td>2541656</td>
          <td>王小二</td>
          <td>13812345678</td>
          <td>03.01</td>
          <td>九折会员</td>
          <td>水星店</td>
          <td>启用</td>
          <td>
            <span class="btn btn-default" data-toggle="modal" data-target="#vip-change-templ">变更</span>
            <span class="btn btn-default" data-toggle="modal" data-target="#vip-edit-templ">编辑</span>
            <span class="btn btn-default" data-toggle="modal" data-target="#">查看</span>
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

  <!--模态框-编辑-->
  <div class="modal fade" id="vip-edit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">会员编辑</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="col-sm-4 control-label">会员卡号</label>
              <div class="col-sm-8">
                <p class="form-control-static">05238554654885</p>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="江小白">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">手机号码</label>
              <div class="col-sm-8">
                <p class="form-control-static">13812345678</p>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">微商城密码</label>
              <div class="col-sm-8">
                <input type="password" class="form-control" id="" placeholder="登录密码，请谨慎填写！" value="">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="江小白">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</label>
              <div class="col-sm-8">
                <select class="form-control">
                  <option value="">九折会员</option>
                </select>
              </div>
            </div>
            <div class="btn-group" style="margin-left: 118px;">
              <button type="button" class="btn btn-primary">停用</button>
              <button type="button" class="btn btn-default">启用</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#vip-changeOk-templ">提交</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-新会员-->
  <div class="modal fade" id="vip-newVip-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新会员办理</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="col-sm-4 control-label">会员卡号</label>
              <div class="col-sm-8">
                <p class="form-control-static">05238554654885</p>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="江小白">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">手机号码</label>
              <div class="col-sm-8">
                <p class="form-control-static">13812345678</p>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">微商城密码</label>
              <div class="col-sm-8">
                <input type="password" class="form-control" id="" placeholder="登录密码，请谨慎填写！" value="">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="江小白">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</label>
              <div class="col-sm-8">
                <select class="form-control">
                  <option value="">九折会员</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">充值金额</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="" placeholder="" value="">
              </div>
              <div class="col-sm-4">
                <select class="form-control">
                  <option value="">现金</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#vip-changeOk-templ">提交</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!-- 模态框-变更 -->
  <div class="modal fade" id="vip-change-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">管理变更</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">支付方式</label>
              <div class="col-sm-8">
                <select class="form-control">
                  <option value="">增加积分</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">变更数额</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="江小白">
              </div>
            </div>
            <div class="form-group">
              <label for="" class="col-sm-4 control-label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="" placeholder="" value="">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#vip-changeOk-templ">提交</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- 模态框-变更 -->

  <!-- 模态框-ok -->
  <div class="modal fade" id="vip-changeOk-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">提示</h4>
          </div>
          <div class="modal-body">
            <h2 class="text-center">变更成功！</h2>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">提交</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- 模态框-ok -->
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
