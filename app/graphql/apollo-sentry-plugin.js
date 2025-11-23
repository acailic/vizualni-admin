import * as Sentry from "@sentry/nextjs";
const getDataCubeIri = (req) => {
    var _a, _b;
    const { variables, operationName } = req;
    if (operationName === "DataCubePreview" ||
        operationName === "DataCubeMetadata" ||
        operationName === "DataCubeObservations" ||
        operationName === "Components" ||
        operationName === "ComponentsWithHierarchies" ||
        operationName === "PossibleFilters") {
        return (_a = variables === null || variables === void 0 ? void 0 : variables.iri) !== null && _a !== void 0 ? _a : (_b = variables === null || variables === void 0 ? void 0 : variables.cubeFilter) === null || _b === void 0 ? void 0 : _b.iri;
    }
    else if (operationName === "DimensionHierarchy") {
        return variables === null || variables === void 0 ? void 0 : variables.cubeIri;
    }
    else {
        return variables === null || variables === void 0 ? void 0 : variables.dataCubeIri;
    }
};
export const SentryPlugin = {
    requestDidStart({ request }) {
        var _a;
        const transaction = Sentry.startTransaction({
            op: "gql",
            name: "GQL - Unnamed", // this will be the default name, unless the gql query has a name
        });
        if (!!request.operationName) {
            // set the transaction Name if we have named queries
            transaction.setName(`GQL - ${request.operationName}`);
        }
        const dataCubeIri = getDataCubeIri(request);
        if (dataCubeIri) {
            transaction.setTag("visualize.dataCubeIri", dataCubeIri);
        }
        if ((_a = request.variables) === null || _a === void 0 ? void 0 : _a.sourceUrl) {
            transaction.setTag("visualize.sourceUrl", request.variables.sourceUrl);
        }
        return Promise.resolve({
            willSendResponse() {
                // hook for transaction finished
                transaction.finish();
                return Promise.resolve();
            },
            executionDidStart() {
                return Promise.resolve({
                    willResolveField({ info }) {
                        // hook for each new resolver
                        const description = `${info.parentType.name}.${info.fieldName}`;
                        const span = transaction.startChild({
                            op: "resolver",
                            description,
                        });
                        return span.finish();
                    },
                });
            },
        });
    },
};
