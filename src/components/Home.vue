<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/mian.png" alt width="50px" height="50px" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏区域 -->
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse = "isCollapse"
          :collapse-transition = "false"
          :router = "true"
        >
          <!-- 变换菜单栏 -->
          <div class="toggle-botton" @click="toggleClick">|||</div>
          <!-- 一级菜单栏区域 -->
          <el-submenu :index="'/' + item.path" v-for='item in menuList' :key='item.id'>
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for='subItem in item.children' :key='subItem.id'>
              <i :class="subItem.icon"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容展示区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data(){
        return{
            menuList: [{
              'id':1,
              "children":[{
                'id':2,
                "children":[],
                'authName': '用户管理',
                'icon': 'el-icon-location',
                'path': 'users'
              },{
                'id':3,
                "children":[],
                'authName': '用户权限',
                'icon': 'el-icon-location',
                'path': 'rights'
              },{
                'id':4,
                "children":[],
                'authName': '用户角色',
                'icon': 'el-icon-location',
                'path': 'roles'
              }],
              'authName': '主页',
              'icon': 'el-icon-location',
              'path': 'welcome'
            }],
            // 菜单折叠属性
            isCollapse: false
        }
    },
    created(){
        this.getMenuList();
    },
    methods: {
        logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
        },
        // 获取所有的菜单
        async getMenuList(){
            const {data: result} = await this.$http.get('menu');
            if(result.meta.status !== 200){
                return this.$message.console.error(result.data.msg);
            }
            this.menuList = result.data.menuList;
            console.log(menuList);
        },
        // 点击展开折叠菜单
        toggleClick(){
            this.isCollapse = !this.isCollapse;
        }
    }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-mian {
  background-color: #eaedf1;
}
.el-menu-vertical-demo {
  border-right: none;
}
.confont{
  margin-right: 10px;
}
.toggle-botton{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>