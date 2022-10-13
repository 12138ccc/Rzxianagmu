<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane lazy label="登录账户设置" name="first">
            <el-form ref="form" :model="accountInfo" :rules="rules" label-width="80px">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane lazy label="个人详情" name="second"><userInfo /></el-tab-pane>
          <el-tab-pane lazy label="岗位信息" name="third"><jobInfo /></el-tab-pane>

        </el-tabs>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getUserById, saveUserById } from '@/api/user'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: { userInfo, jobInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {},
      rules: {
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最小6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserByIdInfo()
  },
  methods: {
    async getUserByIdInfo() {
      const res = await getUserById(this.$route.params.id)
      console.log(res)
      this.accountInfo = res
    },
    async updateEmployees() {
      try {
        await this.$refs.form.validate()
        await saveUserById(this.accountInfo)
        this.$message.success('更新成功')
        // console.log('校验成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击tabs存储cookies数据
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
