import { Icon } from "@chakra-ui/react";
import { MdPerson, MdHome, MdLock, MdLeaderboard } from "react-icons/md";
import { BiSolidBowlHot } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import {
  FaTrophy,
  FaFireAlt,
  FaTint,
  FaBreadSlice,
  FaFish
} from "react-icons/fa";
// Admin Imports
import MainDashboard from "views/admin/home";
import WeightStats from "views/admin/weightStats";
import MealPlanner from "views/admin/mealPlanner";
import UserMeasurements from "views/userMeasurements";
import Contact from "views/admin/contact";
import RecommendedFoods from "views/admin/recommendedFoods";
import TopCaloryMeals from "views/admin/topCalorieMeals";
import TopProteinMeals from "views/admin/topProteinMeals";
import TopFatMeals from "views/admin/topFatMeals";
import TopCarbsMeals from "views/admin/topCarbsMeals";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUpCentered from "views/auth/signUp";
import ForgotPass from "views/auth/forgotPass";
import EULA from "views/auth/eula";

import Landing from "views/landing";

const routes: RoutesType[] = [
  {
    name: "Начало",
    layout: "/admin",
    path: "/home",
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
    name: "Най-препоръчвани храни",
    layout: "/admin",
    path: "/suggested",
    icon: <Icon as={FaTrophy} width="20px" height="20px" color="inherit" />,
    component: RecommendedFoods,
    hideInSidebar: true
  },
  {
    name: "Топ храни спрямо калории",
    layout: "/admin",
    path: "/calory",
    icon: <Icon as={FaFireAlt} width="20px" height="20px" color="inherit" />,
    component: TopCaloryMeals,
    hideInSidebar: true
  },
  {
    name: "Топ храни спрямо мазнини",
    layout: "/admin",
    path: "/fat",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: TopFatMeals,
    hideInSidebar: true
  },
  {
    name: "Топ храни спрямо въглехидрати",
    layout: "/admin",
    path: "/carbs",
    icon: <Icon as={FaBreadSlice} width="20px" height="20px" color="inherit" />,
    component: TopCarbsMeals,
    hideInSidebar: true
  },
  {
    name: "Топ храни спрямо протеин",
    layout: "/admin",
    path: "/protein",
    icon: <Icon as={FaFish} width="20px" height="20px" color="inherit" />,
    component: TopProteinMeals,
    hideInSidebar: true
  },
  {
    name: "Класации",
    layout: "/admin",
    path: "/parent",
    icon: (
      <Icon as={MdLeaderboard} width="20px" height="20px" color="inherit" />
    ),
    collapseRoutes: [
      {
        name: "Най-препоръчвани храни",
        layout: "/admin",
        path: "/suggested",
        icon: <Icon as={FaTrophy} width="20px" height="20px" color="inherit" />,
        component: RecommendedFoods,
        hideInSidebar: true
      },
      {
        name: "Топ храни спрямо калории",
        layout: "/admin",
        path: "/calory",
        icon: (
          <Icon as={FaFireAlt} width="20px" height="20px" color="inherit" />
        ),
        component: TopCaloryMeals,
        hideInSidebar: true
      },
      {
        name: "Топ храни спрямо мазнини",
        layout: "/admin",
        path: "/fat",
        icon: <Icon as={FaTint} width="20px" height="20px" color="inherit" />,
        component: TopFatMeals,
        hideInSidebar: true
      },
      {
        name: "Топ храни спрямо въглехидрати",
        layout: "/admin",
        path: "/carbs",
        icon: (
          <Icon as={FaBreadSlice} width="20px" height="20px" color="inherit" />
        ),
        component: TopCarbsMeals,
        hideInSidebar: true
      },
      {
        name: "Топ храни спрямо протеин",
        layout: "/admin",
        path: "/protein",
        icon: <Icon as={FaFish} width="20px" height="20px" color="inherit" />,
        component: TopProteinMeals,
        hideInSidebar: true
      }
    ]
  },
  {
    name: "За контакт",
    layout: "/admin",
    path: "/contact",
    icon: <Icon as={IoMdMail} width="20px" height="20px" color="inherit" />,
    component: Contact,
    hideInSidebar: false
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
    name: "Условия за регистриране на потребител",
    layout: "/auth",
    path: "/eula",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: EULA,
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
