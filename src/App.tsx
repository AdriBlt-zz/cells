import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";

import { appMenu, Category, Page } from "./Menu";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
  },
}));

export default function App() {
  return (
    <HashRouter hashType="noslash">
      {renderMenu()}
      {renderRoute()}
    </HashRouter>
  );
}

function renderMenu() {
  const classes = useStyles();
  const menu = appMenu;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link href={'#' + menu.route}>{menu.name}</Link>
          </Typography>
          {menu.categories.map((category: Category) => MenuCategory(category))}
        </Toolbar>
      </AppBar>
    </div>
  );
}

function MenuCategory(category: Category) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // tslint:disable-next-line:no-any
  const handleMenu = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div key={category.name}>
      <Button
        className={classes.title}
        onClick={handleMenu}
      >
        {category.name}
      </Button>
      <Menu
        id={category.name}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted={true}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {category.pages.map((page: Page) => (
          <MenuItem
            key={page.route}
          >
            <Link href={'#' + page.route}>{page.name}</Link>
          </MenuItem>
        ))}
      </Menu>
    </div >
  );
}

function renderRoute(): JSX.Element {
  const menu = appMenu;
  /* A <Switch> looks through its children <Route>s and
  renders the first one that matches the current URL. */
  return (
    <Switch>
      {menu.categories.map((category: Category) =>
        category.pages.map((page: Page) => (
          <Route
            key={page.route}
            path={'/' + page.route}
            render={() => page.component}
          />
        ))
      )}
      <Route key={menu.route} component={Home} />
    </Switch>
  );
}

const Home = () => (
  <div>
    <h1>Hello world!</h1>
  </div>
);
