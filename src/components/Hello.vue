
<template>
  <div>
    <!-- 新增特性 -->
    <p>
    <input type="text" @keydown.enter="addFeature">
  </p>
    <!-- ts特性列表 -->
    <ul>
      <li v-for="item in features" :key="item.id">{{item.name}}</li>
      <li>特性总数：{{count}}</li>
    </ul>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Feature } from '@/types';
  import { getFeature } from '@/api/features';

  @Component
  export default class Hello extends Vue {
    //属性就是data
    features: Feature[] = []

    //函数直接作为时间回调
    addFeature(e: KeyboardEvent) {
      //target类型EventTarget
      const inp = e.target as HTMLInputElement
      this.features.push({id: this.features.length+1 ,name:inp.value})
      inp.value = ''
    }

    //如果和生命周日钩子同名，就是生命周期
    created() {
      getFeature().then(res => {
        console.log(res.data)
      })
      this.features = [{id: 1,name:'类型注解'}, {id:2,name:'编译型语言'}]
    }

    //存取器用于计算属性
    get count() {
      return this.features.length
    }
  }

</script>