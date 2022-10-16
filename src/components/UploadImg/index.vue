<template>
  <div>
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      :file-list="fileList"
      list-type="picture-card"
      :on-preview="Preview"
      :on-remove="handleRemove"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :before-upload="beforeUpload"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览图片的弹层 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialog"
      width="50%"
    >
      <img style="width:100%" :src="previewImgUrl">

    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
console.log(COS)
const cos = new COS({
  SecretId: 'AKID96uOegT2OkxxlLoHi6Sl6NbkmfVMD6xg',
  SecretKey: 'YrxLxTs77tnRpdDZfV5Z4XmlW3MSM3Yt'
})
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      loading: false,
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewDialog: false,
      previewImgUrl: ''
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  methods: {
    Preview(file) {
      this.previewImgUrl = file.url
      this.previewDialog = true
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 上传之前
    beforeUpload(file) {
      // 1.文件类型
      const allowTypes = ['image/png']
      // 循环 查找某一个数据 是否在数组中
      // 1 . some()某一个数组 是否在数组中
      // 2 . find() 查找，找到的那一项的索引 更复杂的查找
      // 3. findIndex() 查找 返回的那一项的索引 更复杂的查找
      // 4 .indexof('1') 查找 返回的索引[{id:1},{id:2}] 用于简单类型数组
      // 5 . includes 查找 返回的是布尔 简单数据类型
      const ishas = allowTypes.includes(file.type)
      if (!ishas) {
        this.$message.error('上传图片只能是' + allowTypes.join('.') + '格式!')
        return false
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传的图片不能超过1mb')
        return false
      }
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'hz-gfs-1314348478', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        this.loading = false
        if (err) return this.$message.error('上传图片失败')
        this.$emit('on-success', {
          imgUrl: 'https:' + data.Location
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.uploadImg{
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
