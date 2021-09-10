import React, { Component } from 'react';
//import { TodoTextInput } from '../TodoTextInput';
// import { TodoActions } from 'app/actions/todos';
import { Link, NavLink } from 'react-router-dom';
// import { connect } from 'react-redux';
//import $ from "jquery";

import { logout } from "../../../actions/auth";

// interface IProps {
//   isAuthenticated?: boolean | null;
// }


//export const Header = (props:any) => {
  // const handleSave = React.useCallback(
  //   (text: string) => {
  //     if (text.length) addTodo({ text });
  //   },
  //   [addTodo]
  // );
  //const tmp=$('body');

  export class Header extends Component<any,any>{
    constructor(props:any) {
      super(props);
      console.log('dddd',this.props)
      //const  t  = useTranslation();
     // console.log('tttt',this.props.t())
      // this.state={t};
    }
    logout(){
      console.log('test');
      this.props.dispatch(logout());
    }

  
  loggedInHeader() {
   //const {user}=this.props.auth;
    return (
      
      <div className="top-header">
        <div className="container-fluid">
          <ul>
            <li className="dash-logo">
              <Link to="/"><img src="/assets/images/logo-admin.png" alt="logo" title="myCoid" /></Link>
            </li>
            <li className="menu_header">
              <i className={"lnr-"+this.props.pageTitle?.icon} /> {this.props.pageTitle?.title}
                      </li>
            <li className="dropMenu">
              <ul>
                <li>
                  <div className="locale-flag"> <img src="/assets/images/svg/user-w.svg" alt="user" /></div>
                </li>
                <li className="dropdown">
                  <div className="dropdown-toggle" data-toggle="dropdown"><i>{this.props.user?.firstName} {this.props.user?.lastName}</i> <b className="caret" /></div>
                  <ul className="dropdown-menu">
                    <li><Link to="/passwortandern"><i className="lnr-lock" />Passwort ändern</Link></li>
                    <li><Link to="#" onClick={()=>{this.logout()}}><i className="lnr-lock" />Ausloggen</Link></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    )
  }
   loggedOutHeader() {
    return (
      <div className="container-fluid">

        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="" className="navbar-brand"><img src="/assets/images/logo.png" alt="logo" title="myCoid" /></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse " id="navbarNavDropdown">
            <ul className="navbar-nav mr-auto">
            </ul>
            <ul className="navbar-nav ">
              <li className="nav-item">
                <NavLink to="/" exact className="nav-link" >Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/uber-uns" exact className="nav-link">Über uns</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/kontakt" exact className="nav-link">Kontakt</NavLink>
              </li>
              <li className="nav-item">
                <div className="nav-link OpenLogin" ><img src="/assets/images/svg/user.svg" alt="user" />Login</div>
              </li>
              {/*<li className="nav-item dropdown">
                <div className="nav-link dropdown-toggle" data-toggle="dropdown">
                    <img src="assets/images/svg/user.svg" alt="user" /> Sarankan <b className="caret" />
                </div>
                <ul className="dropdown-menu">
                  <li><Link to=""><i className="lnr-user" />Profil</Link></li>
                  <li><Link to=""><i className="lnr-book" />Bestellungen</Link></li>
                  <li className="divider" />
                  <li><Link to=""><i className="lnr-lock" />Ausloggen</Link></li>
                </ul>
            </li>*/}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
  render() {return (
    // <header>
    //   <h1>Todos</h1>
    //   <TodoTextInput newTodo onSave={handleSave} placeholder="What needs to be done?" />
    // </header>
    <header className="header">
      {this.props.isAuthenticated ? this.loggedInHeader(): this.loggedOutHeader()}
    </header>
  );
  }
};



export default Header;
