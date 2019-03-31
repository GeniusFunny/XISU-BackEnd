import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'

const styles = {
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }
}

function SearchAppBar() {
  return (
    <div style={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton style={styles.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            今日空闲教室
          </Typography>
          <div style={styles.grow} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default SearchAppBar
