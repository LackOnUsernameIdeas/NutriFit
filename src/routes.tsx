import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdLeaderboard
} from "react-icons/md";
import { BiSolidBowlHot } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import DataTables from "views/admin/dataTables";
import WeightStats from "views/admin/weightStats";
import MealPlanner from "views/admin/mealPlanner";
import UserMeasurements from "views/userMeasurements";
import Contact from "views/admin/contact";
import TopMeals from "views/admin/topMeals";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUpCentered from "views/auth/signUp";
import ForgotPass from "views/auth/forgotPass";

import Landing from "views/landing";

const routes: RoutesType[] = [
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
    name: "Хранителен план",
    layout: "/admin",
    path: "/mealplan",
    icon: (
      <Icon as={BiSolidBowlHot} width="20px" height="20px" color="inherit" />
    ),
    component: MealPlanner
  },
  {
    name: "Класации",
    layout: "/admin",
    path: "/top-meals",
    icon: (
      <Icon as={MdLeaderboard} width="20px" height="20px" color="inherit" />
    ),
    component: TopMeals,
    hideInSidebar: false
  },
  // {
  //   name: "Sub Route 1",
  //   layout: "/admin",
  //   path: "/sub1",
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: WeightStats,
  //   hideInSidebar: true
  // },
  // {
  //   name: "Sub Route 2",
  //   layout: "/admin",
  //   path: "/sub2",
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: MealPlanner,
  //   hideInSidebar: true
  // },
  // {
  //   name: "Parent Route",
  //   layout: "/admin",
  //   path: "/parent",
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   collapseRoutes: [
  //     {
  //       name: "Sub Route 1",
  //       layout: "/admin",
  //       path: "/sub1",
  //       icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //       component: WeightStats,
  //       hideInSidebar: false
  //     },
  //     {
  //       name: "Sub Route 2",
  //       layout: "/admin",
  //       path: "/sub2",
  //       icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //       component: MealPlanner,
  //       hideInSidebar: false
  //     }
  //   ]
  // },
  {
    name: "За контакт",
    layout: "/admin",
    path: "/contact",
    icon: <Icon as={IoMdMail} width="20px" height="20px" color="inherit" />,
    component: Contact,
    hideInSidebar: false
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
    name: "Регистрация",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignUpCentered,
    hideInSidebar: true
  },
  {
    name: "Забравена парола",
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
  },
  {
    name: "NutriFit",
    layout: "/measurements",
    path: "/userData",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: UserMeasurements,
    hideInSidebar: true
  }
];

export default routes;
