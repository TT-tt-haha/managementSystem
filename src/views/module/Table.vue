<template>
  <!-- eslint-disable -->
  <el-container id="aside">
    <vAsideSpace />
    <el-container>
      <el-header :height="head_height" :style="{backgroundColor:head_background_color}">
        <vHeadSpace />
      </el-header>
      <el-main id="main" :style="{backgroundColor:main_background_color}">
        <el-container>
          <el-aside width="200px"> <h1>区域信息</h1>
            <el-tree :data="data" :props="defaultProps" style="margin-top: 20px" @node-click="handleNodeClick"></el-tree></el-aside>
          <el-main>
            <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
              <el-tab-pane
                      :key="item.name"
                      v-for="(item) in editableTabs"
                      :label="item.title"
                      :name="item.name"
              >
                <el-row>
                  <el-col :span="12" :offset="22"><el-button type="primary" style="margin:5px" @click="exportInfo">导出</el-button></el-col>
                </el-row>

                <el-table
                        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%">
                  <el-table-column
                          label="Id"
                          prop="uid">
                  </el-table-column>
                  <el-table-column
                          label="Name"
                          prop="uname">
                  </el-table-column>
                  <el-table-column
                          label="Number"
                          prop="unum">
                  </el-table-column>
                  <el-table-column
                          label="Tel"
                          prop="utele">
                  </el-table-column>
                  <el-table-column
                          label="Building"
                          prop="umenuName">
                  </el-table-column>
                  <el-table-column
                          align="right">
                    <template slot="header" slot-scope="scope">
                      <el-input
                              v-model="search"
                              size="mini"
                              placeholder="输入关键字搜索"/>
                    </template>
                    <template slot-scope="scope">
                      <el-button
                              size="mini"
                              @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                      <el-popconfirm
                              confirmButtonText='好的'
                              cancelButtonText='不用了'
                              icon="el-icon-info"
                              iconColor="red"
                              title="确定要删除当前用户吗？"
                              @confirm="handleDelete(scope.$index, scope.row)"></el-popconfirm>
                      <el-button
                              size="mini"
                              type="danger"
                              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row>
                  <el-col :span="12" :offset="8">
                    <el-pagination style="margin: 15px 0px"
                                   layout="prev, pager, next,jumper,total,sizes" :page-sizes="[1,2,4,8]" :page-size="size" :current-page="pageNow"
                                   @current-change="findPage"
                                   @size-change="findSize"
                                   :total="total">
                    </el-pagination>
                  </el-col>
                </el-row>
                <el-button type="primary" style="margin:10px" @click="saveUserInfo">添加用户</el-button>

                <transition name="el-zoom-in-center">
                  <div v-show="show" class="transition-box">
                    <el-form :hide-required-asterisk="false" :rules="rules" ref="userForm" :model="form"  label-suffix=":" label-width="80px">

                      <el-form-item label="姓名" prop="name">
                        <el-input @input="changeFn"  v-model="form.uName"></el-input>
                      </el-form-item>
                      <el-form-item label="用户编号" prop="uNum">
                        <el-input @input="changeFn" v-model="form.uNum"></el-input>
                      </el-form-item>

                      <el-form-item label="用户电话" prop="uTele">
                        <el-input @input="changeFn" v-model="form.uTele"></el-input>
                      </el-form-item>

                      <el-form-item label="单元编号" prop="unitId">
                        <el-input @input="changeFn" v-model="form.unitId"></el-input>
                      </el-form-item>
                      <el-form-item label="详细位置" prop="location">
                        <el-input @input="changeFn" v-model="form.menuName"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="onSubmit('userForm')">保存信息</el-button>
                        <el-button @click="saveUserInfo">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </transition>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  /* eslint-disable */
import axios from "axios";

  export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuName:'',
      total:0,
      size:4,
      pageNow:1,
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 0,
      tableData: [],
      search: '',
      temp:'',
      url:'',
      show:false,
      form: {
        uName: '',
        uId:'',
        qingzhouId:'',
        officeId:'',
        communityId:'',
        buildingId:'',
        pId:'',
        menuName:'',
        uNum:'',
        uTele:'',
        unitId:''
      },
      rules: {
        // uId: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        // buildingId: [{ required: true, message: '请输入楼栋编号', trigger: 'blur' }],
        // unitId: [{ required: true, message: '请输入单元编号', trigger: 'blur' }],
        // location: [{ required: true, message: '请输入详细位置编号', trigger: 'blur' }],
        uNum: [{ required: true, message: '请输入用户编号', trigger: 'blur' }],
        uTele: [{ required: true, message: '请输入用户电话', trigger: 'blur' }],


      },
    };
  },
  methods: {
    changeFn(){
      this.$forceUpdate();
    },
    findSize(size){
      this.size = size;
      this.findAllData(1,1001,this.page,size)
    },
    findPage(page){
      this.page = page;
      this.findAllData(1,1001,page,this.size);
    },
    findAllData(level,id,page,size){
      page = page?page:this.pageNow,
      size=size?size:this.size,
      this.$http.get("http://localhost:8989/user/"+level+"/"+id+"?pageNow="+page+"&pageSize="+size).then(res=>{
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    findTreeData(){
      this.$http.get("http://localhost:8989/treedata").then(res=>{
        this.data=res.data;
      });
    },
    exportInfo(){
      var url = "http://localhost:8989/export";
      window.location.href = url;
    },
    saveUserInfo(){
      this.show=true;
      this.form = {};
    },
    onSubmit(userForm) {
      // console.log(this.$refs[userForm][0])
      this.$refs[userForm][0].validate((valid) => {
        if (valid) {
          let pId = this.form.unitId;
          let qs=require('qs');
          var instance = axios.create({ headers: {'content-type': 'application/x-www-form-urlencoded'} });

          instance.post("http://localhost:8989/user/save/"+pId,qs.stringify(this.form)).then(res=>{
            if(res.data.status){
              this.$message({
                message: '恭喜你，'+res.data.msg,
                type: 'success'
              });
              this.findAllData(1,1001);
              this.findTreeData();
              this.show=false;
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error("当前输入不合法！");
          return false;
        }
      });

    },
    handleEdit(index, row) {
      console.log(row);
      this.show=true;
      this.form = row;
      // this.form.uId = row.uid;
      this.form.uName = row.uname;
      this.form.uNum = row.unum;
      this.form.uTele = row.utele;
      this.form.unitId = row.unitId;
      this.form.menuName =row.umenuName;
    },
    handleDelete(index, row) {
      console.log(row);
      this.$http.get("http://localhost:8989/user/delete?id=" + row.uid).then(res => {
        if (res.data.status) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.findAllData(1,1001,this.pageNow,this.size);//刷新数据
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleNodeClick(data) {
      let id = data.menuId;
      let level = data.level;
      console.log(data);
      let newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: data.menuName,
        name: newTabName,
        content: this.findAllData(level,id,this.pageNow,this.size)
      });
      this.editableTabsValue = newTabName;
    },
    handleTabsEdit(targetName, action) {

      if (action === 'remove') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  },
  created() {
    this.findTreeData();
  }
}
</script>
<style scoped>
#aside {
  height: 100vh;
}
#main {
  height: 100vh;
  overflow: auto;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

/*外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果*/
::-webkit-scrollbar-track {
  width: 6px;
  background-color: #f2f6fc;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

/*滚动条的设置*/

::-webkit-scrollbar-thumb {
  background-color: #f56c6c;
  background-clip: padding-box;
  min-height: 1px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
/*滚动条移上去的背景*/

::-webkit-scrollbar-thumb:hover {
  background-color: #fff;
}
</style>