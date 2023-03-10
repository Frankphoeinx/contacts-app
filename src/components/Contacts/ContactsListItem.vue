<script setup>
// vue
import { RouterLink } from "vue-router"

// components
import Tag from "@/components/Tag.vue"
import Img from "@/components/Img.vue"

// icons
import DeleteIcon from "../icons/DeleteIcon.vue"

// api
import { deleteContactApi, deleteImageApi } from "@/api/contacts.js"
import { useContactsStore } from "../../stores/contacts"

// props
const props = defineProps({
  contact: Object
})

// global state
const { contacts } = useContactsStore()

// methods
const deleteContact = async () => {
  contacts.loading = true
  if (props.contact.avatar) {
    const deleteRes = await deleteImageApi(props.contact.avatar)
    if (deleteRes.error) {
      contacts.loading = false
      throw deleteRes.error
    }
  }

  const response = await deleteContactApi(props.contact.id)
  contacts.loading = false
  if (response.error) throw response.error

  const index = contacts.list.findIndex((contact) => contact.id === props.contact.id)
  if (index !== -1) {
    contacts.list.splice(index, 1)
  }
}
</script>

<template>
  <RouterLink :to="`/contacts/${contact.id}`" class="contact">
    <DeleteIcon class="contact__icon" @click.prevent="deleteContact" />
    <Img :src="contact.avatar" width="150px" />
    <div class="contact__info">
      <Tag class="contact__info__item">Ф.И.О: {{ contact.name }}</Tag>
      <div class="contact__info__item_grid">
        <Tag class="contact__info__item">Номер: {{ contact.phone }}</Tag>
        <Tag class="contact__info__item">Email: {{ contact.email }}</Tag>
      </div>
      <div class="contact__info__tags">
        <Tag v-for="tag in contact.tags" :key="tag" class="contact__info__tag">{{ tag }}</Tag>
      </div>
    </div>
  </RouterLink>
</template>
<style lang="scss" scoped>
.contact {
  position: relative;
  display: flex;
  align-items: start;
  padding: 25px 75px;
  background: #ffffff;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    .contact__icon {
      opacity: 1;
      visibility: visible;
    }
  }
  .contact__icon {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 25px;
    height: 25px;
    fill: #9b9b9b;
    opacity: 0;
    visibility: hidden;
    transition: 0.2s;
  }
  .contact__info {
    padding-left: 50px;
    width: 100%;
    .contact__info__item {
      margin-bottom: 5px;
    }
    .contact__info__item_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .contact__info__tags {
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      .contact__info__tag {
        text-align: center;
      }
    }
  }
}
</style>
