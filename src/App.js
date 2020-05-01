import React, { useState } from 'react'
import clsx from 'clsx'
import FaxInput from './components/FaxInput'
import ChobaInput from './components/ChobaInput'

// ReactRouter
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom'

// Material-UI
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import InputIcon from '@material-ui/icons/Input'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import { makeStyles, useTheme } from '@material-ui/core/styles'

// Apollo-Client
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo-hooks'

// スタイル
const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
    color: '#000000',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

const PersistentDrawerLeft = () => {

  // キャッシュ
  const cache = new InMemoryCache()

  // GraphQLのエンドポイント
  const httpLink = new HttpLink({
    uri: 'https://daiei-apollo-one.now.sh/',
  })

  // Apollo-Clientの設定
  const client = new ApolloClient({
    link: httpLink,
    cache,
  })

  // スタイル・テーマ
  const classes = useStyles()
  const theme = useTheme()

  // Hooks
  const [open, setOpen] = useState(false)

  // Drawer開閉
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                大京サンプル
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <Link to="fax-input" className={classes.link}>
                <ListItem button key="FAX Input">
                  <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                  <ListItemText primary="FAX見ながら登録" />
                </ListItem>
              </Link>
              <Link to="choba-input" className={classes.link}>
                <ListItem button key="Choba Input">
                  <ListItemIcon><InputIcon /></ListItemIcon>
                  <ListItemText primary="帳場での受注登録" />
                </ListItem>
              </Link>
            </List>
          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <Switch>
              <Route exact path="/" component={FaxInput} />
              <Route path="/fax-input" component={FaxInput} />
              <Route path="/choba-input" component={ChobaInput} />
              <Redirect to="/" />
            </Switch>
          </main>
        </BrowserRouter>
      </ApolloProvider>
    </div>
  )
}

export default PersistentDrawerLeft