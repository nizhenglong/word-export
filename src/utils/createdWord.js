
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

/**
 * 
 * @param {string} tempDocxPath 文件路径 默认放在public文件夹下
 * @param {object} data 数据
 * @param {string} fileName 导出文件名
 */
const  ExportBriefDataDocx = (tempDocxPath, data, fileName) => {
    var expressions = require('angular-expressions')
    var assign = require('lodash/assign')
    expressions.filters.lower = function(input) {
      if (!input) return input
      // toLowerCase() 方法用于把字符串转换为小写。
      return input.toLowerCase()
    }
    function angularParser(tag) {
      tag = tag
        .replace(/^\.$/, 'this')
        .replace(/(’|‘)/g, "'")
        .replace(/(“|”)/g, '"')
      const expr = expressions.compile(tag)
      return {
        get: function(scope, context) {
          let obj = {}
          const scopeList = context.scopeList
          const num = context.num
          for (let i = 0, len = num + 1; i < len; i++) {
            obj = assign(obj, scopeList[i])
          }
          return expr(scope, obj)
        }
      }
    }
    JSZipUtils.getBinaryContent(tempDocxPath, (error, content) => {
      if (error) {
        console.log(error)
      }
   
      // 创建一个JSZip实例，内容为模板的内容
      // let zip = new JSZip(content);
      const zip = new PizZip(content)
      // 创建并加载 Docxtemplater 实例对象
      const doc = new Docxtemplater(zip, { parser: angularParser })
      // 设置模板变量的值
      doc.setData(data)
      try {
        // 呈现文档，会将内部所有变量替换成值，
        doc.render()
      } catch (error) {
        const e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties
   
        }
        console.log({ error: e })
        // 当使用json记录时，此处抛出错误信息
        throw error
      }
      // 生成一个代表Docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
      // 将目标文件对象保存为目标类型的文件，并命名
      saveAs(out, fileName)
    })
  }

export default ExportBriefDataDocx
