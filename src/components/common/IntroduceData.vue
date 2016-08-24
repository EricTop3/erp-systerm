<template>
  <modal :show.sync='instroduceDataModal' :modal-size="instroduceDataModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true" @click="instroduceDataModal= false">&times;</span></button>
      <h4 class="modal-title">{{title}}</h4>
    </div>
    <div slot="body">
      <!-- 页头 -->
      <div class="page-header text-center">
        <form action="" method="post" class="form-inline">
          <div class="form-group mr50" v-if="isPurchase">
            <label>要货门店</label>
            <select class="form-control" v-model="selectedStore">
              <option value="">请选择</option>
              <option :value="item.id" v-for="item in storeList" >{{item.display_name}}</option>
            </select>
          </div>
          <div class="form-group">
            <label>时间段</label>
            <date-picker :value.sync="startTime" :time-text="timeText"></date-picker> -
            <date-picker :value.sync="endTime"   :time-text="timeText"></date-picker>
          </div>
          <span class="btn btn-info" @click="searchMethod">搜索</span>
          <span class="btn btn-info" @click="cancelSearch">撤销搜索</span>
        </form>
      </div>
      <div style="height:200px; overflow: auto;">
        <!--表格-->
        <!--表格-->
        <grid :check="true" :data="firstData" :columns="firstDataTitle" v-on:change-operate="change"
              v-on:change-all-operate="changeAll" :check-all.sync="citeCheckAll"></grid>
      </div>

      <div style="height:200px; overflow: auto; margin-top: 20px;">
        <!--表格-->
        <grid :check="true" :data="secondData" :columns="secondDataTitle" :is-add-flag.sync="isAdd" :check-all.sync="secondDataCheckAll"
              v-on:change-add-operate="changeOperate" v-on:change-all-operate="changeAllOperate"></grid>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmClick()" :class="{'btn-warning':!isAdd}"
              :disabled="!isAdd">确定添加
      </button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import Grid from '../common/Grid'
  import DatePicker from '../common/DatePicker'
  import { requestUrl,token,getDataFromApi,exchangeData} from '../../publicFunction/index'
  import _ from 'underscore'
  export default{
    name: 'introduce-data',
    components: {
      Modal: Modal,
      Grid: Grid,
      DatePicker: DatePicker
    },
    ready: function () {
    },
    props: {
      instroduceDataModal: false,
      instroduceDataModalSize: 'modal-sm',
      secondData: [],
      title:'',
      isPurchase: false,
      firstDataTitle: {
        code: '配送出库单号',
        store_name: '调出仓库',
        number: '配送数量',
        date: '配送日期',
        create_person: '制单人',
        check_person: '审核人'
      },
      firstData: [],
      secondDataTitle: {
        goods_code: '货号',
        goods_name: '品名',
        demanding_number: '要货数量',
        distribution_number: '配送数量',
        unit: '单位',
        unit_specification: '单位规格'
      },
      secondData: [],
      url: '',
      secondUrl: '',
      requestData: {},
      productFlag: false,
      purchaseFlag: false
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      },
      getGoodsWhenClick: function () {
        this.firstData = []
        this.secondData = []
//       不同的url加载不同的数据
        if(this.secondUrl!==undefined){
          this.getProductByUrl(this.url)
          this.getProductByUrl(this.secondUrl)
        }else{
          this.getProductByUrl(this.url)
        }
//      获取门店列表
        if(this.isPurchase){
          var self = this
          getDataFromApi(requestUrl + '/backend-system/store/store',{},function (response){
            self.storeList = response.data.body.list
          })
        }
      }
    },
    methods: {
//      根据id获取商品
      getProductById: function (url,currentId,currentObjCheck) {
        var  fetchedData = []
        var  self = this
        var  data = this.requestData
          getDataFromApi(url + "/" + currentId,data,function(response){
            if(self.productFlag){
              var currentArray = []
//              var len = response.data.body.list.length
//              var cur = 0
              $.each(response.data.body.list,function(index,val){
                  if(val.product_type != 2){
                    currentArray.push(val)
                  }
              })
              fetchedData = currentArray
              console.log(fetchedData)
            }else if(self.purchaseFlag){
              var currentArray = []
              $.each(response.data.body.list,function(index,val){
                if(val.product_type ===2){
                  currentArray.push(val)
                }
              })
              fetchedData = currentArray
            }else{
              fetchedData = response.data.body.list
            }
            var firtElem = fetchedData[0]
            var lastElem = fetchedData[fetchedData.length - 1]
            var start = 0
            var end = 0
            var dataArray= []
            if (currentObjCheck) {
              self.secondData = self.secondData.concat(fetchedData)
            } else {
              $.each(self.secondData, function (index, val) {
                if (_.isEqual(val, firtElem)) {
                  start = index
                }
                if (_.isEqual(val, lastElem)) {
                  end = index
                }
              })
              self.secondData.splice(start, end - start + 1)
            }
          })
      },
//      根据url加载的时候获取一级商品
      getProductByUrl: function (url) {
        var self = this
        var data = this.requestData
        if(this.secondUrl!==undefined){
          getDataFromApi(url,data,function(response){
            self.firstData =  self.firstData.concat(response.data.body.list)
            exchangeData( self.firstData)
          })
        }else{
          getDataFromApi(url,data,function(response){
            self.firstData = response.data.body.list
            exchangeData( self.firstData)
          })
        }
      },
//      全选选择不同的url加载二级数据
      getProductByCheckData: function (url,checkAll) {
        var self = this
        if (checkAll) {
          $.each(this.firstData, function (index, val) {
            var currentId = val.id
            getDataFromApi(url+'/'+currentId,{},function(response){
              self.secondData = self.secondData.concat(response.data.body.list)
            })
          })
          this.isAdd = this.isAddFlag
        } else {
          this.isAdd = false
          this.secondData = []

        }
      },
//      单选上面表格加载下面数据
      change: function (currentId, currentObjCheck,event) {
        var type= $(event.currentTarget).parents('tr').attr('type')
//    根据当前id获取产品
        if(this.secondUrl !== undefined){
          if(type === 'Requisition' || type === 'Distribution'){
            this.getProductById(this.url,currentId, currentObjCheck)
          }else{
            this.getProductById(this.secondUrl,currentId, currentObjCheck)
          }
        }else{
          this.getProductById(this.url,currentId, currentObjCheck)
        }
      },
//    搜索
      searchMethod: function () {
        var self = this
        var url = this.url
        var data = {}
//     判断是否是采购引用数据
        if(self.isPurchase){
          data =  {
            start_time: self.startTime,
            end_time: self.endTime,
            store_id: self.selectedStore
          }
        }else {
          data =  {
            start_time: self.startTime,
            end_time: self.endTime
          }
        }
        getDataFromApi(url,data,function(response){
        self.firstData = response.data.body.list
        exchangeData( self.firstData)
      })
      },
//   取消搜索
      cancelSearch: function () {
        var self = this
        var url = this.url
        var data =  {}
        getDataFromApi(url,data,function(response){
          self.firstData = response.data.body.list
          exchangeData( self.firstData)
          self.startTime = ''
          self.endTime = ''
          if(self.isPurchase){
            self.selectedStore = ''
          }
        })
      },
//    全选上面表格加载下面数据
      changeAll: function (checkAll) {
        this.getProductByCheckData (this.url,checkAll)
        this.getProductByCheckData (this.secondUrl,checkAll)
      },
//      下面表格数据添加全部商品添加
      changeAllOperate: function (checkAll) {
        this.isAddFlag = checkAll
        var goodslist = this.secondData
        $.each(goodslist, function (index, val) {
          if (checkAll) {
            val.choice = true
          } else {
            val.choice = false
          }
        })
      },
//     下面表格数据单选选择商品
      changeOperate: function (currentId, currentObjCheck) {
        var goodslist = this.secondData
        if (currentObjCheck) {
          $.each(goodslist, function (index, val) {
            if (val.id === currentId) {
              val.choice = true
            }
          })
        } else {
          $.each(goodslist, function (index, val) {
            if (val.id === currentId) {
              val.choice = false
            }
          })
        }
      },
      confirmClick: function () {
        this.instroduceDataModal = false
        this.$dispatch('includeConfirmAdd')
      }
    },
    data: function () {
      return {
        isAdd: false,
        isAddFlag: false,
        timeText: '请输入日期',
        startTime: '',
        endTime: '',
        storeList: [],
        selectedStore: '',
        page: [],
        citeCheckAll: false,
        secondDataCheckAll: false,
      }
    }
  }
</script>
