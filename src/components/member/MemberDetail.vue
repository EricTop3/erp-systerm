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
          console.log(this.memberData)

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
      //    编辑会员资料
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
        rechargeModalSize: 'modal-sm',
        editModalSize: 'modal-sm',
        editModal: false,
        rechargeModal: false,
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

