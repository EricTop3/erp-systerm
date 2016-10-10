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
          <span class="btn btn-info" @click="searchMethod">搜索</span>
          <span class="btn btn-warning" @click="cancel()">撤销搜索</span>
        </form>
      </div>
      <div class="container-fluid" style="height: 400px; overflow: auto;">
        <div class="row">
          <div class="col-sm-2" role="navigation" style="padding:0;">
            <ul class="nav nav-stacked dialog-sidebar">
              <li class="header">商品分类</li>
              <li class="active"  @click="fetchStockGood($event)"   id= '0' data-flag="false" data-click="false">
                <a href="javascript:void(0)">全部分类<span class="glyphicon glyphicon-chevron-right"></span></a></li>
              </li>
              <li v-for="item in category" track-by="$index"  @click="fetchStockGood($event)" :id="item.id" data-flag="false" data-click="false">
                <a href="javascript:void(0)">{{item.display_name}}<span
                  class="glyphicon glyphicon-chevron-right"></span></a></li>
            </ul>
          </div>
          <div class="col-sm-10">
            <!--表格-->
            <grid :check="true" :check-all.sync="allChecked" :data="currentData" :columns="goodsListTitle" :is-add-flag.sync="isAdd" :is-check-all="true"></grid>
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
    events:{
      pagechange: function(currentpage){
        var self = this
        var data = $.extend({page: currentpage, search: self.query.search},this.requestData)
        this.allChecked = false
        this.requestApi(data,function(){
          $.each(self.getRenderData,function(index,val){
            $.each(self.addData,function(index1,val1){
               if(val.id ===val1.id){
                 val1.choice= val.choice
                 val1.again= val.again
               }
            })
          })
        })
      },
     getGoodsWhenClick: function () {
       var self = this
       if(!this.isLoadFinish){
//        分类
         var self = this
         getDataFromApi(self.categoryUrl,{},function(response){
           self.category = response.data.body.list
           $.each(self.category,function(index,val){
             val.isCategoryLoadData =  false
           })
           var data = $.extend({category: self.query.category},self.requestData)
//           获取产品
           self.requestApi(data,function(){
               self.isLoadFinish = true
             })
         })
       }
     }
    },
    props: {
      page: [],
      addData: [],
      requestData:{},
      getRenderData: [],
      goodsListTitle: {},
      productUrl: '',
      categoryUrl: '',
      stockAddGoodModal: false,
      stockAddGoodModalSize: 'modal-lg'
    },
    methods: {
//     公共产品列表请求
      requestApi: function (data,callback) {
        var self = this
        getDataFromApi(this.productUrl,data,function(response){
          self.currentData = response.data.body.list
          self.addData = self.addData.concat(self.currentData)
          self.cachData.push({
              category: data,
              product: response.data.body.list
          })
          self.page = response.data.body.pagination
          callback && callback ()
        })
      },
//    根据分类进行产品请求
      fetchStockGood: function (event) {
        var self = this
        var currentObj = $(event.currentTarget)
        var currenHtml = $(event.currentTarget).find('a').text()
        var currentId = Number(currentObj.attr('id'))
        var currentLoadFinished =currentObj.attr('data-flag')
        var currentIsClick =currentObj.attr('data-click')
        currentObj.addClass('active').siblings('li').removeClass('active')
        this.query.category = Number(currentObj.attr('id'))
        var data = $.extend({category: this.query.category},this.requestData)
        console.log(data)
//         获取产品
          if(currentLoadFinished === 'false'){
            this.requestApi(data,function(){
               currentObj.attr('data-flag',true)
            })
           } else {
            $.each(this.cachData,function(index,val){
              if(val.category.category ===currentId ){
                self.currentData = val.product
                if(currentIsClick === 'false'){
                  self.addData = self.addData.concat(self.currentData)
                  currentObj.attr('data-click',true)
                }
              }
            })
          }
        this.$dispatch('fetchProduct')
      },
//      根据搜索进行产品请求
      searchMethod: function () {
        var data = {
          search: this.query.search
        }
        this.requestApi(data)
      },
//      撤销搜索
      cancel: function () {
        var data = {}
        this.query.search = ''
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
        cachData: [],
        currentData: [],
        query: {
          search: '',
          category: '0'
        },
        category: [],
        allChecked: false
      }
    }
  }
</script>
