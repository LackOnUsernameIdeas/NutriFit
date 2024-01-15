import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import DataTables from "views/admin/dataTables";
import WeightStats from "views/admin/weightStats";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUpCentered from "views/auth/signUp";
import ForgotPass from "views/auth/forgotPass";

import Landing from "views/test/default";

const routes = [
  {
    name: "Начало",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard
  },
  {
    name: "Калкулатор за тегло",
    layout: "/admin",
    path: "/weight",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: WeightStats
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: NFTMarketplace,
    secondary: true,
    hideInSidebar: true
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: "/data-tables",
    component: DataTables,
    hideInSidebar: true
  },
  {
    name: "Вход",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
    hideInSidebar: true
  },
  {
    name: "Вход",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignUpCentered,
    hideInSidebar: true
  },
  {
    name: "Вход",
    layout: "/auth",
    path: "/forgot-password",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: ForgotPass,
    hideInSidebar: true
  },
  {
    name: "NutriFit",
    layout: "/",
    path: "/",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: Landing,
    hideInSidebar: true
  }
];

export default routes;
