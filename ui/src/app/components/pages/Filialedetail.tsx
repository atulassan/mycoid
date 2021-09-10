import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, imageData } from "../../services/main-service";
import { getDays, getTiming } from '../../utils/';
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns';
import { getCallingCode } from '../../utils/';

const ct = require('countries-and-timezones');

const timezone = ct.getTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
const country = timezone.country || 'CH';
let callingCode = getCallingCode(country);
//import FilialeEditForm from '../shared/Modules/FilialeEditForm';
// import Header1 from './Header1';

const API_URL:any = process.env.API_URL;

export class Filialedetail extends Component<any, any> {

  private stepInput: React.RefObject<HTMLInputElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      branchData: {},
      fields: {},
      errors: {},
      days: getDays,
      timing: getTiming,
      holidays: [],
      vacations: [],
      shoptime: [
        { day: "Montag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Dienstag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Mittwoch", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Donnerstag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Freitag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Samstag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
        { day: "Sonntag", hours: [{ opentime: "08:00", opentimeError: false, closetime: "18:15", closetimeError: false }], enabled: false },
      ],
      showOpenHours: false,
      showHolidays: false,
      showVacations: false,
      file: null,
      imageData: null,
      toEdit: false,
      countryCode: `+${callingCode}`,
    }
    this.stepInput = React.createRef();
    this.handleChangeAll = this.handleChangeAll.bind(this);
    this.showFileUpload = this.showFileUpload.bind(this);
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
    this.handleOpenhoursStatus = this.handleOpenhoursStatus.bind(this);
    this.handleShowHolidayStatus = this.handleShowHolidayStatus.bind(this);
    this.handleShowVacationsStatus = this.handleShowVacationsStatus.bind(this);
    this.handleToEdit = this.handleToEdit.bind(this);
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
    this.fetchItems();
  }

  showFileUpload() {
    this.stepInput.current?.click();
  }

  async fetchItems() {
    let { id }: any = this.props.match.params;
    let getUser: any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result: any = await getData(`/branch/${id}`);
    console.log(result);
    let holidays = await this.state.holidays;
    let vacations = await this.state.vacations;
    if (result.status === 200) {
      let shoptime = this.state.shoptime;
      if (result.data.response.hasOwnProperty('openingHours') && result.data.response.openingHours.length > 0) {
        shoptime.forEach((shopHour: any, sdx: any) => {
          result.data.response.openingHours.forEach((savedHour: any, idx: any) => {
            if (savedHour.days === shopHour.day) {
              shoptime[sdx]['hours'] = JSON.parse(savedHour.openingHours);
              shoptime[sdx]['enabled'] = true;
            }
          })
        })
        //console.log(shoptime);
      }

      result.data.response.holidayVaction.forEach((hv: any) => {
        if (hv.type === 1) {
          vacations.push({ date: format(new Date(hv.date), 'dd.MM.yyyy'), selectedDate: parseISO(hv.date), 
          toDate: format(new Date(hv.toDate), 'dd.MM.yyyy'), selectedToDate: parseISO(hv.toDate), reason: hv.reason });
          //holidays.push({date:hv.date, selectedDate: parseISO(hv.date), reason:hv.reason});
        }
        if (hv.type === 2) {
          holidays.push({ date: format(new Date(hv.date), 'dd.MM.yyyy'), selectedDate: parseISO(hv.date), reason: hv.reason });
          //vacations.push({date:hv.date, selectedDate: parseISO(hv.date), reason:hv.reason});
        }
      })
      this.setState({
        loading: false,
        branchData: (result.data.hasOwnProperty('response')) ? result.data.response : [],
        fields: result.data.response.branch,
        ...holidays,
        ...vacations,
        ...shoptime
      });
    }

  }

  handleValidation() {
    let fields = this.state.fields;
    let openingHours = this.state.shoptime;
    let errors: any = {};
    let isFormValid = true;
    console.log('fieldsfields', this.state.fields)
    //Opening Hours Validation
    openingHours.forEach((openingHour: any, idx: any) => {
      if (openingHour.enabled) {
        console.log(openingHour);
        openingHour.hours.forEach((hour: any, idx: any) => {
          if (hour.opentimeError || hour.closetimeError) {
            console.log(hour);
            console.log("fields Can't be Empties");
            isFormValid = false;
            errors["openingHours"] = "Required Fields Cannot be empty";
          }
        });
      }
    })

    //branchName
    if (fields["branchName"] === '') {
      isFormValid = false;
      errors["branchName"] = "Diese Eingabe ist erforderlich.";
    }

    //guestno
    if (fields["guestNo"] === '') {
      isFormValid = false;
      errors["guestNo"] = "Diese Eingabe ist erforderlich.";
    }

    //telephone
    if (fields["telephone"] === '' || fields["telephone"].length < 10) {
      isFormValid = false;
      errors["telephone"] = "telephone Cannot be empty or longer than 10 characters";
    }

    //Email
    if (fields["email"] === '') {
      isFormValid = false;
      errors["email"] = "email Diese Eingabe ist erforderlich.";
    }

    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf('@');
      let lastDotPos = fields["email"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
        isFormValid = false;
        errors["email"] = "Email is not valid";
      }
    }
    //  console.log(errors);
    this.setState({ errors: errors });
    console.log(fields);
    return isFormValid;
  }

  async handleSubmit(e: any) {
    e.preventDefault();
    if (this.handleValidation()) {
      let { id } = this.props.match.params
      let getUser: any = localStorage.getItem('user');
      console.log(typeof (getUser));
      getUser = (getUser !== null) ? JSON.parse(getUser) : {};
      //let branchData = this.state.branchData;

      let removeFields = ['createdby', 'modifiedDatetime', 'modifiedby', 'userId', 'createdDatetime'];
      let fields = this.state.fields;

      removeFields.forEach((field: any) => {
        if (fields.hasOwnProperty(field)) {
          delete fields[field];
        }
      });

      if (!fields.hasOwnProperty('guestNo')) {
        fields['guestNo'] = parseInt(fields['guestno']);
      }

      let openingHours = this.state.shoptime;
      let shopHours: any = [];
      let shopDays: any = [];

      openingHours.forEach((openingHour: any, idx: any) => {
        if (openingHour.enabled) {
          shopDays.push(openingHour.day);
          openingHour.hours.forEach((hour: any, idxn: any) => {
            delete hour.closetimeError;
            delete hour.opentimeError;
          });
          shopHours.push(JSON.stringify(openingHour.hours));
        }
      })

      let holidays = await this.state.holidays;
      let holidayDate: any = [];
      let holidayReason: any = [];
      holidays.forEach((vc: any, index: any) => {
        let datearray: any = vc.date.split(".");
        let newDate: any = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
        console.log(newDate);
        holidayDate.push(newDate);
        holidayReason.push(vc.reason);
      })

      let vacations = await this.state.vacations;
      let vacationDate: any = [];
      let vacationToDate: any = [];
      let reason: any = [];
      vacations.forEach((vc: any, index: any) => {
        let datearray: any = vc.date.split(".");
        let dateToarray: any = vc.toDate.split(".");
        let newDate: any = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
        let toDate: any = dateToarray[2] + '/' + dateToarray[1] + '/' + dateToarray[0];
        console.log(newDate);
        vacationDate.push(newDate);
        vacationToDate.push(toDate);
        reason.push(vc.reason);
      })

      console.log('fieldsfields', fields);
      let updateData = {
        ...fields,
        modifiedBy: getUser.userId,
        vacationDate: vacationDate,
        vacationToDate: vacationToDate,
        reason: reason,
        holidayDate: holidayDate,
        holidayVacationToDate: null,
        holidayReason: holidayReason,
        openingHours: shopHours,
        days: shopDays,
      };

      //console.log(updateData);
      //return false;

      const formData = new FormData()
      if(fields.hasOwnProperty('image') && fields['image'] !== "") {
        await formData.append('file', fields['image']);
      }
      formData.append('data', JSON.stringify(updateData));
      // for (var key in updateData) {
      //   formData.append(key, updateData[key]);
      // }
      console.log('data', updateData);
      //return false;

      let result: any = await imageData(`/branch/update/${id}`, formData);
      console.log(result);
      if (result.hasOwnProperty('status') && result.status === 200) {
        //alert(result.data.message);
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: { message: result.data.message, variant: 'success' },
        });
        await this.setState({toEdit: false});
      } else {
        this.props.dispatch({
          type: SET_MESSAGE,
          payload: { message: result.data.message, variant: 'Error' },
        });
      }
    }
  }

  async handleChangeAll(e: any) {
    let fields = this.state.fields;
    let { name, value } = e.target;
    fields[name] = value;
    if(name === 'telephone') {
      console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      fields[name] = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 ');
    }
    if (e.target.files !== null && e.target.files.length > 0) {
      fields['image'] = e.target.files[0];
      let imageData:any = await this.imageData(e.target.files[0]);
      await this.setState({ file: e.target.files[0], imageData: imageData });
    }
    this.setState({ fields: fields });
    console.log('handleChangeAll', fields, this.state.fields);
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

  selectedHolidayDate(date: any, index: any) {
    let upDate = [...this.state.holidays];
    //let dateVal = format( date, 'yyyy/MM/dd' );
    let dateVal = format(date, 'dd.MM.yyyy');
    upDate[index]['date'] = dateVal;
    upDate[index]['selectedDate'] = date;
    this.setState(upDate);
    console.log(this.state.holidays);
  }

  selectedVacationDate(date: any, index: any, assign:any) {
    let upDate = [...this.state.vacations];
    //let dateVal = format( date, 'yyyy/MM/dd' );
    let dateVal = format(date, 'dd.MM.yyyy');
    //upDate[index]['date'] = dateVal;
    //upDate[index]['selectedDate'] = date;
    if(assign) {
      upDate[index]['date'] = dateVal;
      upDate[index]['selectedDate'] = date;
    } else {
      upDate[index]['toDate'] = dateVal;
      upDate[index]['selectedToDate'] = date;
    }
    this.setState(upDate);
    console.log(this.state.vacations);
  }

  handleChangeVacations(index: any, event: any) {
    let vacations = [...this.state.vacations];
    let { name, value } = event.target;
    vacations[index][name] = value;
    this.setState(vacations);
    console.log(this.state.vacations);
  }

  async handleAddVacations() {
    //console.log('tst');
    await this.setState({ vacations: [...this.state.vacations, { date: "", selectedDate: "", toDate:"", selectedToDate: "",reason: "" }] });
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  async handleRemoveVacations(index: any) {
    console.log(index);
    let removeVacations = [...this.state.vacations];
    await removeVacations.splice(index, 1);
    console.log(removeVacations);
    await this.setState({ vacations: removeVacations });
    console.log(this.state.vacations);
  }

  handleChangeHolidays(index: any, event: any) {
    let holidays = [...this.state.holidays];
    let { name, value } = event.target;
    holidays[index][name] = value;
    this.setState(holidays);
    console.log(this.state.holidays);
  }

  async handleAddHolidays() {
    //console.log('tst');
    await this.setState({ holidays: [...this.state.holidays, { date: "", selectedDate: "", reason: "" }] });
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  async handleRemoveHolidays(index: any) {
    console.log(index);
    let removeHolidays = [...this.state.holidays];
    await removeHolidays.splice(index, 1);
    console.log(removeHolidays);
    await this.setState({ holidays: removeHolidays });
    console.log(this.state.holidays);
  }

  //ShopTime
  handleChangeShopTime(index: any, idx: any, event: any, cskey:any) {
    let shoptime = [...this.state.shoptime];
    let { name, value } = event.target;
    shoptime[index].hours[idx][name] = value;
    if(cskey && name === 'closetime') {
      shoptime[index].hours[idx]['cskey'] = parseInt(value.replace(":", ""));
    }
    if (shoptime[index].hours[idx][name]) {
      shoptime[index].hours[idx][`${name}Error`] = false;
    } else {
      shoptime[index].hours[idx][`${name}Error`] = true;
    }
    this.setState(shoptime);
    console.log(this.state.shoptime);
  }

  //ShopDay enable or disabled
  async handleChangeShopDay(index: any, event: any) {
    let shopDay = [...this.state.shoptime];
    let { name, value } = event.target;
    console.log(name, value);
    if (shopDay[index][name]) {
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
  async handleAddShopTime(index: any) {
    console.log(index);
    let shoptime = this.state.shoptime;
    await shoptime[index].hours.push({ opentime: "", opentimeError: true, closetime: "", cskey:"", closetimeError: true });
    await this.setState(shoptime);
    console.log(this.state.shoptime);
    //await this.setState({shoptime: [...this.state.shoptime, { day: "", opentime: "", closetime: ""}]});
    //let addholidays = [...this.state.holidays];
    //addholidays.push({ date: "", reason: ""});
    //this.setState({holidays: addholidays});
    //console.log(this.state.holidays);
  }

  //shoptiming Remove
  async handleRemoveShopTime(index: any, idx: any) {
    console.log(index);
    let removeshoptime = this.state.shoptime;
    await removeshoptime[index].hours.splice(idx, 1);
    //await this.setState({ shoptime: removeshoptime });
    await this.setState(removeshoptime);
    console.log(this.state.shoptime);
  }

  handleOpenhoursStatus() {
    let showHours = this.state.showOpenHours;
    if (showHours) {
      showHours = false;
    } else {
      showHours = true;
    }
    this.setState({ showOpenHours: showHours });
    console.log(this.state.showOpenHours);
  }

  handleShowHolidayStatus() {
    let showHolidays = this.state.showHolidays;
    if (showHolidays) {
      showHolidays = false;
    } else {
      showHolidays = true;
    }
    this.setState({ showHolidays: showHolidays });
    console.log(this.state.showHolidays);
  }

  handleShowVacationsStatus() {
    let showVacations = this.state.showVacations;
    if (showVacations) {
      showVacations = false;
    } else {
      showVacations = true;
    }
    this.setState({ showVacations: showVacations });
    console.log(this.state.showVacations);
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

    let { loading, branchData, timing, holidays, vacations, shoptime, showOpenHours, showHolidays, showVacations, file, imageData, toEdit }: any = this.state;

    return (
      <div>
        {/* <Header1 /> */}
        <LeftSidebar />
        <div className="mainWrapper">
          <div className="row no-gutters">
            <div className="col-xl-12">
              <div className="menu-category-bar ">
                <div className="container-fluid">
                  <div className="addBtn"><Link to="/filialeadd" className="btn btn-sm btn-success btn-rounded"><i className="lnr-plus-circle"></i> hinzufügen</Link></div>
                </div>
              </div>
              <div className="mainWrapperBody">
                <div className="form-page">
                  {loading ? <span>Loading...</span> : (
                    branchData.branch ?

                      <form onSubmit={this.handleSubmit.bind(this)}>

                        <div className="row">
                          <div className="col-lg-12 col-md-12 text-left">
                            <h3 className="sub_title"><i className="lnr-clock" /> Filiale</h3>
                          </div>
                        </div>
                        <div className="filialeInfoEditHide">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 text-left">
                              <div className="filialeImg">
                                <div className="uploadImg" onClick={this.showFileUpload}><i className="lnr-cloud-upload"></i></div>
                                <input
                                  type="file"
                                  name="profileImg"
                                  onChange={this.handleChangeAll}
                                  ref={this.stepInput}
                                  style={{ display: 'none' }}
                                />

                                    {
                                     file ?
                                        <img className="img-fluid profile-img" src={imageData} alt={ file.name } />
                                        : 
                                        branchData.branch['image'] ? 
                                        <img className="img-fluid profile-img" src={`${API_URL}/${branchData.branch['image']}`} alt="profile" />
                                        : 
                                        <img className="img-fluid profile-img" src={`/assets/images/1.jpg`} alt="profile" />
                                    }

                                {/* <img className="img-fluid" src={ (branchData.branch['image']) ? `${API_URL}/${branchData.branch['image']}` : `https://mycoid.ch/assets/images/1.jpg` } alt="filiale" />*/}
                              </div>
                            </div>
                            <div className="col-lg-8 col-md-8">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Firmenname</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="branchName" className="form-control" placeholder="memoria"
                                      value={this.state.fields.hasOwnProperty('branchName') ? this.state.fields['branchName'] : branchData.branch['branchName']} />
                                    <span className="text-danger error">{this.state.errors["branchName"]}</span>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Strasse Nr.</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="address" className="form-control" placeholder="Rosenweg 12"
                                      value={this.state.fields.hasOwnProperty('address') ? this.state.fields['address'] : branchData.branch['address']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>PLZ </label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="postcode" className="form-control" placeholder="4452"
                                      value={this.state.fields.hasOwnProperty('postcode') ? this.state.fields['postcode'] : branchData.branch['postcode']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Ort</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="city" className="form-control" placeholder="Itingen"
                                      value={this.state.fields.hasOwnProperty('city') ? this.state.fields['city'] : branchData.branch['city']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Kanton</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="place" className="form-control" placeholder="Swiss"
                                      value={this.state.fields.hasOwnProperty('place') ? this.state.fields['place'] : branchData.branch['place']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Land</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="country" className="form-control" placeholder="Schweiz"
                                      value={this.state.fields.hasOwnProperty('country') ? this.state.fields['country'] : branchData.branch['country']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Web</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="website" className="form-control" placeholder="www.one-ix.ch"
                                      value={this.state.fields.hasOwnProperty('website') ? this.state.fields['website'] : branchData.branch['website']} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Guest Limit</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="guestNo" className="form-control" placeholder="500"
                                      value={this.state.fields.hasOwnProperty('guestNo') ? this.state.fields['guestNo'] : branchData.branch['guestno']} />
                                    <span className="text-danger error">{this.state.errors["guestNo"]}</span>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>email</label>
                                  <div className="form-group">
                                    <input disabled={!toEdit ? true : false} type="text" onChange={this.handleChangeAll} name="email" className="form-control" placeholder="info@domain.com"
                                      value={this.state.fields.hasOwnProperty('email') ? this.state.fields['email'] : branchData.branch['email']} />
                                    <span className="text-danger error">{this.state.errors["email"]}</span>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 text-left">
                                  <label>Telefon</label>
                                  <div className="form-group">
                                    <div className="input-group">
                                          { /*<div className="input-group-prepend">
                                            <span className="input-group-text left-rounded-corner">+41</span>
                                          </div> */}
                                          <input disabled={!toEdit ? true : false} type="text" onFocus={event => this.handleCountryCode(event)} onChange={this.handleChangeAll} name="telephone" className="form-control right-rounded-corner" placeholder="Telefon"
                                      value={this.state.fields.hasOwnProperty('telephone') ? this.state.fields['telephone'] : branchData.branch['telephone']} />
                                    </div>
                                    <span className="text-danger error">{this.state.errors["telephone"]}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12 text-left">
                            <div className="form-group">
                              <h3 className="sub_title mb-3"><i className="lnr-clock" /> Öffnungszeiten
                              { toEdit &&                 
                                <span className="float-right">
                                  <div onClick={this.handleOpenhoursStatus} className="btn btn-success btn-rounded btn-sm filiale-btn"><i className="lnr-pencil"></i> bearbeiten</div>
                                </span>
                              }
                              </h3>
                              {!showOpenHours &&
                                <ul className="opening-hours openingHoursHide">
                                  {branchData.openingHours.map((opening: any, index: any) => <OpeningHour key={index} opening={opening} />)}
                                </ul>
                              }
                            </div>
                          </div>

                          {showOpenHours &&
                            <div className="col-md-12 openingHoursEdit">
                              <span className="text-left text-danger error mb-2 dinlineBlock">{this.state.errors["openingHours"]}</span><br />
                              {shoptime && shoptime.map((shoptime: any, index: any) => (
                                <Fragment key={`${shoptime}~${index}`}>
                                  <div className="row">
                                    <div className="col-md-3 form-group shoptimeChkLabel text-left">
                                      <p className="form-control checkBaseBorder">
                                        <label className="ix-checkbox-label">
                                          <input className="shoptimeCheck ix-checkbox" type="checkbox" name="enabled" onChange={event => this.handleChangeShopDay(index, event)} checked={shoptime.enabled ? true : false} value={shoptime.enabled} />{shoptime.day} <mark className="tickMark"></mark>
                                        </label>
                                      </p>

                                      {/*<select data-placeholder="Tag von" onChange={event => this.handleChangeShopTime(index, event)} name="day" className="form-control custom-select" tabIndex={1}>
                                                          <option value="">Tag von</option>
                                                          { days.length > 0 ? 
                                                            days.map((day:any) => (
                                                            <option value={day} selected={shoptime.day === day ? true : false}>{day}</option>
                                                            )) : null
                                                        </select>
                                                        */ }
                                    </div>
                                    <div className="col-md-9">
                                      {
                                        shoptime.enabled ?
                                          shoptime['hours'].map((hour: any, idx: any) => (
                                            <Fragment key={`${shoptime}~${idx}`}>
                                              <div className="row">
                                                <div className="col-md-5 form-group text-left">
                                                  <select data-placeholder="Zeit von" onChange={event => this.handleChangeShopTime(index, idx, event, false)} name="opentime" className="form-control custom-select" tabIndex={1}>
                                                    <option value="">Zeit von</option>
                                                    {/* timing.length > 0 ?
                                                      timing.map((time: any, hdx: any) => (
                                                        <Fragment key={`${hdx}`}>
                                                          <option value={time} selected={hour.opentime === time ? true : false}>{time}</option>
                                                        </Fragment>
                                                      )) : null
                                                      */ }
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
                                                  {hour.opentimeError ?
                                                    <span className="text-danger error">Pflichtfeld</span>
                                                    : null
                                                  }
                                                </div>
                                                <div className="col-md-5 form-group text-left">
                                                  <select data-placeholder="Zeit von" onChange={event => this.handleChangeShopTime(index, idx, event, true)} name="closetime" className="form-control custom-select" tabIndex={1}>
                                                    <option value="">Zeit von</option>
                                                    {/* timing.length > 0 ?
                                                      timing.map((time: any, hdx: any) => (
                                                        <Fragment key={`${hdx}`}>
                                                          <option value={time} selected={hour.closetime === time ? true : false}>{time}</option>
                                                        </Fragment>
                                                      )) : null
                                                      */ }
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
                                                  {hour.closetimeError ?
                                                    <span className="text-danger error">Pflichtfeld</span>
                                                    : null
                                                  }
                                                </div>
                                                <div className="col-md-2 text-right">
                                                  <div className="form-group">
                                                    {idx ?
                                                      <div onClick={() => this.handleRemoveShopTime(index, idx)} className="btn btn-sm btn-success btn-rounded" data-id="opening-hours-row1" data-type="custom-hours1">
                                                        <i className="lnr-circle-minus"></i> löschen
                                                                      </div>
                                                      :
                                                      <div onClick={() => this.handleAddShopTime(index)} className="btn btn-sm btn-success btn-rounded" data-id="opening-hours-row1" data-type="custom-hours1">
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
                          }

                          <div className="col-md-12 text-left">
                            <h3 className="sub_title mb-3"><i className="lnr-layers" /> Feiertage
                                { toEdit && 
                                <span className="float-right">
                                  <div onClick={this.handleShowHolidayStatus} className="btn btn-success btn-rounded btn-sm filiale-btn"><i className="lnr-pencil"></i> bearbeiten</div>
                                </span> }
                            </h3>
                            {!showHolidays &&
                              <div className="feiertageHide1">
                                <div className="row">
                                  {holidays ?
                                    holidays.map((holiday: any, idx: any) => (
                                      <React.Fragment key={`${idx}`}>
                                        <div className="col-md-3 form-group">
                                          <div className="card">
                                            <div className="card-body">
                                              <h5 className="card-title mb-3">{holiday.date} </h5>
                                              <p className="card-text">{holiday.reason}</p>
                                              { toEdit && 
                                              <p className="text-center"><span onClick={() => this.handleRemoveHolidays(idx)} style={{cursor: 'pointer'}}>löschen</span></p>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ))
                                    : null
                                  }
                                </div>
                              </div>
                            }

                            {showHolidays &&
                              <div className="feiertageEdit1">
                                <div id="Feiertage-row1">
                                  {holidays ?
                                    holidays.map((holiday: any, index: any) => (
                                      <React.Fragment key={`${index}`}>
                                        <div className="row">
                                          <div className="col-md-4">
                                            <DatePicker className="form-control" selected={holiday.selectedDate} dateFormat="dd.MM.yyyy" name="datepicker" onChange={(date) => { this.selectedHolidayDate(date, index) }} />
                                          </div>
                                          <div className="col-md-8">
                                            <div className="form-group">
                                              <div className="input-group">
                                                <input type="text" onChange={event => this.handleChangeHolidays(index, event)} className="form-control" placeholder="" name="reason" defaultValue={holiday.reason} />

                                                {index ?
                                                  <div onClick={() => this.handleRemoveHolidays(index)} className="input-group-append">
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
                                      </React.Fragment>
                                    ))
                                    : null
                                  }
                                </div>
                              </div>
                            }
                          </div>
                          <div className="col-md-12 text-left">
                            <h3 className="sub_title mb-3"><i className="lnr-layers" /> Ferien
                            { toEdit && 
                                <span className="float-right">
                                  <div onClick={this.handleShowVacationsStatus} className="btn btn-success btn-rounded btn-sm filiale-btn"><i className="lnr-pencil"></i> bearbeiten</div>
                                </span>
                            }
                            </h3>

                            {!showVacations &&
                              <div className="ferienHide1">
                                <div className="row">
                                  {vacations ?
                                    vacations.map((vacation: any, idx: any) => (
                                      <React.Fragment key={`${idx}`}>
                                        <div className="col-md-3 form-group">
                                          <div className="card">
                                            <div className="card-body">
                                              <h5 className="card-title mb-3">{vacation.date} - {vacation.toDate}</h5>
                                              <p className="card-text">{vacation.reason}</p>
                                              { toEdit && 
                                              <p className="text-center"><span onClick={() => this.handleRemoveVacations(idx)} style={{cursor: 'pointer'}}>löschen</span></p>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ))
                                    : null
                                  }
                                </div>
                              </div>
                            }

                            {showVacations &&
                              <div className="ferienEdit1">
                                <div id="ferien-row1">

                                  {vacations ?
                                    vacations.map((vacation: any, index: any) => (
                                      <React.Fragment key={`${index}`}>
                                        <div className="row">
                                          <div className="col-md-4">
                                          <div className="row">
                                              <div className="col-md-6">
                                              <DatePicker 
                                                className="form-control" 
                                                selected={vacation.selectedDate} 
                                                dateFormat="dd.MM.yyyy" 
                                                name="datepicker" 
                                                onChange={(date) => { this.selectedVacationDate(date, index, true) }}
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
                                                  dateFormat="dd.MM.yyyy" 
                                                  name="datepicker" 
                                                  onChange={(date) => { this.selectedVacationDate(date, index, false) }}
                                                  selectsEnd
                                                  startDate={vacation.selectedDate}
                                                  endDate={vacation.selectedToDate}
                                                  minDate={vacation.selectedDate} 
                                                  />
                                              }
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-8">
                                            <div className="form-group">
                                              <div className="input-group">
                                                <input type="text" onChange={event => this.handleChangeVacations(index, event)} className="form-control" placeholder="" name="reason" defaultValue={vacation.reason} />

                                                {index ?
                                                  <div onClick={() => this.handleRemoveVacations(index)} className="input-group-append">
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
                                      </React.Fragment>
                                    ))
                                    : null
                                  }
                                </div>
                              </div>
                            }
                          </div>

                          <div className="col-md-12 text-left">
                            <div className="form-group btn-groups">
                              <Link className="btn btn-primary btn-rounded" to="/filiale">zurück</Link>
                              { toEdit ? 
                                <button className="btn btn-success btn-rounded" id="submit" value="Submit">spicheren</button>
                                : 
                                <span className="btn btn-success btn-rounded" onClick={this.handleToEdit}>bearbeiten</span>
                              }
                            </div>
                          </div>
                        </div>
                      </form>

                      : <p>Loading...</p>)
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

const OpeningHour = ({ opening }: any) => {
  return (
    <li>
      <span>{opening.days} </span>
      {opening.openingHours ?
        JSON.parse(opening.openingHours).map((hour: any, idx: any) => <React.Fragment key={`${idx}`}><i>{hour.opentime} - {hour.closetime} Uhr</i></React.Fragment>)
        : null
      }

    </li>
  )
}

function mapStateToProps(state: any) {
  const { messages } = state;
  return {
    messages
  };
}
export default connect(mapStateToProps)(Filialedetail);

//export default Filialedetail
