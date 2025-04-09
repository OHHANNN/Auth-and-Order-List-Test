<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from 'stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const res = await axios.post('https://dev.tapgo.cc/test/auth/login', {
      username: username.value,
      password: password.value,
    })

    const token = res.data.token
    const user = res.data.user || { username: username.value }

    auth.login(token, user)

    router.push('/order/list')
  } catch (err) {
    console.error('登入失敗', err)
    alert('登入失敗，請檢查帳號密碼')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2" style="width: 300px">
      <q-card-section>
        <div class="text-h6 text-center">登入</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="使用者名稱" outlined dense />
        <q-input v-model="password" label="密碼" type="password" outlined dense class="q-mt-sm" />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="登入" color="primary" @click="handleLogin" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
