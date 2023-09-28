
class Colors {

  constructor(colors = {}) {
    this.mainColor1 = colors.main_a ? colors.main_a : '#777777';
    this.mainColor2 = colors.main_b ? colors.main_b : '#000000';
    this.mainColor3 = colors.main_c ? colors.main_c : '#D6551B';
    this.tintColor1 = colors.tint_a ? colors.tint_a : '#EAFFCB';
    this.tintColor2 = colors.tint_b ? colors.tint_b : '#B2FFDE';
    this.tintColor3 = colors.tint_c ? colors.tint_c : '#FFDED0';
    this.shadeColor1 = colors.shade_a ? colors.shade_a : '#25430E';
    this.shadeColor2 = colors.shade_b ? colors.shade_b : '#00361F';
    this.shadeColor3 = colors.shade_c ? colors.shade_c : '#5D230A';
  }

  init(colors) {
    this.mainColor1 = colors.main_a ? colors.main_a : '#7BB94D';
    this.mainColor2 = colors.main_b ? colors.main_b : '#006F40';
    this.mainColor3 = colors.main_c ? colors.main_c : '#D6551B';
    this.tintColor1 = colors.tint_a ? colors.tint_a : '#EAFFCB';
    this.tintColor2 = colors.tint_b ? colors.tint_b : '#B2FFDE';
    this.tintColor3 = colors.tint_c ? colors.tint_c : '#FFDED0';
    this.shadeColor1 = colors.shade_a ? colors.shade_a : '#25430E';
    this.shadeColor2 = colors.shade_b ? colors.shade_b : '#00361F';
    this.shadeColor3 = colors.shade_c ? colors.shade_c : '#5D230A';
  }
  get() {
    return this.localColors
  }

};

const colors = new Colors();
export default colors;

// const Colors = (colors = {}) => {
//   return ({
//     mainColor1: colors.main_a ? colors.main_a : '#7BB94D',
//     mainColor2: colors.main_b ? colors.main_b : '#006F40',
//     mainColor3: colors.main_c ? colors.main_c : '#D6551B',
//     tintColor1: colors.tint_a ? colors.tint_a : '#EAFFCB',
//     tintColor2: colors.tint_b ? colors.tint_b : '#B2FFDE',
//     tintColor3: colors.tint_c ? colors.tint_c : '#FFDED0',
//     shadeColor1: colors.shade_a ? colors.shade_a : '#25430E',
//     shadeColor2: colors.shade_b ? colors.shade_b : '#00361F',
//     shadeColor3: colors.shade_c ? colors.shade_c : '#5D230A',
//   })
// };


// export default Colors
