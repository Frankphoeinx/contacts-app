<script setup>
// props
const props = defineProps({
  plus: Boolean
})
</script>

<template>
  <button class="button">
    <div class="button__text"><slot /></div>
    <span v-if="plus">+</span>
  </button>
</template>
<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 15px;
  color: #585252;
  padding: 10px 25px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);
  border: none;
  width: fit-content;
  &:hover {
    background: #585252;
    color: #ffffff;
  }
  &:active {
    background: #383838;
  }
  .button__text {
    font-size: 16px;
  }

  span {
    margin-left: 90px;
    font-size: 20px;
  }
}
</style>
