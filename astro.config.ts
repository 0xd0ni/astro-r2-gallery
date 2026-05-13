import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'
import icon from 'astro-icon'

export default defineConfig({
  site: '',
  vite: {
    plugins: [tailwindcss()],
  },

  server: {
    port: 1234,
    host: true,
  },

  devToolbar: {
    enabled: false,
  },

  image: {
    // note that: domain expect hostnames, not full URLs
    domains: ['astro.build', `${process.env.R2_DOMAIN}`],
    remotePatterns: [{ protocol: 'https' }],
    layout: 'constrained',
    responsiveStyles: true,
  },

  integrations: [react(), icon()],
})
