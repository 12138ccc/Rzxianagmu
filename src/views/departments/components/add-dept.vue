<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username11" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
export default {
  name: 'HrsaasAddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      //   console.log(depts)
      // 编辑模式下 ，让我自己和自己校验了？？
      // 解决方案 对比的过程中 把自己排除掉 然后再去对比
      let isRepeat = true
      if (this.formData.id) {
        isRepeat = depts.some(ele => ele.id !== this.formData.id && ele.code === value)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }

      isRepeat ? callback(new Error(`模块下已经存在${value}编码`)) : callback()
    }
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 编辑模式下 存在的问题：无法准确校验同级部门的数据（同级的列表到的不对）
      // 解决方案：先找到所有与自己处于同级的列表 然后再排除自己 然后判断
      let isRepeat = true
      if (this.formData.id) { // 编辑
        // 找同级部门
        // depts==>找到真正的同级部门
        // depts[{},{}{}...]
        // 排除自己，再判断名称是否重复
        const deptstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        isRepeat = deptstj1.some(ele => ele.name === value)
        console.log(deptstj1)
      } else { // 新增子部门
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        isRepeat = deptstj.some(ele => ele.name === value)
      }
      isRepeat ? callback(new Error(`该部门下已经存在${value}部门名称`)) : callback()

      // console.log(deptstj)
      // callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      loading: false,
      peoples: [],
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门管理必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍要求1-50个字符', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑模式' : '新增模式'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async submit() {
      // 表单验证通过
      try {
        await this.$refs.addDeptForm.validate()
        // 调用接口
        this.loading = true
        if (this.formData.id) { // 编辑模式
          await updateDepartments(this.formData)
        } else {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }

        // 因为是添加子部门，所以我们需要将新增的部门pid设置成当前部门的id新增的部门就成了自己的子部门
        // 调用接口成功之后，提示成功信息
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
        // 刷新父组件的组织架构列表
        this.$parent.getDepartments()
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}

</script>

<style>

</style>
