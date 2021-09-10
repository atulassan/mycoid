import React, { Component } from 'react';
import { postData } from "../../services/main-service";
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";


export class Kontakt extends Component<any , any>{

  constructor(props: any) {
    super(props);
    this.state = {
      fields:{},
      errors: {},
    }
    this.handleChangeAll = this.handleChangeAll.bind(this);
  }

  async handleChangeAll(e: any) {
    let fields = this.state.fields;
    let {name, value} = e.target;
    fields[name] = value;
    this.setState({fields});
    console.log(fields);
  }

  handleValidation() {
    let fields = this.state.fields?this.state.fields:{};
    let errors:any = {};
    let isFormValid = true;
    
    if(!fields.hasOwnProperty('firstName') || fields["firstName"] === '') {
      isFormValid = false;
      errors["firstName"] = "Cannot be empty";
    }
    
    if(!fields.hasOwnProperty('lastName') || fields["lastName"] === '') {
      isFormValid = false;
      errors["lastName"] = "Cannot be empty";
    }
    
    if(!fields.hasOwnProperty('company') || fields["company"] === '') {
      isFormValid = false;
      errors["company"] = "Cannot be empty";
    }

    if(!fields.hasOwnProperty('message') || fields["message"] === '') {
      isFormValid = false;
      errors["message"] = "Cannot be empty";
    }

    //Email
    if(!fields.hasOwnProperty('email') || fields["email"] === '') {
      isFormValid = false;
      errors["email"] = "Email Cannot be empty";
    }

    if(typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        isFormValid = false;
        errors["email"] = "Email is not valid";
      }
    }
    this.setState({errors: errors});
    console.log(fields);
    return isFormValid;
  }

  async handleSubmit(e: any) {
    e.preventDefault();
    if(this.handleValidation()) {
      let fields:any = this.state.fields;
      let result:any = await postData(`/message/support`, fields);
      console.log(result);
      if(result.hasOwnProperty('status') && result.status === 200) {
        //alert(result.data.message);
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'success'},
        });  
      } else {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'Error'},
        });  
      }
    }
  }

    render(){
        return(
            <div>
              <div className="topBanner" />
              <section id="welcome">
                <div className="container">
                  <div className="row justify-content-md-center">
                    <div className="col-xl-10 col-lg-10">
                      <div className="form-page section-md">
                            <div className="text-center">
                              <h3 className="sec_title inner_head_padding">Kontakt</h3>
                            </div>
                            <h4 className="sub_sec_title">Noch Fragen?</h4>
                            <p>Ob für einen Kaffeetalk zum Kennenlernen, ein gemeinsames Projekt: Hier gibt's für alle Anliegen den passenden Kontakt.</p>
                            <p>Auf Agentursuche für das nächste Projekt? Wir freuen uns über Anfragen.</p>

                            <div className="mt-2">
                              <form onSubmit= {this.handleSubmit.bind(this)}>
                                  <div className="row">
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="form-group">
                                      <label>Vorname</label>
                                      <input type="text" name="firstName" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["firstName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="form-group">
                                      <label>Nachname</label> 
                                      <input type="text" name="lastName" className="form-control" placeholder=""  onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["lastName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="form-group">
                                      <label>E-Mail</label>
                                      <input type="email" name="email" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["email"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="form-group">
                                      <label>Unternehmen</label>
                                      <input type="text" className="form-control" name="company" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["company"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 text-left">
                                    <div className="form-group">
                                      <label>Ihre Nachricht an uns</label>
                                      <textarea className="form-control" name="message" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["message"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 text-left">
                                    <div className="form-group">
                                      <p>Die mit <span className="star">*</span> gekennzeichneten Felder sind Pflicht.</p>
                                      <label className="checkWrapper">Ich habe die Hinweise zum Datenschutz gelesen und bin damit einverstanden.
                                          <input type="checkbox" />
                                          <span className="checkmark" />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-12 my-auto text-center">
                                    <div className="form-group btn-groups">
                                      <button type="submit" className="btn btn-primary btn-rounded" >Senden</button>
                                    </div>
                                  </div>
                                  </div>
                                </form>
                            </div>

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

function mapStateToProps(state: any) {
  const { messages } = state;
  return {
      messages
  };
}
export default connect(mapStateToProps)(Kontakt);

//export default Kontakt
