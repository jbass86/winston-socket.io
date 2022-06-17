// @ts-nocheck

import React from "react"; // eslint-disable-line no-unused-vars
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, makeStyles } from '@material-ui/core';
import BrushIcon from '@material-ui/icons/Brush';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import FontDownloadIcon from '@material-ui/icons/FontDownload';

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiPaper-root": {
      "min-width": "350px",
      "overflow-x": "hidden"
    }
  },
  header: {
    "& span": {
      "font-size": "28px",
      "font-weight": "bold"
    }
  },
  listitem: {
    "& span": {
      "font-size": "22px",
    }
  }
}));

function SlideMenu(props) {

  const classes = useStyles();
  
  return(
    <Drawer className={classes.root} open={props.open} onClose={props.onClose}>
      <List>
        <ListItem>
          <ListItemText className={classes.header} primary="Navigation"></ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => props.onEvent("theme")}>
          <ListItemIcon><BrushIcon /></ListItemIcon>
          <ListItemText className={classes.listitem} primary={props.theme === "light" ? "Light Theme" : "Dark Theme"}></ListItemText>
        </ListItem>
        <ListItem button onClick={() => props.onEvent("clear")}>
          <ListItemIcon><LayersClearIcon /></ListItemIcon>
          <ListItemText className={classes.listitem} primary="Clear"></ListItemText>
        </ListItem>
        <ListItem button onClick={() => props.onEvent("casesensitive")}>
          <ListItemIcon><FontDownloadIcon /></ListItemIcon>
          <ListItemText className={classes.listitem} primary={props.casesensitive ? "Case Sensitive" : "Case Insensitive"}></ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SlideMenu;