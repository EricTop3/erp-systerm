<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：会员首页</li>
      <li class="active">会员明细</li>
    </ol>

    <!-- 表格 -->
    <grid :data="memberData" :columns="memberColumns" :operate="memberOperate">
      <div slot="operateList">
        <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#chongzhi-member-templ"
              @click="recharge($event)">充值</span>
        <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ" id="show-modal"
              @click="updateMember($event)">编辑</span>
      </div>
    </grid>

    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :operate="gridOperate"></grid>
    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>

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
              <date-picker :value.sync="formData.birthday"></date-picker>
              <!--<input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="formData.birthday">-->
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">等 级：</label>

            <div class="col-sm-8">
              <select class="form-control" v-model="formData.level">
                <option selected>请选择会员等级</option>
                <option v-for="value in member_level_group">{{value.name}}</option>
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
  import {requestUrl, token} from '../../publicFunction/index'
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
//    会员详情-列表渲染
      this.listData(1)
//    单条数据渲染
      this.thisOneData()
    },
    methods: {
//    单条数据渲染
      thisOneData: function () {
        var str = window.location.href
        var num = str.indexOf('member') + 7
        var id = str.substr(num)
        console.log(id)
        this.$http({
          url: requestUrl + '/front-system/user/' + id,
          method: 'get',
          headers: {
            'X-Overpowered-Token': token
          }
        }).then(function (response) {
          this.memberData = response.data.body
          $.each(this.memberData, function (index, value) {
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
          })

        }, function (err) {
          console.log(err)
        })
      },
//    会员详情-列表数据渲染
      listData: function (page) {
        var str = window.location.href
        var num = str.indexOf('member') + 7
        var id = str.substr(num)
        this.$http({
          url: requestUrl + '/front-system/user/' + id + '/detail',
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
            value.new_money = Number(Number(value.new_money) * 0.01).toFixed(2)
          })

        }, function (err) {
          console.log(err)
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
        var id = Number($(event.currentTarget).attr('value'))
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
//    会员详情-列表渲染
          this.listData(1)
//    单条数据渲染
          this.thisOneData()

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
//    会员详情-列表渲染
          this.listData(1)
//    单条数据渲染
          this.thisOneData()

          this.rechargeModal = false
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        member_level_group: [],
        rechargeModalSize: 'modal-sm',
        editModalSize: 'modal-sm',
        editModal: false,
        rechargeModal: false,
        member_card: '',
        member_name: '',
        phone: '',
        birthday: '',
        balance: '',
        password: '',
        level: '',
        payment: '',
        page: [],
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
        gridData: [],
        gridColumns: {
          operation_type: "操作类型",
          money_change: "余额变更",
          score_change: "积分变更",
          new_money: "最新余额",
          new_score: "最新积分",
          updated_at: "操作时间",
          created_at: "备注"
        },
        memberOperate: true,
        memberData: [],
        memberColumns: {
          member_card: "会员卡号",
          balance: "余额",
          score: "积分",
          name: "姓名",
          phone: "手机号码",
          birthday: "生日",
          level: "等级",
          open_card_store: "开卡点"
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
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

