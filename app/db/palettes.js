import { convertDBTypeToPaletteType, convertPaletteTypeToDBType, } from "@/config-types";
import { prisma } from "@/db/client";
export const createPaletteForUser = async (data) => {
    const palette = await prisma.palette.create({
        data: {
            name: data.name,
            type: convertPaletteTypeToDBType(data.type),
            colors: data.colors,
            user_id: data.user_id,
            updated_at: new Date(),
        },
    });
    return {
        ...palette,
        type: convertDBTypeToPaletteType(palette.type),
    };
};
export const getPalettesForUser = async ({ user_id, }) => {
    const palettes = await prisma.palette.findMany({
        where: {
            user_id,
        },
    });
    return palettes.map((palette) => {
        return {
            paletteId: palette.paletteId,
            name: palette.name,
            colors: palette.colors,
            type: convertDBTypeToPaletteType(palette.type),
        };
    });
};
export const deletePaletteForUser = async ({ paletteId, user_id, }) => {
    const palette = await prisma.palette.findUnique({
        where: {
            paletteId,
        },
    });
    if (!palette || palette.user_id !== user_id) {
        throw new Error("Palette not found");
    }
    await prisma.palette.delete({
        where: {
            paletteId,
        },
    });
};
export const updatePaletteForUser = async ({ type, paletteId, name, colors, user_id, }) => {
    const palette = await prisma.palette.findUnique({
        where: {
            paletteId,
        },
    });
    if (!palette || palette.user_id !== user_id) {
        throw new Error("Palette not found");
    }
    await prisma.palette.update({
        where: {
            paletteId,
        },
        data: {
            name,
            colors,
            type: type && convertPaletteTypeToDBType(type),
            updated_at: new Date(),
        },
    });
};
