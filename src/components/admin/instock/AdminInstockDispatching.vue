<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-instock></left-instock>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存配送出库</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>单号</label>
              <input type="text" class="form-control" placeholder="" v-model="searchData.document_number">
            </div>
            <div class="form-group ml10">
              <label>审核状态</label>
              <select class="form-control" v-model="searchData.checked">
                <option>全部</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>调入仓库</label>
              <select class="form-control" v-model="searchData.provider_id">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>出货仓库</label>
              <select class="form-control" v-model="searchData.warehouse_id">
                <option>请选择</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>制单人</label>
              <select class="form-control" v-model="searchData.creator_id">
                <option>请选择</option>
              </select>
            </div>
            <br/>
            <div class="form-group ml10 mt20">
              <label>配送时间段</label>
              <input type="text" class="form-control date_picker" placeholder="开始时间"
                     v-model="searchData.start_receive_time"> -
              <input type="text" class="form-control date_picker" placeholder="结束时间"
                     v-model="searchData.end_receive_time">
            </div>
            <button type="submit" class="btn btn-primary mt20" @click="getlistData(1)">搜索</button>
            <span class="btn btn-warning mt20" @click="cancelSearch()">撤销搜索</span>
            <span class="btn btn-info spanblocks fr" v-link="{ path: '/admin/instock/createOutInstock',exact: true}">新建配送出库单</span>
          </form>
        </div>

        <!-- 表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate"></grid>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftInstock from '../common/LeftInstock'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftInstock: LeftInstock,
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
      this.getlistData(1)
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/distribution'
        var data = {
          document_number: this.searchData.document_number || '',
          checked: this.searchData.checked || '',
          provider_id: this.searchData.provider_id || '',
          warehouse_id: this.searchData.warehouse_id || '',
          creator_id: this.searchData.creator_id || '',
          start_receive_time: this.searchData.start_receive_time || '',
          end_receive_time: this.searchData.end_receive_time || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      }
    },
    data: function () {
      return {
        gridColumns: {
          document_number: "配送单号",
          checked: "审核状态",
          warehouse_name: "调入仓库",
          creator_name: "制单人",
          auditor_name: "审核人",
          operated_at: "配送时间",
          amount: "配送数量"
        },
        gridOperate: false,
        listdata: [],
        page: [],
        searchData: {
          document_number: '',
          checked: '',
          provider_id: '',
          warehouse_id: '',
          creator_id: '',
          start_receive_time: '',
          end_receive_time: ''
        }
      }
    }
  }
</script>
