import axios from './axios'

export const getUsers = async (id) => {
  try {
    const { data } = await axios.get('/users', { params: { id } })
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

export const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`/users/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export const updateUser = async (id, user) => {
  try {
    const { data } = await axios.put(`/users/${id}`, user)
    return data
  } catch (error) {
    console.log('Error updating user:', error)
    throw error
  }
}

export const changeAvatar = async (id, avatar) => {
  try {
    const { data } = await axios.put(`/users/${id}/avatar`, avatar)
    return data
  } catch (error) {
    console.log('Error changing avatar:', error)
    throw error
  }
}

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const getFiles = async () => {
  try {
    const { data } = await axios.get('/file')
    return data
  } catch (error) {
    console.error('Error fetching files:', error)
    throw error
  }
}

export const deleteFile = async (id) => {
  try {
    const { data } = await axios.delete(`/file/${id}`)
    return data
  } catch (error) {
    console.log('Error deleting file:', error)
  }
}
