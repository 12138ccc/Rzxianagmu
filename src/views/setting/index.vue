<template>
  <div>
    <template>
      <div class="app-container">
        <el-card>
          <el-tabs v-model="activeName">
            <el-tab-pane label="角色管理" name="first">
              <el-button type="primary" style="margin-left:10px" icon="el-icon-plus" size="small" @click="addRoles">新增角色</el-button>
              <el-table
                v-loading="loading"
                :data="roleList"
                style="width: 100%"
                border=""
              >
                <el-table-column

                  label="序号"
                  width="180"
                  type="index"
                />
                <el-table-column
                  prop="name"
                  label="角色名称"
                  width="180"
                />
                <el-table-column
                  prop="description"
                  label="描述"
                />

                <el-table-column width="240" label="操作">
                  <template slot-scope="{row}">
                    <el-button size="small" type="success">分配权限</el-button>
                    <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>

              <el-row type="flex" justify="end" align="middle" style="hight:60px">

                <el-pagination
                  v-if="total>0"
                  layout="prev, pager, next,sizes"
                  :total="total"
                  :current-page.sync="page.page"
                  :page-size.sync="page.pagesize"
                  :page-sizes="[2,5,10,15]"
                  @current-change="getROleList"
                  @size-change="getROleList"
                />

              </el-row>
            </el-tab-pane>
            <!-- 公司信息 -->
            <el-tab-pane label="公司信息" name="second">
              <el-alert
                title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                type="info"
                show-icon
                :closable="false"
              />
              <!-- 表单组件 -->
              <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
                <el-form-item label="公司名称">
                  <el-input v-model="companyInfo.name" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

          </el-tabs>
        </el-card>
        <add-role ref="addRole" :dislog-visible.sync="dislogVisible" @refreshList="getROleList" />
      </div>

    </template>
  </div>
</template>

<script>
import { getROleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './compoents/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      dislogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getROleList()
    this.getCompanyInfo()
  },

  methods: {
    addRoles() {
      this.dislogVisible = true
    },
    editRole(row) {
      // row直接赋值给addRole的formData
      // 地址一样，指同一个对象
      this.$refs.addRole.formData = { ...row }
      this.dislogVisible = true
      // 优化，数据是引用类型
    },
    // 删除
    async delRow(id) {
      try {
        await this.$confirm('确定删除该角色', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        // console.log('success')
        await deleteRole(id)
        // 刷新列表
        this.getROleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log('error')
      }
    },
    // 获取公司接口封装好
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
      // console.log(this.companyInfo)
    },
    async getROleList() {
      try {
        this.loading = true
        const { rows, total } = await getROleList(this.page)

        this.total = total
        this.roleList = rows
        // total 大于0 并且 rows的length === 0 这种情况并不是正在的没有数据 是有的，要重新发起请求
        if (this.total > 0 && rows.length === 0) {
          this.page.page--
          this.getROleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
