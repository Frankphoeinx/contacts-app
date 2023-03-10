<script setup>
// libs
import { v4 } from "uuid"

// components
import ErrorMessage from "@/components/ErrorMessage.vue"

// icons
import SearchIcon from "@/components/icons/SearchIcon.vue"

let id = v4()

// props
const props = defineProps({
  search: Boolean,
  label: String,
  type: String,
  placeholder: String,
  modelValue: String,
  name: String,
  errorMessage: [String, Boolean],
  dark: Boolean,
  pattern: RegExp
})

// emits
const emit = defineEmits(["update:modelValue", "enter"])

const inputMethod = (e) => {
  let text = e.target.value

  if (props.pattern) {
    text = text.replace(props.pattern, "")
    e.target.value = text
  }

  emit("update:modelValue", text)
}
</script>

<template>
  <div class="input">
    <label v-if="label" :for="id" class="input__label">{{ label }}</label>
    <div
      :class="[
        'input__wrapper',
        {
          input__wrapper_dark: dark
        }
      ]"
    >
      <label v-if="search" :for="id" class="input__icon">
        <SearchIcon />
      </label>
      <input
        :type="type"
        :placeholder="placeholder"
        :id="id"
        class="input__field"
        :name="name"
        :value="modelValue"
        @input="inputMethod"
        :pattern="pattern"
        @keyup.enter="emit('enter')"
      />
    </div>
    <ErrorMessage v-if="errorMessage" class="input__error">{{ errorMessage }}</ErrorMessage>
  </div>
</template>
<style lang="scss" scoped>
.input {
  .input__label {
    display: block;
    padding-left: 15px;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .input__wrapper {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    height: 50px;
    padding: 0 30px;
    &.input__wrapper_dark {
      background: #d9d9d9;
      .input__field {
        color: #878080;
        &::placeholder {
          color: #878080;
        }
      }
    }

    .input__icon {
      cursor: pointer;
      margin-right: 15px;
    }
    .input__field {
      width: 100%;
      height: 100%;
      border: none;
      // Чисто ради визуала, в продакшн проектах outline лучше не отключать))
      outline: none;
      background: transparent;
      font-size: 16px;
      line-height: 18px;
      color: #878080;
      &::placeholder {
        color: #878080;
      }
    }
  }
  .input__error {
    text-align: center;
  }
}
</style>
