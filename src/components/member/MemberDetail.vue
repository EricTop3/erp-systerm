<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：会员首页</li>
      <li class="active">会员明细</li>
    </ol>

    <!-- 表格 -->
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <td class="text-left">会员卡号</td>
        <td>余额</td>
        <td>积分</td>
        <td>姓名</td>
        <td>手机号码</td>
        <td>生日</td>
        <td>等级</td>
        <td>开卡点</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td class="text-left">05238</td>
        <td>￥1000.00</td>
        <td>1000</td>
        <td>江小白</td>
        <td>18523565656</td>
        <td>06.01</td>
        <td>九折会员</td>
        <td>水星店</td>
        <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#chongzhi-member-templ">充值</span>
          <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ">编辑</span>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 表格 -->
    <grid :data="memberData" :columns="memberColumns" :filter-key="searchQuery" :operate="memberOperate">
      <div slot="operateList">
        <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#chongzhi-member-templ">充值</span>
        <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#edit-member-templ">编辑</span>
      </div>
    </grid>

    <!-- 表格 -->
    <grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery" :operate="gridOperate"></grid>
    <!-- 翻页 -->
    <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
          :last-page='page.last_page'></page>
  </div>
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
//    会员详情-列表数据渲染
      listData: function (page) {
        var idstr = window.location.href
        var idIdx = idstr.indexOf('?')
        var id = idstr.substring(idIdx + 1)
        console.log(id)
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
          this.memberData = response.data.body.list
          var a = []
          a.push(this.memberData[0])
          console.log(a)
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
    },
    data: function () {
      return {
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
          new_money: "余额",
          new_score: "积分",
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

