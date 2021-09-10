
import React, { useEffect } from 'react';
import { connect } from "react-redux";

import { clearMessage } from 'app/actions/message';

function Alert(props: any) {
  const icon:any ={'danger':'fa-exclamation-triangle','success':'fa-check','info':'fa-info','warning':'fa-exclamation'};

  useEffect(()=>{
    setTimeout(()=>{
      props.dispatch(clearMessage());
    }, 5000)  
  }, [])

  const closeAlert = () => {
    props.dispatch(clearMessage());
  }

  if (props.show) {
    return (
      <div >
        <div className={"alert alert-" + (props.variant ? props.variant : 'danger') + ' active'}>
          <div className="alert-close" onClick={() => closeAlert()}>&times;</div>
          <span className="icon">
            <i className={icon[props.variant]?"fa "+icon[props.variant]:"fa fa-exclamation-triangle"} aria-hidden="true" />
          </span>
          <p>{props.message}</p>
        </div>
      </div>
    );
  }
  return null;

}

function mapStateToProps(state: any) {
  const { messages } = state;
  console.log(messages);
  return {
      messages
  };
}
export default connect(mapStateToProps)(Alert);

//export default Alert