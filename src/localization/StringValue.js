export default class StringValue {

  constructor(value = '') {
    this.value = value;
  }

  val(){
    return this.value;
  }

  toTitleCase() {
    return this.value.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  toLabelCase() {
    return this.value.charAt(0).toUpperCase() + this.value.substr(1).toLowerCase();
  }

  toUpperCase() {
    return this.value.toUpperCase();
  }
}
