import { defineConfig } from '@playwright/test'
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:4188/Relevance-Studio/',trace:'retain-on-failure'},webServer:{command:'npm run preview',url:'http://127.0.0.1:4188/Relevance-Studio/',reuseExistingServer:false}})
