import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { staticPages } from "@/static-pages";
export default function ContentPage({ staticPage }) {
    var _a;
    const Component = (_a = staticPages[staticPage]) === null || _a === void 0 ? void 0 : _a.component;
    return (<ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
    </ContentMDXProvider>);
}
export const getStaticPaths = async () => {
    return {
        paths: [],
        // TODO: change to false once https://github.com/vercel/next.js/issues/19934 is fixed
        fallback: "blocking",
    };
};
export const getStaticProps = async ({ params, locale, }) => {
    const path = `/${locale}/${params.slug}`;
    // FIXME: this check should not be needed when fallback: false can be used
    const pageExists = !!staticPages[path];
    if (!pageExists) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            staticPage: path,
        },
    };
};
