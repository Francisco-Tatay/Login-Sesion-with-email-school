// src/stores/userStore.js
import { defineStore } from "pinia";
import {
  getUsers,
  addUser as addUserApi,
  SendPasswordEmail as sendPasswordEmailApi,
  loginUser,
} from "@/services/userService";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        this.users = (await getUsers()).data;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    async addUser(user) {
      this.loading = true;
      try {
        const { data } = await addUserApi(user);
        const newUser = { ...user, id: data.userId, role_id: 1 };
        this.users.push(newUser);
        return data;
      } catch (error) {
        this.error = error;
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async SendPasswordEmail(email) {
      this.loading = true;
      try {
        console.log(email);
        const { data } = await sendPasswordEmailApi(email);
        return data?.message || "Correo enviado";
      } catch (error) {
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async loginUser(credentials){
      this.loading=true;
      try{
        console.log(credentials);
        const { data } = await loginUser(credentials);
        return data;
      }catch(error){
        console.error(error);
        throw error;
      }finally{
        this.loading=false;
      }
    }
  },
});
