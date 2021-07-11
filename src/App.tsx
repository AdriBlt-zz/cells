import * as React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { HashRouter, Route, Switch } from "react-router-dom";

import { appMenu, Category, Menu, Page } from "./Menu";

class App extends React.Component {
  public render() {
    return (
      <HashRouter hashType="noslash">
        {this.renderMenu(appMenu)}
        {this.renderRoute(appMenu)}
      </HashRouter>
    );
  }

  private renderMenu(menu: Menu): JSX.Element {
    return (
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href={'#' + menu.route}>{menu.name}</Navbar.Brand>
        <Nav className="mr-auto">
          {menu.categories.map((category: Category) => (
            <NavDropdown
              key={category.name}
              id={category.name}
              title={category.name}
            >
              {category.pages.map((page: Page) => (
                <NavDropdown.Item
                  key={page.route}
                  href={'#' + page.route}
                >
                  {page.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ))}
        </Nav>
      </Navbar>
    );
  }

  private renderRoute(menu: Menu): JSX.Element {
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
}

const Home = () => (<div/>);

export default App;
