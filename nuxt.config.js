import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  css: ['@/assets/css/style.css', 'bootstrap/dist/css/bootstrap.min.css'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/_shared.scss" as *;',
        },
      },
    },
  },

  server: {
    port: 6547,
  },

  devServer: {
    host: '0.0.0.0',
    port: 6547,
  },

  app: {
    baseURL: '/',
    head: {
      title: 'ellemoi AGF',
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        { name: 'description', content: 'LeadTech Agv App' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  ssr: false,

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'ellemoi AGF',
      short_name: 'AGF',
      start_url: './',
      scope: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4A90E2',
      icons: [
        {
          src: '/icon-192x192.png', // 使用标准的正方形图标
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png', // 提供更大的图标
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable', // 提供可遮罩的图标
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: '/*',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'html-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: '/_nuxt/.*',
          handler: 'CacheFirst',
          options: {
            cacheName: 'assets-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: '/images/.*',
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: /.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'fallback',
            networkTimeoutSeconds: 3,
            cacheableResponse: { statuses: [200] },
            plugins: [
              {
                fetchDidFail: async ({ event }) => {
                  return caches.match('/offline.html');
                },
              },
            ],
          },
        },
      ],
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  compatibilityDate: '2025-04-08',
});
