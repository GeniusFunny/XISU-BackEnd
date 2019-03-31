import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

function SimpleTable(props) {
  const { classes, afternoonItems, nightItems } = props
  const data = afternoonItems.concat(nightItems).filter(item => item.size >= 30)
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>日期</TableCell>
            <TableCell align="right">空闲时段</TableCell>
            <TableCell align="right">教室</TableCell>
            <TableCell align="right">类型</TableCell>
            <TableCell align="right">容量</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.time + row.roomName}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.roomName}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(SimpleTable)
