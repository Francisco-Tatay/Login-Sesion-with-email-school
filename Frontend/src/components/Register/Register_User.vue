<template>
  <div class="register_container">
    <div class="bg_blur"></div>
    <div class="card">
      <div class="card_header">
        <div class="logo_dot"></div>
        <div>
          <h2>Crear cuenta</h2>
          <p>Regístrate con tu correo y contraseña</p>
        </div>
      </div>

      <form @submit.prevent="handleRegister">
        <label class="field">
          <span>Email</span>
          <div class="input_wrap">
            <input type="email" v-model="email" placeholder="tucorreo@dominio.com" required />
          </div>
        </label>

        <label class="field">
          <span>Contraseña</span>
          <div class="input_wrap">
            <input
              type="password"
              v-model="password"
              placeholder="********"
              minlength="6"
              required
            />
          </div>
        </label>

        <button type="submit" :disabled="loading" class="primary_btn">
          <span>{{ loading ? "Registrando..." : "Registrarse" }}</span>
        </button>

        <div class="divider">
          <span>o</span>
        </div>

        <a class="link_login" href="/">¿Ya tienes cuenta? Inicia sesión</a>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/UseStore";
document.title = "Register";
const email = ref("");
const password = ref("");
const loading = ref(false);

const handleRegister = async () => {
  const userStore = useUserStore();
  loading.value = true;
  try {
    await userStore.addUser({ email: email.value, password: password.value });
    alert("Registro exitoso");
  } catch (error) {
    alert("Error en el registro: " + (error?.message || "desconocido"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register_container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(900px 400px at 10% -10%, rgba(59, 130, 246, 0.18), transparent 60%),
    radial-gradient(700px 300px at 110% 0%, rgba(99, 102, 241, 0.2), transparent 60%),
    linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.bg_blur {
  position: absolute;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 60%);
  filter: blur(30px);
  top: -200px;
  right: -200px;
}

.card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  padding: 28px;
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  animation: fadeUp 0.35s ease;
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
  font-size: 24px;
  letter-spacing: -0.2px;
  color: #0f172a;
}

p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
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
  margin-top: 6px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.05s,
    box-shadow 0.2s,
    filter 0.2s;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
}

.primary_btn:hover {
  filter: brightness(1.03);
}

.primary_btn:active {
  transform: translateY(1px);
}

.primary_btn:disabled {
  background: #93c5fd;
  box-shadow: none;
  cursor: not-allowed;
}

.divider {
  display: grid;
  place-items: center;
  color: #94a3b8;
  font-size: 12px;
  position: relative;
  margin: 6px 0;
}

.divider::before,
.divider::after {
  content: "";
  height: 1px;
  background: #e2e8f0;
  width: 40%;
  position: absolute;
  top: 50%;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.link_login {
  text-align: center;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.link_login:hover {
  text-decoration: underline;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
