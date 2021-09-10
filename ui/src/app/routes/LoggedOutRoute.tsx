import * as React from "react";
import { connect } from "react-redux";
import { Route, useHistory } from "react-router-dom";


import { Header, Footer } from '../components'
import Alert from '../components/shared/Modules/Alert'
import { Login } from "app/components/pages/Login";
interface IProps {
  exact?: boolean;
  isAuthenticated?: boolean | null;
  path: string;
  messages?: any;
  component: React.ComponentType<any>;
}

const LoggedOutRoute = ({
  component: Component,
  isAuthenticated,
  messages,
  ...otherProps
}: IProps) => {
  const history = useHistory()
  if (isAuthenticated === true) {
    history.push("/myprofil");
    //alert("this is a logged out route, you are logged in, redirected to home page");
  }

  const loadAlert = () => {
    console.log('messagesmessages', messages)
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
      <Header isAuthenticated={isAuthenticated}  {...otherProps} />
      <Login  {...otherProps} />
      <Route  {...otherProps}
        render={otherProps => (
          <>

            <Component {...otherProps} />
          </>
        )}
      />
      <Footer />
      {/* <footer>
        Logged Out Footer
      </footer> */}
    </>
  );
};

const mapStateToProps = (state: any) => {
  // console.log('logout', state)
  return {
    isAuthenticated: state.auth.isLoggedIn,
    messages: state.messages
  }
};

export default connect(
  mapStateToProps
)(LoggedOutRoute);