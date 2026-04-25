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
exports.create = create;
exports.getByUser = getByUser;
exports.getAll = getAll;
exports.updateStatus = updateStatus;
const enrollmentsService = __importStar(require("../services/enrollments"));
async function create(req, res, next) {
    try {
        const { userId, programId } = req.body;
        const enrollment = await enrollmentsService.createEnrollment(userId, programId);
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
    }
    catch (error) {
        next(error);
    }
}
async function getByUser(req, res, next) {
    try {
        const userId = req.params.userId;
        const enrollments = await enrollmentsService.getEnrollmentsByUser(userId);
        res.json({ enrollments });
    }
    catch (error) {
        next(error);
    }
}
async function getAll(req, res, next) {
    try {
        const enrollments = await enrollmentsService.getAllEnrollments();
        res.json({ enrollments });
    }
    catch (error) {
        next(error);
    }
}
async function updateStatus(req, res, next) {
    try {
        const id = req.params.id;
        const enrollment = await enrollmentsService.updateEnrollmentStatus(id, req.body.status);
        res.json({ message: 'Status updated', enrollment });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=enrollments.js.map