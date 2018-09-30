import color from 'css-color-function'
import formula from './formula.json'

const generateColors = primary => {
  let colors = {}
  console.log(primary)
  Object.keys(formula).forEach(key => {
    const value = formula[key].replace(/primary/g, primary)
    colors[key] = color.convert(value)
  })
  console.log(colors)
  return colors
}

export default generateColors
