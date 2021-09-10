import React, { Component } from 'react';
import {  } from 'react-router-dom';
// import Login from './Login';

export class Uberuns extends Component{
    render(){
        return(
            <div>
              {/* <Login /> */}
              <div className="topBanner" />
              <section id="welcome">
                <div className="container">
                  <div className="row justify-content-md-center">
                    <div className="col-xl-10 col-lg-10">
                      <div className="form-page section-md">
                            <div className="text-center">
                              <h3 className="sec_title inner_head_padding">Über uns</h3>
                            </div>
                            <h4 className="sub_sec_title">Wir machen Digitales menschlich</h4>
                            <p>Wir sind eine inhabergeführte Digitalagentur in der Schweiz Sri lanka und in Indien mit 30 Mitarbeiterinnen und Mitarbeitern. Wir konzipieren, entwickeln und betreiben digitale Plattformen  für mittlere und grössere Unternehmen mit B2B- und B2C-Fokus.</p>
                            <p>Seit 2015 sind wir in der digitalen Welt unterwegs. Die Begeisterung für den Mehrwert des Digitalen verbindet unsere Expertinnen und Experten. </p>
                            <h4 className="sub_sec_title">Wir schaffen digitale Plattformen</h4>
                            <p>Wir sind überzeugt: Nur wenn Technologie und Benutzerbedürfnisse verschmelzen, entstehen nützliche Lösungen für Unternehmen und Benutzer: Die Erwartungen an digitale Touchpoints sind hoch – wir realisieren mit Ihnen digitale Projekte, die die Benutzer abholen, sie verstehen und sie auf ihrer Reise begleiten.</p>
                            <p>Alles immer auf Augenhöhe mit unseren Kunden und Partner. Denn nur gemeinsam erreichen wir unsere Ziele.</p>
                            <p>Neugierig geworden? Dann reden Sie mit uns. Wir freuen uns auf Sie.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* <footer className="fixed-footer">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 text-left">
                      <ul>
                        <li><img src="assets/images/ix-logo.svg" alt="" /> © one ix GmbH - 2020 </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </footer> */}
            </div>
        )
    }


}
export default Uberuns
