"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimit_1 = require("./middlewares/rateLimit");
const passport_1 = __importDefault(require("passport"));
require("./lib/passport"); // initialize passport strategies
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const applications_1 = __importDefault(require("./routes/applications"));
const payments_1 = __importDefault(require("./routes/payments"));
const enrollments_1 = __importDefault(require("./routes/enrollments"));
const certificates_1 = __importDefault(require("./routes/certificates"));
const performance_1 = __importDefault(require("./routes/performance"));
const programs_1 = __importDefault(require("./routes/programs"));
const admin_1 = __importDefault(require("./routes/admin"));
const batches_1 = __importDefault(require("./routes/batches"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
// Rate limiting
app.use('/api', rateLimit_1.apiLimiter);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/enrollments', enrollments_1.default);
app.use('/api/certificates', certificates_1.default);
app.use('/api/performance', performance_1.default);
app.use('/api/programs', programs_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/batches', batches_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map