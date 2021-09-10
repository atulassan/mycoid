import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
// import Header1 from './Header1';

export class Myprofiledit extends Component{

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
                                    <img className="img-fluid" src="/assets/images/1.jpg" alt="profile" />
                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-8 text-left">
                                  <div className="row">
                                    <div className="col-lg-12 col-md-12 text-left">
                                      <label>Kontaktperson</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Manager" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Nachname</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Sar" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Vorname</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Ravindran" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Position</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="CEO" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Telefon</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="+41 78 752 33 15" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>E-Mail</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="sar@one-ix.ch" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Firmenname</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="memoria" />
                                      </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 text-left">
                                      <label>Strasse Nr.</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Rosenweg 12" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 mt-4">
                                  <div className="row">
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>PLZ</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue={4452} />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Ort</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Itingen" />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Kanton</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Swiss" />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Land</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="Schweiz" />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Web</label>
                                      <div className="form-group">
                                        <input type="text" className="form-control" defaultValue="www.one-ix.ch" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12 my-auto text-left">
                                  <div className="form-group btn-groups">
                                    <Link className="btn btn-primary btn-rounded" to="myprofil">zurück</Link>
                                    <Link className="btn btn-success btn-rounded" to="myprofil">spicheren</Link>
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
export default Myprofiledit
