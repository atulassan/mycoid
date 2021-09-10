import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import Message from '../shared/Modules/Message';
import { getData } from '../../services/main-service';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { connect } from "react-redux";
// import Header1 from './Header1';
// import $ from "jquery";

export class Besucher extends Component<any, any> {

  constructor(props: any) {
    super(props);
      this.state = {
        loading: false,
        visitors: [],
        branches: [],
        visitCheck:[],
        visitCheckAll : false,
        searchBar: false,
        totalItems: "", 
        totalPages: "", 
        pageSize: "",
        currentPage: 0,
        sendMsg: false,
        openMail: false,
        searchTxt:"",

      }
      this.handleSearchBar = this.handleSearchBar.bind(this);
      this.handleVisitorCheck = this.handleVisitorCheck.bind(this);
      this.handlePageClick = this.handlePageClick.bind(this);
      this.handleOpenMail = this.handleOpenMail.bind(this);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.handleSearchChange = this.handleSearchChange.bind(this);
      this.getSendData = this.getSendData.bind(this);
  }
  

  componentDidMount() {
    this.setState({loading: true});
    this.fetchItems();
  }

  async fetchItems() {
      //let getUser:any = localStorage.getItem('user');
      //getUser = (getUser !== null) ? JSON.parse(getUser) : {};
      let branches:any = await getData(`/branch/user/${this.props.user.userId}`);
      console.log(branches);
      let visitors:any = await getData(`/visitor/all`);
      let visitorCheck:any = this.state.visitCheck;
      console.log(visitors);
      if(visitors.status === 200 && visitors.data.response['data'].length > 0) {
        visitors.data.response['data'].forEach((visitor:any, idx:any) => {
          let vc:any = { id: visitor.visitorId, branchId: visitor.branchId, customerId: visitor.customerId, branchuserId:this.props.user.userId, createdBy:this.props.user.userId, check:false };
          visitorCheck.push(vc);
        });
      }
      this.setState({
        loading: false, 
        visitors: (visitors.status == 200) ? visitors.data.response : [], 
        branches: (branches.status == 200) ?  branches.data.response : [],
        visitCheck: visitorCheck,
        totalItems: (visitors.status == 200) ? visitors.data.response.totalItems : "", 
        totalPages: (visitors.status == 200) ? visitors.data.response.totalPages : "", 
        pageSize: (visitors.status == 200) ? visitors.data.response.pageSize : "",
        currentPage: (visitors.status == 200) ? visitors.data.response.startPage : 0
      });

    }
    
  async handleSearchBar() {
    let searchBar = this.state.searchBar;
    if(searchBar) {
      searchBar = false;
      let getUser:any = localStorage.getItem('user');
      getUser = (getUser !== null) ? JSON.parse(getUser) : {};
      let visitors:any = await getData(`/visitor/all`);
      let visitorCheck:any = this.state.visitCheck;
      console.log(visitors);
      if(visitors.status === 200 && visitors.data.response['data'].length > 0) {
        visitors.data.response['data'].forEach((visitor:any, idx:any) => {
          let vc:any = { id: visitor.visitorId, branchId: visitor.branchId, customerId: visitor.customerId, branchuserId:getUser.userId, createdBy:getUser.userId, check:false };
          visitorCheck.push(vc);
        });

        this.setState({
          loading: false, 
          visitors: (visitors.status == 200) ? visitors.data.response : [],
          visitCheck: visitorCheck,
          totalItems: (visitors.status == 200) ? visitors.data.response.totalItems : "", 
          totalPages: (visitors.status == 200) ? visitors.data.response.totalPages : "", 
          pageSize: (visitors.status == 200) ? visitors.data.response.pageSize : "",
          currentPage: (visitors.status == 200) ? visitors.data.response.startPage : 0
        });
      }        
    } else {
      searchBar = true;
    }
    console.log(searchBar);
    this.setState({searchBar: searchBar});
  }
  
  async handleSearchSubmit(e: any) {
    console.log(e);
    e.preventDefault();
    let getUser:any = localStorage.getItem('user');
    getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let search = this.state.searchTxt;
    let visitors:any = await getData(`/visitor/all/?search=${search}`);
    let visitorCheck:any = this.state.visitCheck;
      console.log(visitors);
      if(visitors.status === 200 && visitors.data.response['data'].length > 0) {
        visitors.data.response['data'].forEach((visitor:any, idx:any) => {
          let vc:any = { id: visitor.visitorId, branchId: visitor.branchId, customerId: visitor.customerId, branchuserId:getUser.userId, createdBy:getUser.userId, check:false };
          visitorCheck.push(vc);
        });

        this.setState({
          loading: false, 
          visitors: (visitors.status == 200) ? visitors.data.response : [],
          visitCheck: visitorCheck,
          totalItems: (visitors.status == 200) ? visitors.data.response.totalItems : "", 
          totalPages: (visitors.status == 200) ? visitors.data.response.totalPages : "", 
          pageSize: (visitors.status == 200) ? visitors.data.response.pageSize : "",
          currentPage: (visitors.status == 200) ? visitors.data.response.startPage : 0
        });

      }
  }

  async handleSearchChange(e: any) {
    //let search = this.state.searchTxt;
    const {name, value} = e.target;
    console.log(name);
    await this.setState({searchTxt: value});
    console.log(this.state.searchTxt);
  }

  async handlePageClick(e:any) {
    let currentPage = this.state.currentPage;
    let selected = parseInt(currentPage) + parseInt(e.selected);
    let result:any = await getData(`/visitor/all/?currentpage=${selected}`);
    console.log(result);
    this.setState({visitors: (result.data.hasOwnProperty('response')) ?  result.data.response : []})
  }
  

  async handleVisitorCheck(vca:any, vc:any, idx:any) {

    let visitCheck:any = this.state.visitCheck;
    let sendMsg:any = this.state.sendMsg;
    
    if(vca) {
      if(this.state.visitCheckAll) {
        await this.setState({visitCheckAll: false});
        visitCheck.forEach((visit:any, indx:any) => {
          visitCheck[indx]['check'] = false;
          sendMsg = false;
        });
      } else {
        await this.setState({visitCheckAll: true});
        visitCheck.forEach((visit:any, indx:any) => {
          visitCheck[indx]['check'] = true;
          sendMsg = true;
        });
      }
      await this.setState({visitCheck: visitCheck, sendMsg: sendMsg});
    }

    if(vc) {
      visitCheck.forEach((visit:any, indx:any) => {
        if(indx === idx) {
          if(visitCheck[indx]['check']) {
            visitCheck[indx]['check'] = false;
            sendMsg = false;
          } else {
            visitCheck[indx]['check'] = true;
            sendMsg = true;
          }
        } else {
          visitCheck[indx]['check'] = false;
        }
      });
    }

    await this.setState({visitCheck: visitCheck, sendMsg: sendMsg});
    console.log(visitCheck);
    console.log(sendMsg);

  }

  async handleOpenMail() {
    let openMail = this.state.openMail;
    if(openMail) {
      openMail = false;
    } else {
      openMail = true;
    }
    await this.setState({openMail: openMail});
    console.log(this.state.openMail);
  }


  async getSendData(val:any) {
    console.log(val);
    await this.handleVisitorCheck(true, false, null);
    await this.setState({openMail: val});
    console.log(this.state.openMail);
  }  

    render(){

      //let { loading, visitors, branches, visitCheck, searchBar, totalItems, totalPages, sendMsg, openMail, visitCheckAll }:any =  this.state;
      let { loading, visitors, branches, visitCheck, searchBar, totalItems, totalPages, sendMsg, openMail }:any =  this.state;

        return(
            <div>
                {/* <Header1 /> */}
                  <LeftSidebar />
                  <div className="mainWrapper">
                      <div className="row no-gutters w-100">
                        <div className="col-xl-12">
                          <div className="menu-category-bar ">
                            <div className="container-fluid p-0">
                              <div className="menu-category-search">
                                { !searchBar && <i className="icon-search lnr-magnifier" onClick={this.handleSearchBar} /> }
                                { searchBar && 
                                <form onSubmit={this.handleSearchSubmit.bind(this)}>
                                  <div className="searchBase search-display">
                                      <div className="icon-search-close" onClick={this.handleSearchBar}>
                                        <img src="assets/images/svg/close.svg" alt="Close icon" />
                                      </div>
                                      <div className="input-group">
                                          <button className="btn" data-type="submit"><i className="lnr-magnifier" /></button>
                                          <input className="form-control" onChange={this.handleSearchChange} name="search" data-type="search" placeholder="Suchen..." />
                                          <div className="input-group-append">
                                             <span onClick={this.handleSearchSubmit} className="input-group-text" id="basic-addon2">senden</span> 
                                          </div>
                                      </div>
                                  </div>
                                </form>
                                }
                              </div>
                              { !searchBar &&  
                              <div id="navMenu">
                                  <div id="navMenu-wrapper" className="FilialeFilter">
                                    <ul id="navMenu-items">
                                      <div id="menuSelector" />
                                      <li className="navMenu-item active"> <Link className="scrollLink" to="">Alle</Link></li>
                                      { branches['data'] &&
                                        branches['data'].map((branch:any, idx:any) => 
                                        <Fragment key={`${idx}`}>
                                          <li className="navMenu-item"> <Link className="scrollLink" to={`/filialebesucher/${branch.branchId}`}>{branch.branchName}</Link></li>    
                                        </Fragment>  
                                        )
                                      }
                                    </ul>
                                    <div className="navMenu-paddles">
                                      <button className="navMenu-paddle-left icon-chevronleft" aria-hidden="true"><i className="lnr-chevron-left" /></button>
                                      <button className="navMenu-paddle-right icon-chevronright" aria-hidden="true"> <i className="lnr-chevron-right" /></button>
                                    </div>
                                  </div>

                                  { sendMsg &&
                                    <button onClick={ this.handleOpenMail } className="btn btn-sm btn-success btn-rounded SentMsg">Nachricht senden</button>
                                  }

                              </div>
                              }  
                            </div>
                          </div>
                          <div className="mainWrapperBody">
                            <div className="table-responsive">
                              <table className="table table-striped mb-0 order-list-table" cellSpacing={0}>
                                <thead>
                                    <tr>
                                      <th className="text-center" data-width="5%">
                                        <label className="ix-checkbox-label">
                                          { /* visitCheckAll ? 
                                            <input type="checkbox" className="ix-checkbox" name="visitorCheckAll" onClick={()=>this.handleVisitorCheck(true, false, null)} checked />
                                          : 
                                            <input type="checkbox" className="ix-checkbox" name="visitorCheckAll" onClick={()=>this.handleVisitorCheck(true, false, null)} />
                                          */ }
                                          <mark className=''/>
                                        </label>
                                        </th>
                                      <th className="text-right" data-width="10%">BesucherID</th>
                                      <th className="text-right" data-width="10%">Datum</th>
                                      <th className="text-right" data-width="10%">Check-in</th>
                                      <th className="text-right" data-width="10%">Check-out</th>
                                      <th className="text-center" data-width="15%">Vorname</th>
                                      <th className="text-center" data-width="15%">Nachname</th>
                                      <th className="text-center" data-width="15%">E-Mail</th>
                                      <th style={{textAlign: 'center'}} data-width="10%">Aktion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                  { loading ? null :
                                      visitors['data'] && visitors['data'].map((visitor:any, idx:any) => {
                                        //console.log(visitCheck[idx]);
                                        return (
                                          <Fragment key={`${idx}`}>
                                          <tr>
                                            <td className="text-center">
                                              <label className="ix-checkbox-label">
                                                <input type="checkbox" className="ix-checkbox" name="visitorCheck" onClick={()=>this.handleVisitorCheck(false, true, idx)} 
                                                 checked={visitCheck[idx]['check'] ? true : false} readOnly /><mark className=''/>
                                              </label>
                                            </td>
                                            <td className="text-right">{visitor.visitorId}</td>
                                            <td className="text-right">{ format(new Date(visitor.createdDatetime), 'dd.MM.yyyy') }</td>
                                            <td className="text-right">{visitor.checkinTime}</td>
                                            <td className="text-right">{visitor.checkoutTime}</td>
                                            <td className="text-center">{visitor.mycoidCustomer.firstName} Sar</td>
                                            <td className="text-center">{visitor.mycoidCustomer.lastName}</td>
                                            <td className="text-center">{visitor.mycoidCustomer.email}</td>
                                            <td align="center">
                                            <div className="btn">
                                              <Link className="btn btn-sm btn-success btn-rounded" to={`/besucherview/${visitor.visitorId}`}>ansicht</Link>
                                            </div>
                                            </td>
                                        </tr>                          
                                      </Fragment>
                                        )
                                      })
                                  }                                  
                                  </tbody>
                              </table>
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
                <Message openMail={openMail} visitCheck={visitCheck} sendData={this.getSendData} />
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {
  console.log('loggedin', state)
  return {
    isAuthenticated: state.auth.isLoggedIn,
    messages: state.messages,
    user:state.auth.user
  }
};

export default connect(
  mapStateToProps
)(Besucher);


//export default Besucher
