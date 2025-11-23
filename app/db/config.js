/**
 * Server side methods to connect to the database
 */
import { prisma } from "@/db/client";
import { isDataSourceUrlAllowed } from "@/domain/data-source";
import { upgradeConfiguratorStateServerSide } from "@/utils/chart-config/upgrade-cube";
import { migrateConfiguratorState } from "@/utils/chart-config/versioning";
/**
 * Store data in the DB.
 * If the user is logged, the chart is linked to the user.
 *
 * @param key Key of the config to be stored
 * @param data Data to be stored as configuration
 */
export const createConfig = async ({ key, data, userId, published_state, }) => {
    return await prisma.config.create({
        data: {
            key,
            data,
            user_id: userId,
            published_state,
        },
    });
};
/**
 * Update config in the DB.
 * Only valid for logged in users.
 *
 * @param key Key of the config to be updated
 * @param data Data to be stored as configuration
 */
export const updateConfig = async ({ key, data, published_state, }) => {
    return await prisma.config.update({
        where: {
            key,
        },
        data: {
            key,
            data,
            updated_at: new Date(),
            published_state: published_state,
        },
    });
};
/**
 * Remove config from the DB.
 * Only valid for logged in users.
 *
 * @param key Key of the config to be updated
 */
export const removeConfig = async ({ key }) => {
    await prisma.configView
        .deleteMany({
        where: {
            config_key: key,
        },
    })
        .then(() => {
        return prisma.config.delete({
            where: {
                key,
            },
        });
    });
};
const migrateCubeIri = (iri) => {
    if (iri.includes("https://environment.ld.admin.ch/foen/nfi")) {
        return iri.replace(/None-None-/, "");
    }
    return iri;
};
/** Ensure that filters are ordered by position */
const ensureFiltersOrder = (chartConfig) => {
    return {
        ...chartConfig,
        cubes: chartConfig.cubes.map((cube) => {
            return {
                ...cube,
                filters: Object.fromEntries(Object.entries(cube.filters)
                    .sort(([, a], [, b]) => {
                    var _a, _b;
                    return ((_a = a.position) !== null && _a !== void 0 ? _a : 0) - ((_b = b.position) !== null && _b !== void 0 ? _b : 0);
                })
                    .map(([k, v]) => {
                    const { position, ...rest } = v;
                    return [k, rest];
                })),
            };
        }),
    };
};
/** Ensure that cube iris are migrated */
const ensureMigratedCubeIris = (chartConfig) => {
    return {
        ...chartConfig,
        cubes: chartConfig.cubes.map((cube) => ({
            ...cube,
            iri: migrateCubeIri(cube.iri),
        })),
    };
};
const parseDbConfig = async (d) => {
    const data = d.data;
    const state = (await migrateConfiguratorState(data));
    if (!isDataSourceUrlAllowed(state.dataSource.url)) {
        throw new Error("Invalid data source!");
    }
    return {
        ...d,
        data: {
            ...state,
            chartConfigs: state.chartConfigs
                .map(ensureFiltersOrder)
                .map(ensureMigratedCubeIris),
        },
    };
};
const upgradeDbConfig = async (config) => {
    const state = config.data;
    const dataSource = state.dataSource;
    return {
        ...config,
        data: await upgradeConfiguratorStateServerSide(state, {
            dataSource,
        }),
    };
};
/**
 * Get data from DB.
 *
 * @param key Get data from DB with this key
 */
export const getConfig = async (key) => {
    const config = await prisma.config.findFirst({
        where: {
            key,
        },
    });
    if (!config) {
        return;
    }
    const dbConfig = await parseDbConfig(config);
    return await upgradeDbConfig(dbConfig);
};
/**
 * Get all configs from DB.
 */
export const getAllConfigs = async ({ limit, } = {}) => {
    const configs = await prisma.config.findMany({
        orderBy: {
            created_at: "desc",
        },
        take: limit,
    });
    const parsedConfigs = await Promise.all(configs.map(parseDbConfig));
    return await Promise.all(parsedConfigs.map(upgradeDbConfig));
};
/** @internal */
export const getConfigViewCount = async (configKey) => {
    return await prisma.config
        .findFirstOrThrow({
        where: {
            key: configKey,
        },
        include: {
            _count: {
                select: {
                    views: true,
                },
            },
        },
    })
        .then((config) => config._count.views)
        .catch((error) => {
        console.error(`Failed to get view count for config ${configKey}:`, error);
        return 0;
    });
};
/**
 * Increase the view count of a config. Previewing of charts adds views without config key.
 */
export const increaseConfigViewCount = async (configKey) => {
    await prisma.configView.create({
        data: {
            config_key: configKey,
        },
    });
};
/**
 * Get all configs metadata from DB.
 */
export const getAllConfigsMetadata = async ({ limit, orderByViewCount, } = {}) => {
    return await prisma.config.findMany({
        select: {
            key: true,
            created_at: true,
            updated_at: true,
            published_state: true,
            user_id: true,
        },
        orderBy: orderByViewCount
            ? { views: { _count: "desc" } }
            : { created_at: "desc" },
        take: limit,
    });
};
/**
 * Get config from a user.
 */
export const getUserConfigs = async (userId) => {
    const configs = await prisma.config.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    const parsedConfigs = await Promise.all(configs.map(parseDbConfig));
    const upgradedConfigs = await Promise.all(parsedConfigs.map(upgradeDbConfig));
    const configsWithViewCount = await Promise.all(upgradedConfigs.map(async (config) => {
        return {
            ...config,
            viewCount: await getConfigViewCount(config.key),
        };
    }));
    return configsWithViewCount;
};
