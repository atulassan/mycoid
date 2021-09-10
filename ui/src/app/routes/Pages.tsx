import * as React from "react";
//import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

//import About from "../components/pages/About";
import Home from "../components/pages/Home";
//import Landing from "../components/pages/Landing";
//import Login from "../components/pages/Login";
import Registrieren from "../components/pages/Registrieren";
import NotFound from "../components/pages/NotFound";
import Uberuns from "../components/pages/Uberuns";
import Benutzer from "../components/pages/Benutzer";
import Benutzeradd from "../components/pages/Benutzeradd";
import Besucher from "../components/pages/Besucher";
import FilialeBesucher from "../components/pages/FilialeBesucher";
import Besucheredit from "../components/pages/Besucheredit";
import Besucherview from "../components/pages/Besucherview";
import Filiale from "../components/pages/Filiale";
import Filialeadd from "../components/pages/Filialeadd";
import Filialedetail from "../components/pages/Filialedetail";
import Filialeedit from "../components/pages/Filialeedit";
import Geschichte from "../components/pages/Geschichte";
import Geschichteview from "../components/pages/Geschichteview";
import Kontakt from "../components/pages/Kontakt";
import Mittellungen from "../components/pages/Mittellungen";
import Myprofil from "../components/pages/Myprofil";
import Myprofiledit from "../components/pages/Myprofiledit";
import PasswortEmail from "../components/pages/PasswortEmail";
import PasswortReset from "../components/pages/PasswortReset";
import PasswotVergessen from "../components/pages/PasswotVergessen";
import ForgetPassword from "../components/pages/ForgetPassword";
import Benutzeredit from "../components/pages/Benutzeredit";
import ChangePassword from "../components/pages/ChangePassword";

import LoggedInRoute from "../routes/LoggedInRoute";
import LoggedOutRoute from "../routes/LoggedOutRoute";

// import CommonRoute from "../routes/LoggedOutRoute";

const Pages = () => {
  return (
    <Switch>
      {/* <LoggedOutRoute path="/" exact={true} component={Landing} />
    <LoggedOutRoute path="/about" exact={true} component={About} /> */}
      <LoggedOutRoute path="/" exact={true} component={Home} />
      <LoggedOutRoute path="/registerien" exact={true} component={Registrieren} />
      <LoggedOutRoute path="/passwortemail/:email" exact={true} component={PasswortEmail} />
      <LoggedOutRoute path="/verify-token/:token" exact={true} component={PasswortReset} />
      <LoggedOutRoute path="/passwotvergessen" exact={true} component={PasswotVergessen} />
      <LoggedOutRoute path="/reset_password/:forgetToken" exact={true} component={ForgetPassword} />
      <LoggedOutRoute path="/uber-uns" exact={true} component={Uberuns} />
      <LoggedOutRoute path="/Kontakt" exact={true} component={Kontakt} />
      
      <LoggedInRoute pageTitle={{title:"Home",icon:'layers'}} path="/home" exact={true} component={Home} />
      <LoggedInRoute pageTitle={{title:"Benutzer",icon:'users'}} path="/benutzer" exact={true} component={Benutzer} />
      <LoggedInRoute pageTitle={{title:"Benutzer hinzufügen" ,icon:'users'}} path="/benutzeradd" exact={true} component={Benutzeradd} />
      <LoggedInRoute pageTitle={{title:"Besucher" ,icon:'layers'}} path="/besucher" exact={true} component={Besucher} />
      <LoggedInRoute pageTitle={{title:"Filiale Besucher" ,icon:'layers'}} path="/filialebesucher/:id" exact={true} component={FilialeBesucher} />
      <LoggedInRoute pageTitle={{title:"besucher Edit" ,icon:'layers'}} path="/besucheredit" exact={true} component={Besucheredit} />
      <LoggedInRoute pageTitle={{title:"besucher View" ,icon:'layers'}} path="/besucherview/:id" component={Besucherview} />
      <LoggedInRoute pageTitle={{title:"Filiale" ,icon:'chart-bars'}} path="/filiale" exact={true} component={Filiale} />
      <LoggedInRoute pageTitle={{title:"Filiale hinzufügen" ,icon:'chart-bars'}} path="/filialeadd" exact={true} component={Filialeadd} />
      <LoggedInRoute pageTitle={{title:"Filiale Edit" ,icon:'chart-bars'}} path="/filialedetail/:id" exact={true} component={Filialedetail} />
      <LoggedInRoute pageTitle={{title:"Filiale Edit" ,icon:'chart-bars'}} path="/filialeedit" exact={true} component={Filialeedit} />
      <LoggedInRoute pageTitle={{title:"Geschichte" ,icon:'history'}} path="/geschichte" exact={true} component={Geschichte} />
      <LoggedInRoute pageTitle={{title:"Geschichteview" ,icon:'history'}} path="/geschichteview/:id" exact={true} component={Geschichteview} />
      <LoggedInRoute pageTitle={{title:"Passwort ändern",icon:'cog'}} path="/passwortandern" exact={true} component={ChangePassword} />
     
      <LoggedInRoute pageTitle={{title:"mittellungen",icon:'bubble'}} path="/mittellungen" exact={true} component={Mittellungen} />
      <LoggedInRoute pageTitle={{title:"My profile",icon:'user'}}  path="/myprofil" exact={true} component={Myprofil} />
      <LoggedInRoute pageTitle={{title:"My profile user" ,icon:'user'}} path="/myprofiledit" exact={true} component={Myprofiledit} />     
      <LoggedInRoute pageTitle={{title:"Benutzer Edit" ,icon:'users'}} path="/benutzeredit/:id" component={Benutzeredit} />
     
      <Route component={NotFound} />
    </Switch>
  );
};

export default Pages;
