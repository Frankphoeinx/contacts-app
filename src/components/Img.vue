<script setup>
// vue
import { reactive } from "@vue/reactivity"

// props
const props = defineProps({
  src: String,
  alt: String,
  width: String,
  height: String,
  background: String
})

// state
const state = reactive({
  show: null
})
</script>

<template>
  <div
    class="image"
    :style="{
      width,
      minWidth: width,
      height: height || width,
      background
    }"
  >
    <img v-show="state.show && src" :src="src" :alt="alt" @load="state.show = true" />
    <img v-show="!(state.show && src)" src="@/assets/images/image-placeholder.jpg" alt="Без фото" />
  </div>
</template>
<style lang="scss" scoped>
.image {
  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
}
</style>
