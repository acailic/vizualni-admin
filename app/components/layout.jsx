import { Flex } from "@/components/flex";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
export const AppLayout = ({ children, hideHeader, editing, }) => {
    return (<Flex sx={{ minHeight: "100vh", flexDirection: "column" }}>
      {hideHeader ? null : <Header hideLogo={editing} extendTopBar={editing}/>}
      <Flex component="main" role="main" sx={{ flex: 1, flexDirection: "column" }}>
        {children}
      </Flex>
    </Flex>);
};
export const ContentLayout = ({ children, }) => {
    return (<Flex sx={{
            minHeight: "100vh",
            flexDirection: "column",
            backgroundColor: "monochrome.100",
        }}>
      <Header />
      <Flex component="main" role="main" sx={{
            flexDirection: "column",
            flex: 1,
            width: "100%",
        }}>
        {children}
      </Flex>
      <Footer />
    </Flex>);
};
export const StaticContentLayout = ({ children, }) => {
    return (<Flex sx={{
            minHeight: "100vh",
            flexDirection: "column",
            backgroundColor: "monochrome.100",
        }}>
      <Header />
      <Flex component="main" role="main" sx={{
            flexDirection: "column",
            flex: 1,
            width: "100%",
            maxWidth: 1024,
            my: [4, 6],
            mx: [0, 0, "auto"],
            px: 4,
            "& h2": {
                mb: 1,
            },
        }}>
        {children}
      </Flex>
      <Footer />
    </Flex>);
};
export const Center = ({ children }) => (<Flex sx={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
    {children}
  </Flex>);
