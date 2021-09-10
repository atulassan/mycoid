import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
// import Header1 from './Header1';

export class Besucheredit extends Component{

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
                                  <label>BesucherID</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="001"/>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Vorname</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Sar" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Nachname</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Ravindran" />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 text-left">
                                  <label>Strasse Nr.</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Rosenweg 12" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>PLZ</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder='4452' />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Ort</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Itingen" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Kanton</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Swiss" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Land</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Schweiz" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Mobilenummer</label>
                                  <div className="form-group">
                                    <input type="text" className="form-control" placeholder="+41 78 752 33 15" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Geburtsdatum</label>
                                  <div className="form-group">
                                    <input type="date" className="form-control" placeholder="27.08.2020" />
                                  </div>
                                </div>
                                <div className="col-md-12 my-auto text-left">
                                  <div className="form-group btn-groups">
                                    <Link className="btn btn-primary btn-rounded" to="besucher">zurück</Link>
                                    <Link className="btn btn-success btn-rounded" to="besucher">speichern</Link></div>
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
export default Besucheredit
