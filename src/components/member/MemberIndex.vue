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
          <input type="text" class="form-control" placeholder="" v-model="query.member_card">
        </div>
        <div class="form-group ml10">
          <label>会员姓名</label>
          <input type="text" class="form-control" placeholder="" v-model="query.name">
        </div>
        <div class="form-group ml10">
          <label>会员手机号</label>
          <input type="text" class="form-control" placeholder="" v-model="query.phone">
        </div>
        <div class="form-group ml10">
          <label>会员生日</label>
          <date-picker :value.sync="query.birthday"></date-picker>
        </div>
        <div class="form-group ml10">
          <label>开卡点</label>
          <!--TODO 开卡点会通过记录动态获取，现在先写死-->
          <select class="form-control" v-model="query.store_id">
            <option value="1">水星</option>
            <option value="2">万达</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>状态搜索</label>
          <select class="form-control" v-model="query.status">
            <option value="start">启用</option>
            <option value="stop">停用</option>
          </select>
        </div>
        <span type="submit" class="btn btn-info ml10" @click="searchProduct">搜索</span>
        <span type="submit" class="btn btn-warning" @click="cancelSearchProduct">撤销搜索</span>
        <span type="submit" class="btn btn-primary" @click="creatMemberModal=true">新会员办理</span>
      </form>
    </div>
    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span :value="member_card" class="btn btn-primary btn-sm" data-toggle="modal"
              data-target="#chongzhi-member-templ"
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
        <!--TODO 表单各个填写项目的验证 <span style=" float: left; color: red; font-size: 12px; ">请输入正确的手机号码！</span>-->
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">会员卡号：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员卡号" v-model="member_card">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="member_name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">手机号码：</label>
            <div class="col-sm-8">
              <input id="new_phoneNum" type="text" class="form-control" placeholder="手机号码为微商城登录账号！" v-model="phone">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！" v-model="password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <date-picker :value.sync="birthday"></date-picker>
              <!--<input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="birthday">-->
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control" v-model="level">
                <!--<option selected>请选择会员等级</option>-->
                <option v-for="value in member_level_group" value="{{value.id}}" name="{{value.name}}">{{value.name}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">充值金额：</label>

            <div class="col-sm-8">
              <div class="form-inline">
                <input type="text" class="form-control" v-model="balance" placeholder="请输入充值金额！" style="width:104px;">
                <select class="form-control ml10" v-model="payment">
                  <option value="cash" selected>现金</option>
                  <option value="alipay">支付宝</option>
                  <option value="weixin">微信支付</option>
                  <option value="vip">会员支付</option>
                  <option value="post">POSE刷卡</option>
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
              <input type="text" class="form-control" v-model="formData.member_card" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">姓名：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="formData.name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">手机号码：</label>

            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="手机号码为微商城登录账号！" v-model="formData.phone" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">微商城密码：</label>

            <div class="col-sm-8">
              <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！" v-model="formData.password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">生 日：</label>

            <div class="col-sm-8">
              <!--<input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="formData.birthday">-->
              <date-picker :value.sync="formData.birthday"></date-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control" v-model="formData.level">
                <!--<option selected>请选择会员等级</option>-->
                <option v-for="value in member_level_group" value="{{value.id}}" name="{{value.name}}">{{value.name}}</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="editModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="formData.id" @click="saveUpdateMember($event)">保存</button>
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
            <select class="form-control" v-model="formData.payment">
              <option value="cash" selected>现金</option>
              <option value="alipay">支付宝</option>
              <option value="weixin">微信支付</option>
              <option value="vip">会员支付</option>
              <option value="post">POSE刷卡</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">充值金额：</label>

          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="formData.balance">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="rechargeModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="formData.id" @click="saveRecharge($event)">保存</button>
    </div>
  </modal>

</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import DatePicker from  '../common/DatePicker'
  import {requestUrl, token, searchRequest} from '../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      DatePicker: DatePicker,
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
            phone: this.query.phone || '',
            birthday: this.query.birthday || '',
            status: this.query.status || '',
            store_id: this.query.store_id || '',
            name: this.query.name || '',
            member_card: this.query.member_card || '',
            page: page,
            per_page: 16
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.gridData = response.data.body.list
          $.each(this.gridData, function (index, value) {
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
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
//    创建新会员
      creatNewMember: function () {

        this.$http.post(requestUrl + '/front-system/user', {
            member_card: this.member_card,
            name: this.member_name,
            phone: this.phone,
            birthday: this.birthday,
            balance: this.balance,
            password: this.password,
            level: this.level,
            payment: this.payment
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
          if (err.data.message == "无效的手机号码"){
            console.log(err.data.message)
            this.phone = err.data.message
          }
        })
      },
//    编辑会员资料
      updateMember: function (event) {
//      弹出模态框
        this.editModal = true
//      编辑数据
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        var card_number = $(event.currentTarget).parents('tr').find('td:first-child').text()
        var name = $(event.currentTarget).parents('tr').find('td:nth-child(4)').text()
        var phone = $(event.currentTarget).parents('tr').find('td:nth-child(5)').text()
        var birthday = $(event.currentTarget).parents('tr').find('td:nth-child(6)').text()
        var level = $(event.currentTarget).parents('tr').find('td:nth-child(7)').text()

        this.formData.id = id
        this.formData.member_card = card_number.replace(/(^\s*)|(\s*$)/g, '')
        this.formData.name = name.replace(/(^\s*)|(\s*$)/g, '')
        this.formData.phone = phone.replace(/(^\s*)|(\s*$)/g, '')
        this.formData.birthday = birthday.replace(/(^\s*)|(\s*$)/g, '')
        this.formData.level = level.replace(/(^\s*)|(\s*$)/g, '')
      },
//    保存修改的会员数据
      saveUpdateMember: function (event) {
        var id = this.formData.id
        this.$http.put(requestUrl + '/front-system/user/' + id, {
            name: this.formData.name,
            birthday: this.formData.birthday,
            level: this.formData.level,
            password: this.formData.password
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
        var card_number = $(event.currentTarget).parents('tr').find('td:first-child').text()
        this.formData.id = id
        this.formData.member_card = card_number.replace(/(^\s*)|(\s*$)/g, '')

        this.rechargeModal = true
      },
//    保存充值金额
      saveRecharge: function (event) {
        var id = Number($(event.currentTarget).attr('value'))
        this.$http.put(requestUrl + '/front-system/user/change-money/' + id, {
            money: this.formData.balance,
            payment: this.formData.payment,
            member_card: this.formData.member_card
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
//    查看明细
      checkDetail: function (event) {
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + id
      },
//    搜索
      searchProduct: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/user',
          {
            phone: this.query.phone || '',
            birthday: this.query.birthday || '',
            status: this.query.status || '',
            store_id: this.query.store_id || '',
            name: this.query.name || '',
            member_card: this.query.member_card || '',
          },
          function (response) {
            self.gridData = response.data.body.list
            self.page = response.data.body.pagination
            $.each(self.gridData, function (index, value) {
              value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
              if (value.status == 'start') {
                this.status = '启用'
              } else {
                this.status = '停用'
              }
            })
            self.query.phone = '',
            self.query.birthday = '',
            self.query.status = '',
            self.query.store_id = '',
            self.query.name = '',
            self.query.member_card = ''
          })
      },
//    取消搜索
      cancelSearchProduct: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/user',
          {
            phone: '',
            birthday: '',
            status: '',
            open_card_store: '',
            name: '',
            member_card: ''
          },
          function (response) {
            self.gridData = response.data.body.list
            self.page = response.data.body.pagination
            $.each(self.gridData, function (index, value) {
              value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
              if (value.status == 'start') {
                this.status = '启用'
              } else {
                this.status = '停用'
              }
            })
          })
      }
    },
    data: function () {
      return {
        detailUrl: '/#!/member/',
        member_level_group: [],
        member_card: '',
        member_name: '',
        phone: '',
        birthday: '',
        balance: '',
        password: '',
        level: '',
        payment: '',
        page: [],
        createModalSize: 'modal-sm',
        rechargeModalSize: 'modal-sm',
        editModalSize: 'modal-sm',
        creatMemberModal: false,
        editModal: false,
        rechargeModal: false,
        gridOperate: true,
        gridData: [],
        formData: {
          id: '',
          name: '',
          birthday: '',
          password: '',
          level: '',
          status: '',
          phone: '',
          member_card: '',
          payment: ''
        },
        gridColumns: {
          member_card: "会员卡号",
          balance: "余额",
          score: "积分",
          name: "姓名",
          phone: "手机号码",
          birthday: "生日",
          level: "等级",
          store_id: "开卡点",
          status: "状态"
        },
        query: {
          phone: '',
          birthday: '',
          status: '',
          store_id: '',
          name: '',
          member_card: ''
        }
      }
    },
    compiled: function () {
//    新增会员获取会员等级
      this.$http({
        url: requestUrl + '/front-system/user/level',
        method: 'get',
        headers: {'X-Overpowered-Token': token}
      }).then(function (response) {
        this.member_level_group = response.data.body
      }, function (err) {
        console.log(err)
      })
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .calendar{
    z-index: 1;
  }
</style>

