export const isLoggedIn = () => {
  return !!sessionStorage.getItem("token");
};

export const isAdmin = () => {
  return sessionStorage.getItem("role") === "admin";
};
