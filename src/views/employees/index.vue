<template>
  <div>
    <PageTools type="success">
      <!-- <template #before>
        <span>共25条记录</span>
      </template> -->
      <template #after>
        <span><el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button></span>
      </template>
      <!-- <template v-slot="scope">
        <span>共25条记录{{ scope }}</span>
      </template> -->
    </PageTools>

  </div>
</template>

<script>
// import PageTools from '@/components/PageTools/index.vue'
export default {
  name: 'HrsaasIndex',
  // components: { PageTools },
  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
