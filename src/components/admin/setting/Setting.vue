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
              <select class="form-control" v-model="search.selectCategory">
                <option value="">请选择</option>
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>销售状态</label>
              <select class="form-control" v-model="search.selectSellStatus">
                <option value="">请选择</option>
                <option value="0">下架中</option>
                <option value="1">上架中</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品属性</label>
              <select class="form-control" v-model="search.selectProductStatus">
                <option value="">请选择</option>
                <option value="1">工厂产成品</option>
                <option value="2">原材料</option>
                <option value="3">门店产成品</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control" v-model="search.selectPriceStatus">
                <option value="">请选择</option>
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
                <option value="4">非卖品</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>品名</label>
              <input type="text" class="form-control" placeholder="商品名称" v-model="search.name">
            </div>
            <div class="form-group ml10">
              <label>货号</label>
              <input type="text" class="form-control" placeholder="商品货号" v-model="search.code">
            </div>
            <button class="btn btn-primary" @click="searchMethod">搜索</button>
            <span class="btn btn-warning"  @click="cancelSearch">撤销搜索</span>
            <a v-link="{ path: '/admin/setting/commodity/createNew'}" v-if="authority.create"><span class="btn btn-info spanblocks fr">新建商品</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <grid :data="productList" :columns="gridColumns" :operate="productOperate">
          <div slot="operateList">
            <span class="btn btn-info btn-sm" @click="fluctuations($event)" v-if="authority.priceWave">价格波动</span>
            <span class="btn btn-success btn-sm" @click="edit($event)" v-if="authority.edit">编辑</span>
            <list-delete :delete-data.sync="productList" v-if="authority.delete"></list-delete>
          </div>
        </grid>
        <!-- 翻页 -->
        <page
          :total='page.total'
          :current.sync='page.current_page'
          :display='page.per_page'
          :last-page='page.last_page' v-if="productList.length>0">
        </page>
      </div>
    </div>
  </div>

  <!--模态框HTML-->
   <modal :show.sync="modal.priceModal" :modal-size="modal.priceModalSize">
      <div slot="header">
        <button type="button" class="close" @click="modal.priceModal = false"><span
          aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">历史价格波动</h4>
      </div>
      <div slot="body" style="height:400px; overflow:auto;">
        <grid :data="priceList" :columns="priceHeader"></grid>
        <page :total='historyPage.total' :current.sync='historyPage.current_page' :display='historyPage.per_page' :last-page='historyPage.last_page' v-if="priceList.length>0">
        </page>
      </div>
      <div slot="footer">
        <button type="button" class="btn btn-default" @click="modal.priceModal = false">关闭</button>
      </div>
   </modal>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Modal from '../../common/Modal'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import ListDelete from '../../common/ListDelete'
  import {requestUrl, requestSystemUrl,token, searchRequest,getDataFromApi,postDataToApi,exchangeData,deleteRequest,systermAuthority} from '../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      Modal:  Modal,
      LeftSetting: LeftSetting,
      ListDelete: ListDelete
    },
    events: {
      delete: function (id) {
        var self = this
        var curId = ''
        $.each(self.productList, function (index, val) {
          if(id == val.id){ curId = val.product_id }
        })
        var url = requestSystemUrl + '/backend-system/product/product/' + curId
        deleteRequest(url,function(response) {
          self.getlistData(1)
        })
      },
      pagechange: function (currentpage) {
        if(!this.modal.priceModal){
          this.getlistData(currentpage)
        }else{
          this.fluctuationsData(currentpage)
        }
      }
    },
    ready: function () {
      var self = this
//      获取商品分类
      getDataFromApi(requestSystemUrl + '/backend-system/product/get/category',{},function(response){
        self.category = response.data.body.list
      })
//    获取商品
      this.getlistData(1)
//    权限判断
      if(systermAuthority.indexOf('goods-setting-list-create')>-1){
        this.authority.create = true
      }
      if(systermAuthority.indexOf('goods-setting-list-delete')>-1){
        this.authority.delete = true
      }
      if(systermAuthority.indexOf('goods-setting-list-edit')>-1){
        this.authority.edit = true
      }
      if(systermAuthority.indexOf('goods-setting-list-price-wave')>-1){
        this.authority.priceWave = true
      }
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/product/product'
        var data = {
          page: page || ''
        }
        getDataFromApi(url,data,function(response){
          self.productList = response.data.body.list
          exchangeData( self.productList)
          $.each(self.productList, function (index, val) {
            if (val.aruc == 0 || val.aruc == null) {
              val.aruc = ''
            } else {
              val.aruc = val.sell_unit_name ? ('¥' + val.aruc * 0.01 + '/' + val.sell_unit_name) : ''
            }
            if (val.apuc == 0 || val.apuc == null) {
              val.apuc = ''
            } else {
              val.apuc = val.production_unit_name ? ('¥' + val.apuc * 0.01 + '/' + val.production_unit_name) : ''
            }
          })

          self.page =  response.data.body.pagination
        })
      },
//    编辑
      edit: function (event) {
        var self = this
        var Id = Number($(event.currentTarget).parents("tr").attr('id'))
        var curId = ''
        $.each(this.productList, function (index, val) {
          if(Id == val.id){
            curId = val.product_id
          }
        })
        window.location.href = '/#!/admin/setting/settingEditProduct/' + curId
      },
//    搜索
      searchMethod: function (){
         var self = this
         var url = requestSystemUrl + '/backend-system/product/product'
         var data = {
           name: this.search.name,
           category: this.search.selectCategory,
           product_type: this.search.selectProductStatus,
           sell_status: this.search.selectSellStatus,
           code: this.search.code,
           sell_type: this.search.selectPriceStatus
         }
        searchRequest(url,data,function(response){
          self.productList = response.data.body.list
          exchangeData( self.productList)
          $.each(self.productList, function (index, val) {
            if (val.aruc == 0 || val.aruc == null) {
              val.aruc = ''
            } else {
              val.aruc = val.sell_unit_name ? ('¥' + val.aruc + '/' + val.sell_unit_name) : ''
            }
            if (val.apuc == 0 || val.apuc == null) {
              val.apuc = ''
            } else {
              val.apuc = val.production_unit_name ? ('¥' + val.apuc + '/' + val.production_unit_name) : ''
            }
          })
          self.page =  response.data.body.pagination
        })
      },
//    取消搜索
      cancelSearch: function () {

        var self = this
        var url = requestSystemUrl + '/backend-system/product/product'
        var data = {}
        this.search.name = ''
        this.search.selectCategory = ''
        this.search.selectProductStatus = ''
        this.search.selectSellStatus = ''
        this.search.code = ''
        this.search.selectPriceStatus = ''
        searchRequest(url,data,function(response){
          self.productList = response.data.body.list
          exchangeData( self.productList)
          $.each(self.productList, function (index, val) {
            if (val.aruc == 0 || val.aruc == null) {
              val.aruc = ''
            } else {
              val.aruc = val.sell_unit_name ? ('¥' + val.aruc + '/' + val.sell_unit_name) : ''
            }
            if (val.apuc == 0 || val.apuc == null) {
              val.apuc = ''
            } else {
              val.apuc = val.production_unit_name ? ('¥' + val.apuc + '/' + val.production_unit_name) : ''
            }
          })
          self.page =  response.data.body.pagination
        })
      },
//      价格波动
      fluctuations: function (event) {
        var self = this
        this.thisId = $(event.currentTarget).parents('tr').attr('id')
        self.modal.priceModal = true
        self.fluctuationsData(1)
      },
//      价格波动的数据渲染
      fluctuationsData: function(page){
        var self = this
        var data = {
          page: page,
          per_page: 20
        }
        getDataFromApi(requestSystemUrl + '/backend-system/product/' + this.thisId + '/price-wave',data,function (response) {
          self.priceList = response.data.body.list
          self.historyPage = response.data.body.pagination
          self.modifyGetedData(self.priceList)
        })
      },
//    对获取到de列表数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if (value.previous_aruc != '') {
            value.previous_aruc = '￥' + (value.previous_aruc * 0.01).toFixed(2)
          }
          if (value.previous_apuc != '') {
            value.previous_apuc = '￥' + (value.previous_apuc * 0.01).toFixed(2)
          }
        })
      }
    },
//    路由
    route:{
      data: function () {
         console.log('yes')
//        console.log(this.route.path)
      }
    },
    data: function () {
      return {
        isflag: true,
        thisId: '',
        product_id: '',
        page: [],
        historyPage: [],
        category: '',
        productOperate: true,
        search: {
          selectCategory: '',
          selectSellStatus: '',
          selectProductStatus: '',
          selectPriceStatus: '',
          code: '',
          name: ''
        },
        productList: [],
        priceList: [],
        priceHeader:{
          created_at: '修改日期',
          previous_aruc: '历史零售单价',
          previous_apuc: '历史采购单价',
          operator_name: '编辑人'
        },
        modal: {
          priceModal: false,
          priceModalSize: 'modal-lg'
        },
        authority: {
          priceWave: false,
          edit: false,
          delete: false,
          create: false
        },
        gridColumns: {
          id: '编号',
          name: '名称',
          code: '货号',
          aruc: '零售价',
          apuc: '采购价',
          specification_unit: '规格单位',
          category : '分类',
          product_type : '商品属性',
          sell_type: '价格属性',
          sell_status: '销售状态'
        }
      }
    }
  }
</script>
