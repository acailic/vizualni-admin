import { getServerSession } from "next-auth";
import { createPaletteForUser, deletePaletteForUser, getPalettesForUser, updatePaletteForUser, } from "@/db/palettes";
import { nextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { controller } from "@/server/nextkit";
export const UserController = controller({
    createPalette: async ({ req, res }) => {
        var _a;
        const session = await getServerSession(req, res, nextAuthOptions);
        const userId = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error("You must be logged in to create a custom color palette!");
        }
        const data = req.body;
        return await createPaletteForUser({
            ...data,
            user_id: userId,
        });
    },
    getPalettes: async ({ req, res }) => {
        var _a;
        const session = await getServerSession(req, res, nextAuthOptions);
        const userId = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error("You must be logged in to view your custom color palettes!");
        }
        return await getPalettesForUser({ user_id: userId });
    },
    deletePalette: async ({ req, res }) => {
        var _a;
        const session = await getServerSession(req, res, nextAuthOptions);
        const userId = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error("You must be logged in to delete a custom color palette!");
        }
        const data = req.body;
        await deletePaletteForUser({ ...data, user_id: userId });
    },
    updatePalette: async ({ req, res }) => {
        var _a;
        const session = await getServerSession(req, res, nextAuthOptions);
        const userId = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new Error("You must be logged in to update a custom color palette!");
        }
        const data = req.body;
        await updatePaletteForUser({ ...data, user_id: userId });
    },
});
