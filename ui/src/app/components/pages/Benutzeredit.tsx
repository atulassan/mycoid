import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, postData } from "../../services/main-service";
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import Autocomplete from '../shared/Modules/Autocomplete';
import { getCallingCode } from '../../utils/';

const ct = require('countries-and-timezones');

const timezone = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const country = timezone.country || 'CH';
let callingCode = getCallingCode(country);

export class Benutzeredit extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
        loading: false,
        errors: {},
        branches: [],
        branchuser: {},
        activeBranch: null,
        toEdit: false,
        countryCode: `+${callingCode}`,
    }
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.getSendData = this.getSendData.bind(this);
    this.handleToEdit = this.handleToEdit.bind(this);
    this.handleCountryCode = this.handleCountryCode.bind(this);
  }

  async handleCountryCode(e:any) {
    let code:any = this.state.countryCode;
    let branchuser:any = this.state.branchuser;
    let {name, value} = e.target;
    let removeAvailCode:any = value.replace(`${code} `, "");
    //if(name === 'number') {
      branchuser[name] = `${code} ${removeAvailCode}`;
    //}
    await this.setState({branchuser: branchuser});
    console.log(code);
  }

componentDidMount() {
  this.setState({ loading: true });
  this.fetchItems();
}

async fetchItems() {
  // ES6 destructuring the props
  const { id } = this.props.match.params;
  let getUser:any = localStorage.getItem('user');
  getUser = (getUser !== null) ? JSON.parse(getUser) : {};
  let branches:any = await getData(`/branch/user/${getUser.userId}`);
  let branchuser:any = await getData(`/branchuser/${id}`);
  console.log(branchuser);
  let bs:any = [];
  if(branches.hasOwnProperty('status') && branches.status === 200) {
    let lstBranches = branches.data?.response;
    lstBranches['data'].forEach((branch:any) => {
      bs.push({ branchId: branch.branchId, branchName: branch.branchName});
      if(branchuser.data.response.branchId === branch.branchId) {
        this.setState({activeBranch: branch.branchName});
      }
    });
  }
  this.setState({
    loading: false, 
    branches: (branches.status == 200) ?  bs : [],
    branchuser: (branchuser.status == 200) ?  branchuser.data.response : [],
  });
}

handleValidation() {
  let branchuser = this.state.branchuser;
  let errors:any = {};
  let isFormValid = true;

  //branchUserRole  
  if(branchuser["branchUserRole"] === '') {
    isFormValid = false;
    errors["branchUserRole"] = "Cannot be empty";
  }
  //firstName  
  if(branchuser["firstName"] === '') {
    isFormValid = false;
    errors["firstName"] = "Cannot be empty";
  }
  //lastName  
  if(branchuser["lastName"] === '') {
    isFormValid = false;
    errors["lastName"] = "Cannot be empty";
  }
  //email  
  if(branchuser["email"] === '') {
    isFormValid = false;
    errors["email"] = "Cannot be empty";
  }
  //mobile
  if(branchuser["mobile"] === '' || branchuser["mobile"].length < 10) {
    isFormValid = false;
    errors["mobile"] = "Mobile Cannot be empty or longer than 10 characters";
  }
  //telephone
  if(branchuser["telephone"] === '' || branchuser["telephone"].length < 10) {
    isFormValid = false;
    errors["telephone"] = "telephone Cannot be empty or longer than 10 characters";
  }
  //userStatus  
  if(branchuser["userStatus"] === '') {
    isFormValid = false;
    errors["userStatus"] = "Cannot be empty";
  }

  this.setState({errors: errors});  

  return isFormValid;       
}

async handleSubmit(e: any) {
  e.preventDefault();

  if(this.handleValidation()) {
    const { id } =  this.props.match.params;
    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};

    let removeFields = ['createdDatetime', 'createdby', 'image', 'modifiedDatetime', 'modifiedby', 'userId'];
    let updateData = this.state.branchuser;

    removeFields.forEach((field:any) => {
      if(updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });

    if(!updateData.hasOwnProperty('userStatus')) {
      updateData['userStatus'] = parseInt(updateData['status']);
    }

    let formData = { userId: getUser.userId, ...updateData, createdBy: getUser.userId, modifiedBy: getUser.userId };
    let result:any = await postData(`/branchuser/update/${id}`, formData);
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
  }

}

handleChangeAll(e: any) {
  let branchuser = this.state.branchuser;
  let {name, value} = e.target;
  branchuser[name] = value;
  if(name === 'telephone') {
    console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    branchuser[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
  }
  if(name === 'mobile') {
    console.log('mobile', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    branchuser[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
  }
  this.setState({branchuser});
  console.log(branchuser);
}

async getSendData(val:any) {
  console.log(val);
  let branchuser = this.state.branchuser;
  if(val) {
    branchuser['branchId'] = val;
  }
  await this.setState({branchuser: branchuser});
  console.log(this.state.branchuser);
}

async handleToEdit() {
  let toEdit:any = this.state.toEdit;
  if(toEdit) {
    toEdit = false;
  } else {
    toEdit = true;
  }
  await this.setState({ toEdit: toEdit });
  console.log(this.state.toEdit);
}

    render() {

      const { loading, branches, branchuser, activeBranch, toEdit } = this.state;

      console.log(activeBranch);

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

                                { loading ? 
                                  <span>Loading...</span> 
                                : ( branchuser ?

                                <form name="branchuseraddform" className="form-row" onSubmit= {this.handleSubmit.bind(this)}>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Filiale</label>
                                      { !loading && branches && activeBranch ?
                                        <Autocomplete options={branches} sendData={this.getSendData} savedValue={activeBranch} />
                                      : null 
                                      }
                                      { /* <select name="branchId" onChange={this.handleChangeAll} data-type="select" className="">
                                        <option value="">Please Select Branch</option>
                                          { branches['data'] && 
                                            branches['data'].map((branch:any) => (
                                              <option key={branch.branchId} value={branch.branchId} selected={branch.branchId === branchuser.branchId ? true : false}>{branch.branchName}</option>       
                                            )) 
                                          }
                                        </select> */ } 
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Funktion</label>
                                      <select disabled={!toEdit ? true : false} name="branchUserRole" data-type="select" className="" onChange={this.handleChangeAll}>
                                        <option value="">Please Role</option>
                                        <option value={1} selected={branchuser.branchUserRole === 1 ? true : false}>Manager</option>
                                        <option value={2} selected={branchuser.branchUserRole === 2 ? true : false}>Staff</option>
                                      </select>
                                      <span className="text-danger error">{this.state.errors["branchUserRole"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Vorname</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="firstName" className="form-control" placeholder="Ravendran" onChange={this.handleChangeAll}
                                      value={branchuser.firstName} />
                                      <span className="text-danger error">{this.state.errors["firstName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Nachname</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="lastName" className="form-control" placeholder="Sar" onChange={this.handleChangeAll}
                                      value={branchuser.lastName} />
                                      <span className="text-danger error">{this.state.errors["lastName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >telephone</label>
                                      <div className="input-group">
                                        {/* <div className="input-group-prepend">
                                          <span className="input-group-text left-rounded-corner">+41</span>
                                      </div>*/}
                                        <input disabled={!toEdit ? true : false} data-type="tel" onFocus={event => this.handleCountryCode(event)} name="telephone" className="form-control right-rounded-corner" placeholder="Telefon" onChange={this.handleChangeAll}
                                      value={branchuser.telephone} />
                                      </div>
                                      <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Mobile</label>
                                      <div className="input-group">
                                        {/*<div className="input-group-prepend">
                                          <span className="input-group-text left-rounded-corner">+41</span>
                                        </div> */}
                                      <input disabled={!toEdit ? true : false} data-type="tel" onFocus={event => this.handleCountryCode(event)} name="mobile" className="form-control right-rounded-corner" placeholder="Mobile" onChange={this.handleChangeAll}
                                      value={branchuser.mobile} />
                                      </div>
                                      <span className="text-danger error">{this.state.errors["mobile"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >E-Mail</label>
                                      <input disabled={!toEdit ? true : false} data-type="email" name="email" className="form-control" placeholder="info@useremail.com" onChange={this.handleChangeAll}
                                      value={branchuser.email} />
                                      <span className="text-danger error">{this.state.errors["email"]}</span>
                                    </div>
                                  </div>
                                  {/*<div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Passwort</label>
                                      <div className="form-icon-base">
                                      <input data-type="password" name="password" className="form-control" onChange={this.handleChangeAll}
                                      value={branchuser.password} />
                                        <span className="form-icon">
                                          <span className="eye-icon"><i className="fa fa-eye" /></span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>*/}
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>User Postition</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="userPosition" className="form-control" placeholder="Your Position" onChange={this.handleChangeAll}
                                      value={branchuser.userPosition} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label >Status</label>
                                      <select disabled={!toEdit ? true : false} data-type="select" name="userStatus" className="" onChange={this.handleChangeAll}>
                                        <option value="">Please Select Status</option>
                                        <option value={1} selected={branchuser.status === 1 ? true : false}>Aktiv</option>
                                        <option value={0} selected={branchuser.status === 0 ? true : false}>Inaktiv</option>
                                      </select>
                                      <span className="text-danger error">{this.state.errors["userStatus"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Strasse Nr.</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="address" className="form-control" placeholder="Street Address" onChange={this.handleChangeAll} 
                                      value={branchuser.address} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>PLZ</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="postcode" className="form-control" placeholder="4452" onChange={this.handleChangeAll}
                                      value={branchuser.postcode} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Ort</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="city" className="form-control" placeholder="itingen" onChange={this.handleChangeAll}
                                      value={branchuser.city} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Kanton</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="place" className="form-control" placeholder="Aarau" onChange={this.handleChangeAll}
                                      value={branchuser.place} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>Land</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="country" className="form-control" placeholder="Swiss" onChange={this.handleChangeAll}
                                      value={branchuser.country} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 text-left">
                                    <div className="position-relative form-group">
                                      <label>website</label>
                                      <input disabled={!toEdit ? true : false} data-type="text" name="website" className="form-control" placeholder="demo.com" onChange={this.handleChangeAll} 
                                      value={branchuser.website} />
                                    </div>
                                  </div>
                                  <div className="col-md-12 my-auto text-left">
                                    <div className="form-group btn-groups">
                                      <Link className="btn btn-primary btn-rounded" to="/benutzer">zurück</Link>
                                      { toEdit ? 
                                      <button className="btn btn-success btn-rounded" id="submit" value="Submit">spicheren</button>
                                    : 
                                      <span className="btn btn-success btn-rounded" onClick={this.handleToEdit}>bearbeiten</span>
                                    }
                                    </div>
                                  </div>
                                </form>
                               : <p>User not Found</p> )
                              }
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
export default connect(mapStateToProps)(Benutzeredit);
//export default Benutzeredit;
