import React, { Component } from 'react';
import { postData } from '../../services/main-service';
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
// import Login from './Login';

export class PasswotVergessen extends Component<any, any> {

  constructor(props: any) {
    super(props);
      this.state = {
        email: "",
        error: "", 
      }
      this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleValidation() {

    let isFormValid:any = true;
    let email:any = this.state.email;
    let error:any = this.state.error;

    if(email === '') {
      isFormValid = false;
      error = "Email Cannot be empty";
    }

    if(typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        isFormValid = false;
        error = "Email is not valid";
      }
    }

    this.setState( {error: error} );
    return isFormValid;

  }

  async handleEmailChange(e: any) {
    //let search = this.state.searchTxt;
    const {name, value} = e.target;
    console.log(name);
    await this.setState({email: value});
    console.log(this.state.email);
  }

  async handleSubmit(e: any) {
    e.preventDefault();
    let email = this.state.email;
    console.log(email);
    if(this.handleValidation()) {

      let resetPassword:any = await postData(`/auth/reset/password`, {email: email});
      console.log(resetPassword);
      
      if(resetPassword.hasOwnProperty('status') && resetPassword.status === 200) {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:resetPassword.data.message,variant:'success'},
        });
        this.props.history.push(`/passwortemail/${email}`);
      } else {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:resetPassword.data.message,variant:'Error'},
        });
      }

    }

  }

    render() {

      //const { error }:any = this.state;
        return(
              <div>
                {/* <Login /> */}

                <div className="topBanner" />
                <section id="welcome" className="">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-xl-6 col-lg-6 ">
                        <div className="form-page section-md">

                          <form onSubmit= {this.handleSubmit.bind(this)}>
                              <div className="row justify-content-center">
                                <div className="col-lg-12 col-md-12 text-center">

                                  <h3 className="sec_title inner_head_padding">Passwort Vergessen</h3>
                                </div>
                                <div className="col-md-8">
                                  <div className="form-group">
                                    <div className="form-icon-base">
                                      <input type="email" name="email" className="form-control" onChange={this.handleEmailChange} placeholder="E-Mail" />
                                      <span className="text-danger error">{ this.state.error }</span>
                                      </div>
                                  </div>
                                </div>
                                <div className="col-md-8">
                                  <div className="form-group btn-groups">
                                    <button className="btn btn-success btn-rounded" type="submit">Senden</button>
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

function mapStateToProps(state: any) {
  const { messages } = state;
  return {
      messages
  };
}
export default connect(mapStateToProps)(PasswotVergessen);

//export default PasswotVergessen