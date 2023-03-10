import { supabase } from "@/services/supabase.js"
import { v4 } from "uuid"

export const uploadImageApi = async (file) => {
  const {
    data: { path },
    error
  } = await supabase.storage.from("images").upload(`${v4()}`, file, {
    cacheControl: "3600",
    upsert: false
  })

  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, повторите попытку"
    }
  }

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${path}`
}

export const deleteImageApi = async (image) => {
  const imageArray = image.split("/")
  const { error } = await supabase.storage
    .from("images")
    .remove(`${imageArray[imageArray.length - 1]}`)

  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, при удалении фото"
    }
  }
  return "success"
}

export const createContactsApi = async (contact) => {
  const { data, error } = await supabase.from("contacts").insert(contact).select("*")

  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, при добавлении контакта"
    }
  }

  return data[0]
}

export const updateContactsApi = async (contact) => {
  const { data, error } = await supabase.from("contacts").upsert(contact).select("*")

  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, при обновлении контакта"
    }
  }

  return data[0]
}

export const fetchContactsApi = async (userId, from, to) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    return { error }
  }

  return data
}

export const deleteContactApi = async (id) => {
  const { error } = await supabase.from("contacts").delete().eq("id", id)
  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, при удалении контакта"
    }
  }

  return "success"
}

export const fetchContactDetailApi = async (userId, id) => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("userId", userId)
    .eq("id", id)

  if (error) {
    return {
      error,
      errorMessage: "Произошла ошибка, при получении контакта"
    }
  }
  return data
}
