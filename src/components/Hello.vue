
<template>
  <div>
    <ul>
      <li v-for="item in features" :key="item">{{item}}</li>
    </ul>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  @Component
  export default Hello extends Vue {
    //属性就是data
    // features: string[] = ['类型注解', '编译型语言']
  }

</script>