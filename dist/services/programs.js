"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = createProgram;
exports.listPrograms = listPrograms;
exports.updateProgram = updateProgram;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
async function createProgram(data) {
    return prisma_1.default.program.create({
        data: {
            name: data.name,
            track: data.track,
            description: data.description,
            price: data.price,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            maxSeats: data.maxSeats || 30,
        },
    });
}
async function listPrograms() {
    return prisma_1.default.program.findMany({
        orderBy: { startDate: 'desc' },
        include: {
            _count: { select: { enrollments: true } },
        },
    });
}
async function updateProgram(id, data) {
    const program = await prisma_1.default.program.findUnique({ where: { id } });
    if (!program)
        throw new errorHandler_1.AppError('Program not found', 404);
    return prisma_1.default.program.update({
        where: { id },
        data,
    });
}
//# sourceMappingURL=programs.js.map