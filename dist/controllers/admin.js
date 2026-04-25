"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = stats;
exports.users = users;
const admin_1 = require("../services/admin");
async function stats(_req, res, next) {
    try {
        const data = await (0, admin_1.getAdminStats)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
async function users(_req, res, next) {
    try {
        const data = await (0, admin_1.getAllUsers)();
        res.json(data);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=admin.js.map