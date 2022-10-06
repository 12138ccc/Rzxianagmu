<template>
  <el-row type="flex" justify="space-between" align="middle" style="hight:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <!-- <span>江苏传智播客教育科技股份有限公司</span> -->
      <el-row type="flex">
        <span style="margin-right:8px">{{ treeNode.manager }}</span>
        <el-dropdown @command="handCommand">
          <span>
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="edit">编辑子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>

  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handCommand(type) {
      // console.log(type)
      if (type === 'add') {
        // 新增
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑
        this.$emit('editDept', this.treeNode)
      } else {
        // d删除
        // 二次确认
        this.$confirm('是否删除该部门', '提示', {
          type: 'warning'
        }).then(async res => {
          return delDepartments(this.treeNode.id)
        }).then(res => {
          console.log(res)
          this.$message.success('删除成功')
          // 调用父组件getDepartments 重新刷新列表
          this.$emit('refreshList')
        })
      }
    }
  }
}
</script>

<style>

</style>
