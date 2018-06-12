const Vibrant = require('node-vibrant');

const vibrantValues = ['Vibrant', 'LightVibrant', 'DarkVibrant', 'Muted', 'LightMuted', 'DarkMuted'];

const lowerCaseFirstLetter = (str) => {
  return str[0].toLowerCase() + str.slice(1);
};

const vibrantColor = () => {
  return function vibrantColor(input, fulfill, utils) {
    let finish = -input.outputs.length + 1;
    const next = () => {
      finish++;
      if (finish > 0) {
        fulfill(input);
      }
    };

    input.data.vibrantColor = {};
    for (let name of vibrantValues) {
      input.data.vibrantColor[lowerCaseFirstLetter(name)] = null;
    }

    let done = false;
    for (let i in input.outputs) {
      if (!done && ['image/png', 'image/jpeg'].indexOf(utils.mime(input.outputs[i].buffer)) !== -1) {
        done = true;
        Vibrant.from(input.outputs[i].buffer)
          .maxDimension(400)
          .clearFilters()
          .getPalette()
          .then((palette) => {
            for (let name of vibrantValues) {
              if (palette[name]) {
                input.data.vibrantColor[lowerCaseFirstLetter(name)] = palette[name].getHex();
              }
            }
            next();
          });
      }
      else {
        next();
      }
    }
  };
};

module.exports = vibrantColor;
