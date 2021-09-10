import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '../shared/Modules/LeftSidebar';
import { getData } from "../../services/main-service";
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
// import Header1 from './Header1';

export class Geschichte extends Component<any, any>{ 

  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      messages: [],
      totalItems: "", 
      totalPages: "", 
      pageSize: "",
      currentPage: 0,
    }
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.fetchItems();
  }

  async fetchItems() {
    let result:any = await getData(`/message/all`);
    console.log(result);
    //console.log("++++++++++++++++++++++");
    this.setState({
      loading: false, 
      messages: (result.data.hasOwnProperty('response')) ?  result.data.response : [],
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
    let result:any = await getData(`/message/all/?currentpage=${selected}`);
    console.log(result);
    this.setState({messages: (result.data.hasOwnProperty('response')) ?  result.data.response : []})
  }

    render() {

      const { loading, messages, totalItems, totalPages }:any = this.state;

      //console.log(loading); 
      //console.log(messages); 

        return(
            <div>
                {/* <Header1 /> */}
                <LeftSidebar />
                  <div className="mainWrapper">
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="mainWrapperBody">
                          <div className="table-responsive">
                            { loading ? <p>Loading...</p> :

                              ( messages['data'] ?   

                            <table className="table table-striped mb-0 order-list-table" cellSpacing={0}>
                              <thead>
                                <tr>
                                  <th className="text-center" data-width="5%">#</th>
                                  <th className="text-center"  data-width="10%">Filiale</th>
                                  <th className="text-right"  data-width="10%">Datum</th>
                                  <th className="text-center" data-width="15%">Absender</th>
                                  <th className="text-left"  data-width="35%">Mitteilungen</th>
                                  <th className="text-center" data-width="15%">Aktion</th>
                                </tr>
                              </thead>
                              <tbody>
                              { messages['data'].map((message:any, idx:any) => 
                                  <Fragment key={`${idx}`}>
                                <tr>
                                  <td className="text-center">{`#${message.messageId}`}</td>
                                  <td className="text-center">{ message.mycoidBranch.branchName }</td>
                                  <td className="text-right"> { format(new Date(message.createdDatetime), 'dd.MM.yyyy') }</td>
                                  <td className="text-center">{ message.mycoidBranchUser }</td>
                                  <td>{message.message}</td>
                                  <td align="center">
                                      <div className="btn">
                                        <Link className="btn btn-sm btn-success btn-rounded" to={`/geschichteview/${message.messageId}`}>ansicht</Link>
                                      </div>
                                  </td>
                                </tr>
                                </Fragment>
                                )}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan={9} align="right">
                                    <p></p>
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
                                            containerClassName={"pagination pagination-sm"}
                                            activeClassName={"active"} />
                                      }
                                    </div>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                            : <p>No Data Available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

            </div>
        )
    }
}
export default Geschichte
