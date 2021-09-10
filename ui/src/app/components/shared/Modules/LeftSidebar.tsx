import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class LeftSidebar extends Component {

    render() {
        return(
            <React.Fragment>
              <div className="left-sidebar sidebar-shadow">
                    <div className="left-sidebar-inner">
                      <ul className="vertical-nav-menu">
                        <li className="left-sidebar-heading">SPACE</li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/besucher" aria-expanded="true"><i className="metismenu-icon lnr-layers" />Besucher</NavLink>
                        </li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/mittellungen"><i className="metismenu-icon lnr-bubble" /> Mittellungen</NavLink>
                        </li>
                        <li className="left-sidebar-heading">Einstellungen</li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/myprofil"><i className="metismenu-icon lnr-user" />MyProfil</NavLink>
                        </li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/filiale"><i className="metismenu-icon lnr-chart-bars" />Filiale</NavLink>
                        </li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/benutzer"><i className="metismenu-icon lnr-users" /> Benutzer</NavLink>
                        </li>
                        <li>
                          <NavLink activeClassName="selected mm-active" to="/geschichte"><i className="metismenu-icon lnr-history" /> Verlauf</NavLink>
                        </li>
                        {/* <li>
                          <NavLink activeClassName="selected mm-active" to="/passwortandern"><i className="metismenu-icon lnr-cog" /> Passwort ändern</NavLink>
                        </li> */ }
                      </ul>

                      <div className="left-footer">
                        <ul>
                          <li><img src="assets/images/ix-logo.svg" alt="ix-logo" /> © one ix GmbH - 2020</li>
                        </ul>
                      </div>
                    </div>
                  </div>        
            </React.Fragment>
        )
    }
}

