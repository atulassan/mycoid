import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import Autocomplete from '../shared/Modules/Autocomplete';
import { getData, postData } from "../../services/main-service";
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import { getCallingCode } from '../../utils/';

const ct = require('countries-and-timezones');

const timezone = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const country = timezone.country || 'CH';
let callingCode = getCallingCode(country);

export class Benutzeradd extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
        loading: false,
        fields: {},
        errors: {},
        branches: [],
        countryCode: `+${callingCode}`,
    }
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.getSendData = this.getSendData.bind(this);
    this.handleCountryCode = this.handleCountryCode.bind(this);
}

async handleCountryCode(e:any) {
  let code:any = this.state.countryCode;
  let fields:any = this.state.fields;
  let {name, value} = e.target;
  let removeAvailCode:any = value.replace(`${code} `, "");
  //if(name === 'number') {
  fields[name] = `${code} ${removeAvailCode}`;
  //}
  await this.setState({fields: fields});
  console.log(code);
}

componentDidMount() {
  this.setState({ loading: true });
  this.fetchItems();
}

async fetchItems() {

    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result:any = await getData(`/branch/user/${getUser.userId}`);
    console.log(result);
    let bs:any = [];
    if(result.hasOwnProperty('status') && result.status === 200) {
      let lstBranches = result.data?.response;
      lstBranches['data'].forEach((branch:any) => {
        bs.push({ branchId: branch.branchId, branchName: branch.branchName});
      });  
      await this.setState({loading: false, branches: bs });
    } else {
      await this.setState({loading: false });
    }
}


handleValidation() {
  let fields = this.state.fields;
  let errors:any = {};
  let isFormValid = true;

  //branchUserRole  
  if(!fields.hasOwnProperty('branchId') || fields["branchId"] === '') {
    isFormValid = false;
    errors["branchId"] = "Filiale wählen";
  }
  //branchUserRole  
  if(!fields.hasOwnProperty('branchUserRole') || fields["branchUserRole"] === '') {
    isFormValid = false;
    errors["branchUserRole"] = "Bitte wählen Sie Rolle";
  }
  //firstName  
  if(!fields.hasOwnProperty('firstName') || fields["firstName"] === '') {
    isFormValid = false;
    errors["firstName"] = "kann nicht leer sein";
  }
  //lastName  
  if(!fields.hasOwnProperty('lastName') || fields["lastName"] === '') {
    isFormValid = false;
    errors["lastName"] = "kann nicht leer sein";
  }
  //email  
  if(!fields.hasOwnProperty('email') || fields["email"] === '') {
    isFormValid = false;
    errors["email"] = "kann nicht leer sein";
  }
  //mobile
  if(!fields.hasOwnProperty('mobile') || fields["mobile"] === '') {
    isFormValid = false;
    errors["mobile"] = "Mobile kann nicht leer sein";
  } else {
    if(fields["mobile"].length < 10) {
      isFormValid = false;
      errors["mobile"] = "Mobile must longer than 10 characters";
    }
  }
  //telephone
  if(!fields.hasOwnProperty('telephone') || fields["telephone"] === '') {
    isFormValid = false;
    errors["telephone"] = "Telephone kann nicht leer sein";
  } else {
    if(fields["telephone"].length < 10) {
      isFormValid = false;
      errors["telephone"] = "telephone must longer than 10 characters";
    }
  }
  //userStatus  
  if(!fields.hasOwnProperty('status') || fields["status"] === '') {
    isFormValid = false;
    errors["status"] = "kann nicht leer sein";
  }

  console.log(errors);
  this.setState({errors: errors});  
  return isFormValid;       
}


async handleSubmit(e: any) {
  e.preventDefault();
  if(this.handleValidation()) {
    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let formData = { userId: getUser.userId, ...this.state.fields, createdBy: getUser.userId };
    let result:any = await postData("/branchuser/add", formData);
    console.log(result);
    console.log(formData);
    if(result.hasOwnProperty('status') && result.status === 200) {
      this.props.dispatch({
        type: SET_MESSAGE,
        payload: {message:result.data.message,variant:'success'},
      });  
    } else {
      this.props.dispatch({
        type: SET_MESSAGE,
        payload: {message:result.data.message,variant:'error'},
      });  
    }
  } else {
    this.props.dispatch({
      type: SET_MESSAGE,
      payload: {message:"Some Fields Needs to be verified",variant:'error'},
    });  
  }
}

handleChangeAll(e: any) {
  let fields = this.state.fields;
  let {name, value} = e.target;
  fields[name] = value;
  if(name === 'telephone') {
    console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
  }
  if(name === 'mobile') {
    console.log('mobile', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
  }
  this.setState({fields});
  console.log(fields);
}

async getSendData(val:any) {
  console.log(val);
  let fields = this.state.fields;
  if(val) {
    fields['branchId'] =  val;
  }
  await this.setState({fields: fields});
  console.log(this.state.fields);
}

    render() {

      const {loading, branches, fields} = this.state;
      console.log(loading);

      //console.log(branches['data']);
      if(!branches){
        return(
          <div>
            <LeftSidebar />
            <h3>Pease add branches then continue to add branch users <Link className="btn btn-primary btn-rounded" to="/filialeadd">Add Filiale</Link></h3>
          </div>
        )
      }
        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="form-page">
                            <div className="row">
                              <div className="col-lg-12">
                              

                                <div className="form-row">
                                <form name="branchuseraddform" className="form-row" onSubmit= {this.handleSubmit.bind(this)}>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Filiale</label>
                                      { !loading && branches ?
                                        <Autocomplete options={branches} sendData={this.getSendData} />
                                      : null 
                                      }
                                      {/* <select name="branchId" onChange={this.handleChangeAll} data-type="select" className="">
                                      <option value="">Please Select Branch</option>
                                          { !loading && branches['data'] ? 
                                            branches['data'].map((branch:any) => (
                                              <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>       
                                            )) : null 
                                          }
                                        </select> */}
                                      <span className="text-danger error">{this.state.errors["branchId"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Funktion</label>
                                      <select name="branchUserRole" data-type="select" className="" onChange={this.handleChangeAll}>
                                        <option value="">Your Role</option>
                                        <option value={1}>Manager</option>
                                        <option value={2}>Staff</option>
                                      </select>
                                      <span className="text-danger error">{this.state.errors["branchUserRole"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Vorname</label>
                                      <input data-type="text" name="firstName" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["firstName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Nachname</label>
                                      <input data-type="text" name="lastName" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["lastName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Telefon</label>
                                      <div className="input-group">
                                        {/* <div className="input-group-prepend">
                                          <span className="input-group-text left-rounded-corner">+41</span>
                                        </div> */ }
                                        <input data-type="tel" name="telephone" onFocus={event => this.handleCountryCode(event)} value={ fields['telephone'] ? fields['telephone']: '' } className="form-control right-rounded-corner" placeholder="" onChange={this.handleChangeAll} />
                                      </div>
                                      <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Mobile</label>
                                      <div className="input-group">
                                       {/* <div className="input-group-prepend">
                                          <span className="input-group-text left-rounded-corner">+41</span>
                                        </div> */}
                                        <input data-type="tel" name="mobile" onFocus={event => this.handleCountryCode(event)} value={ fields['mobile'] ? fields['mobile']: '' } className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      </div>
                                      <span className="text-danger error">{this.state.errors["mobile"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >E-Mail</label>
                                      <input data-type="email" name="email" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["email"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Passwort</label>
                                      <div className="form-icon-base">
                                        <input data-type="password" name="password" className="form-control" onChange={this.handleChangeAll} />
                                        <span className="form-icon">
                                          <span className="eye-icon"><i className="fa fa-eye" /></span>
                                        </span>
                                        
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Funktion</label>
                                      <input data-type="text" name="userPosition" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Zeichen</label>
                                      <select data-type="select" name="status" className="" onChange={this.handleChangeAll}>
                                        <option value="">Please Select Status</option>
                                        <option value={1}>Aktiv</option>
                                        <option value={2}>Inaktiv</option>
                                      </select>
                                      <span className="text-danger error">{this.state.errors["status"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Strasse Nr.</label>
                                      <input data-type="text" name="address" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>PLZ</label>
                                      <input data-type="text" name="postcode" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Ort</label>
                                      <input data-type="text" name="city" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Kanton</label>
                                      <input data-type="text" name="place" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Land</label>
                                      <input data-type="text" name="country" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>website</label>
                                      <input data-type="text" name="website" className="form-control" placeholder="" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-md-12 my-auto text-left">
                                    <div className="form-group btn-groups">
                                      <Link className="btn btn-primary btn-rounded" to="benutzer">zurück</Link>
                                      <button className="btn btn-success btn-rounded" id="submit" value="Submit">spicheren</button>
                                    </div>
                                  </div>
                                </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
export default connect(mapStateToProps)(Benutzeradd);
//export default Benutzeradd
