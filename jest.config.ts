import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/app"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/page.tsx",
    "!app/**/layout.tsx",
    "!app/**/metadata.ts",
    "!app/sitemap.ts",
    "!app/api/**",
    "!app/components/AdminPanel.tsx",
    "!app/components/AiChat.tsx",
    "!app/components/ShareModal.tsx",
    "!app/components/TransactionFilters.tsx",
    "!app/components/TransactionModal.tsx",
    "!app/components/ThemeToggle.tsx",
    "!app/components/ToastContainer.tsx",
    "!app/login/LoginContent.tsx",
    "!app/context/GlobalContext.tsx",
    "!app/hooks/useAccessibility.ts",
    "!app/lib/accessibility.ts",
    "!app/config/chatConfig.ts",
    "!app/api/transactions/transactions.ts",
    "!app/types/chat.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
}

export default createJestConfig(config)
