import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import Header from './Header';
//import Login from './Login';

export class PasswortEmail extends Component<any , any>{

  constructor(props: any) {
    super(props);
    this.state= {
      email: ""
    }
  }

  componentDidMount() {
    const { email } = this.props.match.params;
    this.setState({email: email});  
  }

    render() {

      const { email } = this.state;

        return(
                <div>
                    <div className="topBanner" />
                    <section id="welcome" className="SSS">
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-xl-6 col-lg-6 ">
                            <div className="form-page section-md">
                              <form>
                                <div className="row">
                                  <div className="row"><div className="col-lg-12 col-md-12 text-center">
                                      <h3 className="sec_title inner_head_padding">Passwort Zurücksetzen</h3>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <p>Eine E-Mail-Nachricht wurde an die Adresse <Link to="home" className="link link-blue">{ email }</Link> versandt. Überprüfen Sie Ihren E-Mail-Account und folgen Sie den Anweisungen, um Ihr Passwort zurückzusetzen.</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                   
                </div>
            )
    }
}
export default PasswortEmail