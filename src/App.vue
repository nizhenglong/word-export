<template>
  <div id="app">
    <button @click="exportWord">
      导出word
    </button>

    
  </div>
</template>

<script>
import ExportBriefDataDocx from './utils/createdWord'
export default {
  data() {
    return {
      config:{
        name:'张三',
        age:'123'
      }
    }
  },
  methods:{
    exportWord() {
      ExportBriefDataDocx('/test.docx',this.config,'测试.docx')
    }
  }

}
</script>


<style>
* {
  padding: 0;
  margin: 0;
}
</style>
