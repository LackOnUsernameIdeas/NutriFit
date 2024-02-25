import React from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";

type RouteType = {
  name: string;
  layout: string;
  path: string;
  icon: JSX.Element;
  component?: () => JSX.Element;
  collapseRoutes?: RouteType[];
  hideInSidebar?: boolean;
};

function SidebarContent({ routes }: { routes: RoutesType[] }) {
  // Convert RoutesType[] to RouteType[]
  const convertedRoutes = routes.map((route) => ({
    ...route,
    icon: route.icon as React.ReactElement // Assuming icon is always a React element
  })) as RouteType[];

  // Filter out routes that should not appear in the sidebar
  const visibleRoutes = convertedRoutes.filter((route) => !route.hideInSidebar);

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" borderRadius="30px">
      <Brand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: "16px", "2xl": "16px" }}>
          <Links routes={visibleRoutes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
