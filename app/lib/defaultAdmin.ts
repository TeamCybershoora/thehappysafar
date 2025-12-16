export const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME ?? "Amit Kumar",
  email: (process.env.DEFAULT_ADMIN_EMAIL ?? "thehappysafar@gmail.com").toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD ?? "Amit@123",
};
