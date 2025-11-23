import { dataSourceToSparqlEditorUrl } from "@/domain/data-source";
export const getSparqlEditorUrl = ({ query, dataSource, }) => {
    const editorUrl = dataSourceToSparqlEditorUrl(dataSource);
    return `${editorUrl}#query=${encodeURIComponent(query)}&requestMethod=POST`;
};
