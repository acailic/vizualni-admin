import "iframe-resizer/js/iframeResizer.contentWindow.js";
import ErrorPage from "next/error";
import Head from "next/head";
import Script from "next/script";
import { ChartPublished } from "@/components/chart-published";
import { useEmbedQueryParams } from "@/components/embed-params";
import { ConfiguratorStateProvider, } from "@/configurator";
// For static export, we'll return an empty array
// Charts won't be pre-rendered in demo mode
export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: false,
    };
};
export const getStaticProps = async () => {
    // In static export mode, return notfound
    // In production with a database, this would fetch the config
    return {
        props: {
            status: "notfound",
        },
    };
};
const EmbedPage = (props) => {
    const { embedParams } = useEmbedQueryParams();
    if (props.status === "notfound") {
        return <ErrorPage statusCode={404}/>;
    }
    const { config: { key, data: state }, } = props;
    return (<>
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline'; script-src 'unsafe-inline' 'self' https://cdn.jsdelivr.net/npm/@open-iframe-resizer/; style-src 'self' 'unsafe-inline';"/>
      </Head>
      <Script type="module" src="https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@1.6.0/dist/index.js"/>
      <ConfiguratorStateProvider chartId="published" initialState={{ ...state, state: "PUBLISHED" }}>
        <ChartPublished configKey={key} embedParams={embedParams}/>
      </ConfiguratorStateProvider>
    </>);
};
export default EmbedPage;
