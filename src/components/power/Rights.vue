<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.id)"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="showSetRightsDialog(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
    <!-- 树形输入框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogViaible" width="50%" :before-close="handleClose">
      <el-tree :default-checked-keys="defKeys" show-checkbox :data="rightsList" :props="treeProps" @node-click="handleNodeClick" node-key="id" :default-expand-all="true"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 初始化权限列表
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限信息失败!')
      }
      this.rightsList = res.data
      this.$message.success('获取权限信息成功！')
    },
    // 分配权限
    async showSetRightsDialog(role){
      // 获取所有权限数据
      const {data: res} = await this.$http.get("/rights/tree");
      if(res.meta.status !== 200){
        return this.$message.error("获取权限数据失败！");
      }
      this.rightsList = res.data;
      this.getLeafKey(role, this.defKeys);
      this.setRightsDialogViaible = true;
    },
    // 通过递归获取所有的三级节点id
    getLeafKey(node, arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKey(item, arr))
    }
  }
}
</script>
<style lang="less" scoped>
</style>