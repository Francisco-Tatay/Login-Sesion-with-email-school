<script setup>
import { useUserStore } from "@/stores/UseStore";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

document.title = "Login | Tu Aplicación";

const router = useRouter();
const store = useUserStore();

// Estados del formulario
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref("");
const response = ref("");

// Validaciones en tiempo real
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => password.value.length >= 6);
const isFormValid = computed(() => isEmailValid.value && isPasswordValid.value);

// Toggle visibilidad de contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Manejo del login con mejoras
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
      remember: rememberMe.value 
    });
    
    response.value = data?.message || "¡Inicio de sesión exitoso!";
    
    // Guardar preferencia de "recordarme"
    if (rememberMe.value) {
      localStorage.setItem("rememberedEmail", email.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    
    // Redirección después de éxito
    setTimeout(() => {
      router.push(data?.redirect || "/dashboard");
    }, 1200);
    
  } catch (err) {
    error.value = err.message || "Credenciales incorrectas. Intenta nuevamente.";
    // Efecto de shake en el formulario (opcional con refs)
  } finally {
    isLoading.value = false;
  }
}

// Cargar email guardado al montar
if (localStorage.getItem("rememberedEmail")) {
  email.value = localStorage.getItem("rememberedEmail");
  rememberMe.value = true;
}

// Permitir login con Enter
const handleKeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleLogin();
  }
};
</script>
<template>
  <div class="login-container">
    <!-- Efectos de fondo animados -->
    <div class="bg_blur blur-1"></div>
    <div class="bg_blur blur-2"></div>
    <div class="bg_particles"></div>

    <form 
      class="card" 
      @submit.prevent="handleLogin"
      @keydown="handleKeydown"
      aria-labelledby="login-title"
    >
      <!-- Header con animación -->
      <div class="card_header">
        <div class="logo_dot">
          <span class="logo-icon">🔐</span>
        </div>
        <div>
          <h2 id="login-title">Iniciar sesión</h2>
          <p>Accede con tu correo y contraseña</p>
        </div>
      </div>

      <!-- Campo Email -->
      <div class="form-group" :class="{ 'has-error': error && !isEmailValid }">
        <label for="email">
          <span>Correo electrónico</span>
          <span v-if="email && !isEmailValid" class="validation-icon" aria-hidden="true">⚠️</span>
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
          <span v-if="isEmailValid" class="success-icon" aria-hidden="true">✓</span>
        </div>
      </div>

      <!-- Campo Password con toggle -->
      <div class="form-group" :class="{ 'has-error': error && !isPasswordValid }">
        <label for="password">
          <span>Contraseña</span>
          <span v-if="password && !isPasswordValid" class="validation-icon" aria-hidden="true">⚠️</span>
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
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <!-- Recordarme y Forgot password -->
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

      <!-- Botón de submit con loader -->
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

      <!-- Mensajes de estado -->
      <transition name="fade-slide">
        <p v-if="error" class="message error" role="alert">
          <span class="message-icon" aria-hidden="true">❌</span>
          {{ error }}
        </p>
      </transition>
      <transition name="fade-slide">
        <output v-if="response" class="message success" aria-live="polite">
          <span class="message-icon" aria-hidden="true">✅</span>
          {{ response }}
        </output>
      </transition>
    </form>

    <!-- Links adicionales -->
    <div class="links-container">
      <RouterLink to="/register" class="link primary">
        Crear una cuenta nueva
      </RouterLink>
      <RouterLink to="/" class="link secondary">
        ← Volver al inicio
      </RouterLink>
    </div>

    <!-- Footer decorativo -->
    <div class="login-footer">
      <p>🔒 Tu información está protegida con encriptación SSL</p>
    </div>
  </div>
</template>
<style scoped>
/* ===== VARIABLES CSS ===== */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: #60a5fa;
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --border: #e2e8f0;
  --shadow-sm: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 10px 25px -5px rgb(0 0 0 / 0.15);
  --shadow-lg: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --radius: 16px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTENEDOR PRINCIPAL ===== */
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

/* ===== EFECTOS DE FONDO ANIMADOS ===== */
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

/* Partículas sutiles de fondo */
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

/* ===== TARJETA PRINCIPAL ===== */
.card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
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

/* ===== HEADER ===== */
.card_header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.logo_dot {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), #7c3aed);
  display: grid;
  place-items: center;
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
  animation: pulse 3s ease-in-out infinite;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 12px 32px rgba(124, 58, 237, 0.45); }
}

.card_header h2 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.card_header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

/* ===== FORMULARIO ===== */
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
  color: var(--text-primary);
  letter-spacing: 0.01em;
}

.validation-icon {
  font-size: 14px;
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ===== INPUTS ===== */
.input_wrap {
  position: relative;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 2px;
  transition: var(--transition);
}

.input_wrap:focus-within {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
  background: #fff;
}

.input_wrap input {
  width: 100%;
  padding: 14px 16px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  transition: var(--transition);
}

.input_wrap input::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.input_wrap input.valid {
  color: var(--success);
}

.input_wrap input.invalid {
  color: var(--error);
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
  color: var(--success);
  font-weight: bold;
  font-size: 16px;
  pointer-events: none;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-50%) scale(0.8); }
  to { opacity: 1; transform: translateY(-50%) scale(1); }
}

/* ===== PASSWORD CON TOGGLE ===== */
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
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: var(--text-secondary);
  transition: var(--transition);
  display: grid;
  place-items: center;
  min-width: 36px;
  min-height: 36px;
}

.toggle-password:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
}

.toggle-password:focus {
  outline: 2px solid var(--primary-light);
  outline-offset: 2px;
}

/* ===== BARRA DE FORTALEZA ===== */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding-left: 4px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  overflow: hidden;
  position: relative;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: var(--transition);
}

.strength-bar.weak::after {
  width: 33%;
  background: var(--error);
}

.strength-bar.medium::after {
  width: 66%;
  background: var(--warning);
}

.strength-bar.strong::after {
  width: 100%;
  background: var(--success);
}

.strength-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ===== OPCIONES DEL FORMULARIO ===== */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 24px;
  flex-wrap: wrap;
  gap: 12px;
}

/* ===== CHECKBOX PERSONALIZADO ===== */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-secondary);
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-wrapper:hover .checkmark {
  border-color: var(--primary-light);
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: var(--primary);
  border-color: var(--primary);
  animation: checkPop 0.2s ease;
}

@keyframes checkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition);
}

.checkbox-wrapper input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

.forgot-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  font-size: 13px;
  transition: var(--transition);
  padding: 4px 8px;
  border-radius: 6px;
}

.forgot-link:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-dark);
}

/* ===== BOTÓN PRINCIPAL ===== */
.primary_btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary_btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary-dark), #1d4ed8);
  opacity: 0;
  transition: var(--transition);
  z-index: -1;
}

.primary_btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(59, 130, 246, 0.4);
}

.primary_btn:hover:not(:disabled)::before {
  opacity: 1;
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

/* ===== LOADER ===== */
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

/* ===== MENSAJES ===== */
.message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 10px;
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

.message-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* ===== TRANSICIONES VUE ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== LINKS ===== */
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
  border-radius: 10px;
  transition: var(--transition);
  width: 100%;
  text-align: center;
}

.link.primary {
  color: var(--primary);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.link.primary:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary-dark);
  transform: translateY(-1px);
}

.link.secondary {
  color: var(--text-secondary);
  background: transparent;
}

.link.secondary:hover {
  color: var(--text-primary);
  background: rgba(148, 163, 184, 0.1);
}

/* ===== FOOTER ===== */
.login-footer {
  margin-top: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  max-width: 440px;
  width: 100%;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .card {
    padding: 24px 20px;
    border-radius: 20px;
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
    border-radius: 16px;
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

/* ===== DARK MODE (opcional) ===== */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --bg-primary: #1e293b;
    --bg-secondary: #334155;
    --border: #475569;
  }
  
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
    background: var(--bg-secondary);
  }
  
  .input_wrap:focus-within {
    background: #1e293b;
  }
  
  .login-footer {
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

/* Focus visible para navegación con teclado */
:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 2px;
}

.primary_btn:focus-visible {
  outline-color: white;
}
</style>