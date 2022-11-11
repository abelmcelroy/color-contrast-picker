# color-contrast-picker

`color-contrast-picker` is a color conversion library for JavaScript and node.

This library provides a method for finding a color with a specific contrast ratio to another color and that matches the hue and saturation of the first.

# API

### `getContrastingHex(color, contrastRatio)`

Returns a color of the same hue/saturation as the `color` and contrasts the original color with a contrast ratio of `contrastRatio`.

### Uses

Potential applications include generating text colors for UI components with designated colors constrained by design specifications.

More specifically, say you had a button colored ![#1749DE](https://placehold.co/15x15/1749DE/1749DE.png) `#1749DE`, and you needed to add text to it. This is what `getContrastingHex` is for:

```javascript
const textColor = getContrastingHex('#1749DE', 'AA_text');
```

Now, `textColor` equals ![#C3D0F9](https://placehold.co/15x15/C3D0F9/C3D0F9.png) `#C3D0F9`, which has a contrast ratio of 4.5 meeting the AA_text WCAG standard.

### Params

#### `color`
- definition: the color you want to be altered into a lighter/darker color with the same hue and saturation
- type: string
- pattern: `/^#[\da-fA-F]{6}/`
- examples: '#db1f90', '#ffffff', '#123456'

#### `contrastRatio`
- definition: the minimum contrast ratio between your `color` and the function's output color [see w3 glossary definition here](https://www.w3.org/TR/WCAG21/#glossary)
- type: number | string
- default value: 'AA' (equivilent to 3)
- examples: 3, 'AA', 'AA_text', 'AA_text_large', 'AAA_text', 'AAA_text_large';

### Example

```js
const { getContrastingHex } = require('color-contrast-picker');

const hex1 = makeHexesContrast('#7524B7', 4.5);
const hex2 = makeHexesContrast('#7524B7', 'AA_text');

// hex1 = hex2 = '#D9BBF2' (contrast ratio = 4.58)
// the next lighter shade is '#DFBFF3' (contrast ratio = 4.79)
// the next darker shade is '#DAB6F1' (contrast ratio = 4.44)

const hex3 = makeHexesContrast('#6D6D6D', 7);

// hex3 = null
// #000000 (black) has a contrast ratio of 4.05
// #FFFFFF (white) has a contrast ratio of 5.17
// thus, no color has sufficient contrast
```

---
### `makeHexesContrast(color, fixedColor, contrastRatio)`

Returns a color of the same hue/saturation as the `color` that has a contrasts the `fixedColor` by with a contrast ratio of `contrastRatio`.

### Uses

Potential applications include procredurally generating colors for charts.

More specifically, say you had two different colors, and you would like to adjust one of them so that their contrast ratio reaches a certain value. This is the function you'd want to use.

E.g. ![#8F428D](https://placehold.co/15x15/8F428D/8F428D.png) `#8F428D` and ![#50B47B](https://placehold.co/15x15/50B47B/50B47B.png) `#50B47B` have a contrast ratio of 2.44, not meeting the minimum WCAG standard of 3.0.

If I wanted to shift ![#8F428D](https://placehold.co/15x15/8F428D/8F428D.png) `#8F428D` to achieve a contrast ratio of 3.0 I would call

```javascript
const newPurple = makeHexesContrast('#8F428D', '50B47B', 3);
```

Now, `newPurple` equals ![#7A3878](https://placehold.co/15x15/7A3878/7A3878.png) `#7A3878`, which has a contrast ratio of 3.09 with ![#50B47B](https://placehold.co/15x15/50B47B/50B47B.png) `#50B47B`.

### Params

#### `color`
- definition: the color you want to be altered into a lighter/darker color with the same hue and saturation
- type: string
- pattern: `/^#[\da-fA-F]{6}/`
- examples: '#db1f90', '#ffffff', '#123456'

#### `fixedColor`
- definition: the color you want to contrast against
- type: string
- pattern: `/^#[\da-fA-F]{6}/`
- examples: '#db1f90', '#ffffff', '#123456'

#### `contrastRatio`
- definition: the minimum contrast ratio between your `fixedColor` and the function's output color [see w3 glossary definition here](https://www.w3.org/TR/WCAG21/#glossary)
- type: number | string
- default value: 'AA' (equivilent to 3)
- examples: 3, 'AA', 'AA_text', 'AA_text_large', 'AAA_text', 'AAA_text_large';

### Example

```js
const { makeHexesContrast } = require('color-contrast-picker');

const hex1 = makeHexesContrast('#3c7801', '#3c7805', 4.5);
// hex1 = '#bafe76' (contrast ratio = 4.51)

const hex2 = makeHexesContrast('#3c7801', '#5a5a27', 'AA_text');
// hex1 = '#75e902' (contrast ratio = 4.58)

const hex3 = makeHexesContrast('#8F428D', 'db1f90', 7);

// hex3 = null
// #000000 (black) has a contrast ratio of 3.33
// #FFFFFF (white) has a contrast ratio of 6.3
// thus, no color has sufficient contrast
```

# Install

```console
$ npm install color-contrast-picker
```

# Contribute

If there is a new methods you would like to support, please make a pull request or reach out.

# License

Licensed under the [MIT License](LICENSE).

# More info

 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * https://www.w3.org/WAI/WCAG21/Techniques/general/G18
 * https://webaim.org/resources/contrastchecker/