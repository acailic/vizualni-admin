import { NavigationItem } from "@/browse/ui/navigation-item";
export const SubthemeFilters = ({ subthemes, filters, counts, disableLinks, countBg, }) => {
    return (<>
      {subthemes.map((d) => {
            var _a;
            const count = counts[d.iri];
            if (!count) {
                return null;
            }
            return (<NavigationItem key={d.iri} next={{ __typename: "DataCubeAbout", ...d }} filters={filters} active={((_a = filters[filters.length - 1]) === null || _a === void 0 ? void 0 : _a.iri) === d.iri} level={2} count={count} disableLink={disableLinks} countBg={countBg}>
            {d.label}
          </NavigationItem>);
        })}
    </>);
};
