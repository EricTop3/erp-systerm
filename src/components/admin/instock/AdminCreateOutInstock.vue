<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2"  role="navigation">
        <left-instock></left-instock>
      </div>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：采购首页</li>
          <li class="active">库存配送出库</li>
          <li class="active">新建</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>调入仓库</label>
              <select class="form-control">
                <option>全部</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>配送时间</label>
              <input type="text" class="form-control" placeholder="">
            </div>

            <div class="form-group ml10">
              <label>备注</label>
              <input type="text" class="form-control" placeholder="" style="width: 250px">
            </div>
            <span class="btn btn-primary" data-toggle="modal" data-target="#data-cite-templ">引用原始单据</span>
            <span class="btn btn-default" data-toggle="modal" data-target="#products-add-templ">添加商品</span>
            <span class="btn btn-default"  data-toggle="modal" data-target="#procurement-submit-templ">提交出库</span>
          </form>
        </div>

        <div>
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#detail"  data-toggle="tab">出库明细</a></li>
            <li role="presentation"><a href="#summary"  data-toggle="tab">出库汇总</a></li>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="detail">
              <!-- 表格 -->
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>单位规格</td>
                  <td>总部库存</td>
                  <td>门店库存</td>
                  <td>要货数量</td>
                  <td>配送数量</td>
                  <td>单位</td>
                  <td>来源要货单号</td>
                  <td>操作</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>1箱*20盒*250ml</td>
                  <td>5000</td>
                  <td>5000</td>
                  <td>300</td>
                  <td align="center" class="form-inline"><input type="text" class="form-control text-center" style="width:100px;" value="10"></td>
                  <td>箱</td>
                  <td>4169498761434915</td>
                  <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ">删除</span></td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li class="active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>

            <div role="tabpanel" class="tab-pane" id="summary">
              <table class="table table-striped table-border table-hover">
                <thead>
                <tr class="text-center">
                  <td class="text-left">货号</td>
                  <td>品名</td>
                  <td>总部库存</td>
                  <td>门店库存</td>
                  <td>要货数量</td>
                  <td>配送数量</td>
                  <td>单位</td>
                  <td>单位规格</td>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <td class="text-left">164643138431315</td>
                  <td>伊利牛奶</td>
                  <td>500</td>
                  <td>200 盒</td>
                  <td>10</td>
                  <td>10</td>
                  <td>箱</td>
                  <td>1箱*20盒*250ml</td>
                </tr>
                </tbody>
              </table>
              <!-- 翻页 -->
              <nav class="text-right">
                <ul class="pagination">
                  <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li class="active"><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

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

    },
    methods: {
    },
    data: function () {
      return {

      }
    }
  }
</script>
