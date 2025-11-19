import { describe, expect, it } from "vitest";

import {
  ConfiguratorStateConfiguringChart,
  decodeChartConfig,
  decodeConfiguratorState,
  LineConfig,
  TableConfig,
} from "@/config-types";
import { configJoinedCubes } from "@/configurator/configurator-state/mocks";
import { stringifyComponentId } from "@/graphql/make-component-id";
import mapConfigV3_3_0 from "@/test/__fixtures/config/prod/map-1.json";
import dualLine1Fixture from "@/test/__fixtures/config/test/chartConfig-photovoltaik-und-gebaudeprogramm.json";
import tableFixture from "@/test/__fixtures/config/test/chartConfig-table-covid19.json";
import {
  CHART_CONFIG_VERSION,
  CONFIGURATOR_STATE_VERSION,
} from "@/utils/chart-config/constants";
import {
  chartConfigMigrations,
  configuratorStateMigrations,
  migrateChartConfig,
  migrateConfiguratorState,
  upOrDown,
} from "@/utils/chart-config/versioning";

const CONFIGURATOR_STATE = {
  dataSource: {
    type: "sparql",
    url: "",
  },
  meta: {
    title: {
      de: "",
      fr: "",
      it: "",
      en: "",
    },
    description: {
      de: "",
      fr: "",
      it: "",
      en: "",
    },
  },
  dataSet: "foo",
} as unknown as ConfiguratorStateConfiguringChart;

describe("config migrations", () => {
  const mapConfigV1_0_0 = {
    version: "1.0.0",
    chartType: "map",
    interactiveFiltersConfig: {
      legend: {
        active: false,
        componentIri: "",
      },
      time: {
        active: false,
        componentIri: "",
        presets: {
          type: "range",
          from: "",
          to: "",
        },
      },
      dataFilters: {
        active: false,
        componentIris: [],
      },
    },
    filters: {},
    fields: {
      areaLayer: {
        show: true,
        componentIri: "GeoShapesDimensionIri",
        measureIri: "MeasureIri",
        colorScaleType: "continuous",
        colorScaleInterpolationType: "linear",
        palette: "oranges",
        nbClass: 5,
      },
      symbolLayer: {
        show: false,
        componentIri: "GeoCoordinatesDimensionIri",
        measureIri: "MeasureIri",
        color: "blue",
      },
    },
    baseLayer: {
      show: true,
    },
  };
  const lineConfigV1_0_0 = {
    version: "1.0.0",
    chartType: "line",
    interactiveFiltersConfig: {
      legend: {
        active: false,
        componentIri: "",
      },
      time: {
        active: false,
        componentIri: "",
        presets: {
          type: "range",
          from: "",
          to: "",
        },
      },
      dataFilters: {
        active: false,
        componentIris: [],
      },
    },
    filters: {},
    fields: {
      x: {
        componentIri: "TimeDimensionIri",
      },
      y: {
        componentIri: "MeasureIri",
      },
    },
  };
  const dashboardConfigV4_0_0 = {
    key: "ZeKjPw1_9Dqt",
    state: "PUBLISHED",
    layout: {
      meta: {
        label: { de: "", en: "", fr: "", it: "" },
        title: { de: "", en: "", fr: "", it: "" },
        description: { de: "", en: "", fr: "", it: "" },
      },
      type: "dashboard",
      layout: "canvas",
      layouts: {
        lg: [
          {
            h: 5,
            i: "tupdJZmSpduE",
            w: 1,
            x: 2,
            y: 7,
            maxW: 4,
            minH: 5,
            resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
          },
        ],
        md: [
          {
            h: 5,
            i: "tupdJZmSpduE",
            w: 1,
            x: 2,
            y: 7,
            maxW: 4,
            minH: 5,
            resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
          },
        ],
        sm: [
          {
            h: 5,
            i: "tupdJZmSpduE",
            w: 1,
            x: 2,
            y: 7,
            maxW: 4,
            minH: 5,
            resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
          },
        ],
        xl: [
          {
            h: 5,
            i: "tupdJZmSpduE",
            w: 1,
            x: 2,
            y: 0,
            maxW: 4,
            minH: 5,
            moved: false,
            static: false,
            resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
          },
        ],
      },
      layoutsMetadata: {
        A7_orWKNE1Bl: { initialized: true },
        dPe76IX5KnFZ: { initialized: true },
        eA7R4wz7Kvq3: { initialized: true },
        tupdJZmSpduE: { initialized: true },
      },
    },
    version: "4.0.0",
    dataSource: {
      url: "https://lindas-cached.cluster.ldbar.ch/query",
      type: "sparql",
    },
    chartConfigs: [
      {
        key: "tupdJZmSpduE",
        meta: {
          label: { de: "", en: "", fr: "", it: "" },
          title: { de: "", en: "", fr: "", it: "" },
          description: { de: "", en: "", fr: "", it: "" },
        },
        cubes: [
          {
            iri: "https://environment.ld.admin.ch/foen/ubd01041prod/4",
            filters: {
              "https://environment.ld.admin.ch/foen/ubd01041prod(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)https://environment.ld.admin.ch/foen/ubd01041prod/location":
                {
                  type: "single",
                  value:
                    "https://ld.admin.ch/dimension/bgdi/inlandwaters/bathingwater/CH22051",
                },
              "https://environment.ld.admin.ch/foen/ubd01041prod(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)https://environment.ld.admin.ch/foen/ubd01041prod/parametertype":
                {
                  type: "single",
                  value: "E.coli",
                },
            },
            joinBy: null,
          },
        ],
        fields: {
          x: {
            sorting: { sortingType: "byAuto", sortingOrder: "asc" },
            componentId:
              "https://environment.ld.admin.ch/foen/ubd01041prod(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)https://environment.ld.admin.ch/foen/ubd01041prod/dateofprobing",
          },
          y: {
            componentId:
              "https://environment.ld.admin.ch/foen/ubd01041prod(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)https://environment.ld.admin.ch/foen/ubd01041prod/value",
          },
        },
        version: "4.0.0",
        chartType: "column",
        interactiveFiltersConfig: {
          legend: { active: false, componentId: "" },
          timeRange: {
            active: false,
            presets: { to: "", from: "", type: "range" },
            componentId:
              "https://environment.ld.admin.ch/foen/ubd01041prod(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)https://environment.ld.admin.ch/foen/ubd01041prod/dateofprobing",
          },
          calculation: { type: "identity", active: false },
          dataFilters: { active: false, componentIds: [] },
        },
      },
    ],
    activeChartKey: "tupdJZmSpduE",
    dashboardFilters: {
      timeRange: {
        active: false,
        presets: { to: "", from: "" },
        timeUnit: "",
      },
      dataFilters: { filters: {}, componentIds: [] },
    },
  };

  it("should migrate to newest config and back (but might lost some info for major version changes)", async () => {
    const migratedConfig = await migrateChartConfig(mapConfigV1_0_0, {
      migrationProps: CONFIGURATOR_STATE,
    });
    expect(migratedConfig).toBeDefined();

    const migratedOldConfig = (await migrateChartConfig(migratedConfig, {
      toVersion: "1.0.0",
    })) as any;
    expect(migratedOldConfig.version).toEqual("1.0.0");
    const symbolLayer = migratedOldConfig.fields.symbolLayer;
    expect(symbolLayer.show).toEqual(false);
    // Should migrate "GeoCoordinatesDimensionIri" to iri defined in Area Layer.
    expect(symbolLayer.componentIri).toEqual(
      mapConfigV1_0_0.fields.areaLayer.componentIri
    );
    expect(symbolLayer.measureIri).toEqual(
      mapConfigV1_0_0.fields.areaLayer.measureIri
    );
    expect(symbolLayer.color).toEqual("#1f77b4");
  });

  it("should migrate to initial config from migrated config for minor version changes", async () => {
    const migratedConfig = await migrateChartConfig(mapConfigV1_0_0, {
      toVersion: "1.0.2",
    });
    const migratedOldConfig = await migrateChartConfig(migratedConfig, {
      toVersion: "1.0.0",
    });

    expect(migratedOldConfig).toEqual(mapConfigV1_0_0);
  });

  it("should correctly migrate interactiveFiltersConfig", async () => {
    const migratedConfig = await migrateChartConfig(lineConfigV1_0_0, {
      migrationProps: CONFIGURATOR_STATE,
    });
    const decodedConfig = decodeChartConfig(migratedConfig);

    expect(decodedConfig).toBeDefined();
    expect(
      (decodedConfig as LineConfig).interactiveFiltersConfig.timeRange
        .componentId === lineConfigV1_0_0.fields.x.componentIri
    ).toBeDefined();

    const migratedOldConfig = (await migrateChartConfig(decodedConfig, {
      toVersion: "1.4.0",
    })) as any;

    expect(
      migratedOldConfig.interactiveFiltersConfig.timeRange.componentIri
    ).toEqual("");
  });

  it("should correctly migrate colorMapping in v4.0.0 for combo charts", async () => {
    const migratedConfig = await migrateChartConfig(dualLine1Fixture, {
      toVersion: "4.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });
    expect(migratedConfig).toBeDefined();
    expect((migratedConfig as any).fields.y.colorMapping).toMatchObject({
      [stringifyComponentId({
        unversionedCubeIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd18_gebaeudeprogramm_co2wirkung/4",
        unversionedComponentIri: "http://schema.org/amount",
      })]: "#ff7f0e",
      [stringifyComponentId({
        unversionedCubeIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/9",
        unversionedComponentIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/AnzahlAnlagen",
      })]: "#1f77b4",
    });
  });

  it("should correctly migrate table charts", async () => {
    const migratedConfig = await migrateChartConfig(tableFixture, {
      toVersion: CHART_CONFIG_VERSION,
      migrationProps: CONFIGURATOR_STATE,
    });
    const decodedConfig = decodeChartConfig(migratedConfig);
    expect(decodedConfig).toBeDefined();
  });

  it("should correctly migrate configs to newest versions", async () => {
    const migratedDashboardConfig = await migrateConfiguratorState(
      dashboardConfigV4_0_0,
      {
        toVersion: CONFIGURATOR_STATE_VERSION,
      }
    );
    const decodedDashboardConfig = decodeConfiguratorState(
      migratedDashboardConfig
    );
    expect(decodedDashboardConfig).toBeDefined();
    const migratedMapConfig = await migrateChartConfig(
      mapConfigV3_3_0.chartConfigs[0],
      {
        toVersion: CHART_CONFIG_VERSION,
        migrationProps: CONFIGURATOR_STATE,
      }
    );
    const decodedMapConfig = decodeChartConfig(migratedMapConfig);
    expect(decodedMapConfig).toBeDefined();
  });

  it("should not migrate joinBy iris", async () => {
    const migratedConfig = await migrateChartConfig(configJoinedCubes.table, {
      toVersion: CHART_CONFIG_VERSION,
      migrationProps: CONFIGURATOR_STATE,
    });
    const decodedConfig = decodeChartConfig(migratedConfig) as TableConfig;
    expect(decodedConfig).toBeDefined();
    expect(Object.keys(decodedConfig.fields)[0]).toBe("joinBy__0");
    expect(decodedConfig.fields["joinBy__0"].componentId).toBe("joinBy__0");
  });
});

describe("last version", () => {
  it("should have a version superior to the last migration (configurator state)", () => {
    const direction = upOrDown(
      CONFIGURATOR_STATE_VERSION,
      configuratorStateMigrations[configuratorStateMigrations.length - 1].to
    );
    expect(direction).toBe("same");
  });

  it("should have a version superior to the last migration (chart config)", () => {
    const direction = upOrDown(
      CHART_CONFIG_VERSION,
      chartConfigMigrations[chartConfigMigrations.length - 1].to
    );
    expect(direction).toBe("same");
  });
});

describe("upOrDown version comparison", () => {
  it("should return 'up' when upgrading from lower to higher version", () => {
    expect(upOrDown("1.0.0", "2.0.0")).toBe("up");
    expect(upOrDown("1.0.0", "1.1.0")).toBe("up");
    expect(upOrDown("1.0.0", "1.0.1")).toBe("up");
    expect(upOrDown("1.2.3", "1.2.4")).toBe("up");
    expect(upOrDown("1.2.3", "1.3.0")).toBe("up");
    expect(upOrDown("1.2.3", "2.0.0")).toBe("up");
  });

  it("should return 'down' when downgrading from higher to lower version", () => {
    expect(upOrDown("2.0.0", "1.0.0")).toBe("down");
    expect(upOrDown("1.1.0", "1.0.0")).toBe("down");
    expect(upOrDown("1.0.1", "1.0.0")).toBe("down");
    expect(upOrDown("1.2.4", "1.2.3")).toBe("down");
    expect(upOrDown("1.3.0", "1.2.3")).toBe("down");
    expect(upOrDown("2.0.0", "1.2.3")).toBe("down");
  });

  it("should return 'same' when versions are identical", () => {
    expect(upOrDown("1.0.0", "1.0.0")).toBe("same");
    expect(upOrDown("1.2.3", "1.2.3")).toBe("same");
    expect(upOrDown("10.20.30", "10.20.30")).toBe("same");
  });

  it("should handle multi-digit version numbers correctly", () => {
    expect(upOrDown("1.9.0", "1.10.0")).toBe("up");
    expect(upOrDown("1.10.0", "1.9.0")).toBe("down");
    expect(upOrDown("10.0.0", "9.99.99")).toBe("up");
  });

  it("should compare major version first, then minor, then patch", () => {
    expect(upOrDown("1.99.99", "2.0.0")).toBe("up");
    expect(upOrDown("1.0.99", "1.1.0")).toBe("up");
  });
});

describe("migration edge cases", () => {
  it("should handle configs without version property (defaults to 1.0.0)", async () => {
    const configWithoutVersion = {
      chartType: "line",
      fields: {
        x: { componentIri: "test" },
        y: { componentIri: "test" },
      },
      filters: {},
      interactiveFiltersConfig: {
        legend: { active: false, componentIri: "" },
        time: { active: false, componentIri: "", presets: { type: "range", from: "", to: "" } },
        dataFilters: { active: false, componentIris: [] },
      },
    };

    const migrated = await migrateChartConfig(configWithoutVersion as any, {
      toVersion: "1.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });

    expect(migrated).toBeDefined();
  });

  it("should preserve data integrity when migrating through multiple versions", async () => {
    const originalData = {
      version: "1.0.0",
      chartType: "line",
      fields: {
        x: { componentIri: "TestDimensionIri" },
        y: { componentIri: "TestMeasureIri" },
      },
      filters: {},
      interactiveFiltersConfig: {
        legend: { active: false, componentIri: "" },
        time: { active: false, componentIri: "", presets: { type: "range", from: "", to: "" } },
        dataFilters: { active: false, componentIris: [] },
      },
    };

    const migrated = await migrateChartConfig(originalData, {
      toVersion: "2.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });

    expect(migrated).toBeDefined();
    expect((migrated as any).chartType).toBe("line");
  });

  it("should handle migration when config is already at target version", async () => {
    const config = {
      version: "3.0.0",
      chartType: "line",
      cubes: [],
      fields: {},
      interactiveFiltersConfig: {},
    };

    const result = await migrateChartConfig(config as any, {
      toVersion: "3.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });

    expect(result).toBeDefined();
    expect(result.version).toBe("3.0.0");
  });

  it("should handle empty configuratorState migrations", async () => {
    const emptyConfig = {
      version: "1.0.0",
      dataSource: { type: "sparql", url: "" },
    };

    const result = await migrateConfiguratorState(emptyConfig as any, {
      toVersion: "1.0.0",
    });

    expect(result).toBeDefined();
  });

  it("should maintain required fields after migration", async () => {
    const mapConfig = {
      version: "1.0.0",
      chartType: "map",
      fields: {
        areaLayer: {
          show: true,
          componentIri: "TestIri",
          measureIri: "TestMeasure",
          colorScaleType: "continuous",
          palette: "oranges",
          nbClass: 5,
        },
        symbolLayer: {
          show: false,
          componentIri: "TestIri",
          measureIri: "TestMeasure",
          color: "red",
        },
      },
      baseLayer: { show: true },
      filters: {},
      interactiveFiltersConfig: {
        legend: { active: false, componentIri: "" },
        time: { active: false, componentIri: "", presets: { type: "range", from: "", to: "" } },
        dataFilters: { active: false, componentIris: [] },
      },
    };

    const migrated = await migrateChartConfig(mapConfig, {
      toVersion: "1.0.2",
      migrationProps: CONFIGURATOR_STATE,
    });

    expect(migrated).toBeDefined();
    expect((migrated as any).chartType).toBe("map");
    expect((migrated as any).fields.areaLayer).toBeDefined();
    expect((migrated as any).fields.symbolLayer).toBeDefined();
  });
});

describe("migration chain validation", () => {
  it("should have continuous migration chain for chartConfig", () => {
    const versions = chartConfigMigrations.map((m) => m.to);

    for (let i = 0; i < chartConfigMigrations.length - 1; i++) {
      const current = chartConfigMigrations[i];
      const next = chartConfigMigrations[i + 1];

      expect(current.to).toBe(next.from);
    }
  });

  it("should have continuous migration chain for configuratorState", () => {
    for (let i = 0; i < configuratorStateMigrations.length - 1; i++) {
      const current = configuratorStateMigrations[i];
      const next = configuratorStateMigrations[i + 1];

      expect(current.to).toBe(next.from);
    }
  });

  it("should have both up and down migrations for all versions", () => {
    chartConfigMigrations.forEach((migration) => {
      expect(migration.up).toBeDefined();
      expect(migration.down).toBeDefined();
      expect(typeof migration.up).toBe("function");
      expect(typeof migration.down).toBe("function");
    });

    configuratorStateMigrations.forEach((migration) => {
      expect(migration.up).toBeDefined();
      expect(migration.down).toBeDefined();
      expect(typeof migration.up).toBe("function");
      expect(typeof migration.down).toBe("function");
    });
  });

  it("should have description for all migrations", () => {
    chartConfigMigrations.forEach((migration) => {
      expect(migration.description).toBeDefined();
      expect(migration.description.length).toBeGreaterThan(0);
    });

    configuratorStateMigrations.forEach((migration) => {
      expect(migration.description).toBeDefined();
      expect(migration.description.length).toBeGreaterThan(0);
    });
  });
});

describe("backward compatibility", () => {
  it("should maintain essential config structure after up and down migration", async () => {
    const originalConfig = {
      version: "2.0.0",
      chartType: "column",
      cubes: [],
      fields: {
        x: { componentIri: "dimension1" },
        y: { componentIri: "measure1" },
      },
      filters: {},
      interactiveFiltersConfig: {
        legend: { active: false, componentIri: "" },
        timeRange: { active: false, componentId: "", presets: { type: "range", from: "", to: "" } },
        calculation: { type: "identity", active: false },
        dataFilters: { active: false, componentIds: [] },
      },
    };

    const upgraded = await migrateChartConfig(originalConfig as any, {
      toVersion: "3.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });

    const downgraded = await migrateChartConfig(upgraded, {
      toVersion: "2.0.0",
      migrationProps: CONFIGURATOR_STATE,
    });

    expect((downgraded as any).chartType).toBe(originalConfig.chartType);
    expect((downgraded as any).version).toBe("2.0.0");
  });
});
