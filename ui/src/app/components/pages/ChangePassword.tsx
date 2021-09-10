import React, { useState, useRef } from 'react';
//import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
//import Alert from '../shared/Modules/Alert'
import { postData} from '../../services/main-service';
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import LeftSidebar from '../shared/Modules/LeftSidebar';

type FormData = {
  oldPassword:string,
  password:string,
  rePassword:string
};
 
//import AuthService from '../../services/auth.service'
//export class PasswortReset extends Component<any,any>{
 function ForgetPassword(props:any){

  const { register, errors, handleSubmit, watch } = useForm<FormData>({
    criteriaMode: "all"
  });
  const password = useRef({});
  password.current = watch("password", "");
  console.log('errors',errors);

    //const [alertMsg, setAlertMsg] = React.useState({show:false,variant:'success',message:''});

    const [oldPasswordType, setoldPasswordType] = useState(true);

    const onSubmit = async (data: FormData) => {

      console.log({...data,  token: props.match.params.forgetToken });
      let changePassword:any = await postData(`/user/changePassword/${props.user.userId}`, data);
      console.log('forget Password', changePassword);
      if(changePassword.hasOwnProperty('status') && changePassword.status === 200) {
        //setAlertMsg({show:true,variant:'success',message:changePassword.data.message});
        props.dispatch({
          type: SET_MESSAGE,
          payload: { message:changePassword.data.message, variant:'success' },
        });
      } else {
        //setAlertMsg({show:true,variant:'danger',message:changePassword.data.message})
        props.dispatch({
          type: SET_MESSAGE,
          payload: { message:changePassword.data.message, variant:'Error' },
        });
      }

    }

    const changeoldPasswordType = async () => {
      console.log(oldPasswordType);
      console.log('testing');
      if(oldPasswordType) {
        setoldPasswordType(false);
      } else {
        setoldPasswordType(true);
      }
    }

        return( 
          <div>
            {/* <Alert variant={alertMsg.variant} show={alertMsg.show} message={alertMsg.message}/> */ }
          {/* <Header1 /> */}
          <LeftSidebar />
            <div className="mainWrapper">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="mainWrapperBody">
                    <div className="form-page">
                    <form onSubmit={handleSubmit(onSubmit)}>
                                  <div className="row justify-content-center">
                                  <div className="col-lg-6">
                                    <div className="col-lg-12 col-md-12 text-center">
                                      <h3 className="sec_title inner_head_padding">Passwort Zurücksetzen</h3>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="form-icon-base">
                                          <input type={oldPasswordType ? "password" : "text"} className="form-control" name="oldPassword" ref={register({ required: "Diese Eingabe ist erforderlich." })} placeholder="Altes Passwort" />
                                          <span className="form-icon"><img onClick={changeoldPasswordType} src={oldPasswordType ? "/assets/images/eye2.svg" : "/assets/images/eye1.svg"} alt="eye1" /></span>
                                        </div>
                                        <ErrorMessage
                                          errors={errors}
                                          name="oldPassword"
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
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="form-icon-base">
                                          <input id="pass3" type="text" className="form-control" name="password" ref={register({ required: "Diese Eingabe ist erforderlich." })} placeholder="Neues Passwort" />
                                          <span className="form-icon"><img id="pas_visible3" src="/assets/images/eye1.svg" alt="eye1" /></span>
                                        </div>
                                        <ErrorMessage
                                          errors={errors}
                                          name="password"
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
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="form-icon-base">
                                          {/* <input id="pass4" type="password" name="rePassword" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Passwort bestätigen" /> */ }
                                          <input id="pass4" type="password" name="rePassword" ref={ register({ validate: value => value === password.current || "The passwords do not match" }) } className="form-control" placeholder="Passwort bestätigen" />
                                          <span className="form-icon"><img id="pas_visible4" src="/assets/images/eye2.svg" alt="eye2" /></span>
                                        </div>
                                        <ErrorMessage
                                          errors={errors}
                                          name="rePassword"
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
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="form-group btn-groups">
                                        <button className="btn btn-primary btn-rounded" type="submit">Aktualisieren</button>
                                        {/* <Link className="btn btn-success btn-rounded" to="/">Aktualisieren</Link> */}
                                        </div>
                                      </div>
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
  //  }
}

function mapStateToProps(state: any) {
  console.log('loggedin', state)
  return {
    isAuthenticated: state.auth.isLoggedIn,
    messages: state.messages,
    user:state.auth.user
  }
}

export default connect(mapStateToProps)(ForgetPassword);

//export default ForgetPassword