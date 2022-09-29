<template>
  <el-dialog
    :title="title"
    width="50%"
    :visible.sync="dislogVisible"
    :before-close="hanleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required: true, message:'角色必填',trigger:'blur'
        }]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="hanleClose">取 消</el-button>
      <el-button v-loading="loading" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dislogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  mounted() {},
  methods: {
    hanleClose() {
      this.$emit('update:dislog-visible', false)
      this.$refs.roleDialogForm.resetFields()
      // 清空
      this.formData = {
        name: '',
        description: ''
      }
    },
    async submit() {
      try {
        // 验证表单校验规则 全部通过才执行后续代码
        await this.$refs.roleDialogForm.validate()
        this.loading = true
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        this.$message.success(this.formData.id ? '编辑成功' : '添加成功')
        this.$emit('refreshList')
        this.hanleClose()
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
