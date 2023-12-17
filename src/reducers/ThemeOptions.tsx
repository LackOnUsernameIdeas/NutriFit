import sideBar6 from '../assets/utils/images/sidebar/city1.jpg';

export const SET_ENABLE_BACKGROUND_IMAGE = 'THEME_OPTIONS/SET_ENABLE_BACKGROUND_IMAGE';

export const SET_ENABLE_MOBILE_MENU = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU';
export const SET_ENABLE_MOBILE_MENU_SMALL = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU_SMALL';

export const SET_ENABLE_FIXED_HEADER = 'THEME_OPTIONS/SET_ENABLE_FIXED_HEADER';
export const SET_ENABLE_HEADER_SHADOW = 'THEME_OPTIONS/SET_ENABLE_HEADER_SHADOW';
export const SET_ENABLE_SIDEBAR_SHADOW = 'THEME_OPTIONS/SET_ENABLE_SIDEBAR_SHADOW';
export const SET_ENABLE_FIXED_SIDEBAR = 'THEME_OPTIONS/SET_ENABLE_FIXED_SIDEBAR';
export const SET_ENABLE_CLOSED_SIDEBAR = 'THEME_OPTIONS/SET_ENABLE_CLOSED_SIDEBAR';
export const SET_ENABLE_FIXED_FOOTER = 'THEME_OPTIONS/SET_ENABLE_FIXED_FOOTER';

export const SET_ENABLE_PAGETITLE_ICON = 'THEME_OPTIONS/SET_ENABLE_PAGETITLE_ICON';
export const SET_ENABLE_PAGETITLE_SUBHEADING = 'THEME_OPTIONS/SET_ENABLE_PAGETITLE_SUBHEADING';
export const SET_ENABLE_PAGE_TABS_ALT = 'THEME_OPTIONS/SET_ENABLE_PAGE_TABS_ALT';

export const SET_BACKGROUND_IMAGE = 'THEME_OPTIONS/SET_BACKGROUND_IMAGE';
export const SET_BACKGROUND_COLOR = 'THEME_OPTIONS/SET_BACKGROUND_COLOR';
export const SET_COLOR_SCHEME = 'THEME_OPTIONS/SET_COLOR_SCHEME';
export const SET_BACKGROUND_IMAGE_OPACITY = 'THEME_OPTIONS/SET_BACKGROUND_IMAGE_OPACITY';

export const SET_HEADER_BACKGROUND_COLOR = 'THEME_OPTIONS/SET_HEADER_BACKGROUND_COLOR';


export const setEnableBackgroundImage = (enableBackgroundImage: boolean) => ({
    type: SET_ENABLE_BACKGROUND_IMAGE,
    enableBackgroundImage
});

export const setEnableFixedHeader = (enableFixedHeader: boolean) => ({
    type: SET_ENABLE_FIXED_HEADER,
    enableFixedHeader
});

export const setEnableHeaderShadow = (enableHeaderShadow: boolean) => ({
    type: SET_ENABLE_HEADER_SHADOW,
    enableHeaderShadow
});

export const setEnableSidebarShadow = (enableSidebarShadow: boolean) => ({
    type: SET_ENABLE_SIDEBAR_SHADOW,
    enableSidebarShadow
});

export const setEnablePageTitleIcon = (enablePageTitleIcon: boolean) => ({
    type: SET_ENABLE_PAGETITLE_ICON,
    enablePageTitleIcon
});

export const setEnablePageTitleSubheading = (enablePageTitleSubheading: boolean) => ({
    type: SET_ENABLE_PAGETITLE_SUBHEADING,
    enablePageTitleSubheading
});

export const setEnablePageTabsAlt = (enablePageTabsAlt: boolean) => ({
    type: SET_ENABLE_PAGE_TABS_ALT,
    enablePageTabsAlt
});

export const setEnableFixedSidebar = (enableFixedSidebar: boolean) => ({
    type: SET_ENABLE_FIXED_SIDEBAR,
    enableFixedSidebar
});

export const setEnableClosedSidebar = (enableClosedSidebar: boolean) => ({
    type: SET_ENABLE_CLOSED_SIDEBAR,
    enableClosedSidebar
});

export const setEnableMobileMenu = (enableMobileMenu: string) => ({
    type: SET_ENABLE_MOBILE_MENU,
    enableMobileMenu
});

export const setEnableMobileMenuSmall = (enableMobileMenuSmall: boolean) => ({
    type: SET_ENABLE_MOBILE_MENU_SMALL,
    enableMobileMenuSmall
});

export const setEnableFixedFooter = (enableFixedFooter: boolean) => ({
    type: SET_ENABLE_FIXED_FOOTER,
    enableFixedFooter
});

export const setBackgroundColor = (backgroundColor: string) => ({
    type: SET_BACKGROUND_COLOR,
    backgroundColor
});

export const setHeaderBackgroundColor = (headerBackgroundColor: string) => ({
    type: SET_HEADER_BACKGROUND_COLOR,
    headerBackgroundColor
});

export const setColorScheme = (colorScheme: string) => ({
    type: SET_COLOR_SCHEME,
    colorScheme
});

export const setBackgroundImageOpacity = (backgroundImageOpacity: string) => ({
    type: SET_BACKGROUND_IMAGE_OPACITY,
    backgroundImageOpacity
});

export const setBackgroundImage = (backgroundImage: any)  => ({
    type: SET_BACKGROUND_IMAGE,
    backgroundImage
});

interface State {
    backgroundColor: string;
    headerBackgroundColor: string;
    enableMobileMenuSmall: string;
    enableBackgroundImage: boolean;
    enableClosedSidebar: boolean;
    enableFixedHeader: boolean;
    enableHeaderShadow: boolean;
    enableSidebarShadow: boolean;
    enableFixedFooter: boolean;
    enableFixedSidebar: boolean;
    colorScheme: string;
    backgroundImage: any;
    backgroundImageOpacity: string;
    enablePageTitleIcon: boolean;
    enablePageTitleSubheading: boolean;
    enablePageTabsAlt: boolean;
}
interface Action {
    type: string;
    backgroundColor?: string;
    headerBackgroundColor?: string;
    enableBackgroundImage?: boolean;
    enableClosedSidebar?: boolean;
    enableFixedHeader?: boolean;
    enableHeaderShadow?: boolean;
    enableSidebarShadow?: boolean;
    enableFixedFooter?: boolean;
    enableFixedSidebar?: boolean;
    colorScheme: string;
    backgroundImage: any;
    backgroundImageOpacity: string;
    enablePageTitleIcon?: boolean;
    enablePageTitleSubheading?: boolean;
    enablePageTabsAlt?: boolean;
    enableMobileMenuSmall: string;
}

const initialState: State = {
    backgroundColor: '',
    headerBackgroundColor: '',
    enableMobileMenuSmall: '',
    enableBackgroundImage: false,
    enableClosedSidebar: false,
    enableFixedHeader: true,
    enableHeaderShadow: true,
    enableSidebarShadow: true,
    enableFixedFooter: true,
    enableFixedSidebar: true,
    colorScheme: 'white',
    backgroundImage: sideBar6,
    backgroundImageOpacity: 'opacity-06',
    enablePageTitleIcon: true,
    enablePageTitleSubheading: true,
    enablePageTabsAlt: true,
}
const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
      case SET_ENABLE_BACKGROUND_IMAGE:
        return {
          ...state,
          enableBackgroundImage: action.enableBackgroundImage || false,
        };
  
      case SET_ENABLE_FIXED_HEADER:
        return {
          ...state,
          enableFixedHeader: action.enableFixedHeader || false,
        };
  
      case SET_ENABLE_HEADER_SHADOW:
        return {
          ...state,
          enableHeaderShadow: action.enableHeaderShadow || false,
        };
  
      case SET_ENABLE_SIDEBAR_SHADOW:
        return {
          ...state,
          enableSidebarShadow: action.enableSidebarShadow || false,
        };
  
      case SET_ENABLE_PAGETITLE_ICON:
        return {
          ...state,
          enablePageTitleIcon: action.enablePageTitleIcon || false,
        };
  
      case SET_ENABLE_PAGETITLE_SUBHEADING:
        return {
          ...state,
          enablePageTitleSubheading: action.enablePageTitleSubheading || false,
        };
  
      case SET_ENABLE_PAGE_TABS_ALT:
        return {
          ...state,
          enablePageTabsAlt: action.enablePageTabsAlt || false,
        };
  
      case SET_ENABLE_FIXED_SIDEBAR:
        return {
          ...state,
          enableFixedSidebar: action.enableFixedSidebar || false,
        };
  
      case SET_ENABLE_MOBILE_MENU:
        return {
          ...state,
          enableMobileMenu: action.enableMobileMenu || false,
        };
  
      case SET_ENABLE_MOBILE_MENU_SMALL:
        return {
          ...state,
          enableMobileMenuSmall: action.enableMobileMenuSmall || '',
        };
  
      case SET_ENABLE_CLOSED_SIDEBAR:
        return {
          ...state,
          enableClosedSidebar: action.enableClosedSidebar || false,
        };
  
      case SET_ENABLE_FIXED_FOOTER:
        return {
          ...state,
          enableFixedFooter: action.enableFixedFooter || false,
        };
  
      case SET_BACKGROUND_COLOR:
        return {
          ...state,
          backgroundColor: action.backgroundColor || '',
        };
  
      case SET_HEADER_BACKGROUND_COLOR:
        return {
          ...state,
          headerBackgroundColor: action.headerBackgroundColor || '',
        };
  
      case SET_COLOR_SCHEME:
        return {
          ...state,
          colorScheme: action.colorScheme || '',
        };
  
      case SET_BACKGROUND_IMAGE:
        return {
          ...state,
          backgroundImage: action.backgroundImage || '',
        };
  
      case SET_BACKGROUND_IMAGE_OPACITY:
        return {
          ...state,
          backgroundImageOpacity: action.backgroundImageOpacity || '',
        };
  
      default:
        return state;
    }
  };
  
  export default reducer;