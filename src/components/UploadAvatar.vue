<script setup>
// components
import Img from "@/components/Img.vue"

// icons
import UploadIcon from "@/components/icons/UploadIcon.vue"

// props
const props = defineProps({
  src: String,
  width: String,
  height: String
})
</script>

<template>
  <div
    class="avatar"
    :style="{
      width,
      minWidth: width,
      height: height || width,
      minHeight: height
    }"
  >
    <Img :src="src" width="100%" alt="Аватар" />
    <label class="avatar__upload">
      <UploadIcon class="avatar__upload__icon" />
      <input type="file" name="upload" @change="$emit('change', $event)" />
    </label>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  background: #d9d9d9;
  margin-bottom: 20px;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    .avatar__upload {
      top: 50%;
    }
  }
  .avatar__upload {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 100%;
    width: 100%;
    height: 50%;
    z-index: 10;
    background: rgba(#d9d9d9, 0.6);
    cursor: pointer;
    transition: 0.2s;
    &:active {
      background: #585252;
      .avatar__upload__icon {
        fill: rgba(#d9d9d9, 0.6);
      }
    }
    input {
      display: none;
    }
    .avatar__upload__icon {
      width: 45px;
      fill: #585252;
    }
  }
}
</style>
