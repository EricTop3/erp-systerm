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
              @click="recharge($event)">充值</span>
        <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ" id="show-modal"
              @click="updateMember($event)">编辑</span>
        <a @click="checkDetail($event)"><span
          class="btn btn-warning btn-sm">查看明细</span></a>
      </div>
    </grid>
    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>
  <!--创建会员弹窗-->
  <modal :show.sync="creatMemberModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="creatMemberModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新会员办理</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">会员卡号：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员卡号" v-model="member_card">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="member_name">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">手机号码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="手机号码为微商城登录账号！" v-model="phone">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！" v-model="password">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="birthday">
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control" v-model="level">
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
                <input type="text" class="form-control" v-model="balance" placeholder="请输入充值金额！" style="width:104px;">
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
      <button type="button" class="btn btn-primary" @click="creatNewMember">保存</button>
    </div>
  </modal>

  <!--编辑弹窗-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="editModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">会员编辑</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">会员卡号：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="edit_member_card" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="edit_member_name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">手机号码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="手机号码为微商城登录账号！" v-model="edit_phone" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！" v-model="edit_password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="edit_birthday">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control" v-model="level">
                <option>九折会员</option>
                <option>八折会员</option>
                <option>七折会员</option>
                <option>五折会员</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div slot="footer" :data="formData">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="editModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="member_id" @click="saveUpdateMember($event)">保存</button>
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
          <label class="col-sm-4 control-label">支付方式：</label>

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
          <label class="col-sm-4 control-label">充值金额：</label>

          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="edit_balance">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="rechargeModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="rechargeId" @click="saveRecharge($event)">保存</button>
    </div>
  </modal>

</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import {requestUrl, token} from '../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      Grid: Grid
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.listData(currentpage)
      }
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
//    会员-列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/user',
          method: 'get',
          headers: {
            'X-Overpowered-Token': token
          },
          data: {
            page: page,
            per_page: 16
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.gridData = response.data.body.list
          $.each(this.gridData, function (index, value) {
            if (value.status == 'start') {
              this.status = '启用'
            } else {
              this.status = '停用'
            }
          })
        }, function (err) {
          console.log(err)
        })
      },
//      创建新会员
      creatNewMember: function () {
        this.$http.post(requestUrl + '/front-system/user', {
            member_card: this.member_card,
            name: this.member_name,
            phone: this.phone,
            birthday: this.birthday,
            balance: this.balance,
            password: this.password,
            level: this.level
          },
          {
            headers: {
              'X-Overpowered-Token': token
            }
          }).then(function (response) {

          this.$http({
            url: requestUrl + '/front-system/user',
            method: 'get',
            headers: {
              'X-Overpowered-Token': token
            }
          }).then(function (response) {
            this.listData(1)
          }, function (err) {
            console.log(err)
          })

          this.creatMemberModal = false

        }, function (err) {
          console.log(err)
        })
      },
//      编辑会员资料
      updateMember: function (event) {
//      弹出模态框
        this.editModal = true
//      编辑数据
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$http({
          url: requestUrl + '/front-system/user/' + id + '/detail',
          method: 'get',
          headers: {
            'X-Overpowered-Token': token
          }
        }).then(function (response) {
          this.formData = response.data.body.list[0]
          this.member_id = this.formData.id

          this.edit_member_card = this.formData.member_card
          this.edit_member_name = this.formData.name
          this.edit_phone = this.formData.phone
          this.edit_birthday = this.formData.birthday
          this.edit_level = this.formData.level
        }, function (err) {
          console.log(err)
        })
      },
//    保存修改的会员数据
      saveUpdateMember: function (event) {
        var id = Number($(event.currentTarget).attr('value'))
        this.$http.put(requestUrl + '/front-system/user/' + id, {
            name: this.edit_member_name,
            birthday: this.edit_birthday,
            level: this.edit_level,
            password: this.edit_password
//            status: this.edit_atatus
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Overpowered-Token': token
            }
          }).then(function (response) {
          this.listData(1)
          this.editModal = false
        }, function (err) {
          console.log(err)
        })
      },
//    充值金额
      recharge: function (event) {
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        this.rechargeId = id
        this.rechargeModal = true
      },
//    保存充值金额
      saveRecharge: function (event) {
        var id = Number($(event.currentTarget).attr('value'))
        this.$http.put(requestUrl + '/front-system/user/change-money/' + id, {
            money: this.edit_balance
          },
          {
            headers: {
              'X-Overpowered-Token': token
            }
          }).then(function (response) {
          this.listData(1)
          this.rechargeModal = false
        }, function (err) {
          console.log(err)
        })
      },
      checkDetail: function (event) {
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + id

      }
    },
    data: function () {
      return {
        detailUrl:'/#!/member/:memberId/detail?',
        rechargeId: '',
        member_id: '',
        member_card: '',
        member_name: '',
        phone: '',
        birthday: '',
        balance: '',
        password: '',
        level: '',
        edit_member_card: '',
        edit_member_name: '',
        edit_phone: '',
        edit_birthday: '',
        edit_balance: '',
        edit_password: '',
        edit_level: '',
        edit_atatus: '',
        page: [],
        createModalSize: 'modal-sm',
        rechargeModalSize: 'modal-sm',
        editModalSize: 'modal-sm',
        creatMemberModal: false,
        editModal: false,
        rechargeModal: false,
        searchQuery: '',
        gridOperate: true,
        gridData: [],
        formData: [],
        gridColumns: {
          member_card: "会员卡号",
          balance: "余额",
          score: "积分",
          name: "姓名",
          phone: "手机号码",
          birthday: "生日",
          level: "等级",
          open_card_store: "开卡点",
          status: "状态"
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

