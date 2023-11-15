// @ts-nocheck
"use strict";

const del = require("del");

const { src, dest, series } = require('gulp');
const ts = require('gulp-typescript');

const eslint = require("gulp-eslint");
const config = require("./webpack.config");
const mochaPromise = import("gulp-mocha");


const webpack = require("webpack-stream");

function lint(cb) {
    return src("lib/**/*.ts").pipe(eslint({rules: {strict: 2}})).pipe(eslint.format()).pipe(eslint.failAfterError());
}

function lintfix(cb) {
    return src("lib/**/*.ts").pipe(eslint({fix: true, rules: {strict: 2}})).pipe(eslint.format()).pipe(dest("lib/"));
}

async function test_basic(cb) {
  const mocha = await mochaPromise;
  return src("./test/basic-test.js", {read: false}).pipe(mocha.default({reporter: 'list'}));
}

async function test_socket(cb) {
  const mocha = await mochaPromise;
  return src("./test/winston-socket-test.js", {read: false}).pipe(mocha.default({reporter: 'list'}));
}

function build() {

  const tsProject = ts.createProject("tsconfig.json");

  const tsResult = src('lib/**/*.ts').pipe(tsProject());

  return tsResult.js.pipe(dest("dist"));
}

function clean() {
  return del(__dirname + "/dist", {force: true});
}

function build_demo() {
  return src("examples/demo/main.js").pipe(webpack(config.demo)).pipe(dest("examples/demo/dist/"));
}

function clean_demo() {
  return del(__dirname + "/examples/demo/dist", {force: true});
}

exports.lint = lint;
exports.lintfix = lintfix;
exports.test = series(test_basic, test_socket);
exports.default = series(exports.lint, build, exports.test);
exports.build = build;
exports.clean = clean;
exports["build-demo"] = build_demo;
exports["clean-demo"] = clean_demo;