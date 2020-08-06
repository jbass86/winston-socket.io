// @ts-nocheck
"use strict";

const { src, dest, parallel, series } = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require("gulp-eslint");

const minimist = require("minimist");
const args = minimist(process.argv.slice(2));

function lint(cb) {
    return src("lib/**/*.js").pipe(eslint({rules: {strict: 2}})).pipe(eslint.format()).pipe(eslint.failAfterError());
}

function lintfix(cb) {
    return src("lib/**/*.js").pipe(eslint({fix: true, rules: {strict: 2}})).pipe(eslint.format()).pipe(dest("src/"));
}

function test_basic(cb) {
  return src("./test/basic-test.js", {read: false}).pipe(mocha({reporter: 'list'}));
}

function test_socket(cb) {
  return src("./test/winston-socket-test.js", {read: false}).pipe(mocha({reporter: 'list'}));
}

exports.lint = lint;
exports.lintfix = lintfix;
exports.test = series(test_basic, test_socket);
exports.default = series(exports.lint, exports.test);