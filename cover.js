#!/usr/bin/env node
var report = process.argv.slice(2);
var mochify = require('mochify');
var istanbul = require('mochify-istanbul');

mochify('./test/*.js', {
  reporter: 'dot',
  transform: ['babelify']
}).plugin(istanbul, {
  report: [report]
}).bundle();