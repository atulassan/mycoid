import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Alert from '../shared/Modules/Alert'
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { SET_MESSAGE } from "../../actions/types";
// import Header from './Header';
// import Login from './Login';
type FormData = {
 password:string,
 rePassword:string
}; 
import AuthService from '../../services/auth.service'
//export class PasswortReset extends Component<any,any>{
 function PasswortReset(props:any){
  const { register, errors, handleSubmit } = useForm<FormData>({
    criteriaMode: "all"
  });
console.log('errors',errors)
  // constructor(props:any){
  //   super(props);
  //   const query = new URLSearchParams(this.props.location.search);
  //   console.log('query',query,props.match.params)
  //   //email: query.get('email'),
  //   if (props.match.params.token) {
  //     AuthService.checkVerifyToken({  verifyToken: props.match.params.token }).then(
  //       (response: any) => {
  //         console.log('res', response.data.response)
  //         this.setState({companyName:response.data.response.companyName});

  //         return Promise.resolve();
  //       },
  //       (error: any) => {
  //         const message =
  //           (error.response &&
  //             error.response.data &&
  //             error.response.data.message) ||
  //           error.message ||
  //           error.toString();
  //         this.props.history.push("/404");
  //         console.log('msg', message);

  //         return Promise.reject();
  //       }
  //     );
  //     this.setState({email:query.get('email')})
  //   }
  //   else {
  //     this.props.history.push("/404");
  //   }

  // }
   // render(){
    useEffect(()=>{
      // do stuff here...
      console.log("testing");
    if (props.match.params.token) {
         AuthService.checkVerifyToken({  verifyToken: props.match.params.token }).then(
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
  }, [])
    const [alertMsg, setAlertMsg] = React.useState({show:false,variant:'success',message:''});
    const onSubmit = async (data: FormData) => {
      let result:any = await AuthService.verifyToken({...data,  verifyToken: props.match.params.token });
      console.log(data);
      if(result.hasOwnProperty('status') && result.status === 200) {
        //alert(result.data.message);
        /*setAlertMsg({show:true,variant:'success',message:result.data.message});
        props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'success'},
        });
        props.history.push("/");*/

        let email:any = result.data.response.getUserQuery['email'];
        if(email) {
            console.log(' this.props', props)
            const { dispatch, history } = props;
            const query = new URLSearchParams(props.location.search);
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
          setAlertMsg({show:true,variant:'success',message: result.data.message});
        }
        
      } else {
        setAlertMsg({show:true,variant:'danger',message:result.data.message});
        props.dispatch({
          type: SET_MESSAGE,
          payload: {message:result.data.message,variant:'error'},
        });
        //alert(result.data.message);  
      }
      console.log(result);
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
                                  <div className="row justify-content-center">
                                    <div className="col-lg-12 col-md-12 text-center">
                                      <h3 className="sec_title inner_head_padding">Passwort erstellen</h3>
                                    </div>
                                    <div className="col-md-8">
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
                                    <div className="col-md-8">
                                      <div className="form-group">
                                        <div className="form-icon-base">
                                          <input id="pass4" type="password" name="rePassword" ref={register({ required: "Diese Eingabe ist erforderlich." })} className="form-control" placeholder="Passwort bestätigen" />
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
                                    <div className="col-md-8">
                                      <div className="form-group">
                                        <div className="form-group btn-groups">
                                        <button className="btn btn-primary btn-rounded" type="submit">Weiter</button>
                                        {/* <Link className="btn btn-success btn-rounded" to="/">Weiter</Link> */}
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
export default connect(mapStateToProps)(PasswortReset);

//export default PasswortReset