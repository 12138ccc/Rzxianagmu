<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon icon-class="eye-open" />
    <UploadExcel :before-upload="beforeUpload" :on-success="handleSuccess" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import UploadExcel from '@/components/UploadExce'
export default {
  name: 'Dashboard',
  components: { UploadExcel },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSuccess(data) {
      console.log('data', data)
      // 做具体的业务逻辑
    },
    beforeUpload(file) { // 出于上传文件之前 可能需要对文件校验的场景 提供beforeUpload字段，可以使用者自由定义校验规则。
      console.log(file)
      if (file.size > 1024) {
        this.$message.error('to big')
        return false
      }
      return true
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
