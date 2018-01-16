'use strict';

module.exports = {
  methods: {
    /**
     * Retrieves parameters from url and sets correct filters
     */
    getFiltersFromUrl: function (data, convertTypes = false, urlString = null) {
      let url = urlString || window.location.hash;

      // Return data if url length is not more then 1
      if (url.length <= 1) {
        return data;
      }

      // Remove # as we do not need it in the string
      if (url[0] === '#') {
        url = url.substring(1);
      }

      const params = url.split('&');

      // Loop through each parameter
      params.forEach(param => {
        const paramBits = param.split('=');
        let paramKey = paramBits[0];
        let paramValue = [];
        let shouldBeArray = false;

        // The string has no '=', making it invalid
        if (paramBits.length === 1) {
          return;
        }

        // Check if key contains bracket, which means that the value should be an array
        // If the key contains braket, we remove the brackets from the name
        if (paramKey.indexOf('[]') !== -1) {
          paramKey = paramKey.substring(0, paramKey.length - 2);
          shouldBeArray = true;
        }

        if (shouldBeArray) {
          // Each value in the array should be separated by comma
          const arrayValues = paramBits[1].split(',');

          arrayValues.forEach(value => {
            if (convertTypes) {
              value = this.convertStringValueToCorrectType(value);
            }

            paramValue.push(value);
          });
        } else {
          if (convertTypes) {
            paramValue = this.convertStringValueToCorrectType(paramBits[1]);
          } else {
            paramValue = decodeURI(paramBits[1]);
          }
        }

        data[paramKey] = paramValue;
      });

      return data;
    },

    convertStringValueToCorrectType(value) {
      let returnValue = null;

      /**
       * Some values contains hyphens (a date or a range)
       * If a string contains 2 hyphens, it will be treated like a date (2017-08-01). If the string contains
       * only 1 hyphen, it will be treated like a range (50-250). This means that a regular string might not
       * returned the way you expect.
       */
      const values = value.split('-');

      if (values.length === 3) {
        // This is a date (2017-3-25) as we have 2 dashes which gives 3 values
        returnValue = decodeURI(paramValue);
      } else if (values.length === 2) {
        // If length of values is greater than 1 we assume it's a range with integer values
        returnValue = {}
        returnValue.min = parseFloat(values[0]);
        returnValue.max = parseFloat(values[1]);
      } else if (values.length === 1) {
        if (isNaN(values[0])) {
          // If the value is NaN (Not a Number), it must be a string
          let stringValue = decodeURI(values[0]);

          // Convert to boolean if string is 'true' or 'false'
          if (stringValue === 'true' || stringValue === 'false') {
            returnValue = JSON.parse(stringValue);
          } else {
            returnValue = stringValue;
          }
        } else {
          // It is a number
          returnValue = parseFloat(values[0]);
        }
      } else {
        // More then 3 hyphens, this must be a regular string
        returnValue = value;
      }

      return returnValue;
    },

    /**
     * Adds parameters to url
     */
    updateUrlHash: function (data) {
      window.location.hash = this.calculateUrlHash(data);
    },

    calculateUrlHash: function (data) {
      let urlHash = '';

      for (let key in data) {
        let value = data[key];

        if ((value !== null && value !== '' && !Array.isArray(value)) || (Array.isArray(value) && value.length > 0)) {
          if (urlHash.length > 1) {
            urlHash += '&';
          }

          if (Array.isArray(value)) {
            urlHash += key + '[]=';

            value.forEach(objectOrElement => {
              if (typeof objectOrElement === 'object') {
                for (let property in objectOrElement) {
                  const propertyValue = objectOrElement[property];

                  urlHash += propertyValue;

                  if (property === 'min') {
                    urlHash += '-';
                  }
                }
              } else {
                urlHash += objectOrElement;
              }

              urlHash += ',';
            });

            urlHash = urlHash.substring(0, urlHash.length - 1);
          } else {
            urlHash += key + '=';

            if (typeof value === 'string') {
              value = encodeURI(value);
            }

            urlHash += value;
          }
        }
      }

      // Prevent scroll to top if urlHash is empty
      if (urlHash.length === 0) {
        urlHash = "#!";
      }

      return urlHash;
    }
  }
}
