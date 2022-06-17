// @ts-nocheck

import log from "./Logger";

import React from "react"; // eslint-disable-line no-unused-vars
import { Card, TextField, makeStyles, Table, TableBody, TableRow, TableCell, IconButton, InputAdornment } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(() => ({
  root: {
    overflow: "visible",
    position: "relative",
    "margin-top": "20px",
    "margin-bottom": "20px",
    "margin-left": "auto",
    "margin-right": "auto",
    width: "85%",
    '& > form': {
      margin: "auto",
      "margin-bottom": "10px",
      width: '95%',
    },
  },
  text: {
    width: "100%",
    margin: "auto",
    "margin-top": "15px"
  },
  table: {
    width: "80%",
    margin: "auto"
  },
  closebutton: {
    position: "absolute",
    top: "-24px",
    right: "-23px"
  }
}));

function Counter(props) {

  log.info("Render Counter Component");
  const classes = useStyles();
  
  const map = {};
  for (let pos in props.value) {
    let char = props.casesensitive ? props.value[pos] : props.value[pos].toUpperCase();
    if (char !== ' ') {
      Number.isFinite(map[char]) ? map[char]++ : map[char] = 1;
    }
  }

  const numCols = props.numCols || 6;
  const letters = Object.keys(map).sort();
  const rows = Math.round(letters.length / numCols) + 1;

  const rowArr = new Array(rows).fill(true);
  const colArr = new Array(numCols).fill(true);

  return (
    <Card className={classes.root}>
      <IconButton className={classes.closebutton} onClick={() => props.handleClose()}>
        <CloseIcon />
      </IconButton>
      <form noValidate autoComplete="off">
        <TextField className={classes.text} 
          label="Enter Text" value={props.value} 
          onChange={(ev) => props.handleChange(ev.target.value)} 
          InputProps={{
            endAdornment:  
            <InputAdornment position="end">
              <IconButton
                onClick={() => props.handleChange("")}
                edge="end"
              >
                {<CancelIcon />}
              </IconButton>
            </InputAdornment>
          }} 
        />  
         
      </form>
      <Table>
        <TableBody>
          {
            rowArr.map((value, rowIndex) => {
              return (
                <TableRow key={`row${rowIndex}`}>
                  {
                    colArr.map((value, colIndex) => {
                      const letter = letters[(rowIndex * numCols) + colIndex];
                      if (letter) {
                        return (
                          <TableCell key={`col${rowIndex}-${colIndex}`} align="center">
                            <b>{`${letter} : `}</b>{map[letter]}
                            </TableCell>
                        );
                      } else {
                        return <TableCell key={`col${rowIndex}-${colIndex}`} align="center" />
                      }
                    })
                  }
                </TableRow>   
              );
            })
          }   
        </TableBody>
      </Table>
    </Card>
  );
}

export default Counter;