<script setup>
// vue
import { watch, reactive } from "vue"

// components
import Input from "@/components/Input.vue"
import Button from "@/components/Button.vue"
import Tag from "@/components/Tag.vue"
import ErrorMassage from "@/components/ErrorMessage.vue"
import LoaderFullScreen from "@/components/LoaderFullScreen.vue"
import UploadAvatar from "@/components/UploadAvatar.vue"

// store
import { useUserStore } from "@/stores/user"
import { useContactsStore } from "@/stores/contacts"

// vuelidate
import { useVuelidate } from "@vuelidate/core"
import { required, email, helpers } from "@vuelidate/validators"

// icons
import CloseIcon from "@/components/icons/CloseIcon.vue"

// api
import { uploadImageApi, createContactsApi } from "@/api/contacts.js"

// emit
const emit = defineEmits(["close"])

// global state
const { user } = useUserStore()
const { contacts } = useContactsStore()

// state
const state = reactive({
  name: "",
  phone: "",
  email: "",
  tag: "",
  tags: [],
  imageURL: "",
  imageFile: null,
  errorMessage: "",
  loading: false
})

const rules = {
  name: {
    required: helpers.withMessage("Обязательное поле", required)
  },
  phone: {
    required: helpers.withMessage("Обязательное поле", required)
  },
  email: {
    required: helpers.withMessage("Обязательное поле", required),
    email: helpers.withMessage("Невалидный email", email)
  }
}

const v$ = useVuelidate(rules, state)

// methods
const addTag = () => {
  if (state.tags.some((tag) => tag === state.tag)) return
  state.tags.push(state.tag)
  state.tag = ""
}

const removeTag = (index) => state.tags.splice(index, 1)

const uploadFiles = (e) => {
  let files = e.target.files
  if (!files[0]) return

  if (state.imageURL) {
    URL.revokeObjectURL(state.imageURL)
  }
  state.imageURL = window.URL.createObjectURL(files[0])
  state.imageFile = files[0]

  e.target.value = ""
}

const addContact = async (e) => {
  v$.value.$validate()
  if (v$.value.$error) return
  state.loading = true

  let contact = {
    userId: user.data.id,
    tags: state.tags,
    email: state.email,
    phone: state.phone,
    name: state.name
  }

  // upload image
  if (state.imageFile) {
    const uploadRes = await uploadImageApi(state.imageFile)
    if (uploadRes.error) {
      state.loading = false
      state.errorMessage = uploadRes.errorMessage
      return
    }
    contact.avatar = uploadRes
  }

  // create contact
  const createRes = await createContactsApi(contact)

  if (createRes.error) {
    state.errorMessage = createRes.errorMessage
    return
  }

  contacts.list.push(createRes)
  state.loading = false
  emit("close")
}
</script>

<template>
  <div class="create">
    <LoaderFullScreen v-if="state.loading" />
    <CloseIcon class="create__close" @click="emit('close')" />
    <form class="create__form" @submit.prevent>
      <h2 class="create__title">Добавить контакт:</h2>
      <UploadAvatar :src="state.imageURL" width="150px" @change="uploadFiles" />
      <div class="create__form__overflow">
        <Input
          v-model="state.name"
          label="Ф.И.О"
          placeholder="Введите Ф.И.О"
          dark
          name="name"
          class="create__form__input"
          :errorMessage="v$.name.$error && v$.name.$errors[0].$message"
        ></Input>
        <Input
          v-model="state.phone"
          label="Номер телефона"
          placeholder="Введите номер телефона"
          dark
          name="phone"
          class="create__form__input"
          :pattern="/[^+\d]/g"
          :errorMessage="v$.phone.$error && v$.phone.$errors[0].$message"
        ></Input>
        <Input
          v-model="state.email"
          label="Email"
          placeholder="Введите Email"
          dark
          name="email"
          class="create__form__input"
          :errorMessage="v$.email.$error && v$.email.$errors[0].$message"
        ></Input>
        <Input
          v-model="state.tag"
          label="Тег"
          placeholder="Введите тег и нажмите Enter"
          dark
          name="tag"
          class="create__form__input"
          @enter="addTag"
        ></Input>
        <div class="create__form__tags">
          <Tag
            closable
            v-for="(tag, index) in state.tags"
            :key="tag"
            class="tag"
            @onClick="removeTag(index)"
            >{{ tag }}</Tag
          >
        </div>
      </div>
      <ErrorMassage>{{ state.errorMessage }}</ErrorMassage>

      <Button type="button" @click="addContact" class="create__form__btn">Добавить</Button>
    </form>
  </div>
</template>
<style lang="scss" scoped>
::-webkit-scrollbar-thumb {
  background-color: #585252;
}
.create {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 400px;
  background: #ffffff;
  color: #585252;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.25);
  padding: 20px;

  .create__close {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 25px;
    height: 25px;
    cursor: pointer;
    z-index: 2;
  }
  .create__title {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 50px;
  }
  .create__form {
    display: flex;
    flex-direction: column;
    height: calc(100% - 20px);
    position: relative;

    .create__form__overflow {
      height: calc(100vh - 320px);
      overflow: auto;
      padding-right: 5px;
    }

    .create__form__input {
      margin-bottom: 15px;
    }
    .create__form__tags {
      display: flex;
      flex-wrap: wrap;
      .tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .create__form__btn {
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
}
</style>
