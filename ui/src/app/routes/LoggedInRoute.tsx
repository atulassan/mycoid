import * as React from "react";
import { connect } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import Alert from '../components/shared/Modules/Alert'
import { Header } from '../components'

interface IProps {
  exact?: boolean;
  isAuthenticated?: boolean | null;
  user?:{};
  pageTitle?:any;
  path: string;
  messages?: any;
  component: React.ComponentType<any>;
}

const LoggedInRoute = ({
  component: Component,
  isAuthenticated,
  messages,
  user,
  pageTitle,
  ...otherProps
}: IProps) => {
  const history = useHistory()
  if (isAuthenticated === false) {
    history.push("/");
    // alert("this is a logged in route, you are logged out, redirected to log in");
  }
  const loadAlert = () => {
    if (typeof messages.message === 'string')
      return (<Alert {...otherProps} variant={messages.variant} show={messages.show} message={messages.message} />)
    else {
      const listItems = messages.message.map((msg: any, id: any) => <Alert {...otherProps} key={id} variant={messages.variant} show={messages.show} message={msg} />);
      return listItems;
    }

  }

  return (
    <>
      {loadAlert()}
      <Header pageTitle={pageTitle} isAuthenticated={isAuthenticated} user={user} {...otherProps} />
      <Route  {...otherProps}
        render={otherProps => (
          <>
            <Component {...otherProps} />
          </>
        )}
      />
      {/* <Footer />
       <footer>
        Logged In Footer
      </footer> */}
    </>
  );
};

const mapStateToProps = (state: any) => {
  console.log('loggedin', state)
  return {
    isAuthenticated: state.auth.isLoggedIn,
    messages: state.messages,
    user:state.auth.user
  }
};

export default connect(
  mapStateToProps
)(LoggedInRoute);
