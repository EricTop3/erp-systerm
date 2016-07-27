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
                <option value="2">非卖品</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品属性</label>
              <select class="form-control" v-model="search.selectProductStatus">
                <option value="">请选择</option>
                <option value="1">工厂产成品</option>
                <option value="2">委外产成品</option>
                <option value="3">门店产成品</option>
                <option value="4">原材料</option>
                <option value="5">套餐</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>价格属性</label>
              <select class="form-control" v-model="search.selectPriceStatus">
                <option value="">请选择</option>
                <option value="1">可议价</option>
                <option value="2">特价</option>
                <option value="3">非议价</option>
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
            <a v-link="{ path: '/admin/setting/commodity/createNew'}"><span class="btn btn-info spanblocks fr">新建商品</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <grid :data="productList" :columns="gridColumns" :operate="productOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#set-price-templ">价格波动</span>
            <span class="btn btn-default btn-sm" data-toggle="modal" @click="edit($event)">编辑</span>
            <list-delete :delete-data.sync="productList"></list-delete>
          </div>
        </grid>
        <!-- 翻页 -->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page' :last-page='page.last_page' v-if="productList.length>0"></page>
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
   <modal :show.sync="priceModal" :modal-size="priceModalSize">
      <div slot="header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
          aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">历史价格波动</h4>
      </div>
      <div slot="body">
        <grid :data="priceList" :columns="priceHeader"></grid>
      </div>
      <div slot="footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
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
  import {requestUrl, requestSystemUrl,token, searchRequest,getDataFromApi,postDataToApi,exchangeData,deleteRequest} from '../../../publicFunction/index'
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
        var url = requestSystemUrl + '/backend-system/product/product/' + id
        console.log(id)
        deleteRequest(url,function(response) {
          console.log(id)
        })
      },
      pagechange: function (currentpage) {
        getDataFromApi(requestSystemUrl + '/backend-system/product/product',{page: currentpage},function(response){
          self.productList = response.data.body.list
          exchangeData( self.productList)
          self.page =  response.data.body.pagination
        })
      }
    },
    ready: function () {
      var self = this
//      获取商品分类
      getDataFromApi(requestSystemUrl + '/backend-system/product/category',{},function(response){
        self.category = response.data.body.list
      })
//    获取商品
      getDataFromApi(requestSystemUrl + '/backend-system/product/product',{},function(response){
        self.productList = response.data.body.list
        exchangeData( self.productList)
        self.page =  response.data.body.pagination
      })
    },
    methods: {
//     获取商品
      fetchGoods: function (page) {
        var data ={
          name: this.search.name,
          category: this.search.selectCategory,
          product_type: this.search.selectProductStatus,
          sell_status: this.search.selectSellStatus,
          code: this.search.code,
          sell_type: this.search.selectPriceStatus,
          page: page
        }
      },
//    编辑
      edit: function (event) {
        var curId = Number($(event.currentTarget).parents("tr").attr('id'))
        console.log(curId)
        /*getDataFromApi(requestSystemUrl + '/backend-system/product/product',{id: curId},function(response){
          console.log(responbse)
        })*/
        window.location.href = '?#!/admin/setting/settingEditProduct/' + curId

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
          self.page =  response.data.body.pagination
        })
      },
//    取消搜索
      cancelSearch: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/product/product'
        var data = {}
        searchRequest(url,data,function(response){
          self.productList = response.data.body.list
          exchangeData( self.productList)
          self.page =  response.data.body.pagination
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
        page: [],
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
        priceHeader:{},
        modal: {
          priceModal: false,
          priceModalSize: 'modal-sm'
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
