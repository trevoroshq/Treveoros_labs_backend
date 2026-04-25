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
exports.getMyApplications = getMyApplications;
exports.list = list;
exports.getById = getById;
exports.updateStatus = updateStatus;
const applicationsService = __importStar(require("../services/applications"));
async function create(req, res, next) {
    try {
        const application = await applicationsService.createApplication(req.user.id, req.body);
        res.status(201).json({ message: 'Application submitted', application });
    }
    catch (error) {
        next(error);
    }
}
async function getMyApplications(req, res, next) {
    try {
        const applications = await applicationsService.getApplicationsByUserId(req.user.id);
        res.json({ applications });
    }
    catch (error) {
        next(error);
    }
}
async function list(req, res, next) {
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        const track = typeof req.query.track === 'string' ? req.query.track : undefined;
        const applications = await applicationsService.listApplications({ status, track });
        res.json({ applications });
    }
    catch (error) {
        next(error);
    }
}
async function getById(req, res, next) {
    try {
        const id = req.params.id;
        const application = await applicationsService.getApplicationById(id);
        res.json({ application });
    }
    catch (error) {
        next(error);
    }
}
async function updateStatus(req, res, next) {
    try {
        const id = req.params.id;
        const application = await applicationsService.updateApplicationStatus(id, req.body);
        res.json({ message: 'Status updated', application });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=applications.js.map