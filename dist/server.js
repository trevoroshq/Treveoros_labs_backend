"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(process.env.PORT || '4000', 10);
app_1.default.listen(PORT, () => {
    console.log(`\n  🚀 TREVORORS LABS API Server`);
    console.log(`  → Running on http://localhost:${PORT}`);
    console.log(`  → Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  → Health: http://localhost:${PORT}/api/health\n`);
});
//# sourceMappingURL=server.js.map