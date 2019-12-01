<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 登录头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" />
            </div>
            <!-- 登录表单 -->
            <el-form :model="loginFrom" ref="loginFormRef" :rules="rule" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item label="" prop="username">
                    <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="" prop="password">
                    <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            loginFrom:{
                username:"",
                password:""
            },
            // 表单验证规则
            rule:{
                // 用户名验证规则
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 30, message:"用户名长度在3到30之间", trigger: 'blur'}
                ],
                // 密码验证规则
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ]
            }
                
        }
    },
    methods: {
        // 表单重置
        reset() {
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            this.$refs.loginFormRef.validate((valid) => {
                console.log(valid);
            })
        }
    }
} 
</script>
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;

    .login_box{
        width: 450px;
        height: 300px;
        background-color: #FFFFFF;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            left: 50%;
            position: absolute;
            transform: translate(-50%, -50%);
            background-color: #FFFFFF;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        };
        .login_form{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            .btns{
                display: flex;
                justify-content: flex-end;
            }
        }
        
    }
}
</style>