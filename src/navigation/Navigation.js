// @flow

import { Navigation } from 'react-native-navigation';

import registerScreens from './registerScreens';
import screenIds from './screenIds';
import store from 'src/store';
import { showHideFooterAction } from 'src/store/actions/menuActions';


Navigation.events().registerCommandListener((name, params) => {
  lastComponent = ''
});

// Register all screens on launch
// registerScreens();
let overLay = false

export function pushTabBasedApp() {
  Navigation.setDefaultOptions({
    topBar: {
      // topMargin: 0,
      visible: false,
      drawBehind: true,
    },
    statusBar: {
      // drawBehind: true,
      // style: 'dark',
      // backgroundColor: '005EB8',
      style: "light"
    },
    layout: {
      orientation: ['portrait'],
      direction: 'ltr',
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysHide',
      visible: true,
      animate: true,

    },
    bottomTab: {
      selectedIconColor: '#FFBD43',
      iconInsets: { top: 0, left: 0, bottom: -14, right: 0 }, // Change to your numbers

    },
  });

}


export const push = (componentId, nextScreen, passProps = {}, options = {}, id = null, hide = true) => {

  let component = {
    name: nextScreen,
    passProps: {
      ...passProps
    },
    options: {

      ...options,
      // customTransition: {
      //   animations: [
      //     { startDelay: 500 }
      //   ],
      //   duration: 0.2
      // }
    }
  }
  if (id) {
    component = {
      name: nextScreen,
      id: id,
      passProps: {
        ...passProps
      },
      options: {

        ...options,
        // customTransition: {
        //   animations: [
        //     { startDelay: 500 }
        //   ],
        //   duration: 0.2
        // }
      }
    }
  }
  Navigation.push(componentId, {
    component: component
  });
  if (hide)
    store.dispatch(showHideFooterAction(false))
};

export const pushWithSaredElement = (componentId, nextScreen, passProps, options, image1, image2) => {
  Navigation.push(componentId, {
    component: {
      name: nextScreen,
      passProps: {
        ...passProps
      },
      options: {
        ...options,
        customTransition: {
          animations: [
            { type: 'sharedElement', fromId: image1, toId: image2, startDelay: 0, springVelocity: 0, duration: 0.5 }
          ],
          duration: 0.8
        }
      },
    }
  });
}

export const popTo = (componentId) => {
  Navigation.popTo(componentId);
};

export const pop = (componentId, show = false) => {
  if (show) store.dispatch(showHideFooterAction(true))
  Navigation.pop(componentId);
};

export const popToRoot = (componentId, show = false) => {
  if (show) store.dispatch(showHideFooterAction(true))
  Navigation.popToRoot(componentId);
};

export const showModal = (nextScreen, passProps = {}, options = {}) => {
  store.dispatch(showHideFooterAction(false))
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: nextScreen,
          id: nextScreen,
          passProps: {
            ...passProps
          },
          options: {
            layout: {
              // backgroundColor: 'rgba(0,0,0,0.9)',
            },
            ...options,
            modalPresentationStyle: 'overCurrentContext',

          }
        }
      }]
    }

  });

}

export const dismissModal = (componentId, show = false) => {
  if (show) store.dispatch(showHideFooterAction(true))
  Navigation.dismissModal(componentId);
};

export const dismissAllModals = (nohide = true) => {
  if (nohide)
    store.dispatch(showHideFooterAction(true))

  Navigation.dismissAllModals();
};

export const showOverlay = (nextScreen, passProps = {}) => {
  if (!overLay) {
    overLay = true
    Navigation.showOverlay({
      component: {
        name: nextScreen,
        id: nextScreen,
        passProps,
        options: {
          overlay: {
            interceptTouchOutside: false
          },
          layout: {
            backgroundColor: 'transparent',
            direction: 'ltr',
            orientation: ['portrait', 'landscape'],
          }
        }
      }
    });
  }
}

export const dismissOverlay = (componentId) => {
  overLay = false
  Navigation.dismissOverlay(componentId);
};

export const dissmisAndShowModal = (nextScreen, passProps = {}, options = {}) => {
  // Navigation.dismissOverlay(screenIds.CUSTOM_FOOTER)
  overLay = false
  showModal(nextScreen, passProps, options);
}
