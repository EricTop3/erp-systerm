<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
     <left-setting></left-setting>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">商品设置</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>商品分类</label>
              <select class="form-control" v-model="">
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>销售状态</label>
              <select class="form-control" v-model="">
                <option value="0">下架中</option>
                <option value="1">上架中</option>
                <option value="2">非卖品</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品属性</label>
              <select class="form-control" v-model="">
                <option value="1">工厂产成品</option>
                <option value="2">委外产成品</option>
                <option value="3">门店产成品</option>
                <option value="4">原材料</option>
                <option value="5">套餐</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control" v-model="">
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="">
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" placeholder="">
            </div>
            <button class="btn btn-primary">搜索</button>
            <span class="btn btn-warning">撤销搜索</span>
            <a v-link="{ path: '/admin/setting/createNew'}"><span class="btn btn-info spanblocks fr">新建商品</span></a>
          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">编号</td>
            <td>品名</td>
            <td>货号</td>
            <td>零售价</td>
            <td>采购价</td>
            <td>规格单位</td>
            <td>分类</td>
            <td>商品属性</td>
            <td>价格属性</td>
            <td>销售状态</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center">
            <td class="text-left">1652254556</td>
            <td>伊利牛奶</td>
            <td>15555221</td>
            <td>￥20.00/盒</td>
            <td>无</td>
            <td>1箱*24盒*250ml</td>
            <td>牛奶</td>
            <td>工厂产成品</td>
            <td>特价商品</td>
            <td>上架中</td>
            <td>
              <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#set-price-templ">价格波动</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" @click="edit($event)">编辑</span>
              <span class="btn btn-default btn-sm" data-toggle="modal" data-target="#set-del-templ">删除</span>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- 翻页 -->
        <page v-if="page.total>0" :total='page.total' :current.sync='page.current_page' :display='page.per_page'
              :last-page='page.last_page'></page>
      </div>
    </div>
  </div>

  <!--模态框-历史价格波动-->
  <div class="modal fade" id="set-price-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form action="" method="post" class="form-horizontal">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">历史价格波动</h4>
          </div>
          <div class="modal-body">
            <!-- 表格 -->
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr class="text-center">
                <td class="text-left">修改日期</td>
                <td>历史零售单价</td>
                <td>历史采购单价</td>
                <td>编辑人</td>
              </tr>
              </thead>
              <tbody>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              <tr class="text-center">
                <td class="text-left">2015-05-12 18:00:00</td>
                <td>￥20.00</td>
                <td>￥20.00</td>
                <td>admin</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <div class="modal fade" id="set-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">删除</h4>
        </div>
        <div class="modal-body">
          <h4>确认删除？</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import {requestUrl, token, searchRequest} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      LeftSetting: LeftSetting
    },
    ready: function () {
//      获取商品分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        console.log(err)
      })
    },
    methods: {
//      编辑
      edit: function () {

      }
    },
    data: function () {
      return {
        page: [],
      category: ''
      }
    }
  }
</script>
