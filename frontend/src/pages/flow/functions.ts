export const randomNumberBetween = (number1:number, number2:number) => {
    return Math.floor(Math.random() * (number2 - number1 + 1) + number1);
  };


let id = 0;
export const getId = () => `dndnode_${id++}`;

