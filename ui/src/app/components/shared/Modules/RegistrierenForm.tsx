import React, { useState } from 'react';
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { postData } from "../../../services/main-service"
import Alert from './Alert'

type FormData = {
  companyTypeId: string,
  companyName: string,
  contactperson: string,
  extraInfo: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  address: string,
  postcode: string,
  place: string,
  country: string,
  telephone: string,
  mobile: string,
  website: string,
  city: string,
};  

function RegistrierenForm(){

  let [telephone, setTelephone] = useState("");
  let [mobile, setMobile] = useState("");
  let [countryCode, setcountryCode] = useState("+41");

  const { register, errors, handleSubmit } = useForm<FormData>({
    criteriaMode: "all"
  });


  const handleCountryCode = (e:any) => {
      let code:any = countryCode;
      let {name, value} = e.target;
      let removeAvailCode:any = value.replace(`${code} `, "");
      if(name ==='telephone') {
        setTelephone(`${code} ${removeAvailCode}`);
      }
      if(name === 'mobile') {
        setMobile(`${code} ${removeAvailCode}`);
      }
      setcountryCode("+41");
      console.log(code);
  }

  const handleChange = (e:any) => {
    const {name, value} = e.target;
    if(name === 'telephone') {
      console.log('telephone', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      setTelephone(value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    }
    if(name === 'mobile') {
      console.log('mobile', value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
      setMobile(value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 '));
    }
    console.log("tel", name, value);
  }
  
  const [alertMsg, setAlertMsg] = React.useState({show:false,variant:'success',message:''});

  const onSubmit = async (data: FormData) => {
    let result:any = await postData('/auth/signup', data);
    console.log(data);
    if(result.hasOwnProperty('status') && result.status === 200) {
      //alert(result.data.message);  
      
      setAlertMsg({show:true,variant:'success',message:result.data.message})
      
    } else {
      setAlertMsg({show:true,variant:'danger',message:result.data.message})
      //alert(result.data.message);  
    }
    console.log(result);
  }

        return(
            <form onSubmit={handleSubmit(onSubmit)}>
              <Alert variant={alertMsg.variant} show={alertMsg.show} message={alertMsg.message}/>
              <div className="row">
              <div className="col-lg-12 col-md-12 text-left">
                <div className="form-group">
                  <h6>Ansprechperson</h6>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="firstName" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Vorname" />
                  <ErrorMessage
                    errors={errors}
                    name="firstName"
                    render={({ messages }) => {
                      return messages
                        ? Object.entries(messages).map(([type, message]) => (
                          <span className="text-danger error" key={type}>{message}</span>
                        ))
                        : null;
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="lastName" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Nachname" />
                  <ErrorMessage
                    errors={errors}
                    name="lastName"
                    render={({ messages }) => {
                      return messages
                        ? Object.entries(messages).map(([type, message]) => (
                          <span className="text-danger error" key={type}>{message}</span>
                        ))
                        : null;
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 text-left">
                <div className="form-group">
                  <h6>Kontaktinformationen</h6>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <div className="input-group">
                    {/* <div className="input-group-prepend">
                      <span className="input-group-text left-rounded-corner">+41</span>
                    </div> */}
                    <input type="text" name="telephone" onFocus={event => handleCountryCode(event)} onChange={event => handleChange(event)} ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Telefon" value={telephone ? telephone : ""} />
                    <ErrorMessage
                      errors={errors}
                      name="telephone"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <div className="input-group">
                    {/*<div className="input-group-prepend">
                      <span className="input-group-text left-rounded-corner">+41</span>
                    </div>*/}

                    <input type="text" name="mobile" onFocus={event => handleCountryCode(event)} onChange={event => handleChange(event)} ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Mobile" value={mobile ? mobile : ""} />
                    <ErrorMessage
                      errors={errors}
                      name="mobile"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <input type="text" name="email" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="E-Mail-Adresse" />
                  <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 text-left">
                <div className="form-group">
                  <h6>Informationen zum Betrieb</h6>
                </div>
              </div>
              <div className="col-lg-4 col-md-4  text-left">
                <div className="form-group">
                  <select name="companyTypeId" data-placeholder="Betriebstyp auswählen" ref={register({ required: true })} className="form-control" tabIndex={1}>
                    <option value="">Betriebstyp auswählen -</option>
                    <option value={1}>Bäckerei</option>
                    <option value={2}>Bar</option>
                    <option value={3}>Café</option>
                    <option value={4}>Club</option>
                    <option value={5}>Hotel</option>
                    <option value={6}>Restaurant</option>
                    <option value={7}>Sonstige (bitte in den Bemerkungen eintragen)</option>
                  </select>
                  <ErrorMessage
                      errors={errors}
                      name="companyTypeId"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 ">
                <div className="form-group">
                  <input type="text" name="companyName" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Name des Betriebs" />
                  <ErrorMessage
                      errors={errors}
                      name="companyName"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 ">
                <div className="form-group">
                  <input type="text" name="contactperson" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Name des Betriebsleitenden" />
                  <ErrorMessage
                      errors={errors}
                      name="contactperson"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="website" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Webseite" />
                  <ErrorMessage
                      errors={errors}
                      name="website"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="address" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Strasse Nr." />
                  <ErrorMessage
                      errors={errors}
                      name="address"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="postcode" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="PLZ" />
                  <ErrorMessage
                      errors={errors}
                      name="postcode"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="city" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Ort" />
                  <ErrorMessage
                      errors={errors}
                      name="city"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="place" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Kanton" />
                  <ErrorMessage
                      errors={errors}
                      name="place"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input type="text" name="country" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Land" />
                  <ErrorMessage
                      errors={errors}
                      name="country"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 text-left">
                <div className="form-group">
                  <h6>Weitere Informationen</h6>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                <textarea name="extraInfo" className="form-control" placeholder="Mitteilung" />
                  { /* <textarea name="extraInfo" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Mitteilung" />
                  <ErrorMessage
                      errors={errors}
                      name="extraInfo"
                      render={({ messages }) => {
                        return messages
                          ? Object.entries(messages).map(([type, message]) => (
                            <span className="text-danger error" key={type}>{message}</span>
                          ))
                          : null;
                      }}
                    /> */ }
                </div>
              </div>
              <div className="col-md-12 my-auto text-center">
                <div className="form-group btn-groups">
                  <button className="btn btn-primary btn-rounded" type="submit">Registrieren</button>
                </div>
              </div>
              </div>
            </form>
        )
    
}

export default RegistrierenForm;

