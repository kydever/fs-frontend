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
      :path="path"
      @closeFun="handleClose"
      @getnewList="getnewList"
    />
    <uploadFolder
      v-if="!isfile"
      :path="path"
      @closeFun="handleClose"
      @getnewList="getnewList"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import uploadFile from './uploadFile.vue'
import uploadFolder from './uploadFolder.vue'
defineProps({
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
  data:{
    type: Object
  }
})

const emit = defineEmits(['closeFun','getnewList'])

const handleClose = () => {
  emit('closeFun')
}

const getnewList = (path:string) => {
  emit('getnewList', path)
}

</script>
