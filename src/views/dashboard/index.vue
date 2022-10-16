<template>
  <div class="dashboard-container">
    <upload-img @on-success="onSuccess1" />
    <upload-img @on-success="onSuccess2" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

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
    onSuccess1(val) {
      console.log(123, val)
    },
    onSuccess2(val) {
      alert(456, val)
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
