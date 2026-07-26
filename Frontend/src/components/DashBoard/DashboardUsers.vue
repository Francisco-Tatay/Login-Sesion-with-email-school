<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UseStore";
import { useRouter } from "vue-router";
import {
  PhUsers,
  PhPlus,
  PhMagnifyingGlass,
  PhX,
  PhWarning,
  PhArrowClockwise,
  PhTray,
  PhEye,
  PhPencilSimple,
  PhTrash,
  PhWarningCircle,
  PhCheckCircle,
  PhXCircle,
  PhArrowsDownUp,
  PhCaretDown,
  PhCaretUp,
  PhCopy,
} from "@phosphor-icons/vue";

document.title = "Dashboard | Gestión de Usuarios";

const router = useRouter();
const storeUsers = useUserStore();
const { users, loading, error } = storeToRefs(storeUsers);

const searchQuery = ref("");
const sortBy = ref("name");
const sortDirection = ref("asc");
const selectedUsers = ref([]);
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const notification = ref({ show: false, message: "", type: "" });

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

const filteredUsers = computed(() => {
  let result = [...(users.value || [])];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  }

  result.sort((a, b) => {
    const aVal = a[sortBy.value]?.toLowerCase() || "";
    const bVal = b[sortBy.value]?.toLowerCase() || "";
    const comparison = aVal.localeCompare(bVal);
    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  return result;
});

const stats = computed(() => ({
  total: users.value?.length || 0,
  filtered: filteredUsers.value.length,
  selected: selectedUsers.value.length,
}));

function toggleSort(field) {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDirection.value = "asc";
  }
}

function confirmDelete(user) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

async function executeDelete() {
  if (!userToDelete.value) return;

  try {
    await storeUsers.deleteUser(userToDelete.value.email);
    showNotification(`Usuario "${userToDelete.value.name}" eliminado`, "success");
    await fetchUsersWithFeedback();
  } catch (err) {
    showNotification(err?.message || "Error al eliminar usuario", "error");
  } finally {
    closeDeleteModal();
  }
}

async function deleteSelected() {
  if (selectedUsers.value.length === 0) return;

  try {
    for (const email of selectedUsers.value) {
      await storeUsers.deleteUser(email);
    }
    showNotification(`${selectedUsers.value.length} usuarios eliminados`, "success");
    selectedUsers.value = [];
    await fetchUsersWithFeedback();
  } catch (err) {
    showNotification(err?.message || "Error en eliminación múltiple", "error");
  }
}

function toggleSelectUser(email) {
  const index = selectedUsers.value.indexOf(email);
  if (index === -1) {
    selectedUsers.value.push(email);
  } else {
    selectedUsers.value.splice(index, 1);
  }
}

function toggleSelectAll() {
  const visibleEmails = filteredUsers.value.map(u => u.email);
  if (selectedUsers.value.length === visibleEmails.length) {
    selectedUsers.value = [];
  } else {
    selectedUsers.value = [...visibleEmails];
  }
}

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

function goToCreateUser() {
  router.push("/register");
}

function goToUserProfile(email) {
  router.push(`/users/${email}`);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(email) {
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#06b6d4", "#ec4899", "#6366f1",
  ];
  const index = email.split("").reduce((acc, char) => acc + (char.codePointAt(0) || 0), 0) % colors.length;
  return colors[index];
}
</script>

<template>
  <div class="dashboard-page">
    <div class="bg-decoration bg-1"></div>
    <div class="bg-decoration bg-2"></div>

    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <h1>
            <PhUsers :size="24" weight="fill" />
            Dashboard de Usuarios
          </h1>
          <p>Gestiona, busca y administra los usuarios de tu plataforma</p>
        </div>
        <button class="btn-primary" @click="goToCreateUser">
          <PhPlus :size="18" weight="bold" />
          Nuevo Usuario
        </button>
      </div>

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

    <div class="toolbar">
      <div class="search-box">
        <PhMagnifyingGlass :size="16" class="search-icon" />
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
        >
          <PhX :size="14" weight="bold" />
        </button>
      </div>

      <div class="bulk-actions" v-if="selectedUsers.length > 0">
        <span class="selected-count">{{ selectedUsers.length }} seleccionados</span>
        <button class="btn-danger btn-sm" @click="deleteSelected">
          <PhTrash :size="14" />
          Eliminar seleccionados
        </button>
        <button class="btn-ghost btn-sm" @click="selectedUsers = []">
          Cancelar
        </button>
      </div>
    </div>

    <div class="table-container">
      <div v-if="loading" class="table-state loading">
        <div class="loader-spinner" aria-label="Cargando"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="error" class="table-state error">
        <PhWarning :size="48" weight="fill" class="state-icon error" />
        <p>{{ error }}</p>
        <button class="btn-ghost" @click="fetchUsersWithFeedback">
          <PhArrowClockwise :size="14" />
          Reintentar
        </button>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="table-state empty">
        <PhTray :size="56" weight="thin" class="state-icon empty" />
        <h3>{{ searchQuery ? "No se encontraron resultados" : "Sin usuarios aún" }}</h3>
        <p>{{ searchQuery ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer usuario" }}</p>
        <button class="btn-primary" @click="goToCreateUser">
          <PhPlus :size="16" weight="bold" />
          Agregar usuario
        </button>
      </div>

      <table v-else class="user-table" role="table">
        <thead>
          <tr>
            <th scope="col" class="col-select">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                  @change="toggleSelectAll"
                  aria-label="Seleccionar todos"
                />
                <span class="checkmark"></span>
              </label>
            </th>

            <th scope="col" class="col-name sortable" @click="toggleSort('name')" tabindex="0" @keydown.enter="toggleSort('name')">
              <span>Nombre</span>
              <span class="sort-icon" :class="{ active: sortBy === 'name' }">
                <PhArrowsDownUp v-if="sortBy !== 'name'" :size="12" />
                <PhCaretUp v-else-if="sortDirection === 'asc'" :size="12" weight="bold" />
                <PhCaretDown v-else :size="12" weight="bold" />
              </span>
            </th>
            <th scope="col" class="col-email sortable" @click="toggleSort('email')" tabindex="0" @keydown.enter="toggleSort('email')">
              <span>Email</span>
              <span class="sort-icon" :class="{ active: sortBy === 'email' }">
                <PhArrowsDownUp v-if="sortBy !== 'email'" :size="12" />
                <PhCaretUp v-else-if="sortDirection === 'asc'" :size="12" weight="bold" />
                <PhCaretDown v-else :size="12" weight="bold" />
              </span>
            </th>
            <th scope="col" class="col-date">Registrado</th>
            <th scope="col" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <transition-group name="table-row" tag="tbody">
          <tr
            v-for="user in filteredUsers"
            :key="user.id || user.email"
            class="user-row"
            :class="{ selected: selectedUsers.includes(user.email) }"
          >
            <td class="col-select">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  :value="user.email"
                  :checked="selectedUsers.includes(user.email)"
                  @change="toggleSelectUser(user.email)"
                  :aria-label="`Seleccionar ${user.name}`"
                />
                <span class="checkmark"></span>
              </label>
            </td>

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

            <td class="col-email">
              <div class="user-cell">
                <span class="user-email">{{ user.email }}</span>
                <button
                  class="copy-btn"
                  @click="navigator.clipboard.writeText(user.email)"
                  aria-label="Copiar email"
                  title="Copiar email"
                >
                  <PhCopy :size="14" />
                </button>
              </div>
            </td>

            <td class="col-date">
              <span class="date-badge">{{ formatDate(user.createdAt || user.registered_at) }}</span>
            </td>

            <td class="col-actions">
              <div class="action-buttons">
                <button
                  class="btn-icon btn-view"
                  @click="goToUserProfile(user.email)"
                  aria-label="Ver perfil"
                  title="Ver perfil"
                >
                  <PhEye :size="16" />
                </button>
                <button
                  class="btn-icon btn-edit"
                  aria-label="Editar usuario"
                  title="Editar"
                >
                  <PhPencilSimple :size="16" />
                </button>
                <button
                  class="btn-icon btn-delete"
                  @click="confirmDelete(user)"
                  aria-label="Eliminar usuario"
                  title="Eliminar"
                >
                  <PhTrash :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </transition-group>
      </table>
    </div>

    <footer class="table-footer">
      <p>Mostrando {{ filteredUsers.length }} de {{ stats.total }} usuarios</p>
      <div class="footer-actions">
        <button class="btn-ghost btn-sm" :disabled="true">← Anterior</button>
        <button class="btn-ghost btn-sm" :disabled="true">Siguiente →</button>
      </div>
    </footer>

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
            <div class="modal-icon critical">
              <PhWarningCircle :size="36" weight="fill" />
            </div>

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
              <PhWarning :size="14" weight="fill" />
              Esta acción <strong>no se puede deshacer</strong>. Todos los datos asociados se perderán.
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

    <transition name="toast">
      <output
        v-if="notification.show"
        class="toast-notification"
        :class="notification.type"
        aria-live="polite"
      >
        <span class="toast-icon">
          <PhCheckCircle v-if="notification.type === 'success'" :size="18" weight="fill" />
          <PhXCircle v-else :size="18" weight="fill" />
        </span>
        <span>{{ notification.message }}</span>
        <button class="toast-close" @click="notification.show = false" aria-label="Cerrar">
          <PhX :size="16" weight="bold" />
        </button>
      </output>
    </transition>
  </div>
</template>

<style scoped>
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

.dashboard-header {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    var(--shadow-md);
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.header-title h1 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-primary);
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(30, 58, 138, 0.4);
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: translateY(0);
}

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
  color: var(--color-text-primary);
}

.stat-value.highlight {
  color: var(--color-destructive);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.toolbar {
  max-width: 1200px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 4px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: var(--transition-base);
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.search-box input::placeholder {
  color: var(--color-text-muted);
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
  background: var(--color-bg-tertiary);
  color: var(--color-text-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: var(--transition-base);
}

.clear-search:hover {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.selected-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-destructive-dark);
}

.btn-danger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--color-destructive), var(--color-destructive-dark));
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-danger:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.btn-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-ghost:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-text-muted);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 12px;
}

.table-container {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-bg-primary);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    var(--shadow-lg);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.table-state {
  padding: 60px 24px;
  text-align: center;
  color: var(--color-text-secondary);
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
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary-light);
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

.state-icon.error {
  color: var(--color-destructive);
}

.table-state.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.state-icon.empty {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.table-state.empty h3 {
  margin: 0;
  font-size: 18px;
  color: var(--color-text-primary);
}

.table-state.empty p {
  margin: 0;
  max-width: 300px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.user-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
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

.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-base);
}

.sortable:hover {
  color: var(--color-primary-light);
}

.sort-icon {
  color: var(--color-text-muted);
  transition: var(--transition-base);
  display: flex;
  align-items: center;
}

.sort-icon.active {
  color: var(--color-primary);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
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
  border-radius: var(--radius-lg);
  font-size: 20px;
}

.user-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.user-email {
  color: var(--color-text-secondary);
  font-family: monospace;
  font-size: 13px;
}

.copy-btn {
  padding: 4px 8px;
  border: none;
  background: var(--color-bg-tertiary);
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: var(--transition-base);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

.user-cell:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.date-badge {
  padding: 4px 10px;
  background: var(--color-bg-tertiary);
  border-radius: 20px;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  display: grid;
  place-items: center;
  color: var(--color-text-secondary);
}

.btn-icon:hover {
  transform: translateY(-2px);
}

.btn-view:hover {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-primary-light);
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-destructive);
}

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
  border: 2px solid var(--color-border);
  border-radius: 5px;
  display: grid;
  place-items: center;
  transition: var(--transition-base);
  background: var(--color-bg-primary);
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
  font-size: 11px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: var(--transition-base);
}

.checkbox-wrapper input:checked ~ .checkmark::after {
  opacity: 1;
  transform: scale(1);
}

.table-footer {
  max-width: 1200px;
  margin: 16px auto 0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-primary);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow:
    inset -2px -2px 8px rgba(0, 0, 0, 0.04),
    var(--shadow-md);
  font-size: 13px;
  color: var(--color-text-muted);
  position: relative;
  z-index: 1;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

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
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: 28px;
  max-width: 460px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  border: 3px solid rgba(239, 68, 68, 0.2);
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
  color: var(--color-text-primary);
}

.modal-description {
  margin: 0 0 20px;
  color: var(--color-text-secondary);
  font-size: 15px;
}

.user-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  text-align: left;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info strong {
  color: var(--color-text-primary);
  font-size: 15px;
}

.user-info span {
  color: var(--color-text-muted);
  font-size: 13px;
  font-family: monospace;
}

.modal-warning {
  margin: 0 0 24px;
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

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
}

.modal-actions .btn-danger {
  padding: 12px 20px;
  font-size: 14px;
  justify-content: center;
}

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--color-bg-primary);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 14px;
  color: var(--color-text-primary);
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
  display: flex;
  flex-shrink: 0;
}

.toast-close {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
}

.toast-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

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
    border-radius: var(--radius-lg);
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

@media (prefers-color-scheme: dark) {
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
    background: var(--color-bg-secondary);
  }

  .user-table tr:hover {
    background: rgba(59, 130, 246, 0.08);
  }

  .search-box input {
    background: var(--color-bg-secondary);
  }

  .modal-warning {
    background: rgba(239, 68, 68, 0.12);
  }
}

@media (hover: none) {
  .user-table tr:hover {
    background: transparent;
  }

  .copy-btn {
    opacity: 1;
  }
}
</style>
