import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData } from '../../services/main-service';
import { format } from 'date-fns';
// import Header1 from './Header1';

export class Geschichteview extends Component<any, any>{

  constructor(props: any) {
    super(props);
    this.state = {
      loading:true,
      message: {},
    }
  }

  componentDidMount() {
    this.fetchItems();
  }

  async fetchItems() {
    let { id }:any =  this.props.match.params;
    let result:any = await getData(`/message/${id}`);
    this.setState({loading:false, message:(result.status === 200) ? result.data.response : {}});
  }

    render(){
      const {loading, message} = this.state;
      console.log(loading);
      console.log(message);
        return(
            <div>
                {/* <Header1 /> */}
                  <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="form-page">
                            { loading ? <p>Loading...</p> : (
                              message ? 
                              <form>
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>ID</label>
                                      <div className="form-group">
                                        <p className="form-control">{message.messageId}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Filiale</label>
                                      <div className="form-group">
                                        <p className="form-control">{ message.mycoidBranch.branchName }</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Datum</label>
                                      <div className="form-group">
                                        <p className="form-control"> { format(new Date(message.createdDatetime), 'dd.MM.yyyy') }</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 text-left">
                                      <label>Absender</label>
                                      <div className="form-group">
                                        <p className="form-control">{ message.mycoidBranchUser }</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 text-left">
                                      <label>Mitteilungen</label>
                                      <div className="form-group">
                                        <p className="form-control minMesgHight">{message.message}</p>
                                      </div>
                                    </div>
                                    <div className="col-md-12 my-auto text-left">
                                      <div className="form-group btn-groups">
                                        <Link className="btn btn-primary btn-rounded" to="/geschichte">zurück</Link>
                                      </div>
                                    </div>
                                  </div>
                                </form>  
                              : 
                              <p>No Informationen Update </p>
                              )
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
export default Geschichteview
