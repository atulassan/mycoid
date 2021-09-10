import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RegistrierenForm from "../shared/Modules/RegistrierenForm"
//import { HashLink } from 'react-router-hash-link';
//import RegistrierenForm from './RegistrierenForm';
//import Header from './Header';
//import Footer from './Footer';


export class Home extends Component{
    render(){
        return(
            <div>
            
               
                    <section id="section01" className="section-md section ">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 my-auto">
                            <h3 className="sec_title">Gästedaten Digital Per <span> Qr-Code Erfassen</span></h3>
                            <span className="sec_line" />
                            <p className="title-content">Contact-Tracing (COVID-19 Schutzkonzept): Kontaktdatenerfassung leicht gemacht für Handel und Gastro.</p>
                            <p className="mt-3">
                              {/* <HashLink to="#section07" className="btn btn-success btn-rounded">Link to Top of Page</HashLink> */}
                            </p>
                            <div className="storeIcons">
                              <ul>
                                <li><Link to="#"><img className="img-fluid" src="assets/images/playstore.png" alt="playstore" /></Link></li>
                                <li><Link to="#"><img className="img-fluid" src="assets/images/appstore.png" alt="appstore" /></Link></li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 my-auto">
                            <img className="img-fluid" src="assets/images/Qr-Code.png" alt="Qr-Code" />
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section02" className="section-md section home-card">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 text-center">
                            <h3 className="sec_title">Erhalten Sie Ihren Qr-Code <span>Self Check-in für Ihre Gäste!</span></h3>
                          </div>
                          <div className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <div className="card">
                                  <div className="card-body">
                                    <img className="card-img-top" src="/assets/images/coronavirus1.jpg" alt="coronavirus1" />
                                    <h5 className="card-title"> 1. Registration </h5>
                                    <p className="card-text">Registrieren Sie Ihren Betrieb.</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-4">
                                <div className="card">
                                  <div className="card-body">
                                    <img className="card-img-top" src="/assets/images/coronavirus2.jpg" alt="coronavirus2" />
                                    <h5 className="card-title">  2. Ausdrucken </h5>
                                    <p className="card-text">Drucken Sie den zugestellten QR-Code so oft aus wie notwendig.</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-4">
                                <div className="card">
                                  <div className="card-body">
                                    <img className="card-img-top" src="assets/images/coronavirus3.jpg" alt="coronavirus3" />
                                    <h5 className="card-title">  3. Positionieren </h5>
                                    <p className="card-text">Platzieren Sie die Blätter auf Ihre Tische und schon können sich Ihre Gäste registrieren. </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section03" className="section-md section">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 my-auto">
                            <img className="img-fluid" src="assets/images/Contact-Tracing.png" alt="Contact-Tracing" />
                          </div>
                          <div className="col-lg-6 col-md-6 my-auto">
                            <h3 className="sec_title">Effizientes und sicheres  <span> Contact-Tracing</span></h3>
                            <p className="title-content">Mycoid unterstützt Restaurants, Bars, Cafés, Hotels, Clubs, Diskotheken, Bäckereien und auch bei einmaligen Veranstaltungen in der Umsetzung des COVID-19 Schutzkonzeptes.</p>
                            <p className="title-content">Ziel ist es, dass die Daten bei Bedarf an die Gesundheitsbehörden zugestellt werden, um das Contact-Tracing zu ermöglichen.</p>
                            <p className="title-content">Die Besucher scannen einen QR-Code oder über den APP, der sich entweder am Eingang oder auf dem Tisch befindet und registrieren sich anschliessend. Für Sie als Betriebsleiter hat es sich schon erledigt.</p>
                            <p className="title-content">Von uns erhalten Sie den Zugang zu den Daten, welche rechtskonform und gemäss aktuellsten Datenschutz­anweisungen bei uns aufbewahrt werden (14 Tage lang).</p>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section04" className="section-md section ">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 my-auto">
                            <h3 className="sec_title"> Für <span>Restaurants</span> </h3>
                            <span className="sec_line" />
                            <p className="title-content">Beim Eingang</p>
                            <ul className="homeList">
                              <li>Besucher erfassen sich selbst</li>
                              <li>Sicherheitsgefühl wird übermittelt</li>
                              <li>Hygenischer als Stift &amp; Papier</li>
                              <li>kontaktlos mit dem eigenen Handy</li>
                              <li>Ohne App-Download</li>
                            </ul>
                          </div>
                          <div className="col-lg-6 col-md-6 my-auto">
                            <img className="img-fluid" src="assets/images/enterance.png" alt="enterance" />
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section05" className="section-md section ">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 my-auto text-left">
                            <img className="img-fluid" src="assets/images/Restaurants.png" alt="Restaurants" />
                          </div>
                          <div className="col-lg-6 col-md-6 my-auto">
                            <h3 className="sec_title"> Für <span>Restaurants</span> </h3>
                            <span className="sec_line" />
                            <p className="title-content">Auf jedem Tisch</p>
                            <ul className="homeList">
                              <li>Bequem für den Gast</li>
                              <li>Kein Mitarbeiteraufwand</li>
                              <li>Jeder Gast kann sich am Tisch registrieren</li>
                              <li>Bestätigung per E-Mail zur Kontrolle.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section06" className="section-md section ">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 my-auto">
                            <h3 className="sec_title"> Für <span>Clubs</span> </h3>
                            <span className="sec_line" />
                            <p className="title-content">Beim Ein- und Ausgang</p>
                            <ul className="homeList">
                              <li>Kontrolle über die Anzahl Gäste</li>
                              <li>Genaue Aufenthaltsdauer nachvollziehbar</li>
                              <li>Überprüfung der Besucher in Echtzeit</li>
                              <li>Behördliche Anforderungen einhalten</li>
                            </ul>
                          </div>
                          <div className="col-lg-6 col-md-6 my-auto">
                            <img className="img-fluid" src="assets/images/Clubs.png" alt="Clubs" />
                          </div>
                        </div>
                      </div>
                    </section>
                    <section id="section07" className="section-md section">
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-xl-10 col-lg-10">
                              <div className="text-center mb-3">
                                <h3 className="sec_title">Jetzt  anmelden<span> </span></h3>
                                <p className="title-content">Jetzt anmelden und bereits in wenigen Stunden den QR-Code erhalten.</p>
                              </div>
                            <div className="form-page homeContact">
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
export default Home
