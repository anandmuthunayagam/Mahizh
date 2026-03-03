export const isAdmin = () => {
  return sessionStorage.getItem("role") === "admin";
};
