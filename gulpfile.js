// @ts-nocheck
"use strict";

const del = require("del");

const { src, dest, parallel, series } = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require("gulp-eslint");
const config = require("./webpack.config");

const minimist = require("minimist");
const args = minimist(process.argv.slice(2));

const webpack = require("webpack-stream");

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

function clean_demo() {
  return del(__dirname + "/examples/demo/dist", {force: true});
}

function build_demo() {
  console.log("build the demo...");
  return src("examples/demo/client.js").pipe(webpack(config)).pipe(dest("examples/demo/dist/"));
}

exports.lint = lint;
exports.lintfix = lintfix;
exports.test = series(test_basic, test_socket);
exports.default = series(exports.lint, exports.test);
exports["build-demo"] = build_demo;
exports["clean-demo"] = clean_demo;