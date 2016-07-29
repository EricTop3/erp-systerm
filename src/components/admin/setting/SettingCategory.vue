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
            <span class="btn btn-warning btn-sm" @click="deletes($event)">删除</span>
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
      <validator name="validation1">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">序号</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="sort" id="sort"
                     v-validate:sort="[ 'required' , 'number']">
              <div v-if="$validation1.sort.touched">
                <p class="error" v-if="$validation1.sort.required">这是必填字段</p>
                <p class="error" v-if="$validation1.sort.number">只能填写数字</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">分类</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" placeholder="字数限制6字以内" v-model="display_name"
                     v-validate:name="{required: true , maxlength: 6}">
              <div v-if="$validation1.name.touched">
                <p class="error" v-if="$validation1.name.required">这是必填字段</p>
                <p class="error" v-if="$validation1.name.maxlength">字数限制6字以内</p>
              </div>
            </div>
          </div>
        </form>
      </validator>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click="onSubmit($event)">提交</button>
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
      <validator name="validation2">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">序号</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="formData.sort" v-validate:sort="[ 'required' , 'number']">
            <div v-if="$validation2.sort.touched">
              <p class="error" v-if="$validation2.sort.required">这是必填字段</p>
              <p class="error" v-if="$validation2.sort.number">只能填写数字</p>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">分类</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="字数限制6字以内" v-model="formData.display_name" v-validate:name="{required: true , maxlength: 6}">
            <div v-if="$validation2.name.touched">
              <p class="error" v-if="$validation2.name.required">这是必填字段</p>
              <p class="error" v-if="$validation2.name.maxlength">字数限制6字以内</p>
            </div>
          </div>
        </div>
      </form>
        </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="EditonSubmit($event)">保存</button>
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
  <error-tip :err-info="messageTip" :err-modal.sync="messageTipModal"></error-tip>
</template>

<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import {requestUrl, token, searchRequest, exchangeData, error} from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftSetting: LeftSetting,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistdata(currentpage)
      }
    },
    ready: function () {
      this.getlistdata(1)
    },
    methods: {
//      获取列表
      getlistdata: function (page) {
        this.$http({
          url: requestUrl + '/backend-system/product/category',
          data: {page: page},
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.listdata = response.data.body.list
          this.page = response.data.body.pagination
        }, function (err) {
          error(err)
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
          error(err)
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
          this.getlistdata(1)
        }, function (err) {
          error(err)
        })
      },
//      删除
      deletes: function (event) {
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
          this.getlistdata(1)
        }, function (err) {
          console.log(err)
          if (err.data.code == '100001') {
            this.deleteModal = false
            this.messageTipModal = true
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
            this.getlistdata(1)
          }, function (err) {
            error(err)
          })
      },
//      表单验证
      onSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation1.invalid) {
            console.log(self.$validation1.invalid)
            self.$validation1.name.touched = true
            self.$validation1.sort.touched = true
            e.preventDefault()
          } else {
            console.log(self.$validation1.invalid)
            self.createSubmit()
          }
        })
      },
//      编辑保存的表单验证
      EditonSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation2.invalid) {
            console.log(self.$validation2.invalid)
            self.$validation2.name.touched = true
            self.$validation2.sort.touched = true
            e.preventDefault()
          } else {
            console.log(self.$validation1.invalid)
            self.confirmEdit()
          }
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
        messageTipModal: false,
        messageTip: '该分类下有商品，不能删除此分类',
        gridOperate: true,
        gridColumns: {
          id: 'ID',
          display_name: '一级分类'
        },
        formData: []
      }
    }
  }
</script>
