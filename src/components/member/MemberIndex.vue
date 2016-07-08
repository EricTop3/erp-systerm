<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：会员首页</li>
    </ol>
    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>会员卡号</label>
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group ml10">
          <label>会员姓名</label>
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group ml10">
          <label>会员手机号</label>
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group ml10">
          <label>会员生日</label>
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group ml10">
          <label>开卡点</label>
          <select class="form-control">
            <option>请选择</option>
            <option>水星店</option>
            <option>万达店</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>状态搜索</label>
          <select class="form-control">
            <option>停用</option>
            <option>启用</option>
          </select>
        </div>
        <button type="submit" class="btn btn-info ml10">搜索</button>
        <button type="submit" class="btn btn-warning">撤销搜索</button>
        <button type="submit" class="btn btn-primary" @click="creatMemberModal=true">新会员办理</button>
      </form>
    </div>
    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery" :operate="gridOperate">
      <div slot="operateList">
        <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#chongzhi-member-templ"
              @click="rechargeModal = true">充值</span>
        <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ" id="show-modal"
              @click="editModal = true">编辑</span>
        <a v-link="{ name: 'member', params: { memberId: memberId }}"><span
          class="btn btn-warning btn-sm">查看明细</span></a>
      </div>
    </grid>
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
  <!--创建会员弹窗-->
  <modal :show.sync="creatMemberModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新会员办理</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label for="carId" class="col-sm-4 control-label">会员卡号：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="carId" placeholder="">
            </div>
          </div>
          <div class="form-group">
            <label for="name" class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="name" placeholder="">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">手机号码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="手机号码为微商城登录账号！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="登录密码，请谨慎填写！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="请填写生日，如：06.01！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control">
                <option>九折会员</option>
                <option>八折会员</option>
                <option>七折会员</option>
                <option>五折会员</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">充值金额：</label>

            <div class="col-sm-8">
              <div class="form-inline">
                <input type="text" class="form-control" id="" placeholder="" style="width:104px;">
                <select class="form-control ml10">
                  <option>现金</option>
                  <option>支付宝</option>
                  <option>微信支付</option>
                  <option>POSE刷卡</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="creatMemberModal=false">关闭</button>
      <button type="button" class="btn btn-primary">保存</button>
    </div>
  </modal>
  <!--编辑弹窗-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close"></button>
      <h4 class="modal-title">会员编辑</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label for="carId" class="col-sm-4 control-label">会员卡号：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="carId" placeholder="">
            </div>
          </div>
          <div class="form-group">
            <label for="name" class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="name" placeholder="">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">手机号码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="手机号码为微商城登录账号！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="登录密码，请谨慎填写！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" id="" placeholder="请填写生日，如：06.01！">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control">
                <option>九折会员</option>
                <option>八折会员</option>
                <option>七折会员</option>
                <option>五折会员</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">充值金额：</label>

            <div class="col-sm-8">
              <div class="form-inline">
                <input type="text" class="form-control" id="" placeholder="" style="width:104px;">
                <select class="form-control ml10">
                  <option>现金</option>
                  <option>支付宝</option>
                  <option>微信支付</option>
                  <option>POSE刷卡</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="editModal=false">关闭</button>
      <button type="button" class="btn btn-primary">保存</button>
    </div>
  </modal>
  <!--充值弹窗-->
  <modal :show.sync="rechargeModal" :modal-size="rechargeModalSize">
    <div slot="header">
      <button type="button" class="close"></button>
      <h4 class="modal-title">会员充值</h4>
    </div>
    <div slot="body">
      <form action="" method="post" class="form-horizontal">
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">支付方式：</label>

          <div class="col-sm-8">
            <select class="form-control">
              <option>现金</option>
              <option>支付宝</option>
              <option>微信支付</option>
              <option>POSE刷卡</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">充值金额：</label>

          <div class="col-sm-8">
            <input type="text" class="form-control" id="">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="rechargeModal=false">关闭</button>
      <button type="button" class="btn btn-primary">保存</button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import {requestUrl} from '../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      Grid: Grid
    },
    ready: function () {
      this.$http({
        url: requestUrl + '/front-system/user',
        method: 'get',
        data: {
//          member_card: member_card
        }
      }).then(function (response) {
        this.page = response.data.body.pagination
        this.gridData = response.data.body.list
      }, function (err) {
        console.log(err)
      })
    },
    data: function () {
      return {
        createModalSize: 'modal-sm',
        rechargeModalSize: 'modal-sm',
        editModalSize: 'modal-sm',
        creatMemberModal: false,
        editModal: false,
        rechargeModal: false,
        searchQuery: '',
        gridOperate: true,
        gridData: [],
        gridColumns: {
          member_card: "会员卡号",
          balances: "余额",
          score: "积分",
          name: "姓名",
          phone: "手机号码",
          birthday: "生日",
          level: "等级",
          open_card_store: "开卡点"
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

