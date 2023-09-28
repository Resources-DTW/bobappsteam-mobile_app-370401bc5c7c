import AsyncStorage from '@react-native-community/async-storage';

class Context {
  constructor() {
    this.currentLanguage = 'ar';
    this.setCurrentLanguage();
  }

  async setCurrentLanguage() {
    await AsyncStorage.getItem('language').then(lang => {
      this.currentLanguage = lang || 'ar';
    }).catch(error => {
      AsyncStorage.setItem('language', this.currentLanguage);
    })
  }

  async changeCurrentLanguage(lang) {
    this.currentLanguage = lang;
    await AsyncStorage.setItem('language', this.currentLanguage);

  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
  async getCurrentLanguageStorage() {
    return await AsyncStorage.getItem('language').then(lang => {
      return lang || 'ar';
    }).catch(error => {
      return this.currentLanguage;
    })
  }
  isRTL() {
    return this.currentLanguage === 'ar';
  }
}

var context = new Context();
export default context;