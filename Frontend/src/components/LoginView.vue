<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="********" required />
      </div>
      <button type="submit">Ingresar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f8;
}

form {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h2 {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.7rem;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: black;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #369870;
}

.error {
  margin-top: 0.75rem;
  color: red;
  text-align: center;
}
</style>

<script setup>
import { ref } from "vue";
//import { useRouter } from 'vue-router'
//import { useAuthStore } from '@/store/auth'
//import LoginForm from '@/components/LoginForm.vue'

const email = ref("");
const password = ref("");
const error = ref(null);

//const router = useRouter()
//const auth = useAuthStore()

const handleLogin = async () => {
  // error.value = null
  // // 🔥 Simulación (luego va backend)
  // if (email.value === 'admin@test.com' && password.value === '1234') {
  //   auth.login({ email: email.value }, 'fake-token-123')
  // }
};
console.log("all correct ");
</script>
