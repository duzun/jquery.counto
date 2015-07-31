# A jQuery plugin to display numeric values with a nice animation.

## Usage

Instead of 
```js
$('#my-number').val((int)nr);
```

use
```js
$(`#my-number`).counto((int)nr, timeout, ondone);
```

where 
```js
ondone.call(this, nr, old_val);
```

### xNumber

If you include `xNumber.js`, `counto` will automatically use it to parse formated numbers.


### Alternatives

- [countUp.js](https://inorganik.github.io/countUp.js/)

