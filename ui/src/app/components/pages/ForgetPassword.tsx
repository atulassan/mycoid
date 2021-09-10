import React, { useRef } from 'react';
//import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Alert from '../shared/Modules/Alert'
import { postData} from '../../services/main-service';
import { connect } from "react-redux";
import { login } from "../../actions/auth";

type FormData = {
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

  /*useEffect(()=>{ 
    if (props.match.params.forgetToken) {
         AuthService.checkVerifyToken({ verifyToken: props.match.params.forgetToken }).then(
        (response: any) => {
          console.log('res', response.data.response)
          return Promise.resolve();
        },
        (error: any) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          props.history.push("/404");
          console.log('msg', message);

          return Promise.reject();
        }
      );
    }
    else {
      props.history.push("/404");
    }
  }, []) */

    const [alertMsg, setAlertMsg] = React.useState({show:false,variant:'success',message:''});

    const onSubmit = async (data: FormData) => {
      //let result:any = await AuthService.verifyToken({...data,  verifyToken: props.match.params.forgetToken });
      //console.log(result);
      /*if(result.hasOwnProperty('status') && result.status === 200) {
        setAlertMsg({show:true,variant:'success',message:result.data.message})
        props.history.push("/");
        
      } else {
        setAlertMsg({show:true,variant:'danger',message:result.data.message})
      }*/
      
      console.log({...data,  token: props.match.params.forgetToken });
      let forgetPassword:any = await postData(`/auth/reset/passwordlinkviatoken`, {...data,  token: props.match.params.forgetToken });
      console.log('forget Password', forgetPassword);
      if(forgetPassword.hasOwnProperty('status') && forgetPassword.status === 200) {
        //setAlertMsg({show:true,variant:'success',message:forgetPassword.data.message});
        //props.history.push("/");

        let email:any = forgetPassword.data.response.getUserQuery['email'];
        if(email) {
            console.log(' this.props', props)
            const { dispatch, history } = props;
            const query = new URLSearchParams(props.location.search);
            let email:any = 'alex@one-x.ch';
            var userType=query.get('usertype')
            // if (this.checkBtn.context._errors.length === 0) {
            dispatch(login(email, data.password,userType))
                .then(() => {
                    history.push("/myprofil");
                    window.location.reload();
                })
                .catch(() => {
                    console.log('error occurred');
                }); 
        } else {
          setAlertMsg({show:true,variant:'success',message:forgetPassword.data.message});
        }
      } else {
        setAlertMsg({show:true,variant:'danger',message:forgetPassword.data.message})
      }

    }

        return( 
                <div>
                  <Alert variant={alertMsg.variant} show={alertMsg.show} message={alertMsg.message}/>
                    {/* <Header /> */}
                    {/* <Login /> */}
                    
                    <div className="topBanner" ></div>
                    <section id="welcome" className='' style={{minHeight:'600px'}}>
                      <div className="container">
                        <div className="row justify-content-md-center">
                          <div className="col-xl-6 col-lg-6 ">
                            <div className="form-page section-md">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                  <div className="row"><div className="col-lg-12 col-md-12 text-center">
                                      <h3 className="sec_title inner_head_padding">Passwort Zurücksetzen</h3>
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
                    </section>

                </div>
            )
  //  }
}

function mapStateToProps(state: any) {
  const { messages } = state;
  return {
      messages
  };
}
export default connect(mapStateToProps)(ForgetPassword);

//export default ForgetPassword