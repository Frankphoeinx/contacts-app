<script setup>
// icons
import CloseIcon from "@/components/icons/CloseIcon.vue"

// props
const props = defineProps({
  closable: Boolean
})
</script>

<template>
  <div :class="['tag', { tag_closable: closable }]">
    <slot />
    <CloseIcon v-if="closable" class="tag__icon" @click="$emit('onClick')" />
  </div>
</template>
<style lang="scss" scoped>
.tag {
  background: #d9d9d9;
  border-radius: 10px;
  padding: 9px 20px;
  font-size: 14px;
  line-height: 17px;
  color: #8e8e8e;

  &:hover {
    color: white;
    background: #9a9a9a;
    .tag__icon {
      stroke: white;
    }
  }

  &.tag_closable {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tag__icon {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>
