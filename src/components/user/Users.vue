<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图组件 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            size="small"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            class="input-with-select"
          >
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="userList" style="width: 100%" size="small" border stripe>
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="age" label="年龄"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="msg_status" label="状态">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.msg_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="useStatusChang(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(socpe.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="13%"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="addForm.age"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="13%"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="editForm.age"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q'
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          console.log(value + Number.isInteger(value))
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 20
      },
      userList: [
        {
          id: 1,
          username: '张三',
          age: 20,
          address: '上海徐汇区',
          msg_status: true
        }
      ],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      // 控制添加用户对话框显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框显示与隐藏
      editDialogVisible: false,
      addForm: {
        username: '',
        age: '',
        address: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '请输入3到10个字符之间',
            trigger: 'blur'
          }
        ],
        age: [
          {
            required: true,
            message: '请输入年龄',
            trigger: 'blur'
          },
          { validator: checkAge, trigger: 'blur' }
        ],
        address: [
          {
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户信息失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.pageNum = res.data.pageNum
      this.pageSize = res.data.pageSize
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pageSize = newsize
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange(newpage) {
      this.queryInfo.pageNum = newpage
      this.getUserList()
    },
    // 监听 switch 触发事件
    useStatusChang(userInfo) {
      const { data: res } = this.$http.put(
        `users/${userInfo.id}/status/${userInfo.msg_status}`
      )
      if (res.status !== 200) {
        userInfo.msg_status = !userInfo.msg_status
        this.$message.error('更新状态失败！')
        return
      }
      this.$message.success('更新状态成功！')
    },
    // 监听对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(validator => {
        if(!validator){
          return;
        };
        const {data: res} = this.$http.post('user', this.addForm);
        if(res.meta.status !== 200){
          this.$message.error("添加用户失败！");
          return;
        }
        this.$message.success("添加用户成功！");
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    // 修改事件
    async showEditDialog(id){
      // const {data: res} = await this.$http.get(`/user/${id}`)
      // if(res.meta,status !== 200){
      //   this.$message.error("获取用户信息详情失败！");
      //   return;
      // }
      // this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    editUser(){
      this.$refs.editFormRef.validate(async validate => {
        if(!validate){
          return
        }
        // 请求修改
        const {data: res} = await this.$http.put("/user/" + this.editForm.id,{
          email: this.editForm.email, mobile: this.editForm.mobile 
        })
        // 关闭修改框
        this.editDialogVisible = false;
        // 刷新列表
        this.getUserList();
        // 提示消息
        if(res.meta.status !== 200){
          this.$message.error("新增失败！");
        }
        this.$message.success("新增成功!");
      })
    },
    // 删除用户数据
    removeUser(id){
      // 提示是否要删除
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const {data: res} = this.$http.delete("/user/" + id);
          if(res.meta.status !== 200){
            this.$message.error("删除失败！")
            return;
          }
          this.$message.success("删除成功!")
          this.getUserList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>
<style lang="less" scoped>
</style>