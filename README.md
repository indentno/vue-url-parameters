# vue-url-parameters

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-url-parameters.svg?style=flat-square)](https://npmjs.com/package/vue-url-parameters)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

A vue mixin that simplifies working with url parameters. The package is developed for the purpose of allowing the key and values of a vue filter to be defined with url parameters.

## Install

**Public package installation**

You can install the package via npm:

```bash
$ npm install vue-url-parameters
```

## Usage

Import the package into your vue component.
```js
import vueUrlParameters from 'vue-url-parameters';
```

Apply the mixin:
```js
mixins: [vueUrlParameters],
```

Retrieve values from url on component init:
```js
// searchParams should be replaced with an object containing your properties
this.searchParams = this.getFiltersFromUrl(this.searchParams);
```

Trigger update of url hash when a filter changes, or in the method responsible for sending a request.
```js
this.updateUrlHash(this.searchParams);
```

**Example structure of an object (searchParams) that can be used with this package.**
```js
data() {
  return {
    searchParams: {
      q: null,
      type: 'all'
    }
  }
}
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please contact [admin@sempro.no](mailto:admin@sempro.no) instead of using the issue tracker.

## Credits

- [Runar Jørgensen](https://github.com/ventrec)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
