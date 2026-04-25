"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
exports.verify = verify;
exports.getByUser = getByUser;
exports.getAll = getAll;
const certificatesService = __importStar(require("../services/certificates"));
const email_1 = require("../services/email");
async function generate(req, res, next) {
    try {
        const certificate = await certificatesService.generateCertificate(req.body);
        // Fire certificate email with logo + preview (non-blocking)
        if (certificate.user?.email && certificate.user?.name) {
            (0, email_1.sendCertificateIssuedEmail)(certificate.user.email, certificate.user.name, certificate.programName, certificate.performance, certificate.code).catch((err) => console.error('[EMAIL] Certificate email failed:', err));
        }
        res.status(201).json({ message: 'Certificate generated', certificate });
    }
    catch (error) {
        next(error);
    }
}
async function verify(req, res, next) {
    try {
        const code = req.params.code;
        const certificate = await certificatesService.verifyCertificate(code);
        res.json({ valid: true, certificate });
    }
    catch (error) {
        next(error);
    }
}
async function getByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        const certificates = await certificatesService.getCertificatesByUser(userId);
        res.json({ certificates });
    }
    catch (error) {
        next(error);
    }
}
async function getAll(req, res, next) {
    try {
        const certificates = await certificatesService.getAllCertificates();
        res.json({ certificates });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=certificates.js.map