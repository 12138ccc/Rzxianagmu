<template>

  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmploy" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:80%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-show="isShow"
          v-loading="loading"
          style="width:80%"
          :data="treeData"
          :default-expand-all="true"
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="quiry">取消</el-button>
          <el-button type="primary" size="small" @click="Btn">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import employeesEnum from '@/api/constant/employees'
import { tranListToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      hireType: employeesEnum.hireType,
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeData: [],
      isShow: false,
      loading: false
    }
  },
  // 部门处理
  // 部门这一块 el-input + el-tree组成
  // 什么时候 调用组织架构的接口 获得焦点
  // 选中数的节点 把节点对应的数据 给departmentName这个字段
  methods: {
    handleClose() {
      this.$refs.addEmploy.resetFields()
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.isShow = false
      this.$emit('update:dialogVisible', false)
    },
    quiry() {
      this.handleClose()
    },
    async getDepartments() {
      this.isShow = true
      this.loading = false
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.isShow = false
    },
    // 点击确定调用接口
    async Btn() {
      // 表单校验调用接口
      try {
        await this.$refs.addEmploy.validate()
        await addEmployee(this.formData) // 新增员工
        this.handleClose()
        this.$parent.getEmployeeList()
        this.$message.success('新增成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
