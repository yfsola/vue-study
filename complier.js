//编译器
//递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归子元素
class Complier {
  constructor(el,vm) {
    // 保存kvue的实例
    this.$vm = vm
    this.$el = document.querySelector(el)

    if(this.$el) {
      //执行编译
      this.complie(this.$el)
    }
  }

  complie(el)  {
    // 遍历el树
    const childNodes = el.childNodes;
    childNodes.forEach(node => {
      if(this.isElement(node)) {
        console.log('编译元素',node.nodeName)
        this.complieElement(node)
      } else if(this.isInter(node)) {
        console.log('编译插值绑定',node.textContent)
        this.complieText(node)
      }


      //递归遍历子节点
      if(node.childNodes && node.childNodes.length > 0) {
        this.complie(node)
      }
    })
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    //首先是文本标签，其次是{{xx}}
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  isDirective(attr) {
    return attr.indexOf('k-') === 0
  }

  isEvent(attr) {
    return attr.indexOf('@') === 0
  }

  //k-text
  text(node,exp) {
    this.update(node,exp,'text')
  }

  //k-html
  html(node,exp) {
    this.update(node,exp,'html')
  }

  model(node,exp) {
    //update方法只完成赋值和更新
    this.update(node,exp,'model')

    // 事件监听
    node.addEventListener('input', e => {
      //将新的值赋值黑数据
      this.$vm[exp] = e.target.value
    })
  }

  eventHandler(node,exp,dir) {
    console.log(this.$vm,exp)
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp]
    node.addEventListener(dir,fn.bind(this.$vm))
  }

  complieElement(node) {
    //节点元素
    // 遍历其属性列表
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      //规则：指令以k-xx="oo" 定义k-text="counter"
      const attrName = attr.name  // k-xx
      const exp = attr.value
      if(this.isDirective(attrName)) {
        const dir = attrName.substring(2)  // xx
        //执行指令
        this[dir] && this[dir](node,exp)
      }

      if(this.isEvent(attrName)) {
        const dir = attrName.substring(1)

        //事件监听
        this.eventHandler(node,exp,dir)
      }

    })
  }

  complieText(node) {
    // node.textContent = this.$vm[RegExp.$1]
    this.update(node,RegExp.$1,'text')
  }

  update(node,exp,dir) {
    //初始化操作
    //指令对应的更新函数  xxUpdater
    const fn = this[dir+'Updater']
    fn && fn(node,this.$vm[exp])

    // 更新处理,封装一个更新函数，可以更新对应的dom元素
    new Watcher(this.$vm,exp,function(val) {
      fn && fn(node,val)
    })
  }

  textUpdater(node,value) {
    node.textContent = value
  }

  htmlUpdater(node,value) {
    node.innerHTML = value
  }

  modelUpdater(node,value) {
    //表单元素进行赋值
    node.value = value
  }
}