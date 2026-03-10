import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        fileParallelism: false,
        setupFiles: ["./tests/integration/setup.ts"],
        env: {
            JWT_SECRET: "test-secret",
            PASSWORD_HASH: "$2b$10$CD8P.GS9zUSujDJzNrfYNeyiBuZo.GbfKTEvOxDTczn2ysxB0iuc.", // Password casuale per test
            MONGO_URI: "mongodb://admin:secret@localhost:27017/linkvault-test?authSource=admin",
        },
    },
})