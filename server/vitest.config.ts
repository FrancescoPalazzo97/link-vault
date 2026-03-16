import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        fileParallelism: false,
        setupFiles: ["./tests/integration/setup.ts"],
        env: {
            NODE_ENV: "test",
            JWT_SECRET: "test-secret",
            PASSWORD_HASH: "$2b$10$CD8P.GS9zUSujDJzNrfYNeyiBuZo.GbfKTEvOxDTczn2ysxB0iuc.", // Password " test-password-123 " per test
            MONGO_URI: "mongodb://admin:secret@localhost:27017/linkvault-test?authSource=admin",
        },
        coverage: {
            provider: "v8",
            reporter: ["html", "lcov", "json-summary"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/index.ts"],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 75,
                statements: 90,
            }
        }, 
    },
})