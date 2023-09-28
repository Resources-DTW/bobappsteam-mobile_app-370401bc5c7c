import { Navigation } from "react-native-navigation";
import { registerScreens, setDefaultOptions, screenIds } from '../navigation';
import { AppState, NativeModules, Platform } from 'react-native';
import context from "src/utils/context";
import CodePush from "react-native-code-push";
import config from "src/config";



const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export const startApp = (parsingFeature = {}) => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'bottomTabs',
        children: [
          {
            stack: {
              id: screenIds.HOME_SCREEN,
              children: [{
                component: {
                  name: screenIds.HOME_SCREEN,
                  // id: screenIds.HOME_SCREEN,
                }
              }],
            }
          },
          {
            stack: {
              id: screenIds.OFFERS_SCREEN,
              children: [{
                component: {
                  name: parsingFeature?.['menu_categories'] ? screenIds.MENU_SUB_CATEGORIES_SCREEN : screenIds.OFFERS_SCREEN,
                  // id: screenIds.OFFERS_SCREEN,
                  passProps: parsingFeature?.['menu_categories'] ? {
                    cat: { _id: 'all', main: true },
                    isOffer: true,
                    hideBack: true,
                    offerScreen: true,
                  } : {}
                }
              }],

            }
          },
          {
            stack: {
              id: screenIds.MENU_SCREEN,
              children: [{
                component: {
                  name: parsingFeature?.['menu_categories'] || parsingFeature?.['category_page_2'] ? screenIds.MENU_CATEGORIES_SCREEN : screenIds.MENU_SCREEN,
                  // id: screenIds.MENU_SCREEN,
                  passProps: {
                    hideBack: true
                  }
                },

              }],
              options: {

              },

            }
          },
          {
            stack: {
              id: screenIds.MY_ORDER_SCREEN,
              children: [{
                component: {
                  name: screenIds.MY_ORDER_SCREEN,
                  // id: screenIds.MY_ORDER_SCREEN,
                }
              }],
              options: {
                // topBar: {

                // },

              }
            }
          },
          {
            stack: {
              id: screenIds.ACCOUNT_SCREEN,
              children: [{
                component: {
                  name: screenIds.ACCOUNT_SCREEN,

                  passProps: {
                    myProfile: true
                  }
                }
              }],
              options: {
                // topBar: {

                // },

              }
            }
          },
        ]
      }
    }
  });

}


export const logoutApp = () => {
  Navigation.setRoot({
    root: {
      component: {
        name: screenIds.LOGOUT_SCREEN,
        options: {
          topBar: {
            visible: false,
            drawBehind: true,
          },
          statusBar: {
            drawBehind: true,
            style: "light"
          }
        }
      }
    },
  });
};

Navigation.events().registerAppLaunchedListener(() => {
  console.log('Navigation: registerAppLaunchedListener ')
  start()
})

function checkCodePushUpdate() {
  return CodePush.sync({
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: Platform.OS == 'ios' ? CodePush.InstallMode.ON_NEXT_RESTART : CodePush.InstallMode.ON_NEXT_RESTART,
    deploymentKey: Platform.OS == 'ios' ? config.iOSDeploymentKey : config.AndroidDeploymentKey,
  })
}

const start = () => {
  checkCodePushUpdate()
    .then(syncStatus => {
      console.log('Start: codePush.sync completed with status: ', syncStatus)
      // wait for the initial code sync to complete else we get flicker
      // in the app when it updates after it has started up and is
      // on the Home screen
      if (syncStatus == 4)
        startAppCodePush()
      return null
    })
    .catch(() => {
      // this could happen if the app doesn't have connectivity
      // just go ahead and start up as normal
      startAppCodePush()
    })
}

function startAppCodePush() {
  AppState.addEventListener('change', onAppStateChange)
  startNavigation()
}

function onAppStateChange(currentAppState) {
  console.log('Start: onAppStateChange: currentAppState: ' + currentAppState)
  if (currentAppState === 'active') {
    checkCodePushUpdate()
  }
}

const startNavigation = async (registered) => {
  console.log('Start: startNavigation')

  registerScreens()
  const lang = await context.getCurrentLanguageStorage();
  setDefaultOptions(lang);
  Navigation.setRoot({
    root: {
      component: {
        name: screenIds.WELCOME_SCREEN,
        options: {
          topBar: {
            visible: false,
            drawBehind: true,
          },
          statusBar: {
            drawBehind: true,
            style: "light"
          }
        }
      }
    },
  });
}

const setRoot = () => {
  Navigation.events().registerAppLaunchedListener(async () => {

    start();

  });
};

export default setRoot;