<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/UseStore";
document.title = "Register | School Login";
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

        <RouterLink class="link_login" to="/login">¿Ya tienes cuenta? Inicia sesión</RouterLink>
      </form>

      <RouterLink to="/" class="go_home">Ver las opciones principales</RouterLink>
    </div>
  </div>
</template>

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
  width: clamp(250px, 44vw, 520px);
  height: clamp(250px, 44vw, 520px);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 60%);
  filter: blur(30px);
  top: -200px;
  right: -200px;
}

.card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 28px;
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    0 20px 50px rgba(15, 23, 42, 0.08);
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
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  box-shadow: var(--shadow-primary);
}

h2 {
  margin: 0 0 4px;
  font-size: 24px;
  letter-spacing: -0.2px;
  color: var(--color-text-primary);
}

p {
  margin: 0;
  color: var(--color-text-secondary);
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
  color: var(--color-text-secondary);
}

.input_wrap {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2px;
  transition: var(--transition-base);
}

input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text-primary);
  font-size: 14px;
}

.input_wrap:focus-within {
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
}

.primary_btn {
  margin-top: 6px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-primary);
}

.primary_btn:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.primary_btn:active:not(:disabled) {
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
  color: var(--color-text-muted);
  font-size: 12px;
  position: relative;
  margin: 6px 0;
}

.divider::before,
.divider::after {
  content: "";
  height: 1px;
  background: var(--color-border);
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
  color: var(--color-primary-light);
  font-weight: 600;
  text-decoration: none;
}

.link_login:hover {
  text-decoration: underline;
}

.go_home {
  display: block;
  text-align: center;
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  text-decoration: none;
}

.go_home:hover {
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

@media (max-width: 768px) {
  .register_container {
    padding: 18px;
  }

  .bg_blur {
    top: -150px;
    right: -130px;
  }
}

@media (max-width: 480px) {
  .register_container {
    padding: 14px;
  }

  .card {
    padding: 20px;
    border-radius: var(--radius-lg);
  }

  h2 {
    font-size: 20px;
  }

  input,
  .primary_btn {
    font-size: 13px;
  }
}

@media (prefers-color-scheme: dark) {
  .register_container {
    background:
      radial-gradient(900px 400px at 10% -10%, rgba(59, 130, 246, 0.2), transparent 60%),
      radial-gradient(700px 300px at 110% 0%, rgba(99, 102, 241, 0.18), transparent 60%),
      linear-gradient(135deg, #0f172a, #1e293b);
  }

  .card {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(71, 85, 105, 0.9);
  }

  .input_wrap {
    background: var(--color-bg-secondary);
  }
}
</style>
