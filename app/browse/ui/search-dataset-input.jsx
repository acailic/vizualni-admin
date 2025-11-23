import { t } from "@lingui/macro";
import { useState } from "react";
import { Flex } from "@/components/flex";
import { SearchField } from "@/components/form";
export const SearchDatasetInput = ({ browseState: { inputRef, search, onSubmitSearch, onReset }, searchFieldProps, }) => {
    const [_, setShowDraftCheckbox] = useState(false);
    const searchLabel = t({
        id: "dataset.search.label",
        message: "Search",
    });
    const placeholderLabel = t({
        id: "dataset.search.placeholder",
        message: "Name, description, organization, theme, keyword",
    });
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputRef.current) {
            onSubmitSearch(inputRef.current.value);
        }
    };
    return (<Flex sx={{ alignItems: "center", gap: 2, pt: 4 }}>
      <SearchField key={search} inputRef={inputRef} id="datasetSearch" label={searchLabel} defaultValue={search !== null && search !== void 0 ? search : ""} InputProps={{
            inputProps: {
                "data-testid": "datasetSearch",
            },
            onKeyPress: handleKeyPress,
            onReset,
            onFocus: () => setShowDraftCheckbox(true),
        }} placeholder={placeholderLabel} {...searchFieldProps} sx={{ ...searchFieldProps === null || searchFieldProps === void 0 ? void 0 : searchFieldProps.sx, width: "100%", maxWidth: 820 }}/>
    </Flex>);
};
