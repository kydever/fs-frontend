<template>
  <div>
    <el-input v-model="folderName" placeholder="请输入文件夹名称" />
    <div class="but_div">
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="submitUpload">创建</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, defineExpose } from 'vue'
import { postFileCreatedir } from '@/api/home'
import { ElMessage, ElLoading } from 'element-plus'
const props = defineProps({
  path:{
    type: String
  }
})
const emit = defineEmits(['closeFun', 'getnewList'])

const folderName = ref<string>('')

const fullscreenLoading = ref<any>(null)

const resetDataFun = () => {
  folderName.value = ''
}

const closeDialog = () => {
  resetDataFun()
  emit('closeFun')
}

const submitUpload = async ()=>{
  fullscreenLoading.value = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const body = {
      path: props.path === '/' ? `/${folderName.value}`: `${props.path}/${folderName.value}`
    }
    const { saved } = await postFileCreatedir(body)
    if(saved){
      ElMessage({
        message: '文件夹新增成功',
        type: 'success'
      })
      emit('getnewList',props.path)
      emit('closeFun')
    }
  } catch (error) {
    console.log(error)
  } finally {
    fullscreenLoading.value.close()
  }
}
defineExpose({ resetDataFun })
</script>
<style scoped lang="scss">
.but_div{
    padding-top: 20px;
    text-align: right;
}
</style>
