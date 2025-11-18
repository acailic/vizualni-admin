"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[49192],{30066:function(e,t,a){a.r(t),a.d(t,{default:function(){return l}});var n=a(31099),i=a(90089);a(27378);var r=a(35318);let o=["components"],s={};function l(e){let{components:t}=e,a=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"We aspire to adhere to the fundamental design regulations, as described in the ",(0,r.kt)("a",{parentName:"p",href:"https://swiss.github.io/styleguide"},`\xabConfederation Web Guidelines\xbb`),".")),(0,r.kt)("h2",null,"Principles"),(0,r.kt)("p",null,"The goal is to establish a visual coherence between Visualize and other websites within the ",(0,r.kt)("a",{parentName:"p",href:"https://www.admin.ch"},"admin.ch"),` domain.
Specifically, we aim to adhere to the guidelines and elements which represent compliance with the primary category of brand elements — the so called \xabCorporate Design Elements\xbb (CD):`),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"designation of the website, comprising of the Confederation logo and the name of the organizational unit"),(0,r.kt)("li",{parentName:"ul"},"line separating the header from the rest of the page"),(0,r.kt)("li",{parentName:"ul"},"footer with the copyright notice, links to the legal notice and further legal information"),(0,r.kt)("li",{parentName:"ul"},`\xabNoto Sans\xbb typeface`),(0,r.kt)("li",{parentName:"ul"},"prescribed color range")),(0,r.kt)("h2",null,"Demarcations"),(0,r.kt)("p",null,`Since Visualize serves specific use cases and therefore has unique requirements, we reserve the right to be non-compliant towards the use of so called \xabFixed\xbb elements, replacing them with our own components if needed, as well as adapting certain \xabFlexible\xbb brand elements where necessary.`),(0,r.kt)("p",null,`While we use the prescribed color range for our basic user interface components, we need to extend the color range for the purpose of creating accessible charts and maps within Visualize. Our extended color range is based on the main colors, described in the official \xabCorporate Design Manual\xbb of the Bundesamt f\xfcr Umwelt (BAFU).`))}l.isMDXComponent=!0},45016:function(e,t,a){let n;a.r(t),a.d(t,{default:function(){return d}});var i=a(31099),r=a(90089);a(27378);var o=a(35318);let s=["components"],l=(n="CodeSpecimen",function(e){return console.warn("Component "+n+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)}),p={};function d(e){let{components:t}=e,a=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,i.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("style",null,`
  table:not([class]) {
     margin-top: 1rem;
     font-size: 0.875rem;
     cell-spacing: none;
     border-spacing: 0;
     border-collapse: collapse;
  }

  table:not([class]) tr:nth-child(2n) {
    background: #eee;
  }

  table:not([class]) td, table:not([class]) th {
    border-bottom: #ccc 1px solid;
    margin-top: 0;
    padding: 0.25rem 0.5rem;
  }

  table:not([class]) tr {
    margin-bottom: 0;
  }

  li > code {
    font-size: 0.875rem;
  }
`),(0,o.kt)("p",null,`While usually you'll want to publish your chart, sometimes you might want to
simply preview it, without going through the publishing process. This could be
especially helpful to programmatically generate charts based on many different
configuration options. Visualize offers a way to preview charts without
publishing them, by using a custom API or iframe hash parameter.`),(0,o.kt)("h2",null,"iframe preview via query parameters"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Demo:")," Visit ",(0,o.kt)("a",{href:"/_preview",target:"_blank"},(0,o.kt)("inlineCode",{parentName:"p"},"/_preview")),` to see a
page with two iframes containing chart previews. The first iframe gets the chart
state via hash parameters.`),(0,o.kt)("p",null,"In order to get the parameters, you can use the ",(0,o.kt)("em",{parentName:"p"},"Copy preview link"),` button found
in the editor or use the
`,(0,o.kt)("a",{parentName:"p",href:"https://github.com/visualize-admin/visualization-tool/blob/main/app/utils/hash-utils.ts"},"objectToHashString"),`
function.`),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},`<iframe
  id="chart"
  src="https://visualize.admin.ch/it/preview#hash-params"
  width="100%"
  height="500"
  frameborder="0"
/>
`)),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note:")," Manually changing ",(0,o.kt)("inlineCode",{parentName:"p"},"chartType"),` can lead to unexpected behavior and
potentially necessitates further adjustments. For example a change from
`,(0,o.kt)("inlineCode",{parentName:"p"},"chartType=bar")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"chartType=column")," needs a swap in ",(0,o.kt)("inlineCode",{parentName:"p"},"x")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"y")," fields."),(0,o.kt)("h2",null,"iframe preview via API"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Demo:")," Visit ",(0,o.kt)("a",{href:"/_preview",target:"_blank"},(0,o.kt)("inlineCode",{parentName:"p"},"/_preview")),` to see a
page with two iframes containing chart previews. The second iframe gets the
chart state from posting a message to the iframe window.`),(0,o.kt)("p",null,"This method works by pointing an iframe to the ",(0,o.kt)("inlineCode",{parentName:"p"},"/preview"),` page, and posting a
message with the chart state to the iframe window when ready.`),(0,o.kt)(l,{lang:"js",raw:!0,rawBody:`const iframe = document.getElementById("chart");
const handleMessage = (e) => {
  if (e.data?.type === "ready" && e.source === iframe.contentWindow) {
    iframe.contentWindow?.postMessage(configuratorState, "*");
    window.removeEventListener("message", handleMessage);
  }
};
window.addEventListener("message", handleMessage);
`,mdxType:"CodeSpecimen"}),(0,o.kt)("h3",null,"Controlling the language"),(0,o.kt)("p",null,"You can set the desired language for the chart preview by adding a ",(0,o.kt)("inlineCode",{parentName:"p"},"/de"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"/fr"),`,
`,(0,o.kt)("inlineCode",{parentName:"p"},"/it")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"/en")," part to the iframe URL, like so:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},`<iframe
  id="chart"
  src="https://visualize.admin.ch/it/preview"
  width="100%"
  height="500"
  frameborder="0"
/>
`)),(0,o.kt)("h2",null,"POST request"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Demo:")," Visit ",(0,o.kt)("a",{href:"/_preview_post",target:"_blank"},(0,o.kt)("inlineCode",{parentName:"p"},"/_preview_post")),` to
see a page with two buttons that open a new page with a chart preview after
clicking.`),(0,o.kt)("p",null,"This method works by sending a POST request to ",(0,o.kt)("inlineCode",{parentName:"p"},"/preview_post"),` page with chart
state when clicking on a form button. The `,(0,o.kt)("inlineCode",{parentName:"p"},"/preview_post"),` page retrieves the
content of a request in `,(0,o.kt)("inlineCode",{parentName:"p"},"getServerSideProps")," and renders a preview of a chart."),(0,o.kt)("p",null,`It's important to only use one input inside a form (as we split the string by
`,(0,o.kt)("inlineCode",{parentName:"p"},"="),")."),(0,o.kt)(l,{lang:"css",raw:!0,rawBody:`<form method="post" action="/preview_post" target="_blank">
  <input
    type="hidden"
    name="configuratorState"
    value={JSON.stringify(photovoltaikanlagenState)}
  />
  <input type="submit" value="☀️ Preview a Photovoltaikanlagen chart" />
</form>`,mdxType:"CodeSpecimen"}),(0,o.kt)("h3",null,"Controlling the language"),(0,o.kt)("p",null,"You can set the desired language for the chart preview by adding a ",(0,o.kt)("inlineCode",{parentName:"p"},"/de"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"/fr"),`,
`,(0,o.kt)("inlineCode",{parentName:"p"},"/it")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"/en")," part to the form action parameter, like so:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},`<form method="post" action="/it/preview_post" target="_blank">
  <input
    type="hidden"
    name="configuratorState"
    value="{JSON.stringify(photovoltaikanlagenState)}"
  />
  <input type="submit" value="☀️ Preview a Photovoltaikanlagen chart" />
</form>
`)),(0,o.kt)("h2",null,"Configurator and chart config schemas"),(0,o.kt)("p",null,`As the application constantly evolves, the configurator and chart config schemas
will change. You can find their latest TypeScript definitions in the
`,(0,o.kt)("a",{parentName:"p",href:"https://github.com/visualize-admin/visualization-tool/blob/main/app/config-types.ts"},"config-types.ts"),`
file and according JSON Schema definitions and examples in the
`,(0,o.kt)("a",{parentName:"p",href:"https://github.com/visualize-admin/visualization-tool/tree/main/app/public/json-schema"},"json-schema folder"),"."),(0,o.kt)("p",null,`JSON Schema examples can be opened e.g. in Visual Studio Code, where you will
have an autocomplete feature to help you fill in the configuration.`),(0,o.kt)("p",null,`Note that the types are very complex and it's encouraged to visit the Visualize
application with `,(0,o.kt)("inlineCode",{parentName:"p"},"&flag__debug=true"),` added to the end of the URL to enable the
debug mode. You will then see the configurator state directly below the chart
that is being edited. It also enables the `,(0,o.kt)("inlineCode",{parentName:"p"},"Dump to console"),` button, which will
log the state to the browser console, for easier re-use.`),(0,o.kt)("p",null,"An example configurator state is shown below."),(0,o.kt)(l,{lang:"json",raw:!0,rawBody:`{
  state: "CONFIGURING_CHART",
  dataSet:
    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/7",
  dataSource: {
    type: "sparql",
    url: "https://lindas-cached.cluster.ldbar.ch/query",
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
  chartConfig: {
    version: "1.4.2",
    chartType: "column",
    filters: {
      "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Kanton":
        {
          type: "single",
          value: "https://ld.admin.ch/canton/1",
        },
    },
    interactiveFiltersConfig: {
      legend: {
        active: false,
        componentIri: "",
      },
      timeRange: {
        active: false,
        componentIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Jahr",
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
      calculation: {
        active: false,
        type: "identity",
      },
    },
    fields: {
      x: {
        componentIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Jahr",
        sorting: {
          sortingType: "byAuto",
          sortingOrder: "asc",
        },
      },
      y: {
        componentIri:
          "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/AnzahlAnlagen",
      },
    },
  },
}`,mdxType:"CodeSpecimen"}))}d.isMDXComponent=!0},85862:function(e,t,a){let n;a.r(t),a.d(t,{default:function(){return d}});var i=a(31099),r=a(90089);a(27378);var o=a(35318);let s=["components"],l=(n="ImageSpecimen",function(e){return console.warn("Component "+n+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)}),p={};function d(e){let{components:t}=e,a=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,i.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Documentation for Visualize")),(0,o.kt)(l,{src:"./static/docs/hero.png",plain:!0,mdxType:"ImageSpecimen"}),(0,o.kt)("h4",null,"Authors"),(0,o.kt)("p",null,"This project and documentation was created by ",(0,o.kt)("a",{parentName:"p",href:"https://www.interactivethings.com"},"Interactive Things"),":"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Jeremy Stucki"),(0,o.kt)("li",{parentName:"ul"},"Solange Vogt"),(0,o.kt)("li",{parentName:"ul"},`Jan W\xe4chter`),(0,o.kt)("li",{parentName:"ul"},"Luc Guillemot"),(0,o.kt)("li",{parentName:"ul"},"Annina Walker"),(0,o.kt)("li",{parentName:"ul"},"Kerstin Faye"),(0,o.kt)("li",{parentName:"ul"},"Bartosz Prusinowski"),(0,o.kt)("li",{parentName:"ul"},"Patrick Browne"),(0,o.kt)("li",{parentName:"ul"},"Noah Onyejese"),(0,o.kt)("li",{parentName:"ul"},"Mark Kunzmann")))}d.isMDXComponent=!0},5561:function(e,t,a){let n;a.r(t),a.d(t,{default:function(){return d}});var i=a(31099),r=a(90089);a(27378);var o=a(35318);let s=["components"],l=(n="TableSpecimen",function(e){return console.warn("Component "+n+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)}),p={};function d(e){let{components:t}=e,a=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,i.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("style",null,`
  table:not([class]) {
     margin-top: 1rem;
     font-size: 0.875rem;
     cell-spacing: none;
     border-spacing: 0;
     border-collapse: collapse;
  }

  table:not([class]) tr:nth-child(2n) {
    background: #eee;
  }

  table:not([class]) td, table:not([class]) th {
    border-bottom: #ccc 1px solid;
    margin-top: 0;
    padding: 0.25rem 0.5rem;
  }

  table:not([class]) tr {
    margin-bottom: 0;
  }

  li > code {
    font-size: 0.875rem;
  }
`),(0,o.kt)("p",null,`Visualize fetches and parses RDF cubes. For easier consumption by the charts, we
transform some of the terms.`),(0,o.kt)("p",null,`Most of the parsing is done in
`,(0,o.kt)("a",{parentName:"p",href:"https://github.com/visualize-admin/visualization-tool/blob/main/app/rdf/parse.ts"},"rdf/parse.ts"),`,
this file can serve as a reference. Do not hesitate to
`,(0,o.kt)("a",{parentName:"p",href:"https://github.com/visualize-admin/visualization-tool/issues"},"post an issue"),` if
you find this documentation incomplete.`),(0,o.kt)("p",null,"See also ",(0,o.kt)("a",{parentName:"p",href:"https://zazuko.github.io/rdf-cube-schema/"},"the RDF cube schema"),` for
more information on the RDF cube schema specification.`),(0,o.kt)("h3",null,"Cube Validator"),(0,o.kt)("p",null,`To be correctly displayed inside Visualize, your cube needs to have some
attributes, some which are part of the cube specification, other which are
specific to Visualize. To help you understand why a cube does not behave as
expected, `,(0,o.kt)("a",{parentName:"p",href:"https://cube-validator.lindas.admin.ch/select"},"the Cube Validator"),`
can help you: it provides a list of checks against a cube that you can use to
troubleshoot.`),(0,o.kt)("p",null,"It can be used to understand:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Why a cube does not appear on the search"),(0,o.kt)("li",{parentName:"ul"},"Why a cube cannot be loaded inside Visualize")),(0,o.kt)("h3",null,"Cube"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube dcterms:identifier ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"identifier"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube schema:name ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"title"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube schema:description ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"description"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube schema:version ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"version"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube schema:creativeWorkStatus adminVocabulary:CreativeWorkStatus/Published")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"isPublished"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube schema:datePublished ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"datePublished"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube dcat:theme ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"themes"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube dcterms:creator ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"creator"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube dcat:contactPoint ?cp"),(0,o.kt)("br",null),(0,o.kt)("inlineCode",{parentName:"td"},"?cp vcard:fn ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"contactPoint.name"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?cube dcat:contactPoint ?cp"),(0,o.kt)("br",null),(0,o.kt)("inlineCode",{parentName:"td"},"?cp vcard:hasEmail ?value")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"contactPoint.email"))))),(0,o.kt)("h3",null,"Dimensions"),(0,o.kt)("h4",null,"Key / Measure"),(0,o.kt)("p",null,"Values inside key dimensions must ",(0,o.kt)("em",{parentName:"p"},"uniquely identify a row"),`. For this reason,
and because visualize does not deal with aggregation, key dimensions must either
be `,(0,o.kt)("strong",{parentName:"p"},"encoded")," or ",(0,o.kt)("strong",{parentName:"p"},"part of a filter"),"."),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension a cube:KeyDimension")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isKeyDimension = true"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension a cube:MeasureDimension")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isMeasureDimension = true"))))),(0,o.kt)("h4",null,"Scale type"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension qudt:scaleType qudt:NominalScale")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.scaleType = "Nominal"'))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension qudt:scaleType qudt:OrdinalScale")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.scaleType = "Ordinal"'))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension qudt:scaleType qudt:RatioScale")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.scaleType = "Ratio"'))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension qudt:scaleType qudt:IntervalScale")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.scaleType = "Interval"'))))),(0,o.kt)("h4",null,"Data type"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"isNumerical"))),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:datatype xsd:int")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isNumerical = true"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:datatype xsd:integer")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isNumerical = true"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:datatype xsd:decimal")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isNumerical = true"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:datatype xsd:float")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isNumerical = true"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:datatype xsd:double")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isNumerical = true"))))),(0,o.kt)("p",null,`ℹ️ At the moment, `,(0,o.kt)("inlineCode",{parentName:"p"},"isNumerical"),` property is used when sorting and formatting
dimension values in some specific cases (e.g. when NominalDimension is
numerical). Generally, this property is a "last resort property", as numerical
dimensions are usually treated as `,(0,o.kt)("inlineCode",{parentName:"p"},"NumericalMeasure"),`s based on
`,(0,o.kt)("inlineCode",{parentName:"p"},"https://cube.link/MeasureDimension")," property."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"isLiteral"))),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension shacl:nodeKind ?shacl:Literal")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"dim.isLiteral = true"))))),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"True")," when the dimension has ",(0,o.kt)("inlineCode",{parentName:"p"},"shacl:nodeKind")," of ",(0,o.kt)("inlineCode",{parentName:"p"},"shacl:Literal"),`. Non literal
dimensions (`,(0,o.kt)("inlineCode",{parentName:"p"},"shacl:IRI"),") are also called ",(0,o.kt)("em",{parentName:"p"},"Shared dimensions"),`, and their values
will be fetched outside of the cube.`),(0,o.kt)("h4",null,"Data kind"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension cube:meta/dataKind time:GeneralDateTimeDescription")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.dataKind = "Time"'))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension cube:meta/dataKind schema:GeoCoordinates")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.dataKind = "GeoCoordinates"'))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dimension cube:meta/dataKind schema:GeoShape")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dim.dataKind = "GeoShape"'))))),(0,o.kt)("p",null,`ℹ️ Temporal dimensions can be used to animate the chart. `,(0,o.kt)("strong",{parentName:"p"},"Important note"),`:
time can also be ordinal if the scale type is set to `,(0,o.kt)("inlineCode",{parentName:"p"},"Ordinal"),"!"),(0,o.kt)("p",null,`ℹ️ GeoCoordinates dimensions can be shown on a map as `,(0,o.kt)("em",{parentName:"p"},"points")),(0,o.kt)("p",null,`ℹ️ GeoShape dimensions can be shown on a map as `,(0,o.kt)("em",{parentName:"p"},"shapes")),(0,o.kt)("h4",null,"Values"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"sh:in"),` predicate on the dimension is used to attach what values are
available on the dimension. It is used by visualize as an optimization to list
the values that are available on the dimension. This list of possible values can
be used for example on dimension filters, or inside the legend.`),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"It is provided automatically by ",(0,o.kt)("inlineCode",{parentName:"li"},"cube-creator"),` if the number of distinct
values is inferior to `,(0,o.kt)("inlineCode",{parentName:"li"},"100"),"."),(0,o.kt)("li",{parentName:"ul"},`If this property is not present, visualize dynamically loads all distinct
values from the dimension, which results in poorer performance than if the
values are present.`)),(0,o.kt)("h4",null,"Currencies"),(0,o.kt)("p",null,"If the dimension is related to a currency (",(0,o.kt)("inlineCode",{parentName:"p"},"?dimension a qudt:CurrencyUnit"),`),
when the values are displayed, we use the currency information to show the
correct number of decimals for the value.`),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"CHF has currency exponent 2, so we will show ",(0,o.kt)("em",{parentName:"li"},"at least"),` 2 decimals, adding
trailing zeroes if necessary`),(0,o.kt)("li",{parentName:"ul"},"YEN has currency exponent 0, so we would not add trailing zeroes"),(0,o.kt)("li",{parentName:"ul"},`Additionally, if the dimension's dataType indicates it contains rounded values
(`,(0,o.kt)("inlineCode",{parentName:"li"},"?dim sh:datatype xsd:int")," or ",(0,o.kt)("inlineCode",{parentName:"li"},"?dim sh:datatype xsd:integer"),`), we do not use
this logic and will show the values without decimals`)),(0,o.kt)("h4",null,"Related dimensions"),(0,o.kt)("h5",null,"Standard error"),(0,o.kt)("p",null,`A dimension can indicate that it is contains standard error values for another
dimension.`),(0,o.kt)("p",null,`ℹ️ Standard error dimensions are not shown in the left filters.`),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"RDF"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Visualize"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?dim "),"cube/meta/dimensionRelation",(0,o.kt)("inlineCode",{parentName:"td"}," ?relationNode"),(0,o.kt)("br",null),(0,o.kt)("inlineCode",{parentName:"td"},"?relationNode a <https://cube.link/relation/StandardError>")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},'dimension.related = { type: "StandardError", iri: "https://dimension-containing-values"}'))))),(0,o.kt)("h4",null,"Possible chart types"),(0,o.kt)("p",null,`After parsing, we can determine the type of our dimension. Conditions are
checked one after the other.`),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Ordinal Measure")," if ",(0,o.kt)("inlineCode",{parentName:"li"},'isMeasureDimension = true and scaleType = "Ordinal"'),`,
else`),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Numerical Measure"),` if
`,(0,o.kt)("inlineCode",{parentName:"li"},'isMeasureDimension = true and scaleType != "Ordinal"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Standard Error Dimension"),` if any of the related dimensions has
`,(0,o.kt)("inlineCode",{parentName:"li"},"StandardError")," type, else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Confidence Upper Bound Dimension"),` if any of the related dimensions has
`,(0,o.kt)("inlineCode",{parentName:"li"},"ConfidenceUpperBound")," type, else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Confidence Lower Bound Dimension"),` if any of the related dimensions has
`,(0,o.kt)("inlineCode",{parentName:"li"},"ConfidenceLowerBound")," type, else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Temporal Entity Dimension"),` if
`,(0,o.kt)("inlineCode",{parentName:"li"},'dataKind = "Time" and scaleType = "Ordinal" and (timeUnit = "Month" or timeUnit = "Year")'),`,
else`),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Temporal Ordinal Dimension"),` if
`,(0,o.kt)("inlineCode",{parentName:"li"},'dataKind = "Time" and scaleType = "Ordinal"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Temporal Dimension")," if ",(0,o.kt)("inlineCode",{parentName:"li"},'dataKind = "Time" and scaleType != "Ordinal"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"GeoCoordinates Dimension")," if ",(0,o.kt)("inlineCode",{parentName:"li"},'dataKind = "GeoCoordinates"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"GeoShapes Dimension")," if ",(0,o.kt)("inlineCode",{parentName:"li"},'dataKind = "GeoShape"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Ordinal Dimension")," if ",(0,o.kt)("inlineCode",{parentName:"li"},'scaleType = "Ordinal"'),", else"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Nominal Dimension")," if none of the above condition have been fulfilled")),(0,o.kt)("p",null,"We can regroup some of these dimensions, for easier business logic:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Ordinal Measure")," and ",(0,o.kt)("strong",{parentName:"li"},"Numerical Measure")," are ",(0,o.kt)("strong",{parentName:"li"},"Measures"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"Ordinal")," and ",(0,o.kt)("strong",{parentName:"li"},"Nominal")," are ",(0,o.kt)("strong",{parentName:"li"},"Categorical Dimensions"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"GeoCoordinates")," and ",(0,o.kt)("strong",{parentName:"li"},"GeoShapes")," are ",(0,o.kt)("strong",{parentName:"li"},"Geo Dimensions"),".")),(0,o.kt)("p",null,"To enable particular chart types the following conditions have to be met:"),(0,o.kt)(l,{columns:["Chart Type","Conditions"],rows:[{"Chart Type":"Table",Conditions:"- None"},{"Chart Type":"Column",Conditions:`- 1 or more **Numerical Measures**
- 1 or more **Categorical** or **Geo** or **Temporal (Ordinal) Dimensions**`},{"Chart Type":"Lines",Conditions:`- 1 or more **Numerical Measures**
- 1 or more **Temporal Dimensions**`},{"Chart Type":"Areas",Conditions:`- 1 or more **Numerical Measures**
- 1 or more **Temporal Dimensions**`},{"Chart Type":"Pie",Conditions:`- 1 or more **Numerical Measures**
- 1 or more **Categorical** or **Geo** or **Temporal (Ordinal) Dimensions**`},{"Chart Type":"Scatterplot",Conditions:"- 2 or more **Numerical Measures**"},{"Chart Type":"Maps",Conditions:`- 1 or more **Measures**
- 1 or more **Geo Dimensions**`}],mdxType:"TableSpecimen"}),(0,o.kt)("h2",null,"Update constraints"),(0,o.kt)("p",null,`When updating a cube, you have to follow a number of rules to make sure that the
charts that rely on those cubes will continue to work.`),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},`Structure of a dimension should not be changed, otherwise, if a filter relies
on the dimension, it might not work anymore. Here are the properties of a
dimension that should not change:`),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"a"),": Dimension type"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"qudt:hasUnit"),": Unit"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"qudt:scaleType"),": Scale type"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"shacl:datatype"),": Data type"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"meta:dataKind"),": Data kind")),(0,o.kt)("p",{parentName:"li"},`Please refer to the
`,(0,o.kt)("a",{parentName:"p",href:"https://zazuko.github.io/rdf-cube-schema/#properties-0"},"RDF Cube Schema"),` to
learn more about those attributes.`)),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},`Similarly, a dimension should not be removed (same reason: if it is used in a
chart filter, the filter will not be correct when the dimension is removed)`)),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},`Observations should not be removed, otherwise a chart that shows only those
observations via a data filter will not show anything anymore.`))),(0,o.kt)("p",null,"If you need to do any of those things, you should create a new cube."),(0,o.kt)("p",null,`If your cube is in draft, you can ignore those rules as chart owners know that
they are relying on something that is not finished and that can change.`))}d.isMDXComponent=!0},63803:function(e,t,a){a.r(t),a.d(t,{default:function(){return l}});var n=a(31099),i=a(90089);a(27378);var r=a(35318);let o=["components"],s={};function l(e){let{components:t}=e,a=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",null,"Testing Strategy"),(0,r.kt)("h3",null,"E2E Testing"),(0,r.kt)("p",null,"Several end-to-end scenarios are run (searching, configuring charts) for every pull-request."),(0,r.kt)("h3",null,"Snapshot Regression Testing"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Existing chart configurations are downloaded from the ",(0,r.kt)("del",{parentName:"li"},"production")," develompent environment stored in ",(0,r.kt)("inlineCode",{parentName:"li"},"app/test/__fixtures")),(0,r.kt)("li",{parentName:"ul"},"Running ",(0,r.kt)("inlineCode",{parentName:"li"},"yarn test")," will compare ",(0,r.kt)("strong",{parentName:"li"},"image snapshots")," of the rendered charts with previous snapshots. When the new snapshots differ more than a certain threshold, the test will fail and a diff will be stored to inspect.")),(0,r.kt)("p",null,"To prevent regressions between releases, snapshot ",(0,r.kt)("strong",{parentName:"p"},"tests are run automatically before a new version is applied"),"."),(0,r.kt)("h3",null,"Notes"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The snapshot tests rely on the app server running on http://localhost:3000"),(0,r.kt)("li",{parentName:"ul"},"Fixtures can be updated by running ",(0,r.kt)("inlineCode",{parentName:"li"},"./scripts/fetch-config-fixtures.js"),". Make sure that tests are passing before running this command and delete the ",(0,r.kt)("inlineCode",{parentName:"li"},"__image_snapshots__")," directory in ",(0,r.kt)("inlineCode",{parentName:"li"},"app/test/")," to get a fresh set of snapshots.")),(0,r.kt)("h3",null,"To Do"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Download full data for test fixtures incl. observations, so tests can run faster and don't rely on network requests.")),(0,r.kt)("h2",null,"Query performance"),(0,r.kt)("p",null,`A developer tool to monitor resolver performance and SPARQL queries that are made by the server
is available if a page is accessed with the `,(0,r.kt)("inlineCode",{parentName:"p"},"flag__debug=true")," query parameter."),(0,r.kt)("p",null,"See for example ",(0,r.kt)("a",{parentName:"p",href:"https://test.visualize.admin.ch/en?flag__debug=true"},"https://test.visualize.admin.ch/en?flag__debug=true")),(0,r.kt)("p",null,`A small 🛠 should be present in the lower corner of the screen and clicking it will display the
GraphQL debug panel. This panel shows every GraphQL query that is made to the server and queries
can be inspected to see the timings of its resolvers. SPARQL queries made during requests are
also collected and shown.`),(0,r.kt)("p",null,`⚠️ To be able to collect SPARQL queries, we need to monkey-patch the SPARQL client. If a library
uses its own SPARQL client, we cannot monitor the SPARQL queries made, so some requests that
are made can be missing.`))}l.isMDXComponent=!0},99536:function(e,t,a){a.r(t);var n=a(37980),i=a(24246);t.default=()=>(0,n.JH)`

## Content
1. [Chart Configuration Interface](#1-chart-configuration-interface)
1.1 [Chart configuration panel](#11-chart-configuration-panel)
1.2 [Visualization preview panel](#12-visualization-panel)
1.3 [Data filter panel](#13-data-filter-panel)
2. [Mockups](#2-mockups)
2.1 [Bar Chart](#21-bar-chart)
2.2 [Column Chart](#22-column-chart)
2.3 [Line Chart](#23-line-chart)
2.4 [Area Chart](#24-area-chart)
2.5 [Scatterplot](#25-scatterplot)


# 1. Chart Configuration Interface
The configuration interface is divided in 3 panels:
- The _chart configuration_ panel on the left is used to select chart parameters, the visual encodings of the dataset dimensions.
- The _visualzation preview_ panel in the middle offers an interactive preview of the chart.
- The _data filtering_ panel on the right allows to filter the data points being displayed on the chart.
${(0,i.jsx)(n.sO,{plain:!0,span:4,src:"./static/docs/design/chart-config/flow-general.png"})}

## 1.1 Chart configuration panel

### Chart elements: x-axis, y-axis, segment, etc.
After a user has selected a dataset and a chart type, the chart configuration panel is updated so that the configuration options match the chart elements of the selected chart type. Some parameters are mandatory. For instance, a column chart requires at least two chart elements to be defined: the horizontal axis and the vertical axis. The other parameters are optional.

### Dataset dimensions: categories, numbers, time, etc.
The options available to select for each chart element are based on the dimension types defined in the dataset metadata. For instance, colors of a line chart needs to be defined by a dimension that can create groups (for instance: cantons). Visualize tries to select default parameters that should work (for instance, a temporal dimension for the horizontal axis of a line chart). Of course, the user has the power to modify all options.

### Additional parameters
Depending on the chart type selected, additional options are available for selection and influence the visualization. Some optional parameter will modify the chart type selected, for instance, defining a data dimension that controls segments in a column chart will convert it into a _stacked_ column chart. Other parameters don’t directly influence the chart type, but modify the view of the dataset, like sorting the columns of a column chart for instance.

### Mapping between chart types and dataset dimensions
Whether a chart element is defined or not controls the visualization. In the table below is a non exhaustive list of some of the configuration combinations that we consider. For more information about how the dimension types are defined, see the Components / RDF to Visualize section.

${(0,i.jsx)(n.Un,{span:5,rows:[{"Chart type":"**area**","x-axis":"time","y-axis":"number",color:"\xf8",group:"\xf8"},{"Chart type":"**stacked area**","x-axis":"time","y-axis":"number",color:"category | ordinal time",group:"\xf8"},{"Chart type":"**column**","x-axis":"category | (ordinal) time","y-axis":"number",color:"\xf8",group:"\xf8"},{"Chart type":"**stacked column**","x-axis":"category | (ordinal) time","y-axis":"number",color:"category | ordinal time",group:"\xf8"},{"Chart type":"**grouped column**","x-axis":"category | (ordinal) time","y-axis":"number",color:"\xf8",group:"category | ordinal time"},{"Chart type":"**line**","x-axis":"time","y-axis":"number",color:"\xf8",group:"\xf8"},{"Chart type":"**multi-line**","x-axis":"time","y-axis":"number",color:"category | ordinal time",group:"\xf8"},{"Chart type":"**map**","x-axis":"geo","y-axis":"number",color:"number | category (ordinal measure) | ordinal time",group:"\xf8"},{"Chart type":"**pie**","x-axis":"\xf8","y-axis":"number",color:"category | ordinal time",group:"\xf8"},{"Chart type":"**scatterplot**","x-axis":"number","y-axis":"number",color:"category | ordinal time",group:"\xf8"}]})}

## 1.2 Visualization panel

This panel displays an interactive preview of the data visualization.

## 1.3 Data filter panel

The right panel is used to filter the data points to display on the chart. For each data dimension, the dimension values are listed (“Zürich” or “Vaud” are dimension values of the dimension “Canton” for instance). They can be toggled in or out of the chart.

# 2. Mockups
> These mockups illustrate the different configuration options for each of the chart-types available.

## 2.1 Bar-Chart

A bar chart encodes quantitative values as the extent of rectangular bars.

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.1.1_l_configuration_bar-chart.png",description:"[Default Bar-Chart](./static/docs/design/chart-config/2.1.1_l_configuration_bar-chart.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.1.2_l_configuration_bar-chart_stacked.png",description:"[Stacked Bar-Chart](./static/docs/design/chart-config/2.1.2_l_configuration_bar-chart_stacked.png)"})}

## 2.2 Column-Chart

The column chart or vertical bar chart is the same as a bar chart only the x-axis and y-axis are switched.

A «stacked» column or bar charts is multiple datasets on top of each other in order to show how the larger category is divided into the smaller categories and their relations to the total amount.
Basically, they can be divided into two types:

- A stacked column or bar chart displays total value of the bar is all the segment values added together.
- A normalized (100%) stacked column or bar chart displays part to whole relationship in each group.

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.2.1_l_configuration_column-chart.png",description:"[Default Column-Chart](./static/docs/design/chart-config/2.2.1_l_configuration_column-chart.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.2.2_l_configuration_column-chart_stacked.png",description:"[Stacked Column-Chart](./static/docs/design/chart-config/2.2.2_l_configuration_column-chart_stacked.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,src:"./static/docs/design/chart-config/2.2.3_l_configuration_column-chart_stacked.png",span:3,description:"[Normalized (Percentage) Column-Chart](./static/docs/design/chart-config/2.2.3_l_configuration_column-chart_stacked.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.2.4_l_configuration_column-chart_grouped.png",description:"[Grouped Column-Chart](./static/docs/design/chart-config/2.2.4_l_configuration_column-chart_grouped.png)"})}

## 2.3 Line-Chart

A line chart is a type of chart which displays information as a series of data points (e.g. time) connected by a line.

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.3.1_l_configuration_line-chart.png",description:"[Default Line-Chart](./static/docs/design/chart-config/2.3.1_l_configuration_line-chart.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.3.2_l_configuration_line-chart_multi-line.png",description:"[Multi-Line Chart](./static/docs/design/chart-config/2.3.2_l_configuration_line-chart_multi-line.png)"})}

## 2.4 Area-Chart

An area chart or area graph are basically a line chart with the area below the lined filled with colors or textures. Like line graphs area charts are used to represent the development of quantitative values over a time period. It can also be used to compare two or more categories and is similar to the stacked area chart.

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.4.1_l_configuration_area.png",description:"[Default Area-Chart](./static/docs/design/chart-config/2.4.1_l_configuration_area.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.4.2_l_configuration_area-chart_stacked.png",description:"[Stacked Area-Chart](./static/docs/design/chart-config/2.4.2_l_configuration_area-chart_stacked.png)"})}

## 2.5 Scatterplot

A scatter plot uses cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.5.1_l_configuration_scatterplot.png",description:"[Default Scatterplot](./static/docs/design/chart-config/2.5.1_l_configuration_scatterplot.png)"})}

${(0,i.jsx)(n.sO,{plain:!0,span:3,src:"./static/docs/design/chart-config/2.5.2_l_configuration_scatterplot_grouped.png",description:"[Grouped Scatterplot](./static/docs/design/chart-config/2.5.2_l_configuration_scatterplot_grouped.png)"})}
`},22603:function(e,t,a){a.r(t);var n=a(37980);t.default=()=>(0,n.JH)`
> The components used in the User Interface are built upon the Material-UI library. This library provides
> a set of basic components that can be used to build complex interfaces.

All styles are defined in the \`federal\` theme file that contain the "Federal" customizations for MUI.

Components are developed with Storybook, a tool for developing UI components in isolation. The storybook
is accessible [here](/storybook).
`},4055:function(e,t,a){a.r(t);var n=a(37980);let i=[{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.1_l_chart-maker_step-1.1.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.2_l_chart-maker_step-1.2.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.3_l_chart-maker_step-1.3.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.4_l_chart-maker_step-1.4_jahr.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.5_l_chart-maker_step-1.5_messung.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.6_l_chart-maker_step-1.6_kanton.png"},{group:"Select and Filter Dataset",src:"static/docs/design/mockups/1.2.7_l_chart-maker_step-1.7_art.png"},{group:"Select Chart Type",src:"static/docs/design/mockups/1.3_l_chart-maker_step-2.png"},{group:"Customize Chart",src:"static/docs/design/mockups/1.4.1_l_chart-maker_step-3.1.png"},{group:"Customize Chart",src:"static/docs/design/mockups/1.4.2_l_chart-maker_step-3.2_filter.png"},{group:"Customize Chart",src:"static/docs/design/mockups/1.4.3_l_chart-maker_step-3.3_filter-interactive.png"},{group:"Annotate Chart",src:"static/docs/design/mockups/1.5.1_l_chart-maker_step-4.1.png"},{group:"Annotate Chart",src:"static/docs/design/mockups/1.5.2_l_chart-maker_step-4.2.png"},{group:"Annotate Chart",src:"static/docs/design/mockups/1.5.3_l_chart-maker_step-4.3.png"},{group:"Annotate Chart",src:"static/docs/design/mockups/1.5.4_l_chart-maker_step-4.4.png"},{group:"Annotate Chart",src:"static/docs/design/mockups/1.5.5_l_chart-maker_step-4.5.png"},{group:"Publish Chart",src:"static/docs/design/mockups/1.6_l_chart-maker_step-5.png"}].reduce((e,t)=>(e[t.group]?e[t.group].push(t):e[t.group]=[t],e),{});t.default=()=>(0,n.JH)`
> The design mockups illustrate an exemplary user flow through _Visualize_.

## Home

The user's first contact with _Visualize_. In addition to a description of the tool and it's purpose, several entrypoints are available. A prominent call-to-action invites to go to the Chart Builder directly.

The homepage includes a short tutorial section that describies the different steps needed to create a visualization, as well as some example charts that explain different features of the charts created with the tool and which invite the users to create their own visualizations based on the examples. The examples are followed by a section about which kind of data is available via _Visualize_, followed by a call-to-action for other potential data-providers.

~~~image
plain: true
span: 3
src: "./static/docs/design/mockups/1.0_l_home.png"
description: "[Open full-size image](./static/docs/design/mockups/1.0_l_home.png)"
~~~

~~~image
plain: true
span: 1
src: "./static/docs/design/mockups/1.0_s_home.png"
description: "[Open full-size image](./static/docs/design/mockups/1.0_s_home.png)"
~~~

As the Chart builder is not optimized for mobile use-case, a user trying to access the Chart Builder using a mobile device, will be presented with the following warning.

~~~image
plain: true
span: 1
src: "./static/docs/design/mockups/1.1_s_chart-maker_error-mobile.png"
description: "[Open full-size image](./static/docs/design/mockups/1.1_s_chart-maker_error-mobile.png)"
~~~

## Chart Landing Page

Each chart built with _Visualize_ is assignened a dedicated Chart-URL. As soon as a chart has been published, a dedicated «Landing Page» can be accessed by anyone using the appropriate URL. This page should also be made available on mobile devices (responisve design).

The landing page includes the chart itself, as well as the header & footer of _Visualize_ and a set of dedicated actions such as image download, sharing, or embedding. At the bottom of the page, the user is presented with the option to create a new visualization from scratch.

~~~image
plain: true
span: 3
src: "./static/docs/design/mockups/1.8.1_l_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.1_l_shared_page.png)"
~~~

~~~image
plain: true
span: 3
src: "./static/docs/design/mockups/1.8.2_l_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.2_l_shared_page.png)"
~~~

~~~image
plain: true
span: 3
src: "./static/docs/design/mockups/1.8.3_l_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.3_l_shared_page.png)"
~~~

~~~image
plain: true
span: 3
src: "./static/docs/design/mockups/1.8.4_l_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.4_l_shared_page.png)"
~~~

~~~image
plain: true
span: 1
src: "./static/docs/design/mockups/1.8.1_s_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.1_s_shared_page.png)"
~~~

~~~image
plain: true
span: 1
src: "./static/docs/design/mockups/1.8.3_s_shared_page.png"
description: "[Open full-size image](./static/docs/design/mockups/1.8.3_s_shared_page.png)"
~~~


## Chart Builder

The Chart Builder is the core of _Visualize_. It guides the user through an easy to understand process from selecting the right dataset to customizing a visualization, and finally publishing it.

${Object.entries(i).map(e=>{let[t,a]=e;return`### ${t}
  ${a.map(e=>`~~~image
plain: true
span: 3
src: "./${e.src}"
description: "[Open full-size image](./${e.src})"
~~~`).join("\n")}
  `}).join("\n")}
  `},49192:function(e,t,a){a.r(t);var n=a(17043),i=a(90089),r=a(19563),o=a(35318),s=a(74790),l=a(37980),p=a(45969),d=a.n(p),c=a(27378),m=a(27102),u=a(24246);let h=["href"];function g(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}let k=[{path:"/",title:"Introduction",content:a(85862)},{path:"/branding",title:"Branding",content:a(30066)},{title:"Design Concept",pages:[{path:"/mockups",title:"Mockups",content:a(4055)},{path:"/chart-config",title:"Chart-Config",content:a(99536)}]},{title:"Charts",pages:[{path:"/charts/rdf-to-visualize",title:"RDF to visualize",content:a(5561)}]},{path:"/api",title:"API",content:a(45016)},{path:"/components",title:"Components",content:a(22603)},{path:"/testing",title:"Testing",content:a(63803)}],f=e=>{let t=t=>{let a=(0,c.useMemo)(()=>new(d())().slug(t.children),[t.children]);return(0,u.jsx)(l.UG.Heading,{level:e,text:[t.children],slug:a})};return t.displayName=`Heading${e}`,t},b={wrapper:e=>{let{children:t}=e;return(0,u.jsx)(l.T3,{children:t})},h1:f(1),h2:f(2),h3:f(3),h4:f(4),h5:f(5),h6:f(6),p:l.UG.Paragraph,ul:l.UG.UnorderedList,ol:l.UG.OrderedList,li:l.UG.ListItem,blockquote:l.UG.BlockQuote,em:l.UG.Em,strong:l.UG.Strong,del:l.UG.Del,img:l.UG.Image,code:l.UG.CodeSpan,hr:l.UG.Hr,a:e=>{let{href:t}=e,a=(0,i.Z)(e,h);return(0,u.jsx)(l.UG.Link,function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?g(Object(a),!0).forEach(function(t){(0,n.Z)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):g(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({to:t},a))},ImageSpecimen:l.sO,AudioSpecimen:l.DR,CodeSpecimen:l.A8,ColorSpecimen:l.Qy,ColorPaletteSpecimen:l.j$,HtmlSpecimen:l.AL,HintSpecimen:l.Mc,TableSpecimen:l.Un,TypeSpecimen:l.J0,DownloadSpecimen:l.Kk},N=()=>((0,c.useEffect)(()=>{let e=setTimeout(()=>{let e=location.hash&&""!==location.hash?location.hash.slice(1):void 0;if(e){let t=document.querySelector("#"+e);t?.scrollIntoView({behavior:"smooth"})}},1);return()=>clearTimeout(e)},[]),null);t.default=()=>{let{0:e,1:t}=(0,c.useState)(!1),a=(0,m.$5)("en");return m.ag.activate(a),(0,c.useEffect)(()=>{t(!0)},[]),e?(0,u.jsx)(o.Zo,{components:b,children:(0,u.jsxs)(m.bd,{i18n:m.ag,children:[(0,u.jsx)(s.ZP,{}),(0,u.jsx)(l.gm,{basePath:"/docs",useBrowserHistory:!0,title:"Visualize",pages:k,theme:{brandColor:"#333",sidebarColorText:"#333",navBarTextColor:"#333",sidebarColorHeading:"#333",pageHeadingTextColor:"#fff",linkColor:"rgb(255,95,85)",sidebarColorTextActive:"rgb(255,95,85)",background:r.c.monochrome[100],pageHeadingBackground:"#156896"}}),(0,u.jsx)(N,{})]})}):null}}}]);
//# sourceMappingURL=49192-7cfc55e531778032.js.map