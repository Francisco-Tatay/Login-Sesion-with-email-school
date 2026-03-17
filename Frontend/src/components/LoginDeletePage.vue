<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UseStore";

document.title = "login-delete";

const router = useRouter();
const store = useUserStore();

const email = ref("");
const reason = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

async function handleDelete() {
  error.value = "";
  success.value = "";

  if (!email.value) {
    error.value = "Ingresa un correo";
    return;
  }

  try {
    loading.value = true;
    const data = await store.deleteUser(email.value);
    success.value = data?.message || "Usuario eliminado";
    email.value = "";
    reason.value = "";
  } catch (err) {
    error.value = err?.response?.data?.message || err?.message || "No se pudo eliminar el usuario";
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push("/login");
}
</script>

<template>
  <section class="idea-page">
    <div class="ambient"></div>

    <form class="idea-card" @submit.prevent="handleDelete">
      <header class="idea-header">
        <h1>login-delete</h1>
        <p>Pagina de prueba para validar el flujo visual antes de conectar store/composables.</p>
      </header>

      <label for="email">Correo objetivo</label>
      <input id="email" v-model="email" type="email" placeholder="usuario@ejemplo.com" />

      <label for="reason">Motivo</label>
      <input id="reason" v-model="reason" type="text" placeholder="Ej: solicitud de baja" />

      <div class="actions">
        <button type="submit" class="btn secondary">Eliminar</button>
        <button type="button" class="btn primary" @click="goToLogin">Volver a login</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </section>
</template>

<style scoped>
.idea-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(850px 340px at 100% 0%, rgba(14, 165, 233, 0.18), transparent 55%),
    linear-gradient(120deg, #f0f9ff, #ecfeff 55%, #f8fafc);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.ambient {
  position: absolute;
  inset: auto auto -140px -120px;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  background: radial-gradient(circle at 35% 35%, rgba(34, 197, 94, 0.25), transparent 62%);
  filter: blur(20px);
}

.idea-card {
  width: 100%;
  max-width: 500px;
  padding: 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.93);
  border: 1px solid #dbeafe;
  box-shadow: 0 18px 44px rgba(2, 132, 199, 0.14);
  display: grid;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.idea-header {
  margin-bottom: 6px;
}

.idea-header h1 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
}

.idea-header p {
  margin: 6px 0 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.45;
}

label {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #155e75;
}

input {
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  outline: none;
  color: #0f172a;
  background: #f0f9ff;
}

input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
}

.actions {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 11px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.btn.secondary {
  background: #e0f2fe;
  color: #0c4a6e;
}

.btn.primary {
  background: linear-gradient(120deg, #0891b2, #0e7490);
  color: #ecfeff;
}

.preview {
  margin: 6px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: #ecfeff;
  border: 1px dashed #67e8f9;
  color: #164e63;
  font-size: 13px;
}

@media (max-width: 560px) {
  .idea-card {
    padding: 20px;
  }

  .actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 360px) {
  .idea-page {
    padding: 14px;
  }

  .idea-card {
    padding: 16px;
  }

  .idea-header h1 {
    font-size: 24px;
  }
}
</style>
