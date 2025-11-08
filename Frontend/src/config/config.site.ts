// src/config/config.site.ts

const config = {
  site: {
    name: "My Project",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },

  api: {
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || "http://localhost:8000/api/v1",
  },

  auth: {
    loginPath: "/login",
    registerPath: "/register",
    profilePath: "/profile",
    albumsPath: "/albums",
  },

  i18n: {
    defaultLocale: "ru",
    supportedLocales: ["ru", "en"],
  },
};

export default config;
