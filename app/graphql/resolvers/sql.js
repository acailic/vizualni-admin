import { topology } from "topojson-server";
import { SQL_ENDPOINT } from "@/domain/env";
import { DataCubePublicationStatus, } from "@/graphql/resolver-types";
const fetchSQL = ({ path, pathParams, method = "GET", body, }) => fetch(`${SQL_ENDPOINT}${path}${pathParams ? `?${new URLSearchParams(pathParams)}` : ``}`, { method, body });
const parseSQLCube = (cube) => {
    const { iri, title, description } = cube;
    return {
        cube: cube,
        locale: "en",
        data: {
            iri,
            title,
            description,
            publicationStatus: DataCubePublicationStatus.Published,
            identifier: "",
        },
    };
};
export const dataCubeLatestIri = async () => {
    return "";
};
export const dataCubeUnversionedIri = async () => {
    return "";
};
export const searchCubes = async () => {
    const result = await fetchSQL({ path: "cubes" });
    const cubes = await result.json();
    return cubes.map((d) => ({
        dataCube: parseSQLCube(d),
    }));
};
export const dataCubeComponents = async () => {
    return { dimensions: [], measures: [] };
};
export const dataCubeMetadata = async () => {
    return {};
};
export const dataCubeComponentTermsets = async () => {
    return [];
};
export const possibleFilters = async (_, { cubeFilter }) => {
    const { iri, filters } = cubeFilter;
    // FIXME: there ideally would be an access to a parent cube
    const result = await fetchSQL({
        path: "cube_observations",
        pathParams: { cube_iri: iri },
    });
    const allObservations = await result.json();
    const nbFilters = Object.keys(filters).length;
    for (let i = nbFilters; i > 0; i--) {
        const queryFilters = Object.fromEntries(Object.entries(filters).slice(0, i));
        const observations = filterObservations(allObservations, queryFilters);
        if (observations.length === 0) {
            continue;
        }
        const result = Object.keys(filters).map((d) => ({
            id: d,
            type: "single",
            value: observations[0][d],
        }));
        return result;
    }
    return [];
};
export const dataCubeDimensionGeoShapes = async () => {
    return {
        topology: topology({
            shapes: {
                type: "FeatureCollection",
                features: [],
            },
        }),
    };
};
export const dataCubeDimensionGeoCoordinates = async () => {
    return [];
};
const filterObservations = (allObservations, filters) => {
    const observations = [];
    // FIXME: move to backend
    if (filters) {
        const filtersEntries = Object.entries(filters);
        allObservations.forEach((d) => {
            const add = filtersEntries.reduce((acc, _, index) => {
                const filter = filtersEntries[index];
                // TODO: implement multi & range filters.
                if (filter[1].type === "single") {
                    const [_k, { value }] = filter;
                    const k = _k;
                    if (d[k] === value) {
                        acc.push(true);
                    }
                    acc.push(false);
                }
                else if (filter[1].type === "range") {
                    const [_k, { from, to }] = filter;
                    const k = _k;
                    const v = d[k];
                    if (v !== null) {
                        // FIXME: handle properly, right now works only for years.
                        if (+v >= +from && +v <= +to) {
                            acc.push(true);
                        }
                    }
                    acc.push(false);
                }
                return acc;
            }, []);
            if (add.filter(Boolean).length === filtersEntries.length) {
                observations.push(d);
            }
        });
    }
    else {
        allObservations.forEach((d) => observations.push(d));
    }
    return observations;
};
export const dataCubeObservations = async () => {
    return {
        data: [],
        sparqlEditorUrl: "",
    };
};
export const dataCubePreview = async () => {
    return {
        dimensions: [],
        measures: [],
        observations: [],
    };
};
