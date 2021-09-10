import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
// import Header1 from './Header1';

export class Filialeedit extends Component{

    render(){
        return(
            <div>
                {/* <Header1 /> */}
                  <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="form-page">
                            <form>
                              <div className="row">
                                <div className="col-lg-4 col-md-4 text-left">
                                  <div className="filialeImg">
                                    <div className="uploadImg"><i className="lnr-cloud-upload" /></div>
                                    <img className="img-fluid" src="assets/images/1.jpg" alt="filiale" />
                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-8 text-left">
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Firmenname</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Strasse Nr.</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>PLZ</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Ort</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Kanton</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Land</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Web</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Guest Limt</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-12 col-md-12 text-left">
                                  <h3 className="sub_title"><i className="lnr-clock" /> Öffnungszeiten</h3>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Montag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Dienstag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Mittwoch</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Donnerstag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Freitag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Samstag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Sonntag</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" defaultValue='' />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12 text-left">
                                  <h3 className="sub_title"><i className="lnr-layers" /> Feiertage</h3>
                                  <div className="row">
                                    <div className="col-md-4">
                                      <input type="date" className="form-control" placeholder='' />
                                    </div>
                                    <div className="col-md-8">
                                      <div className="form-group">
                                        <div className="input-group">
                                          <input type="text" className="form-control" placeholder="Betreff" />
                                          <div className="input-group-append">
                                            <div className="input-group-text" ><i className="lnr-plus-circle" /> hinzufügen</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12 text-left">
                                  <h3 className="sub_title"><i className="lnr-layers" /> Ferien</h3>
                                  <div className="row">
                                    <div className="col-md-4">
                                      <input type="date" className="form-control" placeholder='' />
                                    </div>
                                    <div className="col-md-8">
                                      <div className="form-group">
                                        <div className="input-group">
                                          <input type="text" className="form-control" placeholder="Betreff" />
                                          <div className="input-group-append">
                                            <div className="input-group-text" ><i className="lnr-plus-circle" /> hinzufügen</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12 text-left">
                                  <div className="form-group btn-groups">
                                    <Link className="btn btn-primary btn-rounded" to="filiale">zurück</Link>
                                    <Link className="btn btn-success btn-rounded" to="filiale">spicheren</Link>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

            </div>
        )
    }
}
export default Filialeedit
