<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UseStore";

document.title = "Eliminar Cuenta | Tu Aplicación";

const router = useRouter();
const store = useUserStore();

// Estados del formulario
const email = ref("");
const reason = ref("");
const passwordConfirm = ref(""); // 🔐 Confirmación adicional
const loading = ref(false);
const error = ref("");
const success = ref("");
const showConfirmModal = ref(false);

// Validaciones en tiempo real
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const isReasonValid = computed(() => reason.value.trim().length >= 10);
const isFormValid = computed(() => isEmailValid.value && isReasonValid.value);

// Previsualización del motivo (caracteres restantes)
const reasonRemaining = computed(() => 200 - reason.value.length);
const isReasonTooLong = computed(() => reason.value.length > 200);

// Manejo de eliminación con confirmación
function handleDeleteRequest() {
  error.value = "";
  
  if (!isEmailValid.value) {
    error.value = "Por favor ingresa un correo electrónico válido";
    return;
  }
  
  if (!isReasonValid.value) {
    error.value = "El motivo debe tener al menos 10 caracteres";
    return;
  }
  
  // Mostrar modal de confirmación para acción destructiva
  showConfirmModal.value = true;
}

async function confirmDelete() {
  if (loading.value) return;
  
  error.value = "";
  success.value = "";
  loading.value = true;
  showConfirmModal.value = false;

  try {
    const data = await store.deleteUser({
      email: email.value.trim().toLowerCase(),
      reason: reason.value.trim(),
      // passwordConfirm: passwordConfirm.value // Descomentar si tu backend lo requiere
    });
    
    success.value = data?.message || "✅ Usuario eliminado exitosamente";
    
    // Limpiar formulario y redirigir después de éxito
    setTimeout(() => {
      email.value = "";
      reason.value = "";
      passwordConfirm.value = "";
      router.push("/login");
    }, 2000);
    
  } catch (err) {
    console.error("Delete error:", err);
    error.value = err?.response?.data?.message 
      || err?.message 
      || "❌ No se pudo eliminar el usuario. Verifica los datos e intenta nuevamente.";
  } finally {
    loading.value = false;
  }
}

function cancelDelete() {
  showConfirmModal.value = false;
  error.value = "";
}

function goToLogin() {
  router.push("/login");
}

// Permitir submit con Enter (solo en campos de texto, no en textarea)
const handleKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    handleDeleteRequest();
  }
};

// Cerrar modal con Escape
const handleModalKeydown = (e) => {
  if (e.key === "Escape") cancelDelete();
};
</script>
<template>
  <section class="delete-page">
    <!-- Efectos de fondo -->
    <div class="ambient ambient-1"></div>
    <div class="ambient ambient-2"></div>
    <div class="grid-pattern"></div>

    <form 
      class="delete-card" 
      @submit.prevent="handleDeleteRequest"
      @keydown="handleKeydown"
      aria-labelledby="delete-title"
    >
      <!-- Header con advertencia visual -->
      <header class="delete-header">
        <div class="header-icon warning" aria-hidden="true">⚠️</div>
        <div>
          <h1 id="delete-title">Eliminar cuenta</h1>
          <p>Esta acción es <strong>irreversible</strong>. Asegúrate de tener una copia de seguridad.</p>
        </div>
      </header>

      <!-- Campo Email -->
      <div class="form-group" :class="{ 'error-state': error && !isEmailValid }">
        <label for="email">
          <span>Correo electrónico</span>
          <span v-if="email && !isEmailValid" class="validation-badge error" aria-hidden="true">✕</span>
          <span v-else-if="isEmailValid" class="validation-badge success" aria-hidden="true">✓</span>
        </label>
        <div class="input-wrapper">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            :class="{ 'valid': isEmailValid, 'invalid': email && !isEmailValid }"
            required
            autocomplete="email"
            aria-required="true"
            aria-describedby="email-hint"
          />
          <span class="input-icon" aria-hidden="true">📧</span>
        </div>
        <small id="email-hint" class="hint">Ingresa el correo de la cuenta a eliminar</small>
      </div>

      <!-- Campo Motivo (textarea para mejor UX) -->
      <div class="form-group" :class="{ 'error-state': error && !isReasonValid }">
        <label for="reason">
          <span>Motivo de eliminación <span class="optional">(opcional)</span></span>
          <span v-if="isReasonTooLong" class="validation-badge error" aria-hidden="true">⚠️</span>
        </label>
        <div class="input-wrapper textarea-wrapper">
          <textarea
            id="reason"
            v-model="reason"
            placeholder="Ej: Ya no uso este servicio, migré a otra plataforma, etc."
            rows="3"
            maxlength="200"
            :class="{ 'invalid': isReasonTooLong }"
            aria-describedby="reason-counter"
          ></textarea>
          <span class="input-icon textarea-icon" aria-hidden="true">✏️</span>
        </div>
        <small id="reason-counter" class="hint counter" :class="{ 'warning': reasonRemaining < 30 }">
          {{ reasonRemaining }} caracteres restantes
        </small>
      </div>

      <!-- Campo de confirmación (opcional, para mayor seguridad) -->
      <div class="form-group security-check">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="passwordConfirm" 
            true-value="confirmar"
            false-value=""
            class="custom-checkbox"
          />
          <span class="checkmark" aria-hidden="true"></span>
          <span>Confirmo que deseo eliminar permanentemente esta cuenta</span>
        </label>
      </div>

      <!-- Botones de acción -->
      <div class="actions">
        <button 
          type="button" 
          class="btn ghost" 
          @click="goToLogin"
          :disabled="loading"
        >
          ← Cancelar
        </button>
        <button 
          type="submit" 
          class="btn danger"
          :disabled="loading || !isFormValid || passwordConfirm !== 'confirmar'"
          :class="{ 'loading': loading, 'shake': error }"
        >
          <span v-if="!loading" class="btn-content">
            <span class="btn-icon" aria-hidden="true">🗑️</span>
            Eliminar cuenta
          </span>
          <span v-else class="loader" aria-hidden="true"></span>
        </button>
      </div>

      <!-- Mensajes de estado -->
      <transition name="fade-slide">
        <p v-if="error" class="message error" role="alert">
          <span class="message-icon" aria-hidden="true">❌</span>
          {{ error }}
        </p>
      </transition>
      <transition name="fade-slide">
        <output v-if="success" class="message success" aria-live="polite">
          <span class="message-icon" aria-hidden="true">✅</span>
          {{ success }}
        </output>
      </transition>
    </form>

    <!-- 🔴 MODAL DE CONFIRMACIÓN (Overlay) -->
    <Teleport to="body">
      <transition name="modal">
        <dialog 
          v-if="showConfirmModal" 
          open
          class="modal-overlay" 
          @click.self="cancelDelete"
          @keydown="handleModalKeydown"
          aria-modal="true"
          aria-labelledby="confirm-title"
          tabindex="-1"
        >
          <div class="modal-card">
            <div class="modal-icon critical" aria-hidden="true">🚨</div>
            
            <h2 id="confirm-title">¿Estás completamente seguro?</h2>
            <p class="modal-description">
              Estás a punto de eliminar la cuenta:
            </p>
            
            <div class="confirmation-detail">
              <span class="detail-label">Correo:</span>
              <span class="detail-value">{{ email }}</span>
            </div>
            
            <div v-if="reason" class="confirmation-detail">
              <span class="detail-label">Motivo:</span>
              <span class="detail-value">{{ reason }}</span>
            </div>
            
            <p class="modal-warning">
              ⚠️ Esta acción <strong>no se puede deshacer</strong>. Todos los datos asociados serán eliminados permanentemente.
            </p>
            
            <div class="modal-actions">
              <button 
                type="button" 
                class="btn ghost" 
                @click="cancelDelete"
                :disabled="loading"
              >
                No, volver atrás
              </button>
              <button 
                type="button" 
                class="btn danger critical" 
                @click="confirmDelete"
                :disabled="loading"
              >
                <span v-if="!loading">Sí, eliminar permanentemente</span>
                <span v-else class="loader mini"></span>
              </button>
            </div>
          </div>
        </dialog>
      </transition>
    </Teleport>

    <!-- Footer informativo -->
    <footer class="delete-footer">
      <p>🔒 Tu solicitud será procesada de forma segura. <RouterLink to="/help" class="footer-link">¿Necesitas ayuda?</RouterLink></p>
    </footer>
  </section>
</template>
<style scoped>
/* ===== VARIABLES CSS ===== */
:root {
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --danger-light: #f87171;
  --warning: #f59e0b;
  --success: #10b981;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --border: #e2e8f0;
  --border-focus: #06b6d4;
  --shadow-sm: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 10px 25px -5px rgb(0 0 0 / 0.15);
  --shadow-lg: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-critical: 0 0 0 4px rgba(239, 68, 68, 0.2);
  --radius: 16px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== PÁGINA PRINCIPAL ===== */
.delete-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(1000px 500px at 100% 0%, rgba(14, 165, 233, 0.12), transparent 60%),
    radial-gradient(600px 300px at 0% 100%, rgba(239, 68, 68, 0.08), transparent 50%),
    linear-gradient(135deg, #f0f9ff 0%, #fafafa 50%, #fefefe 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* ===== EFECTOS DE FONDO ===== */
.ambient {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
  animation: float 25s ease-in-out infinite;
}

.ambient-1 {
  width: clamp(300px, 45vw, 500px);
  height: clamp(300px, 45vw, 500px);
  background: radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.25), transparent 65%);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.ambient-2 {
  width: clamp(200px, 30vw, 350px);
  height: clamp(200px, 30vw, 350px);
  background: radial-gradient(circle at 60% 60%, rgba(239, 68, 68, 0.18), transparent 65%);
  bottom: -80px;
  left: -60px;
  animation-delay: -12s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(15px, -15px) scale(1.03); }
  66% { transform: translate(-10px, 10px) scale(0.97); }
}

/* Patrón de grid sutil */
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ===== TARJETA PRINCIPAL ===== */
.delete-card {
  width: 100%;
  max-width: 520px;
  padding: 32px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: var(--shadow-lg);
  display: grid;
  gap: 16px;
  position: relative;
  z-index: 1;
  animation: cardSlideIn 0.4s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== HEADER CON ADVERTENCIA ===== */
.delete-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 24px;
  flex-shrink: 0;
  animation: pulseWarning 2s ease-in-out infinite;
}

.header-icon.warning {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #78350f;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

@keyframes pulseWarning {
  0%, 100% { box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 8px 28px rgba(245, 158, 11, 0.5); }
}

.delete-header h1 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.delete-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.delete-header strong {
  color: var(--danger);
  font-weight: 600;
}

/* ===== GRUPOS DE FORMULARIO ===== */
.form-group {
  display: grid;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.label .optional {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 12px;
}

.validation-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: bold;
  animation: popIn 0.2s ease;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.validation-badge.success {
  background: var(--success);
  color: white;
}

.validation-badge.error {
  background: var(--danger);
  color: white;
}

/* ===== INPUTS ===== */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 14px 40px 14px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: var(--transition);
  resize: vertical;
  min-height: 48px;
}

.input-wrapper input:focus,
.input-wrapper textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
  background: var(--bg-primary);
}

.input-wrapper input.valid {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.05);
}

.input-wrapper input.invalid,
.input-wrapper textarea.invalid {
  border-color: var(--danger);
  animation: shake 0.4s ease;
  background: rgba(239, 68, 68, 0.05);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.input-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--text-muted);
  pointer-events: none;
  user-select: none;
}

.textarea-wrapper .input-icon {
  top: 16px;
  transform: none;
}

.textarea-wrapper textarea {
  min-height: 80px;
  padding-right: 40px;
  line-height: 1.5;
}

.hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 4px;
}

.hint.counter {
  text-align: right;
}

.hint.counter.warning {
  color: var(--warning);
  font-weight: 500;
}

/* ===== CHECKBOX PERSONALIZADO ===== */
.security-check {
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
  padding: 8px;
  border-radius: 10px;
  transition: var(--transition);
}

.checkbox-label:hover {
  background: rgba(239, 68, 68, 0.05);
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: var(--transition);
  margin-top: 2px;
}

.checkbox-label:hover .checkmark {
  border-color: var(--danger-light);
}

.checkbox-label input:checked ~ .checkmark {
  background: var(--danger);
  border-color: var(--danger);
  animation: checkPop 0.25s ease;
}

@keyframes checkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.checkmark::after {
  content: '✓';
  color: white;
  font-size: 13px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition);
}

.checkbox-label input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

/* ===== BOTONES ===== */
.actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Botón Ghost */
.btn.ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border);
}

.btn.ghost:hover:not(:disabled) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* Botón Danger */
.btn.danger {
  background: linear-gradient(135deg, var(--danger), var(--danger-dark));
  color: white;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.35);
}

.btn.danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(239, 68, 68, 0.45);
  filter: brightness(1.05);
}

.btn.danger:active:not(:disabled) {
  transform: translateY(0);
}

.btn.danger.critical {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  box-shadow: 0 10px 25px rgba(185, 28, 28, 0.4);
}

.btn.danger.critical:hover:not(:disabled) {
  box-shadow: 0 14px 32px rgba(185, 28, 28, 0.55);
}

.btn-icon {
  font-size: 16px;
}

.btn.shake {
  animation: shake 0.4s ease;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loader.mini {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== MENSAJES ===== */
.message {
  margin: 0;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.error {
  background: rgba(239, 68, 68, 0.12);
  color: #991b1b;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.message.success {
  background: rgba(16, 185, 129, 0.12);
  color: #065f46;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.message-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* ===== TRANSICIONES VUE ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== MODAL DE CONFIRMACIÓN ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 28px;
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: modalSlideUp 0.3s ease;
  text-align: center;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 32px;
  animation: bounce 0.5s ease;
}

.modal-icon.critical {
  background: linear-gradient(135deg, #fecaca, #f87171);
  color: #991b1b;
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.35);
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.modal-card h2 {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-description {
  margin: 0 0 16px;
  color: var(--text-secondary);
  font-size: 15px;
}

.confirmation-detail {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 10px;
  margin-bottom: 12px;
  text-align: left;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 70px;
}

.detail-value {
  color: var(--text-secondary);
  word-break: break-all;
}

.modal-warning {
  margin: 20px 0;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #991b1b;
  font-size: 13px;
  line-height: 1.5;
}

.modal-warning strong {
  font-weight: 700;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 12px;
  margin-top: 8px;
}

/* ===== FOOTER ===== */
.delete-footer {
  margin-top: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  max-width: 520px;
  width: 100%;
}

.footer-link {
  color: var(--border-focus);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.footer-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

/* ===== TRANSICIÓN MODAL VUE ===== */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(20px) scale(0.98);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .delete-page {
    padding: 16px;
  }
  
  .delete-card {
    padding: 24px 20px;
    border-radius: 20px;
  }
  
  .delete-header {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  
  .actions,
  .modal-actions {
    grid-template-columns: 1fr;
  }
  
  .btn.ghost {
    order: 2;
  }
  
  .btn.danger {
    order: 1;
  }
}

@media (max-width: 400px) {
  .delete-card {
    padding: 20px 16px;
  }
  
  .delete-header h1 {
    font-size: 22px;
  }
  
  .input-wrapper input,
  .input-wrapper textarea,
  .btn {
    font-size: 14px;
    padding: 13px 36px 13px 14px;
  }
  
  .modal-card {
    padding: 24px 20px;
  }
}

/* ===== DARK MODE ===== */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --bg-primary: #1e293b;
    --bg-secondary: #334155;
    --bg-tertiary: #475569;
    --border: #475569;
    --border-focus: #22d3ee;
  }
  
  .delete-page {
    background:
      radial-gradient(1000px 500px at 100% 0%, rgba(14, 165, 233, 0.15), transparent 60%),
      radial-gradient(600px 300px at 0% 100%, rgba(239, 68, 68, 0.12), transparent 50%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  }
  
  .delete-card {
    background: rgba(30, 41, 59, 0.96);
    border-color: rgba(71, 85, 105, 0.95);
  }
  
  .grid-pattern {
    background-image: 
      linear-gradient(rgba(14, 165, 233, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 165, 233, 0.06) 1px, transparent 1px);
  }
  
  .modal-card {
    background: var(--bg-primary);
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  .delete-footer {
    background: rgba(30, 41, 59, 0.7);
  }
}

/* ===== ACCESIBILIDAD ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.btn.danger:focus-visible {
  outline-color: white;
}

/* Estado de error en grupo */
.form-group.error-state label {
  color: var(--danger);
}

.form-group.error-state .input-wrapper input {
  animation: shake 0.4s ease;
}
</style>