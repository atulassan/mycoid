import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData, postData } from "../../services/main-service";
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";

const API_URL:any = process.env.API_URL;

export class Myprofiledit extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      branches: [],
      totalItems: "", 
      totalPages: "", 
      pageSize: "",
      currentPage: 0,
    }
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleRemoveBranch = this.handleRemoveBranch.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  componentDidMount() {
    this.fetchItems();
  }

  async fetchItems() {
    //let getUser:any = localStorage.getItem('user');
    //getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result:any = await getData(`/branch/user/${this.props.user.userId}`);
    console.log(result);
    this.setState({
      loading: false, 
      branches: (result.data.hasOwnProperty('response')) ?  result.data.response : [],
      totalItems: (result.status == 200) ? result.data.response.totalItems : "" , 
      totalPages: (result.status == 200) ?  result.data.response.totalPages : "", 
      pageSize: (result.status == 200) ? result.data.response.pageSize : "",
      currentPage: (result.status == 200) ? result.data.response.startPage : 0,
     });
  }

  async handlePageClick(e:any) {
    let currentPage = this.state.currentPage;
    let selected = parseInt(currentPage) + parseInt(e.selected);
    console.log(selected);
    //let getUser:any = localStorage.getItem('user');
    //getUser = (getUser !== null) ? JSON.parse(getUser) : {};
    let result:any = await getData(`/branch/user/${this.props.user.userId}/?currentpage=${selected}`);
    console.log(result);
    this.setState({branches: (result.data.hasOwnProperty('response')) ?  result.data.response : []})
  }

  async handleRemoveBranch(id:any, event:any) {
    console.log(id);
    let removeBranch:any = await postData(`/branch/remove/${id}`, {id: id});
    console.log(removeBranch);
    let result:any = await getData(`/branch/user/${this.props.user.userId}`);
    console.log(result);
    this.setState({
      loading: false, 
      branches: (result.data.hasOwnProperty('response')) ?  result.data.response : [],
      totalItems: (result.status == 200) ? result.data.response.totalItems : "" , 
      totalPages: (result.status == 200) ?  result.data.response.totalPages : "", 
      pageSize: (result.status == 200) ? result.data.response.pageSize : "",
      currentPage: (result.status == 200) ? result.data.response.startPage : 0,
     });
  }

  async handleChangeStatus(id:any, event:any) {
    console.log(id);
  }
    render(){

      const {loading, branches, totalItems, totalPages}:any = this.state;

        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="menu-category-bar ">
                          <div className="container-fluid">
                            <div className="addBtn"><Link to="filialeadd" className="btn btn-sm btn-success btn-rounded"><i className="lnr-plus-circle"></i> hinzufügen</Link></div>
                          </div>
                        </div>
                        <div className="mainWrapperBody">
                          <div className="form-page">
                          { loading 
                          ? <span>Loading...</span> 
                          : ( branches['data'] 
                            ? branches['data'].map((branch:any, id:any) => (
                              <Fragment key={`${id}`}>
                                <div className="row branch">
                                  <div className="col-xl-2 col-lg-3 col-md-4 text-left">
                                    <div className="filialeImg filialeListImg">
                                      <Link to={`/filialedetail/${branch.branchId}`} className="branch-title">
                                        <img className="img-fluid profile-img" src={(branch.image) ? `${API_URL}/${branch.image}` : `/assets/images/1.jpg`} alt={branch.branchName} />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="col-xl-10 col-lg-9 col-md-8  text-left">
                                    <Link to={`/filialedetail/${branch.branchId}`} className="branch-title">
                                      <h3>{branch.branchName}</h3>
                                    </Link>
                                    <div className="branch-info">
                                      <ul>
                                        <li>Kanton : <span>{branch.place}</span></li>
                                        <li>PLZ : <span>{branch.postcode}</span></li>
                                        <li>Ort : <span>{branch.city}</span></li>
                                      </ul>
                                    </div>
                                    <div className="branch-contact">
                                      <ul>
                                        <li><i className="ico lnr-map-marker" /><span>{branch.address}</span></li>
                                        <li><i className="ico lnr-phone-handset" /><span>{branch.telephone}</span></li>
                                        <li><i className="ico lnr-envelope" /><span>{branch.email}</span></li>
                                        <li><i className="ico lnr-link" /><span >{branch.website}</span></li>
                                        <li><i className="ico lnr-layers" /><Link to={`/filialebesucher/${branch.branchId}`}>Besucher</Link></li>
                                        <li style={{cursor: 'pointer'}} onClick={ event => this.handleRemoveBranch(branch.branchId, event) }><i className="ico lnr-trash" />entfernen</li>
                                        <li style={{cursor: 'pointer'}} onClick={ event => this.handleChangeStatus(branch.branchId, event) }><i className="ico lnr-trash" />Deaktiveren</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </Fragment>
                            ))
                            : <p>Kein Eintrag vorhanden</p>
                          )
                          }
                          {/* branches['data'] ? branches['data'].map((branch:any, i:any) => <Branch key={i} branch={branch} /> ) : 
                                <p>Loading...</p> */}
                          </div>
                          <div className="fliale-Pagination-base">
                            {totalItems && 
                              <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={(event)=>this.handlePageClick(event)}
                                containerClassName={"pagination pagination-sm"}
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

/*const handleRemoveBranch = async function (id: any, event:any) {
  console.log(id);
  let result:any = await postData(`/branch/remove/${id}`, {id: id});
  console.log(result);
}*/

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
)(Myprofiledit);

//export default Myprofiledit
