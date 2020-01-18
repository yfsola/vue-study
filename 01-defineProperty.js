// 数组响应式
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

//对象响应式

function defineReactive(obj,key,val) {

  observe(val)
  //对传入的obj访问的拦截
  Object.defineProperty(obj,key,{
    get() {
      console.log('get',key)
      return val;
    },
    set(newVal) {
      if(newVal !== val) {
        console.log(`set ${key}:${newVal}`)
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if(typeof obj !== 'object' || obj == null) {
    return 
  }

  // 判断传入的obj的类型
  if(Array.isArray(obj)) {
    //覆盖原型，替换7个变更操作
    obj.__proto__ = arrayProto
    // 对数组内部的元素执行响应化
    const keys = Object.keys(obj)
    for(let i=0; i<obj.length;i++) {
      observe(obj[i])
    }
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj,key,obj[key])
    })
  }
  
}

function set(obj,key,val) {
  defineReactive(obj,key,val)
}


// defineReactive(obj,'foo','foo')

// obj.foo
// obj.foo='fooooooooo'

const obj = {foo:'foo',bar: 'bar',baz: {a:1},arr:[1,2,3]}
observe(obj)

obj.foo
obj.foo = 'fooooooo'
obj.bar
obj.bar = 'barrrrrrr'
obj.baz.a = 10

obj.baz = {a:100}
obj.baz.a = 10000

set(obj,'dong','dong')
obj.dong

//Object.definProperty()对数组无效
//解决方案：修改数组实例的方法，让数组更新的时候进行更新
obj.arr.push(4)

