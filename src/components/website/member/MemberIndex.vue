<template>
  <site-nav></site-nav>
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
          <input type="text" class="form-control" placeholder="请输入会员卡号" v-model="search.card_number">
        </div>
        <div class="form-group ml10">
          <label>会员姓名</label>
          <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="search.name">
        </div>
        <div class="form-group ml10">
          <label>会员手机号</label>
          <input type="text" class="form-control" placeholder="请输入手机号码" v-model="search.phone">
        </div>
        <div class="form-group ml10">
          <label>会员生日</label>
          <date-picker :value.sync="search.birthday" :time-text=timetext></date-picker>
        </div>
        <div class="form-group ml10">
          <label>开卡点</label>
          <select class="form-control" v-model="search.store_id">
            <option value="">请选择</option>
            <option v-for="item in warehouseList" value="{{item.id}}">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>状态搜索</label>
          <select class="form-control" v-model="search.status">
            <option value="">请选择</option>
            <option value="1">启用</option>
            <option value="0">停用</option>
          </select>
        </div>
        <span class="btn btn-info ml10" @click="searchProduct">搜索</span>
        <span class="btn btn-warning" @click="cancelSearchProduct">撤销搜索</span>
        <span class="btn btn-primary" @click="modal.creatMemberModal = true">新会员办理</span>
      </form>
    </div>

    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :operate="gridOperate">
      <div slot="operateList">
        <span :value="member_card" class="btn btn-primary btn-sm" @click="recharge($event)">充值</span>
        <span class="btn btn-info btn-sm" @click="updateMember($event)">编辑</span>
        <span class="btn btn-warning btn-sm" @click="checkDetail($event)">查看明细</span>
      </div>
    </grid>

    <!-- 翻页 -->
    <page
      :total='page.total'
      :current.sync='page.current_page'
      :display='page.per_page'
      :last-page='page.last_page' v-if="page.total > 0">
    </page>
  </div>
  <!--创建会员弹窗-->
  <modal :show.sync="modal.creatMemberModal" :modal-size="modal.createModalSize">
    <div slot="header">
      <button type="button" class="close" @click="modal.creatMemberModal=false" ><span>&times;</span></button>
      <h4 class="modal-title">新会员办理</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <validator name="validationNewMember">
          <form class="form-horizontal" >
              <div class="form-group">
                <label class="col-sm-4 control-label">会员卡号：</label>
                <div class="col-sm-8">
                  <!--只能输入数字 number: /^[0-9]+$/-->
                  <input type="text" class="form-control" placeholder="请输入会员卡号" onkeyup="value=this.value.replace(/[^\d]/g,'')" v-model="create.member_card" v-validate:member_card="{required: true,minlength: 8,maxlength: 8}">
                  <span v-if="$validationNewMember.member_card.touched">
                    <span v-if="$validationNewMember.member_card.minlength" class="errT">会员卡号只能是8位有效数字！</span>
                    <span v-if="$validationNewMember.member_card.maxlength" class="errT">会员卡号只能是8位有效数字！</span>
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">姓名：</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" placeholder="请输入会员姓名" v-model="create.name" v-validate:name="{required: true}">
                  <span v-if="$validationNewMember.name.touched">
                    <span v-if="$validationNewMember.name.required" class="errT">请输入会员姓名！</span>
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">手机号码：</label>
                <div class="col-sm-8">
                  <input id="new_phoneNum" type="text" class="form-control" placeholder="手机号码为微商城登录账号！" v-model="create.phone" v-validate:phone="{required: true,minlength: 11,maxlength: 11}">
                  <span v-if="$validationNewMember.phone.touched">
                    <span v-if="$validationNewMember.phone.minlength" class="errT">请输入正确的手机号码！</span>
                    <span v-if="$validationNewMember.phone.maxlength" class="errT">请输入正确的手机号码！</span>
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">微商城密码：</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" v-model="create.password">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">生 日：</label>
                <div class="col-sm-8">
                  <date-picker :value.sync="create.birthday"></date-picker>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">等 级：</label>
                <div class="col-sm-8">
                  <select class="form-control" v-model="create.level" v-validate:level="{required: true}">
                    <option value="">请选择</option>
                    <option value="{{member_level_group.id}}">{{member_level_group.display_name}}</option>
                  </select>
                  <span v-if="$validationNewMember.level.touched">
                    <span v-if="$validationNewMember.level.required" class="errT">请选择会员等级！</span>
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">充值金额：</label>
                <div class="col-sm-8">
                  <div class="form-inline">
                    <input type="text" class="form-control" v-model="create.balance" style="width:104px;" @input="priceValidate">
                    <select class="form-control fr" v-model="create.payment">
                      <option value="cash" selected>现金</option>
                      <option value="alipay">支付宝</option>
                      <option value="weixin">微信支付</option>
                      <option value="pos">POSE刷卡</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">交易单号：</label>
                <div class="col-sm-8">
                  <input  type="text" class="form-control" placeholder="请输入交易单号" v-model="create.trade_number">
                  <!--<span v-if="create.payment != 'cash'">-->
                    <!--<span v-if="$validationNewMember.trade_number.touched" class="errT">-->
                  <span v-if="hasTN" class="errT">如果有请输入交易单号！</span>
                    <!--</span>-->
                  <!--</span>-->
                  <!--<input v-if="create.payment == 'cash'" type="text" class="form-control" v-model="create.trade_number" disabled>-->
                  <!--<input v-else type="text" class="form-control" v-model="create.trade_number" v-validate:trade_number="{required: true}">-->
                </div>
              </div>
            </form>
        </validator>
        <span v-if="errData.iserr" class="errT">{{errData.date}}</span>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" @click="modal.creatMemberModal=false">关闭</button>
      <button type="button" class="btn btn-primary" @click="verifyNewMember($event)">保存</button>
    </div>
  </modal>

  <!--编辑弹窗-->
  <modal :show.sync="modal.editModal" :modal-size="modal.editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="modal.editModal=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">会员编辑</h4>
    </div>
    <div slot="body">
      <div class="modal-body">
        <validator name="validationEditMember">
        <form action="" method="post" class="form-horizontal">
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
              <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！" v-model="edit.password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">生 日：</label>
            <div class="col-sm-8">
              <!--<input type="text" class="form-control" placeholder="请填写生日，如：06.01！" v-model="edit.birthday">-->
              <date-picker :value.sync="edit.birthday"></date-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">等 级：</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="edit.level" v-validate:level="{required: true}" disabled>
                <option>{{edit.level}}</option>
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
      <span class="btn btn-default" data-dismiss="modal" @click="modal.editModal=false">关闭</span>
      <span class="btn btn-primary" :value="edit.id" @click="verifyEditMember($event)">保存</span>
    </div>
  </modal>

  <!--充值弹窗-->
  <modal :show.sync="modal.rechargeModal" :modal-size="modal.rechargeModalSize">
    <div slot="header">
      <button type="button" class="close"></button>
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
              <option value="pos">POS刷卡</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">充值金额：</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="edit.balance" @input="priceValidate" v-validate:money="{required: true}">
            <div v-if="$validationRecharge.money.touched">
              <p class="error" v-if="$validationRecharge.money.required">充值金额不能为空</p>
            </div>
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
      <button type="button" class="btn btn-default" @click="modal.rechargeModal=false">关闭</button>
      <button type="button" class="btn btn-primary" :value="edit.id" @click="verifyRecharge($event)">保存</button>
    </div>
  </modal>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Modal from '../../common/Modal'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
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
      ErrorTip: ErrorTip,
      DatePicker: DatePicker,
      Grid: Grid,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url: requestSystemUrl + '/front-system/member/member',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.gridData = response.data.body.list
          self.page = response.data.body.pagination

          $.each(self.gridData, function (index, value) {
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
            if (value.status == 1) {
              value.status = '启用'
            } else {
              value.status = '停用'
            }
          })
        }, function (err) {
          console.log(err)
        })
      }
    },
    ready: function () {
      var self = this
//      获取开卡点
      var url = requestSystemUrl + '/front-system/store'
      getDataFromSiteApi(url,{},function (response) {
        self.warehouseList = response.data.body.list
      })
      this.listData({})
    },
    methods: {
//    会员-列表数据渲染
      listData: function (data) {
        var self = this
        var url = requestSystemUrl + '/front-system/member/member'
        getDataFromSiteApi(url, data, function (response) {
          self.gridData = response.data.body.list
          self.page = response.data.body.pagination
          $.each(self.gridData, function (index, value) {
            value.balance = Number(Number(value.balance) * 0.01).toFixed(2)
            if (value.status == 1) {
              value.status = '启用'
            } else {
              value.status = '停用'
            }
          })
        })
      },
//    创建新会员
      creatNewMember: function () {
        var self = this
        var url = requestSystemUrl + '/front-system/member/member'
        var data = {
          member_card: self.create.member_card,
          name: self.create.name,
          phone: self.create.phone,
          birthday: self.create.birthday,
          level: self.create.level,
          balance: self.create.balance,
          password: self.create.password,
          payment: self.create.payment,
          trade_number: self.create.trade_number
        }
//        判断交易方式
        if (self.create.payment == 'cash') {
          self.hasTN = false
          postSiteDataToApi(url, data, function (response) {
            self.modal.creatMemberModal = false
            self.listData({})
          },function (err) {
            if (err.data.code == 200017){
              self.errData.date = '该会员卡或者手机已经注册'
              self.errData.iserr = true

            }
          })
        } else {
//          判断是否填写交易单号
          if (!self.create.trade_number) {
            self.hasTN = true
          } else {
            postSiteDataToApi(url, data, function (response) {
              self.modal.creatMemberModal = false
              self.listData({})
            },function (err) {
              if (err.data.code == 200017){
                self.errData.date = '该会员卡或者手机已经注册'
                self.errData.iserr = true
              }
            })
          }
        }
      },
//    创建新会员验证
      verifyNewMember: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validationNewMember.invalid) {
            self.$validationNewMember.member_card.touched = true
            self.$validationNewMember.name.touched = true
            self.$validationNewMember.phone.touched = true
            self.$validationNewMember.level.touched = true
            e.preventDefault()
          } else {
            self.creatNewMember()
          }
        })
      },
//    金额正则
      priceValidate: function () {
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        if (!re.test(this.create.balance)) {
          this.create.balance =  ''
        }
      },
//    编辑会员资料
      updateMember: function (event) {
        var self = this
//      弹出模态框
        self.modal.editModal = true
//      编辑数据
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        var card_number = $(event.currentTarget).parents('tr').find('td:first-child').text()
        var name = $(event.currentTarget).parents('tr').find('td:nth-child(4)').text()
        var phone = $(event.currentTarget).parents('tr').find('td:nth-child(5)').text()
        var birthday = $(event.currentTarget).parents('tr').find('td:nth-child(6)').text()
        var level = $(event.currentTarget).parents('tr').find('td:nth-child(7)').text()

        self.edit.id = id
        self.edit.member_card = card_number.replace(/(^\s*)|(\s*$)/g, '')
        self.edit.name = name.replace(/(^\s*)|(\s*$)/g, '')
        self.edit.phone = phone.replace(/(^\s*)|(\s*$)/g, '')
        self.edit.birthday = birthday.replace(/(^\s*)|(\s*$)/g, '')
        self.edit.level = level.replace(/(^\s*)|(\s*$)/g, '')
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
//    保存修改的会员数据
      saveUpdateMember: function (event) {
        var id = this.edit.id
        var self = this
        var url = requestSystemUrl + '/front-system/member/member/' + id
        var data = {
          name: self.edit.name,
          birthday: self.edit.birthday,
          level: self.edit.level,
          password: self.edit.password
        }
        putDataToApi(url, data, function (response) {
          self.listData({})
          self.modal.editModal = false
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
//      充值金额的验证
      verifyRecharge: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validationRecharge.invalid) {
            self.$validationRecharge.money.touched = true
            e.preventDefault()
          } else {
            self.saveRecharge(e)
          }
        })
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
            self.listData({})
            self.modal.rechargeModal = false
            self.edit.trade_number = ''
            self.edit.balance = ''
          },function(err){
            if(err.data.code == '200016'){
              self.modal.rechargeModal = false
              self.modal.errModal = true
              self.modal.errInfo = '已结算，不能进行充值'
            }
          })
        } else {
//          判断是否填写交易单号
          if (!self.edit.trade_number) {
            self.hasTN = true
          } else {
            putDataToApi(url, data, function (response) {
              self.listData({})
              self.modal.rechargeModal = false
              self.edit.trade_number = ''
              self.edit.balance = ''
            })
          }
        }
      },
//    查看明细
      checkDetail: function (event) {
        var id = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = this.detailUrl + id
      },
//    搜索
      searchProduct: function () {
        var self = this
        var data = {
          card_number: self.search.card_number || '',
          name: self.search.name || '',
          phone: self.search.phone || '',
          birthday: self.search.birthday || '',
          store_id: self.search.store_id || '',
          status: self.search.status || ''
        }
        self.listData(data)
      },
//    取消搜索
      cancelSearchProduct: function () {
        var self = this
        self.search.card_number = ''
        self.search.name = ''
        self.search.phone = ''
        self.search.birthday = ''
        self.search.store_id = ''
        self.search.status = ''
        self.listData({})
      }
    },
    computed: {},
    data: function () {
      return {
        timetext: '请选择日期',
        hasTN: false,
        errData: {
          date: '',
          iserr: false
        },
        detailUrl: '/#!/site/member/',
        page: [],
        warehouseList: [],
        modal: {
          createModalSize: 'modal-sm',
          rechargeModalSize: 'modal-sm',
          editModalSize: 'modal-sm',
          creatMemberModal: false,
          editModal: false,
          rechargeModal: false,
          errModal: false,
          errInfo: ''
        },
        member_level_group: [],
//        创建新会员
        create: {
          member_card: '',
          name: '',
          phone: '',
          birthday: '',
          level: '',
          balance: '',
          password: '',
          payment: '',
          trade_number: ''
        },
//        编辑会员、充值金额
        edit: {
          id: '',
          name: '',
          birthday: '',
          password: '',
          level: '',
          status: '',
          phone: '',
          member_card: '',
          payment: '',
          trade_number: ''
        },
        gridOperate: true,
        gridData: [],
        gridColumns: {
          card_number: "会员卡号",
          balance: "余额",
          score: "积分",
          name: "姓名",
          mobile_phone: "手机号码",
          birthday: "生日",
          member_type: "等级",
          register_store_name: "开卡点",
          status: "状态"
        },
//        搜索
        search: {
          card_number: '',
          name: '',
          phone: '',
          birthday: '',
          store_id: '',
          status: ''
        }
      }
    },
    compiled: function () {
      var self = this
//    新增会员获取会员等级
      var url = requestSystemUrl + '/front-system/coupon'
      getDataFromSiteApi(url, {}, function (response) {
        self.member_level_group = response.data.body
      })
    }
  }
</script>
<style>
  .calendar{
    z-index: 1;
  }
  .error { color:red}
  .errT{
    float: left;
    color: red;
    font-size: 12px;
  }
</style>

