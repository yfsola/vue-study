
// 1、替换数组原型中7个方法
const originalProto = Array.prototype;
//备份一个，修改备份

const arrayProto = Object.create(originalProto);
['push','pop','shift','unshift'].forEach(method => {
  arrayProto[method] = function() {
  //原始操作

    originalProto[method].apply(this,arguments)
    console.log('数组执行：'+method+'操作')
  }

})


function defineReactive(obj,key,val) {

  observe(val)

  //创建一个dep和当前的key一一对应

  const dep = new Dep()


  //对传入的obj访问的拦截
  Object.defineProperty(obj,key,{
    get() {
      console.log('get',key)
      //依赖收集在这里
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(newVal) {
      if(newVal !== val) {
        console.log(`set ${key}:${newVal}`)
        observe(newVal)
        val = newVal

        //通知更新
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj == null) {
    return 
  }

  new Observer(obj)
}

//代理函数，方便用户直接访问$data中的数据
function proxy(vm,sourceKey) {
  Object.keys(vm[sourceKey]).forEach(key => {
    //将$data中的属性代理到vm的属性中
    Object.defineProperty(vm,key,{
      get() {
        return vm[sourceKey][key]
      },
      set(newVal) {
        vm[sourceKey][key] = newVal
      }
    })
  })
}

//kvue vue构造函数


// 创建kvue构造函数
class KVue  {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    //响应化处理
    observe(this.$data)
    proxy(this,'$data')
    //创建编译器的实例
    new Complier(options.el,this)
  }
  
}

//根据对象类型决定如何做响应化
class Observer {
  constructor(value) {
    this.value = value

    if(Array.isArray(value)) {
      this.arrWalk(value)
    } else {
      this.walk(value)
    }
  }

  //对象数据的响应化
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj,key,obj[key])
    })
  }

  //数组数据的响应化
  arrWalk(obj) {
    obj.__proto__ = arrayProto
    // 对数组内部的元素执行响应化
    const keys = Object.keys(obj)
    for(let i=0; i<obj.length;i++) {
      observe(obj[i])
    }
  }
}

// 观察者：保存更新函数，值发生变化调用更新函数
// const watchers= []
class Watcher {
  constructor(vm,key,updateFn) {
    this.vm = vm

    this.key = key

    this.updateFn = updateFn
    // watchers.push(this)

    // Dep.target静态属性上设置为当前watcher实例
    Dep.target = this
    this.vm[this.key]  //读取触发了getter
    Dep.target = null  //收集完就置空
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}


//Dep: 依赖 管理某个Key相关所有watcher的实例
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(w => w.update())
  }
}
