import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        setupFiles: ["./tests/integration/setup.ts"],
        env: {
            JWT_SECRET: "test-secret",
            PASSWORD_HASH: "$2b$10$dummyHashForTestingOnly1234567890123456789012",
            MONGO_URI: "mongodb://admin:secret@localhost:27017/linkvault-test?authSource=admin",
        },
    },
})