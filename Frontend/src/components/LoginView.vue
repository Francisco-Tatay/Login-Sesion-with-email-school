<script setup>
import { useUserStore } from "@/stores/UseStore";
import { ref } from "vue";
document.title = "Login";
const email = ref("");
const password = ref("");
const error = ref("");
const response = ref("");
async function handleLogin() {
  error.value = "";
  response.value = "";
  try {
    // console.log(email.value,password.value);
    const store = useUserStore();
    const data = await store.loginUser({ email: email.value, password: password.value });
    response.value = data?.message || "Inicio de sesion exitoso";
  } catch (err) {
    error.value = err.message || "An error occurred during login";
  }
}
</script>

<template>
  <div class="login-container">
    <div class="bg_blur"></div>
    <form class="card" @submit.prevent="handleLogin">
      <div class="card_header">
        <div class="logo_dot"></div>
        <div>
          <h2>Iniciar sesión</h2>
          <p>Accede con tu correo y contraseña</p>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <div class="input_wrap">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input_wrap">
          <input id="password" v-model="password" type="password" placeholder="********" required />
        </div>
      </div>

      <button type="submit" class="primary_btn">Ingresar</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="response" class="success">{{ response }}</p>
    </form>
    <div class="links">
      <RouterLink to="/register" class="link"> Ir al registro </RouterLink>
    </div>
    <div class="links">
      <RouterLink to="/send-email" class="link"> ¿Olvidaste tu contraseña? </RouterLink>
    </div>
    <div class="links">
      <RouterLink to="/" class="link"> Ver las 3 opciones principales </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(900px 400px at 10% -10%, rgba(59, 130, 246, 0.18), transparent 60%),
    linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.bg_blur {
  position: absolute;
  width: clamp(250px, 44vw, 520px);
  height: clamp(250px, 44vw, 520px);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 60%);
  filter: blur(30px);
  top: -200px;
  right: -200px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
}

.card_header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.logo_dot {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
}

h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #0f172a;
}

p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.form-group {
  margin-bottom: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 13px;
  color: #475569;
}

.input_wrap {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  outline: none;
  color: #0f172a;
  font-size: 14px;
}

.input_wrap:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
}

.primary_btn {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    filter 0.2s,
    transform 0.05s;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
}

.primary_btn:hover {
  filter: brightness(1.03);
}

.primary_btn:active {
  transform: translateY(1px);
}

.error {
  margin-top: 10px;
  color: #ef4444;
  text-align: center;
  font-size: 13px;
}

.links {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  text-align: center;
}

.link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  font-size: 13px;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    padding: 18px;
  }

  .bg_blur {
    top: -150px;
    right: -130px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 14px;
  }

  .card {
    padding: 20px;
    border-radius: 14px;
  }

  h2 {
    font-size: 20px;
  }

  input,
  .primary_btn {
    font-size: 13px;
  }
}
</style>
