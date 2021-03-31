import * as React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { appMenu, Category, Menu, Page } from "./Menu";

class App extends React.Component {
  public render() {
    return (
      <div>
        {this.renderMenu(appMenu)}
        {this.renderRoute(appMenu)}
      </div>
    );
  }

  private renderMenu(menu: Menu): JSX.Element {
    return (
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/home">{menu.name}</Navbar.Brand>
        <Nav className="mr-auto">
          {menu.categories.map((category: Category) => (
            <NavDropdown
              key={category.name}
              id={category.name}
              title={category.name}
            >
              {category.pages.map((page: Page) => (
                <NavDropdown.Item key={page.route} href={page.route}>
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
    const allPages: Page[] = ([] as Page[]).concat(
      ...menu.categories.map((category: Category) => category.pages)
    );
    return (
      <BrowserRouter>
        <Switch>
          {allPages.map((page: Page) => (
            <Route
              key={page.route}
              path={page.route}
              render={(props) => page.component}
            />
          ))}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
