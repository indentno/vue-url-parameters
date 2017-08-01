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
          const paramKey = paramBits[0];

          // Invalid parameters, ignore!
          if (paramBits.length === 1) {
            return;
          }

          const paramValues = paramBits[1].split(',');

          paramValues.forEach(paramValue => {
            const obj = {};
            const values = paramValue.split('-');

            if (values.length === 3) {
              // This is a date (2017-3-25) as we have 2 dashes which gives 3 values
              obj.value = decodeURI(paramValue);
            } else if (values.length === 2) {
              // If length of values is greater than 1 we assume it's a range with integer values
              obj.min = parseInt(values[0]);
              obj.max = parseInt(values[1]);
            } else if (isNaN(parseInt(values[0]))) {
              // If the value is NaN (Not a Number), it must be a string
              obj.value = decodeURI(values[0]);
            } else {
              // It is a number
              obj.value = parseInt(values[0]);
            }

            // If string, set the value directly
            if (typeof obj.value === 'string') {
              // Convert to boolean if we can
              if (obj.value === 'true' || obj.value === 'false') {
                data[paramKey] = JSON.parse(obj.value);
              } else {
                data[paramKey] = obj.value;
              }
            } else {
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

        if ((value !== null && !Array.isArray(value)) || (Array.isArray(value) && value.length > 0)) {
          if (urlHash.length > 1) {
            urlHash += '&';
          }

          urlHash += key + '=';

          if (Array.isArray(value)) {
            value.forEach(object => {
              for (let property in object) {
                const propertyValue = object[property];

                urlHash += propertyValue;

                if (property === 'min') {
                  urlHash += '-';
                }
              }

              urlHash += ',';
            });

            urlHash = urlHash.substring(0, urlHash.length - 1);
          } else {
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