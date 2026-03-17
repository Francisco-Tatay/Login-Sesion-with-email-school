import http from "../api/http";
export const getUsers = async () => http.get("/users/all");
export const addUser = async (user) => http.post("/register", user);
export const SendPasswordEmail = async (email) => http.post("/users/resetPassword", { email });
export const loginUser = async (credentials) => http.post("/login", credentials);
export const deleteUser=async(email)=>http.delete("/users/delete",{data:{email}});
