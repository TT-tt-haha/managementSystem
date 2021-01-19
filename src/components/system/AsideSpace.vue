<template>
  <el-aside
    :width="aside.aside_width"
    id="aside"
    :style="{backgroundColor:aside.aside_background_color}"
  >
    <div style="height:60px;color:#fff">
      <p style="padding-top:10%;padding-left:10%;">智慧漏损管理系统</p>
    </div>
    <el-menu
      class="el-menu-vertical-demo"
      @select="change_aside_menu"
      @click="get($event)"
      :default-active="activie_index"
      :unique-opened="true"
      :background-color="aside.aside_background_color"
      :text-color="aside.aside_icon_color"
      :active-text-color="aside.aside_active_text_color"
      :collapse="aside.aside_state"
    >
      <el-menu-item index="/home">
        <i class="el-icon-menu" :style="{color:aside.aside_icon_color}"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-suitcase" :style="{color:aside.aside_icon_color}"></i>
          <span>维修管理</span>
        </template>
        <el-menu-item index="/module/editor">维修上报</el-menu-item>
        <el-menu-item index="/module/superform">维修状态</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-user-solid" :style="{color:aside.aside_icon_color}"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/module/table">用户资料管理</el-menu-item>
        <el-menu-item index="/module/table/excel">支持Excel表格</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-pie-chart" :style="{color:aside.aside_icon_color}"></i>
          <span>压力管理</span>
        </template>
        <el-menu-item index="/echarts/bar">柱状图</el-menu-item>
        <el-menu-item index="/echarts/line">折线图</el-menu-item>
        <el-menu-item index="/echarts/map">地图</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-monitor" :style="{color:aside.aside_icon_color}"></i>
          <span>水厂分析</span>
        </template>
        <el-menu-item index="/page/message/list">水厂压力</el-menu-item>
        <el-menu-item index="/">供水水量</el-menu-item>
        <el-menu-item index="/register">历史数据</el-menu-item>
        <el-menu-item index="/forget/password">添加水厂</el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-setting" :style="{color:aside.aside_icon_color}"></i>
          <span>设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/setting/user">个人设置</el-menu-item>
          <el-menu-item index="/setting/password">密码设置</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/download">
        <i class="el-icon-map-location" :style="{color:aside.aside_icon_color}"></i>
        <span slot="title">地图展示</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-question" :style="{color:aside.aside_icon_color}"></i>
        <span slot="title">漏损侦测</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-warning" :style="{color:aside.aside_icon_color}"></i>
        <span slot="title">预警记录</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>
import Pass from "@/plugins/Pass.js";
export default {
  data() {
    return {
      activie_index: this.$cookies.get("activie_index"),
      aside: {
        aside_background_color: this.$cookies.get("setting")
          .aside_background_color,
        aside_text_color: this.$cookies.get("setting").aside_text_color,
        aside_icon_color: this.$cookies.get("setting").aside_icon_color,
        aside_active_text_color: this.$cookies.get("setting")
          .aside_active_text_color,
        aside_state: false,
        aside_title: this.$cookies.get("setting").aside_title,
        aside_small_title: this.$cookies.get("setting").aside_small_title,
        aside_width: this.$cookies.get("setting").aside_width + "px",
      },
    };
  },
  created() {
    Pass.$on("aside_state", (val) => {
      this.aside.aside_state = val;
      if (this.aside.aside_state) {
        this.aside.aside_width =
          this.$cookies.get("setting").aside_small_width + "px";
        this.aside.aside_title = this.$cookies.get("setting").aside_small_title;
      } else {
        this.aside.aside_width =
          this.$cookies.get("setting").aside_width + "px";
        this.aside.aside_title = this.$cookies.get("setting").aside_title;
      }
    });
  },
  methods: {
    change_aside_menu(index) {
      this.activie_index = index;
      if (index != this.$cookies.get("activie_index")) {
        this.$cookies.set("activie_index", index);
        this.$router.push(this.$cookies.get("activie_index"));
      }
    },
    get(e) {
      console.log(e.target.innerHTML);
    },
  },
  mounted() {
    if (this.$cookies.get("activie_index") == null) {
      this.$cookies.set("activie_index", 1);
      this.$router.push(this.$cookies.get("activie_index"));
    }
  },
};
</script>
<style scoped>
.el-menu {
  /* 去除右侧边框线 */
  border-right: 0 !important;
}
#aside::-webkit-scrollbar {
  display: none;
}
#aside {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>