import React, { Component } from 'react';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, postData } from "../../services/main-service";
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import { getCallingCode } from '../../utils/';

const ct = require('countries-and-timezones');

const timezone = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const country = timezone.country || 'CH';
let callingCode = getCallingCode(country);
//console.log('+++++++callig code+++++', callingCode); 

const API_URL:any = process.env.API_URL;

export class Myprofil extends Component<any,any> {

  private stepInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
      super(props);
      this.state = {
          loading: false,
          profile: {},
          fields: {},
          errors: {},
          file: null,
          imageData: null,
          toEdit: false,
          countryCode: `+${callingCode}`,
      }
      this.stepInput = React.createRef();
      this.handleChangeAll = this.handleChangeAll.bind(this);
      this.showFileUpload = this.showFileUpload.bind(this);
      this.handleToEdit = this.handleToEdit.bind(this);
      this.handleCountryCode = this.handleCountryCode.bind(this);
      //this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  showFileUpload() {
    this.stepInput.current?.click();
  }

  componentDidMount() {
    this.setState({loading: true});
    this.fetchItems();
    /*this.props.dispatch({
      type: PAGETITLE,
      payload: { message:'', show:false, pageTitle:'MyProfile' },
    });*/
  }

  async fetchItems() {
    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result:any = await getData(`/user/${getUser.userId}`);
    console.log("Response Data", result);
    this.setState({
      loading: false, 
      profile: result.data.response
    });
    let profileUpdate = await result.data.response;
    let deleteUnwantedProperties = ['password', 'verificationToken', 'modifiedDatetime', 'createdDatetime','forgotToken', 'modifiedby'];
    for(let i = 0; i < deleteUnwantedProperties.length; i++) {
       if(this.state.profile.hasOwnProperty(deleteUnwantedProperties[i])) {
        delete profileUpdate[deleteUnwantedProperties[i]];
       }
    }
    this.setState({ fields: profileUpdate });
    //let countryCode:any = await getCountryCode(`https://ipapi.co/country_calling_code/`);
    //console.log("country Code", countryCode);
  }

  handleValidation() {
    let fields = this.state.fields?this.state.fields:{};
    let errors:any = {};
    let isFormValid = true;
    
    //Contactpersion
    if(fields["contactperson"] === '') {
      isFormValid = false;
      errors["contactperson"] = "Cannot be empty";
    }
    if(fields["firstName"] === '') {
      isFormValid = false;
      errors["firstName"] = "Cannot be empty";
    }
    if(fields["lastName"] === '') {
      isFormValid = false;
      errors["lastName"] = "Cannot be empty";
    }
    if(fields["mobile"] === '' || fields["mobile"].length < 10) {
      isFormValid = false;
      errors["mobile"] = "Mobile Cannot be empty or longer than 10 characters";
    }
    if(fields["telephone"] === '' || fields["telephone"].length < 10) {
      isFormValid = false;
      errors["telephone"] = "telephone Cannot be empty or longer than 10 characters";
    }

    //Email
    if(fields["email"] === '') {
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

  async handleSubmit(e: any) {
    e.preventDefault();
    if(this.handleValidation()) {
      //let getUser = localStorage.getItem('user');
      //console.log(typeof(getUser));
      //getUser = (getUser !== null) ? JSON.parse(getUser) : {};

      // Create an object of formData 
      //const formData = new FormData();
      //formData.append( "image", this.state.fields.image, this.state.fields.image.name );

      let fields = this.state.fields;
      let profile = this.state.profile;
      let updateData = {...this.state.fields, modifiedBy: profile.userId, };
      const formData = new FormData()
      if(fields.hasOwnProperty('image') && fields['image'] !== "") {
        await formData.append('file', fields['image']);
      }
      formData.append('data', JSON.stringify(updateData));
      console.log(updateData);
      //let result:any = await postData(`/user/update/${profile.userId}`, updateData);
      let result:any = await postData(`/user/update/${profile.userId}`, formData);
      console.log('data->', result);
      if(result.hasOwnProperty('status') && result.status === 200) {
        //alert(result.data.message);
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'success'},
        });
        await this.setState({toEdit: false});
      } else {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'Error'},
        });  
      }
      //success("form send successfully");      
    }
  }

  async handleChangeAll(e: any) {
    
    let fields = this.state.fields;
    let {name, value} = e.target;
    fields[name] = value;
    if(name === 'telephone') {
      //console.log(this.phoneFormat1(value));
      console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
    }
    if(name === 'mobile') {
      //console.log(this.phoneFormat1(value));
      console.log('mobile', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
    }
    if(e.target.files !== null && e.target.files.length > 0) {
      fields['image'] = e.target.files[0];
      let imageData:any = await this.imageData(e.target.files[0]);
      await this.setState({ file: e.target.files[0], imageData: imageData });
    }
    this.setState({fields});
    console.log(fields);
    console.log(this.state.file);
    console.log(this.state.imageData);
    
  }

  imageData(blob:any) {
    var reader:any = new window.FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
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

 phoneFormat(phoneNumberString: any) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
 }

 phoneFormat1(phoneNumberString: any) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+41 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
 }
 
 /*formatUSNumber(entry:any) {
  const match = entry.replace(/\D+/g, '').match(/([^\d]*\d[^\d]*)$/)[0]
  const part1 = match.length > 2 ? `(${match.substring(0,3)})` : match
  const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
  const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''    
  return `${part1}${part2}${part3}`
}*/

    render() {

      let { loading, profile, fields, file, imageData, toEdit } = this.state;

      console.log(profile);

      let userRole = '';
      if(!profile){
        return (
          <div>
            <LeftSidebar />
            <div className="mainWrapper">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="mainWrapperBody">
                    <h3>You are not allowed this page</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      if(profile.hasOwnProperty('userRole')) {
          userRole = (parseInt(profile.userRole) == 2) ? "Admin" : "Super Admin";
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
                            { loading ? <p>Loading...</p>
                            :
                            <form name="profileform" className="profileform" onSubmit= {this.handleSubmit.bind(this)}>
                              <div className="row">
                                <div className="col-lg-4 col-md-4 text-left">
                                  <div className="filialeImg">
                                  <div className="uploadImg" onClick={this.showFileUpload}><i className="lnr-cloud-upload"></i></div>
                                  <input 
                                      type="file"
                                      name="profileImg"
                                      onChange={this.handleChangeAll}
                                      ref={this.stepInput}
                                      style={{display: 'none'}}
                                      />

                                    {/*<img className="img-fluid  profile-img" src="assets/images/1.jpg" alt="profile" />*/}
                                    { /* <img className="img-fluid  profile-img" src={ (profile.image) ? `${API_URL}/${profile.image}` : `/assets/images/1.jpg` } alt="profile" />*/ }
                                    
                                    {
                                     file ?
                                        <img className="img-fluid  profile-img" src={imageData} alt={ file.name } />
                                        : 
                                        profile.image ? 
                                        <img className="img-fluid  profile-img" src={`${API_URL}/${profile.image}`} alt="profile" />
                                        : 
                                        <img className="img-fluid  profile-img" src={`/assets/images/1.jpg`} alt="profile" />
                                    }

                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-8 text-left">
                                  <div className="row">
                                    <div className="col-lg-12 col-md-12 text-left">
                                      <label>Kontaktperson</label>
                                      <div className="form-group">
                                        <input disabled={!toEdit ? true : false} type="text" className="form-control" name="contactperson" defaultValue={profile.contactperson} onChange={this.handleChangeAll} 
                                        value= { fields.hasOwnProperty('contactperson') && fields['contactperson'] !== '' ? this.state.fields['contactperson'] : profile.contactperson} />
                                        <span className="text-danger error">{this.state.errors["contactperson"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Nachname</label>
                                      <div className="form-group">
                                        <input disabled={!toEdit ? true : false} type="text" className="form-control" name="firstName" defaultValue={profile.firstName} onChange={this.handleChangeAll} 
                                        value={fields.hasOwnProperty('firstName') && fields['firstName'] !== '' ? this.state.fields['firstName'] : profile.firstName } />
                                        <span className="text-danger error">{this.state.errors["firstName"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Vorname</label>
                                      <div className="form-group">
                                        <input disabled={!toEdit ? true : false} type="text" className="form-control" name="lastName" defaultValue={profile.lastName} onChange={this.handleChangeAll} 
                                        value={fields.hasOwnProperty('lastName') && fields['lastName'] !== '' ? this.state.fields['lastName'] : profile.lastName } />
                                        <span className="text-danger error">{this.state.errors["lastName"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Position</label>
                                      <div className="form-group">
                                      <input type="text" className="form-control" name="userrole" defaultValue={userRole} disabled />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Telefon</label>
                                      <div className="form-group">

                                        <div className="input-group">
                                          { /* <div className="input-group-prepend">
                                            <span className="input-group-text left-rounded-corner">+41</span>
                                          </div> */ }
                                          <input placeholder="Telefon" disabled={!toEdit ? true : false} type="text" onFocus={event => this.handleCountryCode(event)} className="form-control right-rounded-corner" defaultValue={profile.telephone} name="telephone" onChange={this.handleChangeAll} 
                                            value={fields.hasOwnProperty('telephone') && fields['telephone'] !== '' ? this.state.fields['telephone'] : profile.telephone } />
                                        </div>
                                        <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>mobile</label>
                                      <div className="form-group">
                                      
                                        <div className="input-group">
                                          { /* <div className="input-group-prepend">
                                            <span className="input-group-text left-rounded-corner">+41</span>
                                          </div> */ }
                                          <input placeholder="Mobile" disabled={!toEdit ? true : false} type="text" onFocus={event => this.handleCountryCode(event)} className="form-control right-rounded-corner" defaultValue={profile.mobile} name="mobile" onChange={this.handleChangeAll} 
                                          value={fields.hasOwnProperty('mobile') && fields['mobile'] !== '' ? this.state.fields['mobile'] : profile.mobile } />
                                          <span className="text-danger error">{this.state.errors["mobile"]}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>E-Mail</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="email" defaultValue={profile.email} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('email') && fields['email'] !== '' ? this.state.fields['email'] : profile.email } />
                                        <span className="text-danger error">{this.state.errors["email"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-4 text-left">
                                      <label>Firmenname</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="companyName" defaultValue={profile.companyName} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('companyName') && fields['companyName'] !== '' ? this.state.fields['companyName'] : profile.companyName } />
                                        <span className="text-danger error">{this.state.errors["companyName"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Strasse Nr.</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="address" defaultValue={profile.address} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('address') && fields['address'] !== '' ? this.state.fields['address'] : profile.address } />
                                        <span className="text-danger error">{this.state.errors["address"]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 mt-4">
                                  <div className="row">
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>PLZ</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="postcode" defaultValue={profile.postcode} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('postcode') && fields['postcode'] !== '' ? this.state.fields['postcode'] : profile.postcode } />
                                        <span className="text-danger error">{this.state.errors["postcode"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Ort</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="city" defaultValue={profile.city} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('city') && fields['city'] !== '' ? this.state.fields['city'] : profile.city } />
                                        <span className="text-danger error">{this.state.errors["city"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Kanton</label>
                                      <div className="form-group">
                                        <input disabled={!toEdit ? true : false} type="text" className="form-control" name="place" defaultValue={profile.place} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('place') && fields['place'] !== '' ? this.state.fields['place'] : profile.place } />
                                        <span className="text-danger error">{this.state.errors["place"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Land</label>
                                      <div className="form-group">
                                      <input disabled={!toEdit ? true : false} type="text" className="form-control" name="country" defaultValue={profile.country} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('country') && fields['country'] !== '' ? this.state.fields['country'] : profile.country } />
                                        <span className="text-danger error">{this.state.errors["country"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 text-left">
                                      <label>Web</label>
                                      <div className="form-group">
                                          <input disabled={!toEdit ? true : false} type="text" className="form-control" name="website" defaultValue={profile.website} onChange={this.handleChangeAll} 
                                        value={this.state.fields.hasOwnProperty('website') && fields['website'] !== '' ? this.state.fields['website'] : profile.website } />
                                        <span className="text-danger error">{this.state.errors["website"]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12 my-auto text-left">
                                  <div className="form-group btn-groups">
                                    {/* <Link className="btn btn-success btn-rounded" to="myprofiledit">bearbeiten</Link> */}
                                    { toEdit ? 
                                      <button className="btn btn-success btn-rounded" id="submit" value="Submit">speichern</button>  
                                    : 
                                      <span className="btn btn-success btn-rounded" onClick={this.handleToEdit}>bearbeiten</span>
                                    }
                                    </div>
                                </div>
                              </div>
                            </form>
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
function mapStateToProps(state: any) {
  const { messages } = state;
  return {
      messages
  };
}
export default connect(mapStateToProps)(Myprofil);
//export default Myprofil
