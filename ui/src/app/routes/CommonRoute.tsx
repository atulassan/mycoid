import * as React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import {Header, Footer} from '../components'

interface IProps {
  exact?: boolean;
  isAuthenticated?: boolean | null;
  path: string;
  component: React.ComponentType<any>;
}

const CommonRoute = ({
  component: Component,
  isAuthenticated,
  ...otherProps
}: IProps) => {
  // const history = useHistory()
  // if (isAuthenticated === false) {
  //   history.push("/login");
  //  // alert("this is a logged in route, you are logged out, redirected to log in");
  // }

  return (
    <>
       <Header />
      <Route
        render={otherProps => (
          <>
            <Component {...otherProps} />
          </>
        )}
      />
       <Footer />
      <footer>
        Logged In Footer
      </footer>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isLoggedIn
});

export default connect(
  mapStateToProps
)(CommonRoute);
