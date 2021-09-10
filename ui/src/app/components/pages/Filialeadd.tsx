import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { postData} from '../../services/main-service';
import {getDays, getTiming, getCallingCode} from '../../utils/';
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const ct = require('countries-and-timezones');

const timezone = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const country = timezone.country || 'CH';
let callingCode = getCallingCode(country);

export class Filialeadd extends Component<any, any> {

  private stepInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.state = {
        loading: false,
        fields: {},
        errors: {},
        branches: {},
        days: getDays,
        timing: getTiming,
        shoptime: [
          { day:"Montag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:true },
          { day:"Dienstag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:true },
          { day:"Mittwoch", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:true },
          { day:"Donnerstag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:true },
          { day:"Freitag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:true },
          { day:"Samstag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:false },
          { day:"Sonntag", hours: [{ opentime:"08:00", opentimeError:false, closetime:"18:00", cskey:parseInt("1800"), closetimeError:false }], enabled:false },
        ],
        holidays: [
          {
            date: new Date(),
            selectedDate: new Date(),
            reason: "",
          }
        ],
        vacations: [
          {
            date: "",
            selectedDate: "",
            toDate: "",
            selectedToDate: "",
            reason: "",
          }
        ],
        imageData: null,
        countryCode: `+${callingCode}`,
    }
    this.stepInput = React.createRef();
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.handleChangeHolidays = this.handleChangeHolidays.bind(this);
    this.handleAddHolidays = this.handleAddHolidays.bind(this);
    this.handleRemoveHolidays = this.handleRemoveHolidays.bind(this);
    this.handleChangeVacations = this.handleChangeVacations.bind(this);
    this.handleAddVacations = this.handleAddVacations.bind(this);
    this.handleRemoveVacations = this.handleRemoveVacations.bind(this);
    this.handleChangeShopTime = this.handleChangeShopTime.bind(this);
    this.handleChangeShopDay = this.handleChangeShopDay.bind(this);
    this.handleAddShopTime = this.handleAddShopTime.bind(this);
    this.handleRemoveShopTime = this.handleRemoveShopTime.bind(this);
    this.selectedVocationDate = this.selectedVocationDate.bind(this);
    this.showFileUpload = this.showFileUpload.bind(this);
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

  showFileUpload() {
    this.stepInput.current?.click();
  }

  handleValidation() {

    let fields = this.state.fields;
    let openingHours = this.state.shoptime;
    let errors:any = {};
    let isFormValid = true;

    openingHours.forEach((openingHour:any, idx:any)=> {
        if(openingHour.enabled) {
          console.log(openingHour);
          openingHour.hours.forEach((hour:any, idx:any)=> {
            if(hour.opentimeError || hour.closetimeError) {
              console.log(hour);
              console.log("fields Can't be Empties");
              isFormValid = false;
              errors["openingHours"] = "Required Fields Cannot be empty";
            }
          });
        }
    })

    //branchName
    if(!fields.hasOwnProperty('branchName') || fields["branchName"] === '') {
      isFormValid = false;
      errors["branchName"] = "Diese Eingabe ist erforderlich.";
    }

    //Guest No
    if(!fields.hasOwnProperty('guestNo') || fields["guestNo"] === '') {
      isFormValid = false;
      errors["guestNo"] = "Diese Eingabe ist erforderlich.";
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

    //telephone
    if(!fields.hasOwnProperty('telephone') || fields["telephone"] === '') {
      isFormValid = false;
      errors["telephone"] = "telephone Cannot be empty";
    } else {
      if(fields["telephone"].length < 10) {
        isFormValid = false;
        errors["telephone"] = "telephone must be longer than 10 characters";
      }
    }

    this.setState({errors: errors});

    return isFormValid;

  }
  
  async vacations() {
    let vacations = await this.state.vacations;
    let vacationDate:any = [];
    let reason:any = [];
    vacations.forEach((vc:any, index:any)=>{
      vacationDate.push(vc.date);
      reason.push(vc.reason);
    })
    return {vacationDate: vacationDate, reason: reason};
  }

  async holidays() {
    let holidays = await this.state.holidays;
    let holidayDate:any = [];
    let holidayReason:any = [];
    holidays.forEach((vc:any, index:any)=>{
      holidayDate.push(vc.date);
      holidayReason.push(vc.reason);
    })
    return {vacationDate: holidayDate, holidayReason: holidayReason};
  }

  async handleSubmit(e: any) {
    e.preventDefault();
    if(this.handleValidation()) {
      let getUser:any = localStorage.getItem('user');
      getUser = (getUser !== null) ? JSON.parse(getUser) : {};

      let fields = this.state.fields;
      let openingHours = this.state.shoptime;
      let shopHours:any = [];
      let shopDays:any = [];

      openingHours.forEach((openingHour:any, idx:any)=> {
        if(openingHour.enabled) {
          console.log(openingHour);
          shopDays.push(openingHour.day);
          openingHour.hours.forEach((hour:any, idxn:any)=> {
              delete hour.closetimeError;
              delete hour.opentimeError;
          });
          shopHours.push(JSON.stringify(openingHour.hours));
        }
    })

    let holidays = await this.state.holidays;
    let holidayDate:any = [];
    let holidayReason:any = [];
    holidays.forEach((vc:any, index:any)=>{
      holidayDate.push(vc.date);
      holidayReason.push(vc.reason);
    })

    let vacations = await this.state.vacations;
    let vacationDate:any = [];
    let vacationToDate:any = [];
    let reason:any = [];
    vacations.forEach((vc:any, index:any)=>{
      vacationDate.push(vc.date);
      vacationToDate.push(vc.toDate);
      reason.push(vc.reason);
    })

      let formData = {
        userId: getUser.userId, 
        ...this.state.fields, 
        createdBy: getUser.userId,
        vacationDate: vacationDate,
        vacationToDate: vacationToDate,
        reason: reason,
        holidayDate: holidayDate,
        holidayReason: holidayReason,
        openingHours: shopHours,
        days: shopDays,
      };

      //console.log(formData);
      //return false;

      const newFormData = new FormData();
      if(fields.hasOwnProperty('image') && fields['image'] !== "") {
        await newFormData.append('file', fields['image']);
      }
      newFormData.append('data', JSON.stringify(formData));
      console.log(formData);
      //return false;
      
      //let result:any = await postData("/branch/add", formData);
      let result:any = await postData("/branch/add", newFormData);
      console.log('data->', result);
      if(result.hasOwnProperty('status') && result.status === 200) {
        //alert(result.data.message);
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: { message:result.data.message, variant:'success' },
        });  
      } else {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: { message:result.data.message, variant:'Error' },
        });  
      }

    } else {
      this.props.dispatch({
        type: SET_MESSAGE,
        payload: { message:"Some Fields Needs to Be Verify", variant:'Error' },
      });  
    }
  }
  
 async handleChangeAll(e: any) {
    let fields = this.state.fields;
    let {name, value} = e.target;
    fields[name] = value;
    if(name === 'telephone') {
      console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
    }
    if(e.target.files !== null && e.target.files.length > 0) {
      fields['image'] = e.target.files[0];
      let imageData:any = await this.imageData(e.target.files[0]);
      await this.setState({ imageData: imageData });
      console.log(this.state.imageData);
    }
    this.setState({fields});
    console.log(fields);
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

  handleChangeHolidays(index:any, event:any) {
    let holidays = [...this.state.holidays];
    let {name, value} = event.target;
    holidays[index][name] = value;
    this.setState(holidays);
    console.log(this.state.holidays);
  }

  async handleAddHolidays() {
    //console.log('tst');
    await this.setState({holidays: [...this.state.holidays, { date: "", selectedDate: "", reason: "" }]});
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  async handleRemoveHolidays(index:any) {
    console.log(index);
    let removeHolidays = [...this.state.holidays];
    await removeHolidays.splice(index, 1);
    console.log(removeHolidays);
    await this.setState({ holidays: removeHolidays });
    console.log(this.state.holidays);
  }

  handleChangeVacations(index:any, event:any) {
    let vacations = [...this.state.vacations];
    let {name, value} = event.target;
    vacations[index][name] = value;
    this.setState(vacations);
    console.log(this.state.vacations);
  }

  async handleAddVacations() {
    //console.log('tst');
    await this.setState({vacations: [...this.state.vacations, { date: "", selectedDate:"", toDate: "", selectedToDate:"", reason: ""}]});
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  async handleRemoveVacations(index:any) {
    console.log(index);
    let removeVacations = [...this.state.vacations];
    await removeVacations.splice(index, 1);
    console.log(removeVacations);
    await this.setState({ vacations: removeVacations });
    console.log(this.state.vacations);
  }

  //ShopTime
  handleChangeShopTime(index:any, idx:any, event:any, cskey:any) {
    let shoptime = [...this.state.shoptime];
    let {name, value} = event.target;
    shoptime[index].hours[idx][name] = value;
    if(cskey && name === 'closetime') {
      shoptime[index].hours[idx]['cskey'] = parseInt(value.replace(":", ""));
    }
    if(shoptime[index].hours[idx][name]) {
      shoptime[index].hours[idx][`${name}Error`] = false;
    } else {
      shoptime[index].hours[idx][`${name}Error`] = true;
    }
    this.setState(shoptime);
    console.log(this.state.shoptime);
  }

  //ShopDay enable or disabled
  async handleChangeShopDay(index:any, event:any) {
    let shopDay = [...this.state.shoptime];
    let {name, value} = event.target;
    console.log(name, value);
    if(shopDay[index][name]) {
      shopDay[index][name] = false;
    } else {
      shopDay[index][name] = true;
    }
    await this.setState(shopDay);
    console.log(this.state.shoptime);
    //console.log(shopDay);
    //console.log(name, value, event.target.checked);
    /*let vacations = [...this.state.shoptime];
    let {name, value} = event.target;
    vacations[index][name] = value;
    this.setState(vacations);
    console.log(this.state.vacations);*/
  }

  //Shoptimeing add
  async handleAddShopTime(index:any) {
    console.log(index);
    let shoptime = this.state.shoptime;
    await shoptime[index].hours.push({ opentime:"", opentimeError:true, closetime:"", cskey:"", closetimeError:true });
    await this.setState(shoptime);
    console.log(this.state.shoptime);
    //await this.setState({shoptime: [...this.state.shoptime, { day: "", opentime: "", closetime: ""}]});
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  //shoptiming Remove
  async handleRemoveShopTime(index:any, idx:any) {
    console.log(index);
    let removeshoptime = this.state.shoptime;
    await removeshoptime[index].hours.splice(idx, 1);
    //await this.setState({ shoptime: removeshoptime });
    await this.setState(removeshoptime);
    console.log(this.state.shoptime);
  }

  dateAvail(date:any) {
    return format(date, 'dd/MM/yyyy');
  }

  async selectedVocationDate(datet:any, index:any) {
    console.log(datet);
    console.log(index);
    /*console.log(format(datet, 'yyyy/MM/dd'));
    console.log(Moment(datet).format('DD-MM-YYYY'));
    let tmp = this.state.vacations;
    let dateVal:any = await format(toDate(datet), 'dd/MM/yyyy');
    //let dateVal:any = await Moment(datet).format('dd/MM/yyyy');
    tmp[index] = {date: dateVal, reason:''};
    await this.setState({vacations:tmp});
    console.log(this.state.vacations);*/
  }

  async selectedHolidayDate(date:any, index:any) {
    //console.log(date);
    //console.log(format(date, 'dd/MM/yyyy'));
    //console.log(index);
    let upDate = [...this.state.holidays];
    let dateVal = format( date, 'yyyy/MM/dd' );
    upDate[index]['date'] = dateVal;
    upDate[index]['selectedDate'] = date;
    console.log(upDate);
    this.setState(upDate);
    console.log(this.state.holidays);
  }

  async handleVacationDateSelect(date: any, index:any, assign:any) {
    //console.log(date);
    //console.log(format(date, 'dd/MM/yyyy'));
    //console.log(index);
    let upDate = [...this.state.vacations];
    let dateVal = format( date, 'yyyy/MM/dd' );
    if(assign) {
      upDate[index]['date'] = dateVal;
      upDate[index]['selectedDate'] = date;
    } else {
      upDate[index]['toDate'] = dateVal;
      upDate[index]['selectedToDate'] = date;
    }
    console.log(upDate);
    this.setState(upDate);
    console.log(this.state.vacations);
  }

  /*async handleVacationToDateSelect(date: any, index:any) {
    let upDate = [...this.state.vacations];
    let dateVal = format( date, 'yyyy/MM/dd' );
    
    console.log(upDate);
    this.setState(upDate);
    console.log(this.state.vacations);
  }*/

  render() {

    const {timing, holidays, vacations, shoptime, fields, imageData} = this.state;

        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="form-page">
                          <form name="filialeaddform" onSubmit= {this.handleSubmit.bind(this)}>
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
                                  { fields['image'] ?
                                    <img className="img-fluid profile-img" src={imageData} alt={ fields['image'].name } />
                                  : 
                                    <img className="img-fluid profile-img" src={`/assets/images/1.jpg`} alt="profile" />
                                  }  
                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-8 text-left">
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Firmenname</label>
                                      <div className="form-group">                                        
                                        <input type="text" name="branchName" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                        <span className="text-danger error">{this.state.errors["branchName"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Strasse Nr.</label>
                                      <div className="form-group">
                                        <input type="text" name="address" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>PLZ</label>
                                      <div className="form-group">
                                        <input type="text" name="postcode" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Ort</label>
                                      <div className="form-group">
                                        <input type="text" name="city" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Kanton</label>
                                      <div className="form-group">
                                        <input type="text" name="place" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Land</label>
                                      <div className="form-group">
                                        <input type="text" name="country" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Web</label>
                                      <div className="form-group">
                                        <input type="text" name="website" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Anzahl Gäste</label>
                                      <div className="form-group">
                                        <input type="text" name="guestNo" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                        <span className="text-danger error">{this.state.errors["guestNo"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>E-Mail</label>
                                      <div className="form-group">
                                        <input type="text" name="email" onChange={this.handleChangeAll} className="form-control" placeholder="" />
                                        <span className="text-danger error">{this.state.errors["email"]}</span>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Telefon</label>
                                      <div className="form-group">
                                        <div className="input-group">
                                          {/* <div className="input-group-prepend">
                                            <span className="input-group-text left-rounded-corner">+41</span>
                                          </div>*/ }
                                          <input type="text" name="telephone" onFocus={event => this.handleCountryCode(event)} onChange={this.handleChangeAll} className="form-control right-rounded-corner" placeholder="" value={fields['telephone']} />
                                        </div>
                                        <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            {/* Opening Hours */}                                  
                            <div className="row">
                              <div className="col-lg-12 col-md-12 text-left">
                                    <h3 className="sub_title"><i className="lnr-clock" /> Öffnungszeiten</h3>
                                    <p><span className="text-danger error">{this.state.errors["openingHours"]}</span></p>
                              </div>
                              
                              <div className="col-lg-12 col-md-12">

                              { shoptime && shoptime.map((shoptime:any, index:any) => (
                                <Fragment key={`${shoptime}~${index}`}>                              
                                    <div className="row">
                                      <div className="col-md-3 form-group shoptimeChkLabel text-left">
                                      <p className="form-control checkBaseBorder">
                                      <label className="ix-checkbox-label">
                                        <input className="shoptimeCheck ix-checkbox" type="checkbox" name="enabled" onChange={event => this.handleChangeShopDay(index, event)} checked={shoptime.enabled ? true : false} value={shoptime.enabled} />{shoptime.day}<mark className="tickMark"></mark>
                                      </label>
                                      </p>
                                      </div>
                                      <div className="col-md-9">
                                      {
                                        shoptime.enabled ? 
                                        shoptime['hours'].map((hour:any, idx:any) => (
                                          <Fragment key={`${shoptime}~${idx}`}>
                                            <div className="row">
                                              <div className="col-md-5 form-group text-left">
                                                <select data-placeholder="Zeit von" onChange={event => this.handleChangeShopTime(index, idx, event, false)} name="opentime" className="form-control custom-select" tabIndex={1}>
                                                  <option value="">Zeit von</option>
                                                  { timing.length > 0 ? (
                                                    idx ? 
                                                    timing.map((time:any, ix:any) => (
                                                      parseInt(time.replace(":", "")) > parseInt(shoptime['hours'][idx-1].cskey) &&
                                                      <Fragment key={`${time}~${ix}`}>
                                                        <option value={time} disabled={ parseInt(time.replace(":", "")) <= parseInt(shoptime['hours'][idx-1].cskey) ? true: false } data-okey={parseInt(time.replace(":", ""))} data-key={parseInt(shoptime['hours'][idx-1].cskey)} selected={hour.opentime === time ? true : false}>{time}</option>
                                                      </Fragment> 
                                                      ))
                                                    : 
                                                    timing.map((time:any, ix:any) => (
                                                      <Fragment key={`${time}~${ix}`}>
                                                        <option value={time} selected={hour.opentime === time ? true : false}>{time}</option>
                                                      </Fragment> 
                                                      ))
                                                    ) 
                                                       : null
                                                  }                         
                                                </select>
                                                { hour.opentimeError ?
                                                  <span className="text-danger error">Pflichtfeld</span>
                                                  : null 
                                                }
                                              </div>
                                              <div className="col-md-5 form-group text-left">
                                                <select data-placeholder="Zeit von" onChange={event => this.handleChangeShopTime(index, idx, event, true)} name="closetime" className="form-control custom-select" tabIndex={1}>
                                                  <option value="">Zeit von</option>
                                                  { timing.length > 0 ? 

                                                    (
                                                      idx ? 
                                                      timing.map((time:any, ix:any) => (
                                                        parseInt(time.replace(":", "")) > parseInt(shoptime['hours'][idx-1].cskey) &&
                                                        <Fragment key={`${time}~${ix}`}>
                                                          <option value={time} disabled={ parseInt(time.replace(":", "")) <= parseInt(shoptime['hours'][idx-1].cskey) ? true: false } data-okey={parseInt(time.replace(":", ""))} data-key={parseInt(shoptime['hours'][idx-1].cskey)} selected={hour.closetime === time ? true : false}>{time}</option>
                                                        </Fragment> 
                                                        ))
                                                      : 
                                                      timing.map((time:any, ix:any) => (
                                                        <Fragment key={`${time}~${ix}`}>
                                                          <option value={time} selected={hour.closetime === time ? true : false}>{time}</option>
                                                        </Fragment> 
                                                        ))
                                                      )
                                                    
                                                    : null
                                                  }                      
                                                </select>
                                                { hour.closetimeError ?
                                                  <span className="text-danger error">Pflichtfeld</span>
                                                  : null 
                                                }
                                              </div>
                                              <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 text-right">
                                                <div className="form-group">
                                                    { idx ?
                                                      <div onClick={()=>this.handleRemoveShopTime(index, idx)} className="btn btn-sm btn-success btn-rounded" data-id="opening-hours-row1" data-type="custom-hours1">
                                                        <i className="lnr-circle-minus"></i> löschen
                                                      </div>
                                                    :
                                                    <div onClick={()=>this.handleAddShopTime(index)} className="btn btn-sm btn-success btn-rounded" data-id="opening-hours-row1" data-type="custom-hours1">
                                                        <i className="lnr-plus-circle"></i> Zeit hinzufügen
                                                      </div>
                                                    }
                                                </div>
                                              </div>
                                            </div>
                                          </Fragment>
                                        )) : null 
                                      }
                                      </div>
                                    </div>
                                </Fragment>
                                ))}
                              </div>
                            </div>

                              {/* Feiertage -> Holidays */}                                
                              <div className="row">
                                <div className="col-md-12 text-left">
                                  <h3 className="sub_title"><i className="lnr-layers" /> Feiertage</h3>
                                  { holidays && holidays.map((holiday:any, index:any) => (
                                    <Fragment key={`${holiday}~${index}`}>
                                      <div className="row">
                                          <div className="col-lg-4 col-md-6">
                                          <DatePicker className="form-control" selected={holiday.selectedDate} dateFormat="dd.MM.yyyy" value={holiday.selectedDate} name="datepicker" onChange={(date)=>{this.selectedHolidayDate(date, index)}} />
                                            {/* <input onChange={event => this.handleChangeHolidays(index, event)} type="text" name="date" value={holiday.date} className="form-control" tabIndex={index} /> */ }
                                          </div>
                                          <div className="col-lg-8 col-md-6">
                                                <div className="form-group">
                                                  <div className="input-group">
                                                    <input onChange={event => this.handleChangeHolidays(index, event)} value={holiday.reason} type="text" name="reason" className="form-control" placeholder="Betreff" 
                                                    tabIndex={index} />
                                                    { index ?
                                                      <div onClick={ ()=>this.handleRemoveHolidays(index)} className="input-group-append">
                                                      <div className="input-group-text"><i className="lnr-circle-minus" /> löschen</div>
                                                    </div> 
                                                    :
                                                    <div onClick={() => this.handleAddHolidays()} className="input-group-append">
                                                    <div className="input-group-text"><i className="lnr-plus-circle" /> hinzufügen</div>
                                                    </div>
                                                    } 
                                                  </div>
                                                </div>
                                          </div>
                                        </div>
                                      </Fragment>
                                  ))}
                                </div>
                                
                                {/* Ferien -> Vacations */}                                
                                <div className="col-md-12 text-left">
                                  <h3 className="sub_title"><i className="lnr-layers" /> Ferien</h3>
                                  { vacations && vacations.map((vacation:any, index:any) => (
                                    <Fragment key={`${vacation}~${index}`}>
                                      <div className="row">
                                          <div className="col-lg-4 col-md-6">
                                            <div className="row">
                                              <div className="col-md-6">
                                                <DatePicker 
                                                  className="form-control" 
                                                  selected={vacation.selectedDate} 
                                                  onSelect={date => this.handleVacationDateSelect(date, index, true)} 
                                                  dateFormat="dd.MM.yyyy" 
                                                  value={vacation.selectedDate} 
                                                  name="datepicker" 
                                                  onChange={(date)=>{this.selectedVocationDate(date, index)}}
                                                  selectsStart
                                                  startDate={vacation.selectedDate}
                                                  endDate={vacation.selectedToDate}
                                                  />
                                              </div>
                                              <div className="col-md-6">
                                                { vacation.selectedDate && 
                                                  <DatePicker 
                                                    className="form-control" 
                                                    selected={vacation.selectedToDate} 
                                                    onSelect={date => this.handleVacationDateSelect(date, index, false)} 
                                                    dateFormat="dd.MM.yyyy" 
                                                    value={vacation.selectedToDate} 
                                                    name="datepicker" 
                                                    onChange={(date)=>{this.selectedVocationDate(date, index)}}
                                                    selectsEnd
                                                    startDate={vacation.selectedDate}
                                                    endDate={vacation.selectedToDate}
                                                    minDate={vacation.selectedDate}
                                                    />
                                                }
                                              </div>
                                            </div>
                                            {/* <input onChange={event => this.handleChangeVacations(index, event)} type="text" name="date" value={vacation.date} className="form-control" tabIndex={index} /> */}
                                          </div>
                                          <div className="col-lg-8 col-md-6">
                                                <div className="form-group">
                                                  <div className="input-group">
                                                    <input onChange={event => this.handleChangeVacations(index, event)} value={vacation.reason} type="text" name="reason" className="form-control" placeholder="Betreff" 
                                                    tabIndex={index} />
                                                    { index ?
                                                      <div onClick={ ()=>this.handleRemoveVacations(index)} className="input-group-append">
                                                      <div className="input-group-text"><i className="lnr-circle-minus" /> löschen</div>
                                                    </div> 
                                                    :
                                                    <div onClick={() => this.handleAddVacations()} className="input-group-append">
                                                    <div className="input-group-text"><i className="lnr-plus-circle" /> hinzufügen</div>
                                                    </div>
                                                    } 
                                                  </div>
                                                </div>
                                          </div>
                                        </div>
                                      </Fragment>
                                  ))}
                                </div>
                                <div className="col-md-12 text-left">
                                  <div className="form-group btn-groups">
                                    <Link className="btn btn-primary btn-rounded" to="/filiale">zurück</Link>
                                    <button className="btn btn-success btn-rounded" type="submit">spicheren</button>
                                  </div>
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
function mapStateToProps(state: any) {
  const { messages } = state;
  return {
      messages
  };
}
export default connect(mapStateToProps)(Filialeadd);
//export default Filialeadd
