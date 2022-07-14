<template>
  <div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      :multiple="true"
      action=""
      :auto-upload="false"
      :on-change="handleChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">选择上传文件</div>
    </el-upload>
    <el-input v-model="ruleForm.summary" placeholder="请输入备注" />
    <div class="tag_div">
      <el-input v-model="tagtext" placeholder="请输入标签" />
      <el-button type="primary" @click="addTagFun">添加标签</el-button>
    </div>
    <el-tag
      v-for="tag in ruleForm.tags"
      :key="tag"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <div class="but_div">
      <el-button plain @click="closeDialog">关闭</el-button>
      <el-button type="primary" plain @click="submitUpload">上传</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch, defineEmits, reactive } from 'vue'
import { postFileId } from '@/api/home'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'

const uploadRef = ref<UploadInstance>()

const props = defineProps({
  path:{
    type: String
  }
})

const emit = defineEmits(['closeFun', 'getnewList'])

interface ruleFormtype {
    id: string
    path: string
    file: any
    summary: string
    tags: string[]
}

const ruleForm = reactive<ruleFormtype>({
  id: '0',
  path: '/',
  file: '',
  summary: '',
  tags: []
})

const tagtext = ref<string>('')

let fromList:any[] = []

watch(
  ()=>props.path,
  (val)=>{
    ruleForm.path = val || '/'
  },
  { immediate: true }
)

const handleChange = (uploadFile)=>{
  console.log(uploadFile)
  let formData = new FormData()
  formData.append('file',uploadFile.raw)
  formData.append('path', ruleForm.path==='/' ? `/${uploadFile.name}` : `${ruleForm.path}/${uploadFile.name}`)
  fromList.push(formData)
}

const submitUpload = async()=>{
  try {
    console.log(fromList)
    fromList.map( async (item)=>{
      item.append('summary', ruleForm.summary)
      item.append('tags', ruleForm.tags)
      const res = await postFileId(ruleForm.id,item)
      console.log(res)
    })
    uploadRef.value?.clearFiles()
    // 会导致有bug
    setTimeout(()=>{
      emit('closeFun')
      emit('getnewList', props.path)
    },500)
  } catch (error) {
    console.log(error)
  }
}

const addTagFun = ()=>{
  if(!tagtext.value) return
  if(ruleForm.tags.indexOf(tagtext.value) === -1){
    ruleForm.tags.push(tagtext.value)
    tagtext.value = ''
  }else{
    ElMessage({
      message: '不能添加重复标签',
      type: 'warning'
    })
    tagtext.value = ''
  }
}

const handleClose = (tag: string) => {
  ruleForm.tags.splice(ruleForm.tags.indexOf(tag), 1)
}

const closeDialog = () => {
  ruleForm.id = '0'
  ruleForm.path = '/'
  ruleForm.file = ''
  ruleForm.summary = ''
  ruleForm.tags = []
  tagtext.value = ''
  emit('closeFun')
}

</script>
<style scoped lang="scss">
.upload-demo{
    margin-bottom: 10px;
    :deep(.el-upload--text){
        width: 100%;
    }
    :deep(.el-upload-dragger){
        width: 100%;
    }
}
.but_div{
    padding-top: 20px;
    text-align: right;
}
.tag_div{
    display: flex;
    padding: 10px 0;
    .el-button{
        margin-left: 8px;
    }
}
</style>
