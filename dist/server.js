"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const productionEnvVars = ['JWT_SECRET', 'FRONTEND_URL'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (process.env.NODE_ENV === 'production') {
    const missingProdVars = productionEnvVars.filter(v => !process.env[v]);
    missingVars.push(...missingProdVars);
}
if (missingVars.length > 0) {
    console.error(`\n❌ FATAL: Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n`);
    process.exit(1);
}
const PORT = parseInt(process.env.PORT || '4000', 10);
app_1.default.listen(PORT, () => {
    console.log(`\n  🚀 TREVORORS LABS API Server`);
    console.log(`  → Running on http://localhost:${PORT}`);
    console.log(`  → Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  → Health: http://localhost:${PORT}/api/health\n`);
});
//# sourceMappingURL=server.js.map