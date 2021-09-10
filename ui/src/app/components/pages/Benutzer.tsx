import React, { Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, postData } from "../../services/main-service";
import { connect } from "react-redux";
import { SET_MESSAGE } from "../../actions/types";
import { format } from 'date-fns';

// import Header1 from './Header1';
// import $ from "jquery";

export class Benutzer extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      branchUsers: [],
      totalItems: "", 
      totalPages: "", 
      pageSize: "",
      currentPage: 0,
    }
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.setState({loading: true});
    this.fetchItems();
  }

  async fetchItems() {
    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let branchUsers:any = await getData('/branchuser/all');
    console.log(branchUsers);
    this.setState({
      loading: false, 
      branchUsers: (branchUsers.status == 200) ? branchUsers.data.response : [],
      totalItems: (branchUsers.status == 200) ? branchUsers.data.response.totalItems : "" , 
      totalPages: (branchUsers.status == 200) ?  branchUsers.data.response.totalPages : "", 
      pageSize: (branchUsers.status == 200) ? branchUsers.data.response.pageSize : "",
      currentPage: (branchUsers.status == 200) ? branchUsers.data.response.startPage : 0,
    });
  }

  async handlePageClick(e:any) {
    let currentPage = this.state.currentPage;
    let selected = parseInt(currentPage) + parseInt(e.selected);
    let branchUsers:any = await getData(`/branchuser/all/?currentpage=${selected}`);
    console.log(branchUsers);
    this.setState({branchUsers: (branchUsers.data.hasOwnProperty('response')) ?  branchUsers.data.response : []})
  }

  async handleRemoveUser(event:any, userId:any) {
    console.log(event);
    console.log(userId);
    let removeUser:any = await postData(`/branchuser/remove/${userId}`, {});
    console.log(removeUser);
    if(removeUser.status == 200) {
      let branchUsers:any = await getData('/branchuser/all');
      this.setState({
        branchUsers: (branchUsers.status == 200) ? branchUsers.data.response : [],
      });
      this.props.dispatch({
        type: SET_MESSAGE,
        payload: {message:removeUser.data.message,variant:'success'},
      });
    } else {
      this.props.dispatch({
        type: SET_MESSAGE,
        payload: {message:removeUser.data.message,variant:'Error'},
      });  
    }
  }


    render() {

      const { loading, branchUsers, totalItems, totalPages }:any = this.state;
      console.log(loading);
      console.log(branchUsers);

        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="menu-category-bar">
                          <div className="container-fluid">
                            <div className="addBtn">
                              <Link to="benutzeradd" className="btn btn-sm btn-success btn-rounded"><i className="lnr-plus-circle"></i> hinzufügen</Link>
                            </div>
                          </div>
                        </div>
                        <div className="mainWrapperBody">
                          <div className="table-responsive">
                            { loading ? <p>Loading...</p> : 
                            ( branchUsers['data'] ? 
                            <table className="table table-striped mb-0 order-list-table" cellSpacing={0}>
                            <thead>
                              <tr>
                                <th className="text-center"  data-width="5%">#</th>
                                <th className="text-center"  data-width="10%">Filiale</th>
                                <th className="text-center"  data-width="10%">Funktion</th>
                                <th className="text-center"  data-width="10%">Vorname</th>
                                <th className="text-center"  data-width="10%">Nachname</th>
                                <th className="text-center"  data-width="15%">Mobil</th>
                                <th className="text-center"  data-width="15%">E-Mail</th>
                                <th className="text-right"  data-width="15%">Erstellt am</th>
                                <th className="text-center"  data-width="15%">Status</th>
                                <th className="text-center"  data-width="10%">Aktion</th>
                              </tr>
                            </thead>
                            <tbody>
                                { branchUsers['data'].map((branchUser:any, idx:any) => 
                                  <Fragment key={`${idx}`}>
                                    <tr>
                                      <td className="text-center"><Link to={`/benutzeredit/${branchUser.branchuserId}`} className="link-blue">#{branchUser.branchuserId}</Link></td>
                                      <td className="text-center">{(branchUser.hasOwnProperty('mycoidBranch') && branchUser.mycoidBranch.branchName !== "") ? branchUser.mycoidBranch.branchName : null }</td>
                                      <td className="text-center">{branchUser.branchuserId}</td>
                                      <td className="text-center">{branchUser.firstName}</td>
                                      <td className="text-center">{branchUser.lastName}</td>
                                      <td className="text-center">{branchUser.telephone}</td>
                                      <td className="text-center">{branchUser.email}</td>
                                      <td className="text-right"> { format(new Date(branchUser.createdDatetime), 'dd MMM yyyy') } </td>
                                      <td className="text-center">
                                        { branchUser.status === 1 
                                          ?
                                          <div className="badge badge-success">aktiv</div>
                                          :
                                          <div className="badge badge-danger">inaktiv</div>
                                        }
                                      </td>
                                      <td className="text-center">
                                          <div className="btn-group active">
                                            <span className="dropdown">
                                              <div className="info" data-toggle="dropdown"><i>i</i></div>
                                              <ul className="dropdown-menu">
                                                <li><Link to={`/benutzeredit/${branchUser.branchuserId}`}>ansicht</Link></li>
                                                <li><Link to={`/benutzeredit/${branchUser.branchuserId}`}>bearbeiten</Link></li>
                                              </ul>
                                            </span>
                                            <div onClick={(event)=>{this.handleRemoveUser(event, branchUser.branchuserId)}} className="deleteRow"><i className="lnr-trash" /></div>
                                          </div>
                                      </td>
                                    </tr>
                                  </Fragment>
                                )}
                            </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={10} align="right">
                              
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                            : <p>Data Not Found</p>
                            )
                            }
                          </div>

                          <div className="fliale-Pagination-base mt-2">
                            { totalItems && 
                              <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={(event)=>this.handlePageClick(event)}
                                containerClassName={"pagination pagination-sm float-right"}
                                activeClassName={"active"} />
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
export default connect(mapStateToProps)(Benutzer);
//export default Benutzer
