import { Navigation } from "react-native-navigation";

const layout = () => {
  return {
    layout: {
      backgroundColor: '#FFFFFF',
      direction: 'ltr',
    },
  };
};

const topBar = () => {
  return {
    topBar: {
      visible: false,
      drawBehind: true,
    }
  };
};

const animations = () => {
  return {
    animations: {
      setRoot: {
        waitForRender: true,
        y: {
          from: 1000,
          to: 0,
          duration: 350,
          interpolation: 'accelerate',
        },
        alpha: {
          from: 0,
          to: 1,
          duration: 600,
          // startDelay: 100,
          interpolation: 'accelerate'
        }
      },
      push: {
        enabled: true,
        waitForRender: true,
      },
    }
  };
};


const setDefaultOptions = (lang = "en") => {
  const rt = lang == "en" ? 'ltr' : 'rtl';
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      drawBehind: true
    },
    statusBar: {
      drawBehind: true,
      style: "light"
    },
    layout: {
      orientation: ['portrait'],
      direction: rt,
      componentBackgroundColor: 'transparent'
    },
    bottomTabs: {
      visible: false,
      animate: false,
      backgroundColor: '#FFFFFF',
    },
    bottomTab: {
      textColor: '#C0C0C0',
      selectedTextColor: '#ED8B19',
      iconColor: '#C0C0C0',
      selectedIconColor: '#ED8B19',

    },
    ...animations(),
  });
};

export default setDefaultOptions;
