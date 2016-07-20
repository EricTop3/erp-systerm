<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-setting></left-setting>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">商品分类</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <span class="btn btn-info spanblocks fr" @click="createModal=true">新增分类</span>
          <div class="clearboth"></div>
        </div>

        <!-- 表格 -->
        <grid :data="list" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" @click="edit($event)">编辑</span>
            <span class="btn btn-warning btn-sm" @click="delete($event)">删除</span>
          </div>
        </grid>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page">
        </page>
      </div>
    </div>
  </div>

  <!--模态框-新增分类-->
  <modal :show.sync="createModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新增分类</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">序号</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="sort">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">分类</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="字数限制6字以内" v-model="display_name">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="createSubmit()">提交</button>
      <button type="button" class="btn btn-default" @click="createModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-编辑分类-->
  <div class="modal fade" id="category-edit-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">编辑分类</h4>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">序号</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="" value="1">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">分类</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="字数限制6字以内" value="咖啡豆">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <div class="modal fade" id="category-del-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">删除</h4>
        </div>
        <div class="modal-body">
          <h4>删除弹出框！</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
  <!--模态框HTML-->
</template>
<style>
</style>
<script>
  import AdminNav from '../AdminNav'
  import leftSetting from '../common/leftSetting'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import {requestUrl, token, searchRequest, exchangeData} from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      leftSetting: leftSetting,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
    },
    ready: function () {
//      获取列表
      this.$http({
        url: requestUrl + '/backend-system/product/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.list = response.body.list
        this.page = response.body.pagination
        console.log("mafgeiyan.")
      }, function (err) {
        console.log(err)
      })
    },
    methods: {
      edit: function () {
      },
      delete: function () {
      },
      createSubmit: function () {
        this.$http.post(
          requestUrl + '/backend-system/product/category',
          {
            display_name: this.display_name,
            sort: this.sort
          },
          {
            headers: {
              'X-Overpowered-Token': token
            }
          }
        ).then(function (response) {
          this.createModal = false

        }, function (err) {
          console.log(err)
        })

      }
    },
    data: function () {
      return {
        createModal: false,
        createModalSize: 'modal-sm',
        display_name: '',
        sort: '',
        list: [],
        page: [],
        gridOperate: true,
        gridColumns: {
          id: '序号',
          display_name: '一级分类'
        }
      }
    }
  }
</script>
