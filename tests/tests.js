'use strict';

const it = require('mocha').it;
const expect = require('chai').expect;
const source = require('../src/index');
const data = require('./data');

describe('vue-url-parameters tests', function () {
  it('query string should be parsed correctly', function () {
    const stringToObject = JSON.stringify(source.methods.getFiltersFromUrl({}, false, data.urlString));

    expect(stringToObject).to.equal(JSON.stringify(data.params));
  });

  it('object should be converted correctly to query string', function () {
    const objectToString = source.methods.calculateUrlHash(data.params);

    expect('#' + objectToString).to.equal(data.urlString);
  });
});
