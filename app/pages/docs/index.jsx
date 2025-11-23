/* eslint-disable import/no-anonymous-default-export */
import { MDXProvider } from "@mdx-js/react";
import { CssBaseline } from "@mui/material";
import { AudioSpecimen, Catalog, CodeSpecimen, ColorPaletteSpecimen, ColorSpecimen, DownloadSpecimen, HintSpecimen, HtmlSpecimen, ImageSpecimen, Markdown, Page, TableSpecimen, TypeSpecimen, } from "catalog";
import Slugger from "github-slugger";
import { useEffect, useMemo, useState } from "react";
import { i18n, I18nProvider, parseLocaleString } from "@/src";
const pages = [
    {
        path: "/",
        title: "Introduction",
        content: require("@/docs/catalog/index.mdx"),
    },
    {
        path: "/branding",
        title: "Branding",
        content: require("@/docs/catalog/branding.mdx"),
    },
    {
        title: "User Guides",
        pages: [
            {
                path: "/getting-started",
                title: "Getting Started",
                content: require("@/docs/catalog/getting-started.mdx"),
            },
            {
                path: "/tutorials-overview",
                title: "Tutorials Overview",
                content: require("@/docs/catalog/tutorials-overview.mdx"),
            },
            {
                path: "/chart-types-guide",
                title: "Chart Types Guide",
                content: require("@/docs/catalog/chart-types-guide.mdx"),
            },
            {
                path: "/embedding-guide",
                title: "Embedding Guide",
                content: require("@/docs/catalog/embedding-guide.mdx"),
            },
            {
                path: "/data-gov-rs-guide",
                title: "data.gov.rs API Guide",
                content: require("@/docs/catalog/data-gov-rs-guide.mdx"),
            },
        ],
    },
    // {
    //   path: "/accessibility",
    //   title: "Accessibility",
    //   content: require("@/docs/catalog/accessibility.mdx"),
    // },
    // {
    //   title: "Theming",
    //   pages: [
    //     {
    //       path: "/theming",
    //       title: "Overview",
    //       content: require("@/docs/catalog/theming.mdx"),
    //     },
    //     {
    //       path: "/colors",
    //       title: "Colors",
    //       content: require("@/docs/catalog/colors.mdx"),
    //     },
    //     {
    //       path: "/layout",
    //       title: "Layout",
    //       content: require("@/docs/catalog/layout.mdx"),
    //     },
    //   ],
    // },
    {
        title: "Design Concept",
        pages: [
            {
                path: "/mockups",
                title: "Mockups",
                content: require("@/docs/catalog/mockups"),
            },
            {
                path: "/chart-config",
                title: "Chart-Config",
                content: require("@/docs/catalog/chart-config"),
            },
        ],
    },
    {
        title: "Charts",
        pages: [
            {
                path: "/charts/rdf-to-visualize",
                title: "RDF to visualize",
                content: require("@/docs/catalog/rdf-to-visualize.mdx"),
            },
        ],
    },
    {
        path: "/api",
        title: "API",
        content: require("@/docs/catalog/chart-preview-via-api.mdx"),
    },
    {
        path: "/components",
        title: "Components",
        content: require("@/docs/catalog/components"),
    },
    {
        path: "/testing",
        title: "Testing",
        content: require("@/docs/catalog/testing.mdx"),
    },
];
const mkHeading = (level) => {
    const Component = (props) => {
        const slug = useMemo(() => {
            const slugger = new Slugger();
            return slugger.slug(props.children);
        }, [props.children]);
        return (<Markdown.Heading level={level} text={[props.children]} slug={slug}/>);
    };
    Component.displayName = `Heading${level}`;
    return Component;
};
const mdxComponents = {
    wrapper: ({ children }) => <Page>{children}</Page>,
    h1: mkHeading(1),
    h2: mkHeading(2),
    h3: mkHeading(3),
    h4: mkHeading(4),
    h5: mkHeading(5),
    h6: mkHeading(6),
    p: Markdown.Paragraph,
    ul: Markdown.UnorderedList,
    ol: Markdown.OrderedList,
    li: Markdown.ListItem,
    blockquote: Markdown.BlockQuote,
    em: Markdown.Em,
    strong: Markdown.Strong,
    del: Markdown.Del,
    img: Markdown.Image,
    code: Markdown.CodeSpan,
    hr: Markdown.Hr,
    a: ({ href, ...props }) => (<Markdown.Link to={href} {...props}/>),
    ImageSpecimen,
    AudioSpecimen,
    CodeSpecimen,
    ColorSpecimen,
    ColorPaletteSpecimen,
    HtmlSpecimen,
    HintSpecimen,
    TableSpecimen,
    TypeSpecimen,
    DownloadSpecimen,
};
const HashHandler = () => {
    useEffect(() => {
        // Scroll to element after page has been rendered
        let timeout = setTimeout(() => {
            const hash = location.hash && location.hash !== ""
                ? location.hash.slice(1)
                : undefined;
            if (!hash) {
                return;
            }
            else {
                const element = document.querySelector("#" + hash);
                element === null || element === void 0 ? void 0 : element.scrollIntoView({
                    behavior: "smooth",
                });
            }
        }, 1);
        return () => clearTimeout(timeout);
    }, []);
    return null;
};
export default () => {
    const [mounted, setMounted] = useState(false);
    const locale = parseLocaleString("en");
    i18n.activate(locale);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted ? (<MDXProvider components={mdxComponents}>
      <I18nProvider i18n={i18n}>
        <CssBaseline />
        <Catalog basePath="/docs" useBrowserHistory title="Visualize" pages={pages} theme={{
            brandColor: "#0B4EA2",
            sidebarColorText: "#333",
            navBarTextColor: "#333",
            sidebarColorHeading: "#0B4EA2",
            pageHeadingTextColor: "#fff",
            linkColor: "#C6363C",
            sidebarColorTextActive: "#C6363C",
            background: "#f5f5f5",
            pageHeadingBackground: "#0B4EA2",
        }}/>
        <HashHandler />
      </I18nProvider>
    </MDXProvider>) : null;
};
