<template>
  <modal :show.sync="stockAddGoodModal"  :modal-size="stockAddGoodModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true" @click="stockAddGoodModal = false">&times;</span></button>
      <h4 class="modal-title">添加商品</h4>
    </div>
    <div slot="body">
      <div class="page-header">
        <form action="" method="post" class="form-inline">
          <div class="form-group">
            <label><input type="checkbox">库存警戒中</label>
          </div>
          <div class="form-group ml10">
            <input type="text" class="form-control" placeholder="请输入商品名或商品编号" v-model="query.search">
          </div>
          <span class="btn btn-info" @click="search()">搜索</span>
          <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
        </form>
      </div>
      <div class="container-fluid" style="height: 400px; overflow: auto;">
        <div class="row">
          <div class="col-sm-2" role="navigation" style="padding:0;">
            <ul class="nav nav-stacked dialog-sidebar">
              <li class="header">商品分类</li>
              <li v-for="item in category" track-by="$index" :class="{'active':$index===0}" @click="fetchStockGood($event)" :id="item.id">
                <a href="javascript:void(0)">{{item.display_name}}<span
                  class="glyphicon glyphicon-chevron-right"></span></a></li>
            </ul>
          </div>
          <div class="col-sm-10">
            <!--表格-->
            <grid :check="true" :check-all.sync="allChecked" :data="addData" :columns="goodsListTitle" :is-add-flag.sync="isAdd"></grid>
            <!--分页-->
            <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page'></page>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmClick()" :class="{'btn-warning':!isAdd}" :disabled="!isAdd">确定添加</button>
    </div>
  </modal>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import {token,requestSystemUrl,getDataFromApi} from '../../publicFunction/index'
  export default {
    name: 'stockGoods',
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal
    },
    compiled: function () {
//      分类
      var self = this
      getDataFromApi(requestSystemUrl + '/backend-system/product/category',{},function(response){
        self.category = response.data.body.list
      })
//       获取产品
      this.requestApi(this.requestData)
    },
    events:{
      pagechange: function(currentpage){
        var self = this
        this.allChecked = false
        this.requestApi({page: currentpage},function(){
          $.each(self.getRenderData,function(index,val){
            $.each(self.addData,function(index1,val1){
               if(val.id ===val1.id){
                 val1.choice= val.choice
                 val1.again= val.again
               }
            })
          })
        })
      }
    },
    props: {
      page: [],
      addData: [],
      requestData:{},
      getRenderData: [],
      goodsListTitle: {
        'code': '货号',
        'name': '品名',
        'sale_amount': '日均销量',
        'current_stock': '当前库存',
        'unit': '单位',
        'unit_specification': '单位规格',
        'category_name': '商品分类'
      },
      url: '',
      stockAddGoodModal: false,
      stockAddGoodModalSize: 'modal-lg'
    },
    methods: {
//     公共产品列表请求
      requestApi: function (data) {
        var self = this
        getDataFromApi(this.url,data,function(response){
          self.addData = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//    根据分类进行产品请求
      fetchStockGood: function (event) {
        var currentObj = $(event.currentTarget)
        this.query.category = Number(currentObj.attr('id'))
        var data = {
          category: this.query.category
        }
        currentObj.addClass('active').siblings('li').removeClass('active')
        this.$dispatch('fetchProduct')
//       获取产品
        this.requestApi(data)
      },
//      根据搜索进行产品请求
      search: function () {
        var data = {
          search: this.query.search
        }
        this.requestApi(data)
      },
//      撤销搜索
      cancel: function () {
        var data = {}
        this.requestApi(data)
      },
//      点击确定添加按钮
      confirmClick: function () {
        this.stockAddGoodModal = false
        this.$dispatch('confirmAdd')
      }
    },
    data: function () {
      return {
        isAdd: false,
        query: {
          search: '',
          category: ''
        },
        category: [],
        allChecked: false
      }
    }
  }
</script>
