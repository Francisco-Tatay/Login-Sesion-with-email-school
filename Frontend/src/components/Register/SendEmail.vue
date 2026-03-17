<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/UseStore";
document.title = "Send Password";
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
        <RouterLink class="link muted" to="/">Ver las 3 opciones principales</RouterLink>
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
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
}

h2 {
  margin: 0 0 6px;
  font-size: 22px;
  color: #0f172a;
}

p {
  margin: 0 0 16px;
  color: #64748b;
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

.primary_btn:disabled {
  background: #93c5fd;
  box-shadow: none;
  cursor: not-allowed;
}

.hint {
  margin-top: 12px;
  color: #94a3b8;
  font-size: 12px;
}

.links {
  display: grid;
  gap: 6px;
  margin-top: 10px;
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

.link.muted {
  color: #64748b;
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
