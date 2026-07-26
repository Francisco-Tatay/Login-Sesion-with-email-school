<script setup>
import { useUserStore } from "@/stores/UseStore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PhLockKey, PhLockSimple, PhEye, PhEyeSlash, PhCheckCircle, PhXCircle, PhWarning, PhCheck } from "@phosphor-icons/vue";

document.title = "Login | School Login";

const router = useRouter();
const store = useUserStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref("");
const response = ref("");

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => password.value.length >= 6);
const isFormValid = computed(() => isEmailValid.value && isPasswordValid.value);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

async function handleLogin() {
  if (!isFormValid.value) {
    if (isEmailValid.value) {
      error.value = "La contraseña debe tener al menos 6 caracteres";
    } else {
      error.value = "Por favor ingresa un email válido";
    }
    return;
  }

  error.value = "";
  response.value = "";
  isLoading.value = true;

  try {
    const data = await store.loginUser({
      email: email.value.trim(),
      password: password.value,
      remember: rememberMe.value,
    });

    response.value = data?.message || "¡Inicio de sesión exitoso!";

    if (rememberMe.value) {
      localStorage.setItem("rememberedEmail", email.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    setTimeout(() => {
      router.push(data?.redirect || "/dashboard");
    }, 1200);
  } catch (err) {
    error.value = err.message || "Credenciales incorrectas. Intenta nuevamente.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (localStorage.getItem("rememberedEmail")) {
    email.value = localStorage.getItem("rememberedEmail");
    rememberMe.value = true;
  }
});

const handleKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleLogin();
  }
};
</script>

<template>
  <div class="login-container">
    <div class="bg_blur blur-1"></div>
    <div class="bg_blur blur-2"></div>
    <div class="bg_particles"></div>

    <form
      class="card"
      @submit.prevent="handleLogin"
      @keydown="handleKeydown"
      aria-labelledby="login-title"
    >
      <div class="card_header">
        <div class="logo_dot">
          <PhLockKey :size="24" weight="bold" />
        </div>
        <div>
          <h2 id="login-title">Iniciar sesión</h2>
          <p>Accede con tu correo y contraseña</p>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': error && !isEmailValid }">
        <label for="email">
          <span>Correo electrónico</span>
          <span v-if="email && !isEmailValid" class="validation-icon">
          <PhWarning :size="14" weight="fill" />
        </span>
        </label>
        <div class="input_wrap">
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            :class="{ 'valid': isEmailValid, 'invalid': email && !isEmailValid }"
            required
            autocomplete="username"
            aria-required="true"
            :aria-invalid="!!(email && !isEmailValid)"
          />
          <span v-if="isEmailValid" class="success-icon">
            <PhCheck :size="16" weight="bold" />
          </span>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': error && !isPasswordValid }">
        <label for="password">
          <span>Contraseña</span>
          <span v-if="password && !isPasswordValid" class="validation-icon">
          <PhWarning :size="14" weight="fill" />
        </span>
        </label>
        <div class="input-wrap-password">
          <div class="input_wrap">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="{ 'valid': isPasswordValid, 'invalid': password && !isPasswordValid }"
              required
              :autocomplete="showPassword ? 'off' : 'current-password'"
              minlength="6"
              aria-required="true"
            />
          </div>
          <button
            type="button"
            class="toggle-password"
            @click="togglePassword"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            tabindex="-1"
          >
            <PhEye v-if="!showPassword" :size="20" />
            <PhEyeSlash v-else :size="20" />
          </button>
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-wrapper">
          <input
            type="checkbox"
            v-model="rememberMe"
            class="custom-checkbox"
          />
          <span class="checkmark"></span>
          <span>Recordarme</span>
        </label>
        <RouterLink to="/send-email" class="forgot-link">
          ¿Olvidaste tu contraseña?
        </RouterLink>
      </div>

      <button
        type="submit"
        class="primary_btn"
        :disabled="isLoading || !isFormValid"
        :class="{ 'loading': isLoading, 'invalid-form': !isFormValid }"
      >
        <span v-if="!isLoading" class="btn-content">
          Ingresar
          <span class="btn-arrow" aria-hidden="true">→</span>
        </span>
        <span v-else class="loader"></span>
      </button>

      <transition name="fade-slide">
        <p v-if="error" class="message error" role="alert">
          <PhXCircle :size="16" weight="fill" />
          {{ error }}
        </p>
      </transition>
      <transition name="fade-slide">
        <output v-if="response" class="message success" aria-live="polite">
          <PhCheckCircle :size="16" weight="fill" />
          {{ response }}
        </output>
      </transition>
    </form>

    <div class="links-container">
      <RouterLink to="/register" class="link primary">
        Crear una cuenta nueva
      </RouterLink>
      <RouterLink to="/" class="link secondary">
        ← Volver al inicio
      </RouterLink>
    </div>

    <div class="login-footer">
      <PhLockSimple :size="14" weight="bold" />
      <span>Tu información está protegida con encriptación SSL</span>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(59, 130, 246, 0.15), transparent 60%),
    radial-gradient(800px 400px at 90% 10%, rgba(99, 102, 241, 0.12), transparent 50%),
    linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f1f5f9 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.bg_blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.blur-1 {
  width: clamp(300px, 50vw, 600px);
  height: clamp(300px, 50vw, 600px);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%);
  top: -150px;
  right: -100px;
  animation-delay: 0s;
}

.blur-2 {
  width: clamp(200px, 35vw, 400px);
  height: clamp(200px, 35vw, 400px);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent 70%);
  bottom: -100px;
  left: -50px;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -20px) scale(1.05); }
  50% { transform: translate(-15px, 15px) scale(0.95); }
  75% { transform: translate(10px, 10px) scale(1.02); }
}

.bg_particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    radial-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px);
  background-size: 50px 50px, 35px 35px;
  background-position: 0 0, 25px 25px;
  opacity: 0.4;
  animation: particlesMove 30s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes particlesMove {
  0% { background-position: 0 0, 25px 25px; }
  100% { background-position: 50px 50px, 60px 60px; }
}

.card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    var(--shadow-lg);
  position: relative;
  z-index: 1;
  animation: cardEntrance 0.5s ease-out;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card_header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.logo_dot {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-primary);
  animation: pulse 3s ease-in-out infinite;
  flex-shrink: 0;
  color: white;
}

@keyframes pulse {
  0%, 100% { box-shadow: var(--shadow-primary); }
  50% { box-shadow: 0 12px 32px rgba(124, 58, 237, 0.45); }
}

.card_header h2 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.card_header p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 18px;
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-primary);
  letter-spacing: 0.01em;
}

.validation-icon {
  color: var(--color-warning);
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.input_wrap {
  position: relative;
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2px;
  transition: var(--transition-base);
}

.input_wrap:focus-within {
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
  background: var(--color-bg-primary);
}

.input_wrap input {
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text-primary);
  font-size: 15px;
  font-family: inherit;
  transition: var(--transition-base);
}

.input_wrap input::placeholder {
  color: var(--color-text-muted);
  opacity: 1;
}

.input_wrap input.valid {
  color: var(--color-success);
}

.input_wrap input.invalid {
  color: var(--color-destructive);
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.success-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-success);
  pointer-events: none;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-50%) scale(0.8); }
  to { opacity: 1; transform: translateY(-50%) scale(1); }
}

.input-wrap-password {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap-password .input_wrap {
  flex: 1;
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: var(--transition-base);
  display: grid;
  place-items: center;
  min-width: 36px;
  min-height: 36px;
}

.toggle-password:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary-light);
}

.toggle-password:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: var(--transition-base);
  flex-shrink: 0;
}

.checkbox-wrapper:hover .checkmark {
  border-color: var(--color-primary-light);
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition-base);
}

.checkbox-wrapper input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

.forgot-link {
  color: var(--color-primary-light);
  font-weight: 600;
  text-decoration: none;
  font-size: 13px;
  transition: var(--transition-base);
  padding: 4px 8px;
  border-radius: 6px;
}

.forgot-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.primary_btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-primary);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary_btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(30, 58, 138, 0.4);
}

.primary_btn:active:not(:disabled) {
  transform: translateY(0);
}

.primary_btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.primary_btn.invalid-form {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.primary_btn:hover .btn-arrow {
  transform: translateX(4px);
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #450a0a;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.message.success {
  background: rgba(16, 185, 129, 0.1);
  color: #022c22;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.links-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  max-width: 440px;
}

.link {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  width: 100%;
  text-align: center;
}

.link.primary {
  color: var(--color-primary-light);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.link.primary:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.link.secondary {
  color: var(--color-text-secondary);
  background: transparent;
}

.link.secondary:hover {
  color: var(--color-text-primary);
  background: rgba(148, 163, 184, 0.1);
}

.login-footer {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  max-width: 440px;
  width: 100%;
}

@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }

  .card {
    padding: 24px 20px;
    border-radius: var(--radius-xl);
  }

  .card_header {
    flex-direction: column;
    text-align: center;
    padding-bottom: 16px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .forgot-link {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px 16px;
    border-radius: var(--radius-lg);
  }

  .card_header h2 {
    font-size: 22px;
  }

  .input_wrap input,
  .primary_btn {
    font-size: 14px;
    padding: 13px 14px;
  }

  .form-options {
    gap: 8px;
  }

  .checkbox-wrapper {
    font-size: 13px;
  }
}

@media (prefers-color-scheme: dark) {
  .login-container {
    background:
      radial-gradient(1200px 600px at 10% -10%, rgba(59, 130, 246, 0.2), transparent 60%),
      radial-gradient(800px 400px at 90% 10%, rgba(139, 92, 241, 0.15), transparent 50%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  }

  .card {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(71, 85, 105, 0.9);
  }

  .input_wrap {
    background: var(--color-bg-secondary);
  }

  .input_wrap:focus-within {
    background: #1e293b;
  }

  .login-footer {
    background: rgba(30, 41, 59, 0.7);
  }
}
</style>
