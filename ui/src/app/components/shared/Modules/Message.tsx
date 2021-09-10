import React from 'react';
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { postData } from "../../../services/main-service"
import Alert from './Alert'

type FormData = {
    message: string,
  };  

function Message(props: any) {

    const { openMail, visitCheck } = props;
    
    const { register, errors, handleSubmit } = useForm<FormData>({
        criteriaMode: "all"
    });
      
    const [alertMsg, setAlertMsg] = React.useState({show:false,variant:'success',message:''});

    var activeClass = ""
    
        if(openMail) {
            activeClass= "active";
        } else {
            activeClass = "";
        }



        const onSubmit = async (data: FormData) => {
            console.log(data);
            /*let visitors:any = visitCheck.filter((visitor:any, idx:any)=> {
                return visitor.check === true;
            });*/
            //let arr:any = visitCheck;
            var visitors:any = visitCheck.filter((visitCheck:any, index:any, self:any) => index === self.findIndex((t:any) => (t.customerId === visitCheck.customerId && t.check === true)));
            console.log(visitors);
            if(visitors.length > 0) {
                let sData:any = { visitors: visitors, ...data };
                console.log(sData);
                let result:any = await postData('/message/add', sData);
                console.log(result);
                if(result.hasOwnProperty('status') && result.status === 200) {
                    setAlertMsg({show:true,variant:'success',message:result.data.message});
                } else {
                    setAlertMsg({show:true,variant:'danger',message:result.data.message});
                }
            } else {
                setAlertMsg({show:true,variant:'danger',message:"No User Selected"});
            }
        }

        const removePopup = () => {
            props.sendData(false);
        }

        return(
            <div className={`slide-form ${activeClass}`}>
                <div onClick={removePopup} id="SentMsgPopupClose" className="slideFormClose">&times;</div>
                <Alert variant={alertMsg.variant} show={alertMsg.show} message={alertMsg.message}/>
                <form id="login" onSubmit={handleSubmit(onSubmit)}>
                    <h1>Nachricht senden</h1>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group NachrichtText">
                                <textarea className="form-control" name="message" ref={register({ required: "Diese Eingabe ist erforderlich." })}></textarea>
                                <ErrorMessage
                                    errors={errors}
                                    name="message"
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
                            <div className="form-group mt-2"> 
                                <button className="btn btn-primary btn-rounded" type="submit">Senden</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default Message

