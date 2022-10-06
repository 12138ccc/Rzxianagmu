<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <tree-tools :tree-node="company" :is-root="false" @addDept="handleAddDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tools slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" @editDept="editDept" @refreshList="getDepartments" />
    </el-tree>
    <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
</template>

<script>
import treeTools from './components/treetools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept.vue'
export default {
  name: 'HrsaasIndex',
  components: { treeTools, addDept },

  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      dialogVisible: false,
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' },
      currentNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyManage, companyName } = await getDepartments()
        // this.departs = depts
        this.departs = tranListToTreeData(depts, '')
        // console.log(this.departs)
        this.company = { name: companyName, manager: companyManage, id: '' }
      } finally {
        this.loading = false
      }
    },
    handleAddDept(node) {
      // addDept显示
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = { ...node }
      // 回显数据
      // node 赋值给addDept formData
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
  // .el-tree {

  // }
   .el-card__body {
      padding-right: 0px;
    }
}
</style>
