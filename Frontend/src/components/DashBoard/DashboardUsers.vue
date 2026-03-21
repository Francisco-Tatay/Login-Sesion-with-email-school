<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UseStore";

document.title = "Dashboard de usuarios";

const storeUsers = useUserStore();
const { users, loading, error } = storeToRefs(storeUsers);

onMounted(async () => {
  await storeUsers.fetchUsers();
  console.log(users.value);
});

async function handleDelete(email) {
  await storeUsers.deleteUser(email);
  await storeUsers.fetchUsers();
}
</script>

<template>
  <div class="container">
    <h1>Dashboard de usuarios</h1>

    <p v-if="loading">Cargando usuarios...</p>
    <p v-else-if="error">Error al cargar usuarios</p>

    <table v-else class="user-table">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Email</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id || user.email">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button type="button" @click="handleDelete(user.email)"> Eliminar </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
