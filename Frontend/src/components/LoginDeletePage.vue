<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UseStore";
import {
  PhWarning,
  PhX,
  PhCheck,
  PhEnvelope,
  PhPencilSimple,
  PhTrash,
  PhXCircle,
  PhCheckCircle,
  PhWarningCircle,
  PhLockSimple,
} from "@phosphor-icons/vue";

document.title = "Eliminar Cuenta | School Login";

const router = useRouter();
const store = useUserStore();

const email = ref("");
const reason = ref("");
const passwordConfirm = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const showConfirmModal = ref(false);

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const isReasonValid = computed(() => reason.value.trim().length >= 10);
const isFormValid = computed(() => isEmailValid.value && isReasonValid.value);

const reasonRemaining = computed(() => 200 - reason.value.length);
const isReasonTooLong = computed(() => reason.value.length > 200);

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
    });

    success.value = data?.message || "Usuario eliminado exitosamente";

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
      || "No se pudo eliminar el usuario. Verifica los datos e intenta nuevamente.";
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

const handleKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
    handleDeleteRequest();
  }
};

const handleModalKeydown = (e) => {
  if (e.key === "Escape") cancelDelete();
};
</script>

<template>
  <section class="delete-page">
    <div class="ambient ambient-1"></div>
    <div class="ambient ambient-2"></div>
    <div class="grid-pattern"></div>

    <form
      class="delete-card"
      @submit.prevent="handleDeleteRequest"
      @keydown="handleKeydown"
      aria-labelledby="delete-title"
    >
      <header class="delete-header">
        <div class="header-icon warning">
          <PhWarning :size="24" weight="fill" />
        </div>
        <div>
          <h1 id="delete-title">Eliminar cuenta</h1>
          <p>Esta acción es <strong>irreversible</strong>. Asegúrate de tener una copia de seguridad.</p>
        </div>
      </header>

      <div class="form-group" :class="{ 'error-state': error && !isEmailValid }">
        <label for="email">
          <span>Correo electrónico</span>
          <span v-if="email && !isEmailValid" class="validation-badge error">
            <PhX :size="11" weight="bold" />
          </span>
          <span v-else-if="isEmailValid" class="validation-badge success">
            <PhCheck :size="11" weight="bold" />
          </span>
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
          <span class="input-icon">
            <PhEnvelope :size="16" />
          </span>
        </div>
        <small id="email-hint" class="hint">Ingresa el correo de la cuenta a eliminar</small>
      </div>

      <div class="form-group" :class="{ 'error-state': error && !isReasonValid }">
        <label for="reason">
          <span>Motivo de eliminación</span>
          <span v-if="isReasonTooLong" class="validation-badge error">
            <Warning :size="11" weight="fill" />
          </span>
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
          <span class="input-icon textarea-icon">
            <PhPencilSimple :size="16" />
          </span>
        </div>
        <small id="reason-counter" class="hint counter" :class="{ 'warning': reasonRemaining < 30 }">
          {{ reasonRemaining }} caracteres restantes
        </small>
      </div>

      <div class="form-group security-check">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="passwordConfirm"
            true-value="confirmar"
            false-value=""
            class="custom-checkbox"
          />
          <span class="checkmark"></span>
          <span>Confirmo que deseo eliminar permanentemente esta cuenta</span>
        </label>
      </div>

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
            <PhTrash :size="16" />
            Eliminar cuenta
          </span>
          <span v-else class="loader"></span>
        </button>
      </div>

      <transition name="fade-slide">
        <p v-if="error" class="message error" role="alert">
          <PhXCircle :size="16" weight="fill" />
          {{ error }}
        </p>
      </transition>
      <transition name="fade-slide">
        <output v-if="success" class="message success" aria-live="polite">
          <PhCheckCircle :size="16" weight="fill" />
          {{ success }}
        </output>
      </transition>
    </form>

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
            <div class="modal-icon critical">
              <PhWarningCircle :size="32" weight="fill" />
            </div>

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
              <PhWarning :size="14" weight="fill" />
              Esta acción <strong>no se puede deshacer</strong>. Todos los datos asociados serán eliminados permanentemente.
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

    <footer class="delete-footer">
      <PhLockSimple :size="14" weight="bold" />
      <span>Tu solicitud será procesada de forma segura.</span>
      <RouterLink to="/help" class="footer-link">¿Necesitas ayuda?</RouterLink>
    </footer>
  </section>
</template>

<style scoped>
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

.delete-card {
  width: 100%;
  max-width: 520px;
  padding: 32px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.96);
  border: 3px solid var(--color-border);
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    var(--shadow-lg);
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

.delete-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
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
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.delete-header p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.delete-header strong {
  color: var(--color-destructive);
  font-weight: 600;
}

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
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
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
  background: var(--color-success);
  color: white;
}

.validation-badge.error {
  background: var(--color-destructive);
  color: white;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 14px 40px 14px 16px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: inherit;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  transition: var(--transition-base);
  resize: vertical;
  min-height: 48px;
}

.input-wrapper input:focus,
.input-wrapper textarea:focus {
  outline: none;
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  background: var(--color-bg-primary);
}

.input-wrapper input.valid {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.05);
}

.input-wrapper input.invalid,
.input-wrapper textarea.invalid {
  border-color: var(--color-destructive);
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
  color: var(--color-text-muted);
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
  color: var(--color-text-muted);
  margin-left: 4px;
}

.hint.counter {
  text-align: right;
}

.hint.counter.warning {
  color: var(--color-warning);
  font-weight: 500;
}

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
  color: var(--color-text-secondary);
  line-height: 1.4;
  padding: 8px;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
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
  border: 2px solid var(--color-border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: var(--transition-base);
  margin-top: 2px;
}

.checkbox-label:hover .checkmark {
  border-color: var(--color-destructive);
}

.checkbox-label input:checked ~ .checkmark {
  background: var(--color-destructive);
  border-color: var(--color-destructive);
}

.checkmark::after {
  content: '✓';
  color: white;
  font-size: 13px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition-base);
}

.checkbox-label input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-base);
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

.btn.ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border);
}

.btn.ghost:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-text-muted);
}

.btn.danger {
  background: linear-gradient(135deg, var(--color-destructive), var(--color-destructive-dark));
  color: white;
  box-shadow: var(--shadow-destructive);
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

.btn.shake {
  animation: shake 0.4s ease;
}

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

.message {
  margin: 0;
  padding: 12px 16px;
  border-radius: var(--radius-md);
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

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
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: 28px;
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: 3px solid rgba(239, 68, 68, 0.2);
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
  color: var(--color-text-primary);
}

.modal-description {
  margin: 0 0 16px;
  color: var(--color-text-secondary);
  font-size: 15px;
}

.confirmation-detail {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  text-align: left;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 70px;
}

.detail-value {
  color: var(--color-text-secondary);
  word-break: break-all;
}

.modal-warning {
  margin: 20px 0;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: #991b1b;
  font-size: 13px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
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

.delete-footer {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-md);
  max-width: 520px;
  width: 100%;
}

.footer-link {
  color: var(--color-primary-light);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-base);
}

.footer-link:hover {
  color: var(--color-text-primary);
  text-decoration: underline;
}

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

@media (max-width: 640px) {
  .delete-page {
    padding: 16px;
  }

  .delete-card {
    padding: 24px 20px;
    border-radius: var(--radius-xl);
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

@media (prefers-color-scheme: dark) {
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
    background: var(--color-bg-primary);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .delete-footer {
    background: rgba(30, 41, 59, 0.7);
  }
}

.form-group.error-state label {
  color: var(--color-destructive);
}

.form-group.error-state .input-wrapper input {
  animation: shake 0.4s ease;
}
</style>
