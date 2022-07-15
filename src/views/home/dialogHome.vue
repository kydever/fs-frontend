<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-dialog
    v-model="visible"
    :title="isfile?'上传文件':'新增文件夹'"
    width="30%"
    :before-close="handleClose"
  >
    <uploadFile
      v-if="isfile"
      ref="uploadFileRef"
      :path="path"
      :modify-data="modifyData"
      :ismodify="ismodify"
      @closeFun="handleClose"
      @getnewList="getnewList"
    />
    <uploadFolder
      v-if="!isfile"
      ref="uploadFolderRef"
      :path="path"
      @closeFun="handleClose"
      @getnewList="getnewList"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue'
import uploadFile from './uploadFile.vue'
import uploadFolder from './uploadFolder.vue'
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  path:{
    type: String
  },
  isfile:{
    type: Boolean
  },
  ismodify:{
    type: Boolean
  },
  modifyData:{
    type: Object
  }
})

const uploadFileRef = ref(null)
const uploadFolderRef = ref(null)

const emit = defineEmits(['closeFun','getnewList'])

const handleClose = () => {
  if (props.isfile) {
    uploadFileRef.value.resetDataFun()
  }else{
    uploadFolderRef.value.resetDataFun()
  }
  emit('closeFun')
}

const getnewList = (path:string) => {
  emit('getnewList', path)
}

</script>
