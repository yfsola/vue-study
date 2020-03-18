//交叉类型
type First = {first:number}
type Second = {second:number}
//扩展新的type
type FirstAndSecond = First & Second;
function fun4(): FirstAndSecond {
  return {first:1, second:2}
}


//函数
//设置了就是必填参数
// 2.默认值 msg = 'abc'
// 3.可选参数？，放最后
function greeting(person: string, msg1='abc',msg2?:string): string {
  return ''
}


//函数重载：场景主要源码和框架，函数用参数个数，类型或者返回值类型区分同名函数
// 先声明(签名)，再实现
// 同名的声明有多个
function watch(cb1: () => void): void;
function watch(cb1: () => void, cb2?: (v1:any,v2:any) => void): void;
//实现
function watch(cb1: () => void, cb2?: (v1:any,v2:any) => void) {
  if(cb1 && cb2) {
    console.log('执行重载2')
  } else {
    console.log('执行重载1')
  }
}

//class ts
class Parent {
  private _foo = 'foo';  //私有属性，不能再类的外部访问
  protected bar = 'bar'; //保护属性，可以在子类内部中访问

  //参数属性：构造函数参数加修饰符，能够定义为成员属性
  constructor(public tua = 'tua') {}

  //放啊也有修饰符
  private someMethod() {}

  //存取器：属性访问方式，可添加二外逻辑，控制读写行
  //可用于计算属性
  get foo() {
    return this._foo
  }

  set foo(val) {
    this._foo = val
  }
}

class Child extends Parent {
 say() {
   return this.tua
 }
}

const p = new Parent()
const c = new Child()


//接口  仅用来约束形式
interface Person {
  firstName: string;
  lastName: string;
}
//greeting函数通过Person接口约束参数解构
function greeting1(person: Person) {
  return 'hello,' + person.firstName + ' ' + person.lastName
}
greeting1({firstName: 'Jane',lastName: 'ruby'}); //正确
// greeting1({firstName: 'Jane'}); //错误


//泛型
// interface Result {
//   ok: 0 | 1;
//   data: Feature[]
// }

//使用泛型
interface Result<T> {
  ok: 1 | 0;
  data: T;
}

//泛型方法
function getResult<T>(data: T): Result<T> {
  return {ok:1,data};
}
//用尖括号方式制定T为string
getResult<string>('hello')
//用类型推断制定T为number


