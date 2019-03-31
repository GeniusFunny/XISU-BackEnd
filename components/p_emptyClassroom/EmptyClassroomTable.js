import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'


const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}

class EmptyClassroomTable extends Component {
  constructor(props) {
    super(props)
    const { afternoonItems = [], nightItems = [] } = props
    this.data = afternoonItems.concat(nightItems).filter(item => item.size >= 30)
  }
  render() {
    return (
      <Paper style={styles.root}>
        <Table style={styles.table}>
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
            {this.data.map(row => (
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
    )
  }
}
export default EmptyClassroomTable
