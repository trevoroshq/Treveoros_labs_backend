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
exports.update = update;
exports.list = list;
exports.getActive = getActive;
exports.deactivate = deactivate;
const batchesService = __importStar(require("../services/batches"));
async function create(req, res, next) {
    try {
        const batch = await batchesService.createBatch(req.body);
        res.status(201).json({ message: 'Batch created', batch });
    }
    catch (error) {
        next(error);
    }
}
async function update(req, res, next) {
    try {
        const batch = await batchesService.updateBatch(req.params.id, req.body);
        res.json({ message: 'Batch updated', batch });
    }
    catch (error) {
        next(error);
    }
}
async function list(req, res, next) {
    try {
        const batches = await batchesService.listBatches();
        res.json({ batches });
    }
    catch (error) {
        next(error);
    }
}
async function getActive(req, res, next) {
    try {
        const track = req.params.track;
        const batch = await batchesService.getActiveBatch(track);
        res.json({ batch }); // null if none found
    }
    catch (error) {
        next(error);
    }
}
async function deactivate(req, res, next) {
    try {
        const batch = await batchesService.deactivateBatch(req.params.id);
        res.json({ message: 'Batch deactivated', batch });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=batches.js.map