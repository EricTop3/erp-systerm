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
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
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
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="createModal=false"><span
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
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">编辑分类</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">序号</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="formData.sort">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">分类</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="字数限制6字以内" v-model="formData.display_name">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmEdit()">保存</button>
      <button type="button" class="btn btn-default" @click="editModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-删除-->
  <modal :show.sync="deleteModal" :modal-size="deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="deleteModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4>确认删除该分类吗？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmDelete()">确定</button>
      <button type="button" class="btn btn-default" @click="deleteModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->
</template>

<script>
  import $ from 'jquery'
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
      this.getlistdata()
    },
    methods: {
//      获取列表
      getlistdata: function () {
        this.$http({
          url: requestUrl + '/backend-system/product/category',
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.listdata = response.data.body.list
          this.page = response.data.body.pagination
        }, function (err) {
          console.log(err)
        })
      },
//      编辑
      edit: function (event) {
        this.editModal = true
        this.categoryId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$http({
          url: requestUrl + '/backend-system/product/category/' + this.categoryId,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.formData = response.data.body
        }, function (err) {
          console.log(err)
        })
      },
//      保存编辑
      confirmEdit: function () {
        this.$http({
          url: requestUrl + '/backend-system/product/category/' + this.categoryId,
          method: 'put',
          data: {
            display_name: this.formData.display_name,
            sort: this.formData.sort
          },
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.editModal = false
          this.getlistdata()
        }, function (err) {
          console.log(err)
        })
      },
//      删除
      delete: function (event) {
        this.deleteModal = true
        this.categoryId = Number($(event.currentTarget).parents('tr').attr('id'))
      },
//      确认删除
      confirmDelete: function () {
        this.$http({
          url: requestUrl + '/backend-system/product/category/' + this.categoryId,
          method: 'delete',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.deleteModal = false
          this.getlistdata()
        }, function (err) {
          console.log(err)
          if(err.data.code == '100001'){
            alert("该分类下有商品，不能删除此分类！")
          }
        })
      },
//      添加商品分类
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
          this.getlistdata()
        }, function (err) {
          console.log(err)
        })

      }
    },
    data: function () {
      return {
        createModal: false,
        createModalSize: 'modal-sm',
        editModal: false,
        editModalSize: 'modal-sm',
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        categoryId: '',
        display_name: '',
        sort: '',
        listdata: [],
        page: [],
        gridOperate: true,
        gridColumns: {
          id: '序号',
          display_name: '一级分类'
        },
        formData: []
      }
    }
  }
</script>
