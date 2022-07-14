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
import { ref, defineProps, defineEmits } from 'vue'
import { postFileCreatedir } from '@/api/home'
import { ElMessage } from 'element-plus'
const props = defineProps({
  path:{
    type: String
  }
})
const emit = defineEmits(['closeFun', 'getnewList'])

const folderName = ref<string>('')

const closeDialog = () => {
  folderName.value = ''
  emit('closeFun')
}

const submitUpload = async ()=>{
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
  }
}
</script>
<style scoped lang="scss">
.but_div{
    padding-top: 20px;
    text-align: right;
}
</style>
