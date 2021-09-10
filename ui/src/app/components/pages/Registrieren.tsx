import React, { Component } from 'react';
//import Header from './Header';
// import Login from './Login';
import RegistrierenForm from '../shared/Modules/RegistrierenForm';

export class Registrieren extends Component<any, any> {
    render() {
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
                                  <h3 className="sec_title inner_head_padding">Jetzt anmelden</h3>
                                </div>
                             <RegistrierenForm />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
            )
    }

}
export default Registrieren