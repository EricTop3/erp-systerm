<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存查询</li>
          <li class="active">列表</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>仓库</label>
              <select class="form-control" v-model="search.selectedHouse">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in warehouseList">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>商品分类</label>
              <select class="form-control" v-model="search.selectCategory">
                <option value="">请选择</option>
                <option v-for="item in category" :value="item.id">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <input type="text" class="form-control" placeholder="请输入商品名或商品货号" v-model="search.name">
            </div>
            <div class="form-group ml10">
              <label>时间段</label>
              <date-picker :value.sync="search.startTime"></date-picker>
              -
              <date-picker :value.sync="search.endTime"></date-picker>
            </div>
            <div class="form-group ml10">
              <label><input type="checkbox" class="checkbox" v-model="search.safeInstock">库存警戒中 </label>
            </div>

            <button class="btn btn-primary" @click="searchMethod">搜索</button>
            <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
            <span class="btn fr btn-info">导出excel</span>
          </form>
        </div>
        <!-- 表格 -->
        <grid :data="productList" :columns="gridColumns" :operate="productOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" @click="checkDetail($event)">出入库明细</span>
          </div>
        </grid>

        <!--翻页-->
        <page
          :total='page.total'
          :current.sync='page.current_page'
          :display='page.per_page'
          :last-page='page.last_page' v-if="productList.length>0">
        </page>

      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import AdminNav from '../../AdminNav'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import LeftInstock from '../../common/LeftInstock'
  import DatePicker from '../../../common/DatePicker'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    searchRequest,
    getDataFromApi,
    postDataToApi,
    exchangeData,
    deleteRequest
  } from '../../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      AdminNav: AdminNav,
      DatePicker: DatePicker,
      LeftInstock: LeftInstock
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url: requestSystemUrl + '/backend-system/stock/log',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.productList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    ready: function () {
      var self = this
//    仓库请求接口
      var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
//    获取仓库列表
      getDataFromApi(url, {}, function (response) {
        self.warehouseList = response.data.body.list
      })
//      获取商品分类
      getDataFromApi(requestSystemUrl + '/backend-system/product/category', {}, function (response) {
        self.category = response.data.body.list
      })
      this.listData({})

    },
    methods: {
//      列表数据渲染
      listData: function (data) {
        var self = this
        var url = requestSystemUrl + '/backend-system/stock/log'
        getDataFromApi(url, data, function (response) {
          self.productList = response.data.body.list
          self.numberChange(self.productList)
          self.page = response.data.body.pagination
        })
      },
//      查看明细
      checkDetail: function (event) {
        var Id = Number($(event.currentTarget).parents("tr").attr('id'))
        window.location.href = '?#!/admin/instock/inStockDetail/' + Id
      },
//    搜索
      searchMethod: function () {
        var data = {
          name: this.search.name,
          category_id: this.search.selectCategory,
          warehouse_id: this.search.selectedHouse,
          safe_stock: this.search.safeInstock
        }
        this.listData(data)
      },
//    取消搜索
      cancelSearch: function () {
        this.search.name = ''
        this.search.selectCategory = ''
        this.search.selectedHouse = ''
        this.search.safeInstock = ''
        this.listData({})
      },
//      负数变为正数
      numberChange: function (list) {
        $.each(list, function (index, val) {
          if ( val.out_stock < 0 ) {
            val.out_stock = val.out_stock * (-1)
          }
        })
      }
    },
    data: function () {
      return {
        page: [],
        category: [],
        warehouseList: [],
        search: {
          selectedHouse: '',
          selectCategory: '',
          name: '',
          startTime: '',
          endTime: '',
          safeInstock: ''
        },
        productOperate: true,
        productList: [],
        gridColumns: {
          goods_code: "货号",
          goods_name: "品名",
          warehouse_name: "仓库",
          start_stock: "期初库存量",
          in_stock: "期间入库量",
          out_stock: "期间出库量",
          current_stock: "期末库存量",
          unit_name: "单位",
          unit_specification: "单位规格"
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

