import { Flex } from "@/components/flex";
export const NavigationChip = ({ children, backgroundColor, }) => {
    return (<Flex data-testid="navChip" justifyContent="center" alignItems="center" minWidth={32} height={24} borderRadius={9999} typography="caption" bgcolor={backgroundColor}>
      {children}
    </Flex>);
};
