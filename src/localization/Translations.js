import strings from './strings';
import context from '../utils/context';
import StringValue from './StringValue';

class Translations {

  constructor() {
    this.values = strings;

  }

  get(id) {
    // check the translation id is valid
    if (!this.values.hasOwnProperty(id)) {
      return new StringValue(id);
      throw `Unknown translation for id: ${id}`;
    }
    var translations = this.values[id];
    // check the langauge is valid
    var currentLanguage = context.getCurrentLanguage();
    if (!translations.hasOwnProperty(currentLanguage)) {
      throw `No translations specified for translation for id: ${id} in language: ${currentLanguage}`;
    }

    return new StringValue(this.values[id][currentLanguage]);
  }
}

var translations = new Translations();
export default translations;
