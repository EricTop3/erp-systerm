<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：会员首页</li>
      <li class="active">会员明细</li>
    </ol>

    <table class="table table-striped table-bordered table-hover" :data="memberData">
      <thead>
      <tr class="text-center">
        <th v-for="value in memberColumns">
          {{value}}
        </th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" id="{{memberData.id}}">
        <td>{{memberData.card_number}}</td>
        <td>{{memberData.balance}}</td>
        <td>{{memberData.score}}</td>
        <td>{{memberData.name}}</td>
        <td>{{memberData.mobile_phone}}</td>
        <td>{{memberData.birthday}}</td>
        <td>{{memberData.member_type}}</td>
        <td>{{memberData.register_store_name}}</td>
        <td>
            <span class="btn btn-primary btn-sm" @click="recharge($event)">充值</span>
            <span class="btn btn-info btn-sm" @click="updateMember($event)">编辑</span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :operate="gridOperate"></grid>
    <!-- 翻页 -->
    <page
      :total='page.total'
      :current.sync='page.current_page'
      :display='page.per_page'
      :last-page='page.last_page' >
    </page>
  </div>

  <!--编辑弹窗-->
  <modal :show.sync="modal.editModal" :modal-size="modal.editModalSize">
    <div slot="header">
      <button type="button" class="close" @click="modal.editModal = false"><span>&times;</span></button>
      <h4 class="modal-title">会员编辑</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <validator name="validationEditMember">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-4 control-label">会员卡号：</label>
              <div class="col-sm-8">
                <span style="display: inline-block; margin-top: 8px;">{{edit.member_card}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">姓名：</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="edit.name">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">手机号码：</label>
              <div class="col-sm-8">
                <span style="display: inline-block; margin-top: 8px;">{{edit.phone}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">微商城密码：</label>
              <div class="col-sm-8">
                <input type="password" class="form-control" v-model="edit.password">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">生 日：</label>
              <div class="col-sm-8">
                <date-picker :value.sync="edit.birthday"></date-picker>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">等 级：</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="edit.level" v-validate:level="{required: true}">
                  <option value="" selected>请选择</option>
                  <option v-for="item in member_level_group" value="{{item.id}}">{{item.display_name}}</option>
                </select>
                <span v-if="$validationEditMember.level.touched">
                  <span v-if="$validationEditMember.level.required" class="errT">请选择会员等级！</span>
                </span>
              </div>
            </div>
          </form>
        </validator>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" @click="modal.editModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="edit.id" @click="verifyEditMember($event)">保存</button>
    </div>
  </modal>

  <!--充值弹窗-->
  <modal :show.sync="modal.rechargeModal" :modal-size="modal.rechargeModalSize">
    <div slot="header">
      <button type="button" class="close"><span>&times;</span></button>
      <h4 class="modal-title">会员充值</h4>
    </div>
    <div slot="body">
      <validator name="validationRecharge">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">支付方式：</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="edit.payment">
                <option value="cash" selected>现金</option>
                <option value="alipay">支付宝</option>
                <option value="weixin">微信支付</option>
                <option value="post">POSE刷卡</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">充值金额：</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="edit.balance" @input="priceValidate">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">交易单号：</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="如果有请输入交易单号" v-model="edit.trade_number">
              <span v-if="hasTN" class="errT">请输入交易单号！</span>
            </div>
          </div>
        </form>
      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" @click="modal.rechargeModal = false">关闭</button>
      <button type="button" class="btn btn-primary" :value="edit.id" @click="verifyRecharge($event)">保存</button>
    </div>
  </modal>

</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Modal from '../../common/Modal'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import DatePicker from  '../../common/DatePicker'
  import {
    requestSystemUrl,
    token,
    getDataFromSiteApi,
    postSiteDataToApi,
    putDataToApi,
    error } from '../../../publicFunction/index'
  export default {
    components: {
      Modal: Modal,
      Page: Page,
      DatePicker: DatePicker,
      Grid: Grid,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        var id = self.$route.params.queryId

        this.$http({
          url: requestSystemUrl + '/front-system/member/member/' + id,
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.gridData = response.data.body.list

          $.each(self.gridData, function (index, value) {
            value.balance_change = Number(Number(value.balance_change) * 0.01).toFixed(2)
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
          })

        }, function (err) {
          console.log(err)
        })
      }
    },
    ready: function () {
//    会员详情-列表渲染
      this.listData()
    },
    methods: {
//    数据渲染
      listData: function () {
        var self = this
        var id = self.$route.params.queryId
        var url = requestSystemUrl + '/front-system/member/member/' + id
        getDataFromSiteApi(url, {}, function (response) {
//          单条
          self.memberData = response.data.body.data
          self.memberData.balance = Number(Number(self.memberData.balance) * 0.01).toFixed(2)

//          列表
          self.page = response.data.body.pagination
          self.gridData = response.data.body.list

          $.each(self.gridData, function (index, value) {
            value.balance_change = Number(Number(value.balance_change) * 0.01).toFixed(2)
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
          })
        })
      },
//    编辑会员资料
      updateMember: function (event) {
//      弹出模态框
        this.modal.editModal = true
//      编辑数据
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        var card_number = $(event.currentTarget).parents('tr').find('td:first-child').text()
        var name = $(event.currentTarget).parents('tr').find('td:nth-child(4)').text()
        var phone = $(event.currentTarget).parents('tr').find('td:nth-child(5)').text()
        var birthday = $(event.currentTarget).parents('tr').find('td:nth-child(6)').text()
        var level = $(event.currentTarget).parents('tr').find('td:nth-child(7)').text()

        this.edit.id = id
        this.edit.member_card = card_number.replace(/(^\s*)|(\s*$)/g, '')
        this.edit.name = name.replace(/(^\s*)|(\s*$)/g, '')
        this.edit.phone = phone.replace(/(^\s*)|(\s*$)/g, '')
        this.edit.birthday = birthday.replace(/(^\s*)|(\s*$)/g, '')
        var self = this
        $.each(self.member_level_group, function (index, val) {
          if (level.replace(/(^\s*)|(\s*$)/g, '') == val.display_name) {
            self.edit.level = val.id
          }
        })
      },
//    保存修改的会员数据
      saveUpdateMember: function (event) {
        var self = this
        var id = self.edit.id

        var url = requestSystemUrl + '/front-system/member/member/' + id
        var data = {
          name: self.edit.name,
          birthday: self.edit.birthday,
          level: self.edit.level,
          password: self.edit.password
        }
        putDataToApi(url, data, function (response) {
          self.modal.editModal = false
//    会员详情-列表渲染
          self.listData()
        })
      },
//    编辑会员的验证
      verifyEditMember: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validationEditMember.invalid) {
            self.$validationEditMember.level.touched = true
            e.preventDefault()
          } else {
            self.saveUpdateMember(e)
          }
        })
      },
//    充值金额
      recharge: function (event) {
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        var card_number = $(event.currentTarget).parents('tr').find('td:first-child').text()

        this.edit.id = id
        this.edit.member_card = card_number.replace(/(^\s*)|(\s*$)/g, '')

        this.modal.rechargeModal = true
      },
//    保存充值金额
      saveRecharge: function (event) {
        var self = this
        var id = self.edit.id
        var url = requestSystemUrl + '/front-system/member/member/' + id + '/recharge'
        var data = {
          money: self.edit.balance,
          payment: self.edit.payment,
          member_card: self.edit.member_card,
          trade_number: self.edit.trade_number
        }
        if (self.edit.payment == 'cash') {
          self.hasTN = false
          putDataToApi(url, data, function (response) {
            self.modal.rechargeModal = false
//    会员详情-列表渲染
            self.listData()
          })
        } else {
//          判断是否填写交易单号
          if (!self.edit.trade_number) {
            self.hasTN = true
          } else {
            putDataToApi(url, data, function (response) {
              self.modal.rechargeModal = false
//    会员详情-列表渲染
              self.listData()
            })
          }
        }
      },
//    充值金额的验证
      verifyRecharge: function (e) {
        var self = this
        self.$validate(function () {
          if (self.$validationRecharge.invalid) {
            e.preventDefault()
          } else {
            self.saveRecharge(e)
          }
        })
      },
//    金额正则
      priceValidate: function () {
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (!re.test(this.edit.balance)) {
          this.edit.balance =  ''
        }
      }
    },
    data: function () {
      return {
        hasTN: false,
//        弹窗
        modal: {
          rechargeModalSize: 'modal-sm',
          editModalSize: 'modal-sm',
          editModal: false,
          rechargeModal: false,
        },
//        编辑、充值
        edit: {
          member_card: '',
          name: '',
          phone: '',
          password: '',
          birthday: '',
          level: '',
          id: '',
          payment: '',
          balance: '',
          status: '',
          trade_number: ''
        },
        member_level_group: [],
        page: [],
        gridData: [],
        gridColumns: {
          point_type: "操作类型",
          balance_change: "余额变更",
          score_change: "积分变更",
          balance: "最新余额",
          score: "最新积分",
          created_at: "操作时间",
          note: "备注"
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
      var self = this
//    新增会员获取会员等级
      var url = requestSystemUrl + '/front-system/coupon'
      getDataFromSiteApi(url, {}, function (response) {
        self.member_level_group = response.data.body.list
      })
    }
  }
</script>
<style scoped>
  h1 {
    color: #42b983;
  }
  .errT{
    float: left;
    color: red;
    font-size: 12px;
  }
</style>

