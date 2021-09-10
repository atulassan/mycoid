import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Login from './Login';

export class NotFound extends Component{
    render(){
        return(
                
                <div>
                    {/* <Header /> */}
                    {/* <Login /> */}
                    
                    <div className="topBanner" />
                    <section id="welcome" className=''>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-xl-6 col-lg-6 ">
                            <div className="form-page section-md">
                              <form>
                                <div className="row">
                                  <div className="row"><div className="col-lg-12 col-md-12 text-center">
                                      <h3 className="sec_title inner_head_padding">404 Not Found</h3>
                                      <Link to="home" className="link link-blue">Home</Link>
                                    </div>
                                  
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <footer className="fixed-footer">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 text-left">
                            <ul>
                              <li><img src="assets/images/ix-logo.svg" alt="" /> © one ix GmbH - 2020 </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </footer>
                </div>
            )
    }
}
export default NotFound