<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/UseStore";
document.title = "Recuperar Contraseña | School Login";
const email = ref("");
const loading = ref(false);

const userStore = useUserStore();

const sendEmail = async () => {
  try {
    loading.value = true;
    const message = await userStore.SendPasswordEmail(email.value);
    alert(message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "desconocido";
    alert("Error al enviar el correo: " + errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="send_container">
    <div class="bg_blur"></div>
    <div class="card">
      <h2>Recuperar contraseña</h2>
      <p>Te enviaremos un enlace si el correo existe.</p>

      <form @submit.prevent="sendEmail">
        <label class="field">
          <span>Correo electrónico</span>
          <div class="input_wrap">
            <input type="email" v-model="email" placeholder="tucorreo@dominio.com" required />
          </div>
        </label>

        <button class="primary_btn" type="submit" :disabled="loading">
          {{ loading ? "Enviando..." : "Enviar correo" }}
        </button>
      </form>

      <p v-if="email" class="hint"
        >Correo ingresado: <strong>{{ email }}</strong></p
      >

      <div class="links">
        <RouterLink class="link" to="/login">Volver al inicio de sesión</RouterLink>
        <RouterLink class="link" to="/register">¿No tienes cuenta? Regístrate</RouterLink>
        <RouterLink class="link muted" to="/">Ver las opciones principales</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.send_container {
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
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 26px;
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    0 20px 50px rgba(15, 23, 42, 0.08);
}

h2 {
  margin: 0 0 6px;
  font-size: 22px;
  color: var(--color-text-primary);
}

p {
  margin: 0 0 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

form {
  display: grid;
  gap: 12px;
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

.hint {
  margin-top: 12px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.links {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  text-align: center;
}

.link {
  color: var(--color-primary-light);
  font-weight: 600;
  text-decoration: none;
  font-size: 13px;
}

.link:hover {
  text-decoration: underline;
}

.link.muted {
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .send_container {
    padding: 18px;
  }

  .bg_blur {
    top: -150px;
    right: -130px;
  }
}

@media (max-width: 480px) {
  .send_container {
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
  .send_container {
    background:
      radial-gradient(900px 400px at 10% -10%, rgba(59, 130, 246, 0.2), transparent 60%),
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
