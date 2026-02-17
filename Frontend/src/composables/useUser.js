// src/composables/useUser.js
import { onMounted, ref } from "vue";
import { getUsers } from "@/services/userService";
import { useUserStore } from "@/stores/UseStore";

export function useUser() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchUsers = async () => {
    if (users.value.length) return;
    loading.value = true;
    try {
      const response = await getUsers();
      users.value = response.data;
      return users.value; // opcional
    } catch (err) {
      console.error("Error fetching users:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchUsers);

  return { users, loading, error, fetchUsers };
}

export function useUserAction() {
  const store = useUserStore();

  const addUser = async (user) => {
    store.users.push(user);
  };

  const removeUser = async (id) => {
    store.users = store.users.filter((u) => u.id !== id);
  };

  return { addUser, removeUser };
}
