<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UseStore";
import { useRouter } from "vue-router";

document.title = "Dashboard | Gestión de Usuarios";

const router = useRouter();
const storeUsers = useUserStore();
const { users, loading, error } = storeToRefs(storeUsers);

// Estados locales
const searchQuery = ref("");
const sortBy = ref("name");
const sortDirection = ref("asc");
const selectedUsers = ref([]);
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const notification = ref({ show: false, message: "", type: "" });

// Cargar usuarios al montar
onMounted(async () => {
  await fetchUsersWithFeedback();
});

async function fetchUsersWithFeedback() {
  try {
    await storeUsers.fetchUsers();
  } catch (err) {
    console.error(err.message || err);
    showNotification("Error al cargar usuarios", "error");
  }
}

// Búsqueda y filtrado en tiempo real
const filteredUsers = computed(() => {
  let result = [...(users.value || [])];
  
  // Filtro por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  }
  
  // Ordenamiento
  result.sort((a, b) => {
    const aVal = a[sortBy.value]?.toLowerCase() || "";
    const bVal = b[sortBy.value]?.toLowerCase() || "";
    const comparison = aVal.localeCompare(bVal);
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
  
  return result;
});

// Estadísticas
const stats = computed(() => ({
  total: users.value?.length || 0,
  filtered: filteredUsers.value.length,
  selected: selectedUsers.value.length
}));

// Toggle ordenamiento
function toggleSort(field) {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDirection.value = "asc";
  }
}

// Confirmar eliminación individual
function confirmDelete(user) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

// Ejecutar eliminación
async function executeDelete() {
  if (!userToDelete.value) return;
  
  try {
    await storeUsers.deleteUser(userToDelete.value.email);
    showNotification(`✅ Usuario "${userToDelete.value.name}" eliminado`, "success");
    await fetchUsersWithFeedback();
  } catch (err) {
    showNotification(err?.message || "Error al eliminar usuario", "error");
  } finally {
    closeDeleteModal();
  }
}

// Eliminación múltiple
async function deleteSelected() {
  if (selectedUsers.value.length === 0) return;
  
  try {
    for (const email of selectedUsers.value) {
      await storeUsers.deleteUser(email);
    }
    showNotification(`✅ ${selectedUsers.value.length} usuarios eliminados`, "success");
    selectedUsers.value = [];
    await fetchUsersWithFeedback();
  } catch (err) {
    showNotification(err?.message || "Error en eliminación múltiple", "error");
  }
}

// Toggle selección de usuario
function toggleSelectUser(email) {
  const index = selectedUsers.value.indexOf(email);
  if (index === -1) {
    selectedUsers.value.push(email);
  } else {
    selectedUsers.value.splice(index, 1);
  }
}

// Seleccionar todos los visibles
function toggleSelectAll() {
  const visibleEmails = filteredUsers.value.map(u => u.email);
  if (selectedUsers.value.length === visibleEmails.length) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = [...visibleEmails];
  }
}

// Notificaciones temporizadas
function showNotification(message, type) {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 4000);
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  userToDelete.value = null;
}

// Navegación
function goToCreateUser() {
  router.push("/register");
}

function goToUserProfile(email) {
  router.push(`/users/${email}`);
}

// Formateo de fecha (si tu API la incluye)
function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Iniciales para avatar
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Color aleatorio para avatar (consistente por email)
function getAvatarColor(email) {
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", 
    "#8b5cf6", "#06b6d4", "#ec4899", "#6366f1"
  ];
  const index = email.split("").reduce((acc, char) => acc + (char.codePointAt(0) || 0), 0) % colors.length;
  return colors[index];
}
</script>
<template>
  <div class="dashboard-page">
    <!-- Efectos de fondo -->
    <div class="bg-decoration bg-1"></div>
    <div class="bg-decoration bg-2"></div>
    
    <!-- Header principal -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <h1>👥 Dashboard de Usuarios</h1>
          <p>Gestiona, busca y administra los usuarios de tu plataforma</p>
        </div>
        <button class="btn-primary" @click="goToCreateUser">
          <span class="btn-primary-icon" aria-hidden="true">＋</span>
          Nuevo Usuario
        </button>
      </div>
      
      <!-- Estadísticas rápidas -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.filtered }}</span>
          <span class="stat-label">Filtrados</span>
        </div>
        <div class="stat-item" v-if="stats.selected > 0">
          <span class="stat-value highlight">{{ stats.selected }}</span>
          <span class="stat-label">Seleccionados</span>
        </div>
      </div>
    </header>

    <!-- Barra de herramientas -->
    <div class="toolbar">
      <!-- Búsqueda -->
      <div class="search-box">
        <span class="search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Buscar por nombre o email..."
          aria-label="Buscar usuarios"
        />
        <button 
          v-if="searchQuery" 
          class="clear-search" 
          @click="searchQuery = ''"
          aria-label="Limpiar búsqueda"
        >✕</button>
      </div>
      
      <!-- Acciones masivas -->
      <div class="bulk-actions" v-if="selectedUsers.length > 0">
        <span class="selected-count">{{ selectedUsers.length }} seleccionados</span>
        <button class="btn-danger btn-sm" @click="deleteSelected">
          🗑️ Eliminar seleccionados
        </button>
        <button class="btn-ghost btn-sm" @click="selectedUsers = []">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Contenedor de tabla -->
    <div class="table-container">
      <!-- Estado: Cargando -->
      <div v-if="loading" class="table-state loading">
        <div class="loader-spinner" aria-label="Cargando"></div>
        <p>Cargando usuarios...</p>
      </div>
      
      <!-- Estado: Error -->
      <div v-else-if="error" class="table-state error">
        <span class="error-icon" aria-hidden="true">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn-ghost" @click="fetchUsersWithFeedback">
          🔄 Reintentar
        </button>
      </div>
      
      <!-- Estado: Vacío -->
      <div v-else-if="filteredUsers.length === 0" class="table-state empty">
        <div class="empty-icon" aria-hidden="true">📭</div>
        <h3>{{ searchQuery ? "No se encontraron resultados" : "Sin usuarios aún" }}</h3>
        <p>{{ searchQuery ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer usuario" }}</p>
        <button class="btn-primary" @click="goToCreateUser">
          Agregar usuario
        </button>
      </div>
      
      <!-- Tabla de datos -->
      <table v-else class="user-table" role="table">
        <thead>
          <tr>
            <!-- Checkbox de selección global -->
            <th scope="col" class="col-select">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                  @change="toggleSelectAll"
                  aria-label="Seleccionar todos"
                />
                <span class="checkmark" aria-hidden="true"></span>
              </label>
            </th>
            
            <!-- Columnas ordenables -->
            <th scope="col" class="col-name sortable" @click="toggleSort('name')">
              <span>Nombre</span>
              <span class="sort-icon" :class="{ active: sortBy === 'name' }" aria-hidden="true">
                {{ sortBy === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅' }}
              </span>
            </th>
            <th scope="col" class="col-email sortable" @click="toggleSort('email')">
              <span>Email</span>
              <span class="sort-icon" :class="{ active: sortBy === 'email' }" aria-hidden="true">
                {{ sortBy === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅' }}
              </span>
            </th>
            <th scope="col" class="col-date">Registrado</th>
            <th scope="col" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <transition-group name="table-row" tag="tbody">
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id || user.email"
              class="user-row"
              :class="{ selected: selectedUsers.includes(user.email) }"
            >
              <!-- Checkbox individual -->
              <td class="col-select">
                <label class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    :value="user.email"
                    :checked="selectedUsers.includes(user.email)"
                    @change="toggleSelectUser(user.email)"
                    :aria-label="`Seleccionar ${user.name}`"
                  />
                  <span class="checkmark" aria-hidden="true"></span>
                </label>
              </td>
              
              <!-- Nombre con avatar -->
              <td class="col-name">
                <div class="user-cell">
                  <div 
                    class="avatar" 
                    :style="{ backgroundColor: getAvatarColor(user.email) }"
                    aria-hidden="true"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                  <span class="user-name">{{ user.name || "Sin nombre" }}</span>
                </div>
              </td>
              
              <!-- Email con copy -->
              <td class="col-email">
                <div class="user-cell">
                  <span class="user-email">{{ user.email }}</span>
                  <button 
                    class="copy-btn" 
                    @click="navigator.clipboard.writeText(user.email)"
                    aria-label="Copiar email"
                    title="Copiar email"
                  >📋</button>
                </div>
              </td>
              
              <!-- Fecha de registro -->
              <td class="col-date">
                <span class="date-badge">{{ formatDate(user.createdAt || user.registered_at) }}</span>
              </td>
              
              <!-- Acciones -->
              <td class="col-actions">
                <div class="action-buttons">
                  <button 
                    class="btn-icon btn-view" 
                    @click="goToUserProfile(user.email)"
                    aria-label="Ver perfil"
                    title="Ver perfil"
                  >👁️</button>
                  <button 
                    class="btn-icon btn-edit" 
                    aria-label="Editar usuario"
                    title="Editar"
                  >✏️</button>
                  <button 
                    class="btn-icon btn-delete" 
                    @click="confirmDelete(user)"
                    aria-label="Eliminar usuario"
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </td>
            </tr>
          </transition-group>
        </tbody>
      </table>
    </div>

    <!-- Footer con info de paginación (preparado para futuro) -->
    <footer class="table-footer">
      <p>Mostrando {{ filteredUsers.length }} de {{ stats.total }} usuarios</p>
      <div class="footer-actions">
        <button class="btn-ghost btn-sm" :disabled="true">← Anterior</button>
        <button class="btn-ghost btn-sm" :disabled="true">Siguiente →</button>
      </div>
    </footer>

    <!-- 🔴 MODAL DE CONFIRMACIÓN -->
    <Teleport to="body">
      <transition name="modal">
        <dialog 
          v-if="showDeleteModal && userToDelete" 
          open
          class="modal-overlay" 
          @click.self="closeDeleteModal"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabindex="-1"
        >
          <div class="modal-card">
            <div class="modal-icon critical" aria-hidden="true">🚨</div>
            
            <h2 id="modal-title">¿Eliminar usuario?</h2>
            <p class="modal-description">
              Estás a punto de eliminar permanentemente:
            </p>
            
            <div class="user-preview">
              <div 
                class="avatar large" 
                :style="{ backgroundColor: getAvatarColor(userToDelete.email) }"
              >
                {{ getInitials(userToDelete.name) }}
              </div>
              <div class="user-info">
                <strong>{{ userToDelete.name }}</strong>
                <span>{{ userToDelete.email }}</span>
              </div>
            </div>
            
            <p class="modal-warning">
              ⚠️ Esta acción <strong>no se puede deshacer</strong>. Todos los datos asociados se perderán.
            </p>
            
            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="closeDeleteModal">
                Cancelar
              </button>
              <button type="button" class="btn-danger" @click="executeDelete">
                Sí, eliminar usuario
              </button>
            </div>
          </div>
        </dialog>
      </transition>
    </Teleport>

    <!-- 🔔 NOTIFICACIÓN TOAST -->
    <transition name="toast">
      <output
        v-if="notification.show" 
        class="toast-notification" 
        :class="notification.type"
        aria-live="polite"
      >
        <span class="toast-icon" aria-hidden="true">
          {{ notification.type === 'success' ? '✅' : '❌' }}
        </span>
        <span>{{ notification.message }}</span>
        <button class="toast-close" @click="notification.show = false" aria-label="Cerrar">✕</button>
      </output>
    </transition>
  </div>
</template>
<style scoped>
/* ===== VARIABLES CSS ===== */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --success: #10b981;
  --warning: #f59e0b;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --border: #e2e8f0;
  --border-hover: #cbd5e1;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 25px -5px rgb(0 0 0 / 0.15);
  --shadow-xl: 0 20px 40px -10px rgb(0 0 0 / 0.2);
  --radius: 12px;
  --radius-lg: 16px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== PÁGINA PRINCIPAL ===== */
.dashboard-page {
  min-height: 100vh;
  background:
    radial-gradient(1200px 400px at 10% -10%, rgba(59, 130, 246, 0.08), transparent 60%),
    radial-gradient(800px 300px at 90% 10%, rgba(139, 92, 241, 0.06), transparent 50%),
    linear-gradient(180deg, #fafafa 0%, #f8fafc 100%);
  padding: 24px;
  position: relative;
  overflow-x: hidden;
}

/* Decoración de fondo */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
  animation: float 30s ease-in-out infinite;
}

.bg-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
  top: -200px;
  right: -100px;
}

.bg-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 241, 0.12), transparent 70%);
  bottom: -100px;
  left: -50px;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -15px) scale(1.02); }
  66% { transform: translate(-15px, 10px) scale(0.98); }
}

/* ===== HEADER ===== */
.dashboard-header {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.header-title h1 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.header-title p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.4);
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary-icon {
  font-size: 18px;
  line-height: 1;
}

/* Barra de estadísticas */
.stats-bar {
  display: flex;
  gap: 24px;
  padding-top: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value.highlight {
  color: var(--danger);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* ===== TOOLBAR ===== */
.toolbar {
  max-width: 1200px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 4px;
}

/* Búsqueda */
.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 16px;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: var(--transition);
}

.clear-search:hover {
  background: var(--border);
  color: var(--text-secondary);
}

/* Acciones masivas */
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.selected-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--danger-dark);
}

/* Botones */
.btn-danger {
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--danger), var(--danger-dark));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-danger:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.btn-ghost {
  padding: 10px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-ghost:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 12px;
}

/* ===== TABLA ===== */
.table-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Estados de tabla */
.table-state {
  padding: 60px 24px;
  text-align: center;
  color: var(--text-secondary);
}

.table-state.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.table-state.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 48px;
}

.table-state.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  font-size: 56px;
  opacity: 0.6;
}

.table-state.empty h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.table-state.empty p {
  margin: 0;
  max-width: 300px;
}

/* Estilos de tabla */
.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.user-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table tr:hover {
  background: rgba(59, 130, 246, 0.04);
}

.user-table tr.selected {
  background: rgba(239, 68, 68, 0.08);
}

/* Columnas específicas */
.col-select {
  width: 50px;
  padding: 16px 12px !important;
}

.col-name {
  min-width: 200px;
}

.col-email {
  min-width: 250px;
}

.col-date {
  width: 140px;
  white-space: nowrap;
}

.col-actions {
  width: 140px;
  text-align: right;
}

/* Columnas ordenables */
.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}

.sortable:hover {
  color: var(--primary);
}

.sort-icon {
  font-size: 10px;
  color: var(--text-muted);
  transition: var(--transition);
}

.sort-icon.active {
  color: var(--primary);
}

/* Celdas de usuario */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar.large {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  font-size: 20px;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.user-email {
  color: var(--text-secondary);
  font-family: monospace;
  font-size: 13px;
}

.copy-btn {
  padding: 4px 8px;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition);
}

.user-cell:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: var(--border);
}

.date-badge {
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: var(--bg-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
  display: grid;
  place-items: center;
}

.btn-icon:hover {
  transform: translateY(-2px);
}

.btn-view:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary);
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
}

/* ===== CHECKBOX PERSONALIZADO ===== */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 5px;
  display: grid;
  place-items: center;
  transition: var(--transition);
  background: var(--bg-primary);
}

.checkbox-wrapper:hover .checkmark {
  border-color: var(--primary);
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: var(--primary);
  border-color: var(--primary);
  animation: checkPop 0.2s ease;
}

@keyframes checkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.checkmark::after {
  content: '✓';
  color: white;
  font-size: 11px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition);
}

.checkbox-wrapper input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

/* ===== FOOTER DE TABLA ===== */
.table-footer {
  max-width: 1200px;
  margin: 16px auto 0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  font-size: 13px;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
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
  max-width: 460px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: modalSlideUp 0.3s ease;
  text-align: center;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 36px;
  animation: bounce 0.5s ease;
}

.modal-icon.critical {
  background: linear-gradient(135deg, #fecaca, #f87171);
  color: #991b1b;
  box-shadow: 0 16px 40px rgba(239, 68, 68, 0.35);
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
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 15px;
}

.user-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: left;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info strong {
  color: var(--text-primary);
  font-size: 15px;
}

.user-info span {
  color: var(--text-muted);
  font-size: 13px;
  font-family: monospace;
}

.modal-warning {
  margin: 0 0 24px;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #991b1b;
  font-size: 13px;
  line-height: 1.5;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
}

.modal-actions .btn-danger {
  padding: 12px 20px;
  font-size: 14px;
}

/* ===== TOAST NOTIFICATION ===== */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  font-size: 14px;
  color: var(--text-primary);
  z-index: 2000;
  animation: toastIn 0.3s ease;
  max-width: 400px;
}

.toast-notification.success {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.08);
  color: #065f46;
}

.toast-notification.error {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.08);
  color: #991b1b;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-close {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: var(--transition);
}

.toast-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

/* ===== TRANSICIONES VUE ===== */
/* Filas de tabla */
.table-row-enter-active,
.table-row-leave-active {
  transition: all 0.25s ease;
}

.table-row-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.table-row-leave-to {
  opacity: 0;
  transform: translateX(-20px);
  position: absolute;
}

/* Modal */
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
  transform: translateY(24px) scale(0.98);
}

/* Toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-bar {
    flex-wrap: wrap;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .bulk-actions {
    justify-content: center;
  }
  
  .user-table {
    font-size: 13px;
  }
  
  .user-table th,
  .user-table td {
    padding: 12px 14px;
  }
  
  .col-date {
    display: none;
  }
  
  .action-buttons {
    gap: 4px;
  }
  
  .btn-icon {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  
  .table-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .modal-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px;
    border-radius: var(--radius);
  }
  
  .header-title h1 {
    font-size: 20px;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .user-table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .user-cell {
    flex-wrap: wrap;
  }
  
  .user-email {
    width: 100%;
    margin-top: 4px;
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
    --border-hover: #64748b;
  }
  
  .dashboard-page {
    background:
      radial-gradient(1200px 400px at 10% -10%, rgba(59, 130, 246, 0.12), transparent 60%),
      radial-gradient(800px 300px at 90% 10%, rgba(139, 92, 241, 0.08), transparent 50%),
      linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  }
  
  .dashboard-header,
  .table-container,
  .table-footer,
  .modal-card,
  .toast-notification {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(71, 85, 105, 0.9);
  }
  
  .user-table th {
    background: var(--bg-secondary);
  }
  
  .user-table tr:hover {
    background: rgba(59, 130, 246, 0.08);
  }
  
  .search-box input {
    background: var(--bg-secondary);
  }
  
  .modal-warning {
    background: rgba(239, 68, 68, 0.12);
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
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn-primary:focus-visible,
.btn-danger:focus-visible {
  outline-color: white;
}

.user-table th:focus-visible,
.sortable:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

/* Estado hover para filas accesible */
@media (hover: none) {
  .user-table tr:hover {
    background: transparent;
  }
  
  .copy-btn {
    opacity: 1;
  }
}
</style>