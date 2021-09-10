import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData } from '../../services/main-service';
//import queryString from 'query-string';
// import Header1 from './Header1';

export class Besucherview extends Component<any, any>{

  state = {
    loading: true,
    visitor: {},
  }

  componentDidMount() {
    this.setState({loading: true,});
    this.fetchItems();
  }

  async fetchItems() {
    //const queryValues = queryString.parse(this.props.location.search);
    //console.log(queryValues);
    const { id } =  this.props.match.params;
    let visitor:any = await getData(`/visitor/${id}`);
    console.log(visitor);
    this.setState({loading: false, visitor: visitor.data.response})
  }

    render() {

      const { loading, visitor }:any = this.state;

      console.log(visitor);

        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="form-page">
                          { loading ? <p>Loading...</p> : 
                           visitor ? 
                            <form>
                              <div className="row">
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>BesucherID</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.visitorId}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Vorname</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.firstName}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Nachname</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.lastName}
                                    </p></div>
                                </div>
                                <div className="col-lg-12 col-md-12 text-left">
                                  <label>Strasse Nr.</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.address}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>PLZ</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.postcode}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Ort</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.city}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Kanton</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.place}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Land</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.country}</p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 text-left">
                                  <label>Mobilenummer</label>
                                  <div className="form-group">
                                    <p className="form-control">{visitor.mycoidCustomer.mobile}</p>
                                  </div>
                                </div>
                                {/* <div className="col-lg-4 col-md-4 text-left">
                                  <label>Geburtsdatum</label>
                                  <div className="form-group">
                                    <p className="form-control">27.08.2020</p>
                                  </div>
                                </div> */ }
                                <div className="col-md-12 my-auto text-left">
                                  <div className="form-group btn-groups">
                                    <Link className="btn btn-primary btn-rounded" to="/besucher">zurück</Link>
                                  </div>
                                </div>
                              </div>
                            </form>
                            : <p>Not Found</p>
                           }
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

            </div>
        )
    }
}
export default Besucherview
