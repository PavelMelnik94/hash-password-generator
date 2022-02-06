export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

let speacialSymbols = ['$', '%', '&', '*', '№'];

export function getThreeSymbol() {
  let strSymbol =
    speacialSymbols[`${getRandomInt(1, 5)}`] +
    speacialSymbols[`${getRandomInt(1, 5)}`] +
    speacialSymbols[`${getRandomInt(1, 5)}`];
  return strSymbol;
}
