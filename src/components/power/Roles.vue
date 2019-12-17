<template>
  <div>
    <el-table :data="dataLst" border stripe>
        <!-- 展开列 -->
      <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, l1) in scope.row.children" closable @click="romverAuthClick(scope.row, item1.id)" :key="item1.id">
                <!-- 渲染一级 -->
                <el-col :span="5">
                    <el-tag>{{item1.authName}}</el-tag>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                    <el-row :class="[l2 === 0 ? '': 'bdtop','vcenter']" closable @click="romverAuthClick(scope.row, item2.id)" v-for="(item2, l2) in item1.children" :key="item2.children">
                        <el-col :span="6">
                          <el-tag>{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                          <el-tag v-for="(item3, l3) in item2.children" closable @click="romverAuthClick(scope.row, item3.id)" :key="item3.children">
                            {{item3.authName}}
                          </el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <pre>
                {{scope.row}}
            </pre>
          </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDescription"></el-table-column>
      <el-table-column label="操作">
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
              @click="removeUser(socpe.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: []
    }
  },
  methods:{
    async romverAuthClick(role, rightId){
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(err => err)
      if(result !== 'confirm'){
        this.$message.info("取消了删除！")
      }
      const {data: res} = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`);

      if(res.meta.status !== 200){
        this.$message.error("删除权限失败！");
        return;
      }
      // 防止列表刷新，影响用户体验
      role.children = res.data;
    }
  }
}
</script>
<style lang="less" scoped>
bdtop{
    border-top: solid 1px #000000;
}
vcenter{
  display: flex;
  align-items: center;
}
</style>