// @ts-nocheck

import "./style.css";

import log from "./Logger";

import React from "react";  // eslint-disable-line no-unused-vars
import ReactDom from "react-dom";
import AppMenu from "./AppMenu";
import Counter from "./Counter";
import SlideMenu from "./SlideMenu";
import { Box } from "@material-ui/core";
import { MuiThemeProvider, createTheme, styled } from "@material-ui/core/styles";

const darkTheme = createTheme({
  typography: {
    useNexVariant: true
  },
  palette: {
    type: "dark",
  }
});

const lightTheme = createTheme({
  typography: {
    useNexVariant: true
  }
});

const StyledBox = styled(Box)({
  "background": props => props.theme ? props.theme.palette.background.default : "white",
  padding: "25px",
  "min-height": "calc(100% - 114px)"
});

let Main = class MainApp extends React.Component {

  constructor() {
    
    super();
    log.info("Contruct Main React Component");

    const theme = localStorage.getItem("lettercounter-theme") || "light";
    const casesensitive = localStorage.getItem("lettercounter-casesensitive") === "true";
    const counterStorage = localStorage.getItem("lettercounter-counters");
    let counters = [""];
    try {
      const counterData = JSON.parse(counterStorage);
      if (counterData && Array.isArray(counterData)) {
        counters = counterData;
      }
    } catch(err) {
      console.error("couldnt parse local storage for counters...", err);
    }
    this.state = {menuOpen: false, theme: theme, counters: counters, casesensitive: casesensitive};

    setInterval(() => {
      localStorage.setItem("lettercounter-theme", this.state.theme);
      localStorage.setItem("lettercounter-casesensitive", this.state.casesensitive);
      localStorage.setItem("lettercounter-counters", JSON.stringify(this.state.counters));
    }, 2000);
  }

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme === "dark" ? darkTheme : lightTheme}>
        <AppMenu add={this.addCounter.bind(this)} menuClicked={() => this.setState({menuOpen: true})}/>
        <SlideMenu open={this.state.menuOpen} onClose={() => this.setState({menuOpen: false})} theme={this.state.theme} casesensitive={this.state.casesensitive} onEvent={this.handleMenuEvent.bind(this)}/>
        <StyledBox theme={this.state.theme === "dark" ? darkTheme : lightTheme}>{this.renderCounters()}</StyledBox>
      </MuiThemeProvider>
    );
  }

  renderCounters() {
    return (
      this.state.counters.map((value, index) => {
        return (
          <Counter key={index} value={value} casesensitive={this.state.casesensitive} handleChange={this.handleChange.bind(this, index)} handleClose={this.handleClose.bind(this, index)}></Counter>
        );  
      })        
    );
  }

  handleChange(index, value) {
    log.info("Letter was typed " + value);
    const counters = [...this.state.counters];
    counters[index] = value;
    this.setState({counters: counters});
  }

  handleClose(index) {
    log.warn("One of the text boxes was closed");
    const counters = [...this.state.counters];
    if (counters.length > 1) {
      counters.splice(index, 1);
      this.setState({counters: counters});
    }
  }

  handleMenuEvent(event) {

    log.info("menu event: " + event);
    if (event === "theme") {
      this.setState({theme: this.state.theme === "light" ? "dark" : "light"});
    }
    if (event === "clear") {
      this.setState({counters: [""]});
    }
    if (event === "casesensitive") {
      this.setState({casesensitive: !this.state.casesensitive});
    }
  }

  addCounter() {
    log.warn("Add a letter counter");
    const counters = [...this.state.counters];
    counters.push("");
    this.setState({counters: counters});
  }
}

window.onload = function () {
  log.error("Load Window Mount React Component");
  ReactDom.render(<Main />, document.body.appendChild(document.createElement("div")));
};
