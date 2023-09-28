// @flow

import React from 'react';
import { Navigation } from 'react-native-navigation';
import screenIds from './screenIds';
import { Provider } from 'react-redux';
import store from '../store';
import { withNavigationProvider, NavigationProvider } from 'react-native-navigation-hooks'
import {
  WelcomeScreen,
  HomeScreen,
  OffersScreen,
  MenuScreen,
  ItemScreen,
  SuccessAddItemScreen,
  CartScreen,
  SearchScreen,
  AccountScreen,
  LoginScreen,
  CheckoutScreen,
  MyAddressesScreen,
  AddAdressScreen,
  SelectLocationOnMapScreen,
  MyOrdersScreen,
  OrderDetailsScreen,
  FilterScreen,
  NotoficationScreen,
  MyFavScreen,
  CategoryScreen,
  LogoutScreen,
  EditProfileScreen,
  WidgetScreen,
  ImageViewScreen,
  AllCategoriesScreen,
  RateAndReviewScreen,
  OnlinePaymentScreen,
  MenuCategoriesScreen,
  MenuSubCategoriesScreen,
  LoyaltyCoinsScreen,
  ShareOrderScreen,
  ShareDialog,
  NewAccountScreen,
  AboutUsScreen,
  ToastModal,
} from 'src/screens';
import MainFooter from '../components/MainFooter';

export default function () {
  Navigation.registerComponentWithRedux(screenIds.WELCOME_SCREEN, () => WelcomeScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.HOME_SCREEN, () => HomeScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.OFFERS_SCREEN, () => OffersScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MENU_SCREEN, () => MenuScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ITEM_SCREEN, () => ItemScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.SUCCESS_ADD_ITEM_SCREEN, () => SuccessAddItemScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.CART_SCREEN, () => CartScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.CUSTOM_FOOTER, () => MainFooter, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.SEARCH_SCREEN, () => SearchScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ACCOUNT_SCREEN, () => withNavigationProvider(NewAccountScreen), Provider, store);
  Navigation.registerComponentWithRedux(screenIds.LOGIN_SCREEN, () => LoginScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.CHECKOUT_SCREEN, () => CheckoutScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MY_ADDRESSES_SCREEEN, () => MyAddressesScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ADD_ADDRESS_SCREEN, () => AddAdressScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.SELECT_LOCATION_ON_MAP, () => SelectLocationOnMapScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MY_ORDER_SCREEN, () => MyOrdersScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ORDER_DETAILS_SCREEN, () => OrderDetailsScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.FILTER_SCREEN, () => FilterScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.NOTOFICATION_SCREEN, () => NotoficationScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MY_FAV_SCREEN, () => MyFavScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.CATEGORY_SCREEN, () => CategoryScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.LOGOUT_SCREEN, () => LogoutScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.EDIT_PROFILE_SCREEN, () => EditProfileScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.WIDGET_SCREEN, () => WidgetScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.IMAGE_VIEW_SCREEN, () => ImageViewScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ALL_CATEGORIES_SCREEN, () => AllCategoriesScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.RATE_AND_REVIEW_SCREEN, () => RateAndReviewScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ONLINE_PAYMENT_SCREEN, () => OnlinePaymentScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MENU_CATEGORIES_SCREEN, () => MenuCategoriesScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.MENU_SUB_CATEGORIES_SCREEN, () => MenuSubCategoriesScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.LOYALTY_COINS_SCREEN, () => LoyaltyCoinsScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.SHARE_ORDER_SCREEN, () => ShareOrderScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.SHARE_DIALOG, () => ShareDialog, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.ABOUT_US_SCREEN, () => AboutUsScreen, Provider, store);
  Navigation.registerComponentWithRedux(screenIds.TOAST_MODAL, () => ToastModal, Provider, store);

  console.info('All screens have been registered...');
}
