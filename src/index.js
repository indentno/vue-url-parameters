export default {
  methods: {
    /**
     * Retrieves parameters from url and sets correct filters
     */
    getFiltersFromUrl: function (data) {
      let url = window.location.hash;

      if (url.length > 1) {
        if (url[0] === '#') {
          url = url.substring(1);
        }

        const params = url.split('&');

        params.forEach(param => {
          const paramBits = param.split('=');
          let paramKey = paramBits[0];

          // Invalid parameters, ignore!
          if (paramBits.length === 1) {
            return;
          }

          const paramValues = paramBits[1].split(',');

          paramValues.forEach(paramValue => {
            let obj = {};
            const values = paramValue.split('-');

            if (values.length === 3) {
              // This is a date (2017-3-25) as we have 2 dashes which gives 3 values
              obj = decodeURI(paramValue);
            } else if (values.length === 2) {
              // If length of values is greater than 1 we assume it's a range with integer values
              obj.min = parseInt(values[0]);
              obj.max = parseInt(values[1]);
            } else if (isNaN(parseInt(values[0]))) {
              // If the value is NaN (Not a Number), it must be a string
              obj = decodeURI(values[0]);
            } else {
              // It is a number
              obj = parseFloat(values[0]);
            }

            // If string, set the value directly
            if (typeof obj === 'string') {
              // Convert to boolean if we can
              if (obj === 'true' || obj === 'false') {
                data[paramKey] = JSON.parse(obj);
              } else {
                data[paramKey] = obj;
              }
            } else {
              // Remove brackets from key name
              if (paramKey.indexOf('[]') !== -1) {
                paramKey = paramKey.substring(0, paramKey.length - 2);
              }

              if (!Array.isArray(data[paramKey])) {
                data[paramKey] = [];
              }

              data[paramKey].push(obj);
            }
          });
        });
      }

      return data;
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