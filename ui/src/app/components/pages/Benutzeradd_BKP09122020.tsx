import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, postData } from "../../services/main-service";

export class Benutzeradd extends Component<any, any> {


  constructor(props: any) {
    super(props);
    this.state = {
        loading: false,
        fields: {},
        errors: {},
        branches: {},
    }
    this.handleChangeAll = this.handleChangeAll.bind(this);
}

componentDidMount() {
  this.setState({ loading: true });
  this.fetchItems();
}

async fetchItems() {

    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result:any = await getData(`/branch/user/${getUser.userId}`);
    this.setState({loading: false, branches: result.data.response });

}


handleValidation() {
  let fields = this.state.fields;
  let errors:any = {};
  let isFormValid = true;

  if(!Object.keys(fields).length) {
    //return isFormValid = false;  
  }

  //branchUserRole  
  if(!fields.hasOwnProperty('branchId') || fields["branchId"] === '') {
    isFormValid = false;
    errors["branchId"] = "Please Select Branch";
  }
  //branchUserRole  
  if(!fields.hasOwnProperty('branchUserRole') || fields["branchUserRole"] === '') {
    isFormValid = false;
    errors["branchUserRole"] = "Please Select Role";
  }
  //firstName  
  if(!fields.hasOwnProperty('firstName') || fields["firstName"] === '') {
    isFormValid = false;
    errors["firstName"] = "Cannot be empty";
  }
  //lastName  
  if(!fields.hasOwnProperty('lastName') || fields["lastName"] === '') {
    isFormValid = false;
    errors["lastName"] = "Cannot be empty";
  }
  
  //telephone  
  if(!fields.hasOwnProperty('telephone') || fields["telephone"] === '') {
    isFormValid = false;
    errors["telephone"] = "Cannot be empty";
  }
  //email  
  if(!fields.hasOwnProperty('email') || fields["email"] === '') {
    isFormValid = false;
    errors["email"] = "Cannot be empty";
  }
  //mobile  
  if(!fields.hasOwnProperty('mobile') || fields["mobile"] === '') {
    isFormValid = false;
    errors["mobile"] = "Cannot be empty";
  }
  //userStatus  
  if(!fields.hasOwnProperty('userStatus') || fields["userStatus"] === '') {
    isFormValid = false;
    errors["userStatus"] = "Cannot be empty";
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
      alert(result.data.message);
    } else {
      alert('Server is Not Connected');  
    }
  } else {
    console.log("error");
  }
}

handleChangeAll(e: any) {
  let fields = this.state.fields;
  let {name, value} = e.target;
  fields[name] = value;
  this.setState({fields});
  console.log(fields);
}

    render() {

      const {loading, branches} = this.state;

      //console.log(branches['data']);

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
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Filiale</label>
                                      <select name="branchId" onChange={this.handleChangeAll} data-type="select" className="">
                                      <option value="">Please Select Branch</option>
                                          { !loading && branches['data'] ? 
                                            branches['data'].map((branch:any) => (
                                              <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>       
                                            )) : null 
                                          }
                                      </select>
                                      <span className="text-danger error">{this.state.errors["branchId"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
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
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >Vorname</label>
                                      <input data-type="text" name="firstName" className="form-control" placeholder="Ravendran" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["firstName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >Nachname</label>
                                      <input data-type="text" name="lastName" className="form-control" placeholder="Sar" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["lastName"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >telephone</label>
                                      <input data-type="tel" name="telephone" className="form-control" placeholder="+41 848 888 888" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Mobil</label>
                                      <input data-type="tel" name="mobile" className="form-control" placeholder="9876543210" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["mobile"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >E-Mail</label>
                                      <input data-type="email" name="email" className="form-control" placeholder="info@useremail.com" onChange={this.handleChangeAll} />
                                      <span className="text-danger error">{this.state.errors["email"]}</span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >Passwort</label>
                                      <input data-type="password" name="password" className="form-control" onChange={this.handleChangeAll} />
                                      <span className="eye-icon"><i className="fa fa-eye" /></span>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>User Postition</label>
                                      <input data-type="text" name="userPosition" className="form-control" placeholder="Your Position" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label >Status</label>
                                      <select data-type="select" name="status" className="" onChange={this.handleChangeAll}>
                                        <option value="">Please Select Status</option>
                                        <option value={1}>Aktiv</option>
                                        <option value={2}>Inaktiv</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Strasse Nr.</label>
                                      <input data-type="text" name="address" className="form-control" placeholder="Street Address" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>PLZ</label>
                                      <input data-type="text" name="postcode" className="form-control" placeholder="4452" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Ort</label>
                                      <input data-type="text" name="city" className="form-control" placeholder="itingen" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Kanton</label>
                                      <input data-type="text" name="place" className="form-control" placeholder="Aarau" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>Land</label>
                                      <input data-type="text" name="country" className="form-control" placeholder="Swiss" onChange={this.handleChangeAll} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="position-relative form-group">
                                      <label>website</label>
                                      <input data-type="text" name="website" className="form-control" placeholder="demo.com" onChange={this.handleChangeAll} />
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
export default Benutzeradd
