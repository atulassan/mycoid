import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import Alert from '../shared/Modules/Alert'
// interface IProps {
//     dispatch?: any;
//     history?: any;
//     location?:any;
//     messages?: any;
// }

interface IState {
    username?: string;
    password?: string;
    loading?: boolean;
}

export class Login extends Component<any, IState>{

    private stepInput: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.stepInput = React.createRef();
        this.handleCloseLogin = this.handleCloseLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
        };
    }

    handleCloseLogin() {
        this.stepInput.current?.click();
    }  

    onChangeUsername(e: any) {
        this.setState({
            username: e.target.value,
        });
    }

    onChangePassword(e: any) {
        this.setState({
            password: e.target.value,
        });
    }
    handleLogin(e: any) {
        e.preventDefault();

        this.setState({
            loading: true,
        });

        // this.form.validateAll();
        console.log(' this.props', this.props)
        const { dispatch, history } = this.props;
        const query = new URLSearchParams(this.props.location.search);
        var userType=query.get('usertype')
        // if (this.checkBtn.context._errors.length === 0) {
        dispatch(login(this.state.username, this.state.password,userType))
            .then(() => {
                history.push("/myprofil");
                window.location.reload();
            })
            .catch(() => {
                this.setState({
                    loading: false
                });
            });
        // } else {
        //   this.setState({
        //     loading: false,
        //   });
        // }
    }
    loadAlert() {
        if (typeof this.props.messages.message === 'string')
            return (<Alert variant={this.props.messages.variant} show={this.props.messages.show} message={this.props.messages.message} />)
        else {
            const listItems = this.props.messages.message.map((msg:any,id:any) =><Alert key={id} variant={this.props.messages.variant} show={this.props.messages.show} message={msg} />);
            return listItems;
        }

    }
    

    render() {
        return (
            <div className="slide-form">
                {/* {this.loadAlert()} */}
                <div id="loginPopupClose" ref={this.stepInput} className="slideFormClose">&times;</div>
                <form id="login">
                    <h1>Anmeldung</h1>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <input type="email" onChange={this.onChangeUsername} className="form-control" placeholder="E-Mail" />
                                {/*<span className="errorMsg">Field is Required</span>*/}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="form-icon-base">
                                    <input id="pass1" onChange={this.onChangePassword} type="password" className="form-control" placeholder="Passwort" />
                                    <span className="form-icon"><img id="pas_visible1" src="assets/images/eye2.svg" alt="eye icon" /></span>
                                </div>
                                {/*<span className="errorMsg">Field is Required</span>*/}
                            </div>
                        </div>
                        <div className="col-lg-12 form-group text-left mt-3">
                            <label className="checkWrapper">angemeldet bleiben
                                <input type="checkbox" />
                                <span className="checkmark" />
                            </label>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <button className="btn btn-success btn-rounded" onClick={this.handleLogin}>
                                    Anmelden
                                </button>
                                {/* <Link className="btn btn-success btn-rounded" to="besucher">Anmelden</Link> */}
                            </div>
                        </div>
                        <div className="col-md-12 my-auto">
                            <div className="form-group">
                                <Link className="link" to="/passwotvergessen" onClick={this.handleCloseLogin}>Passwort vergessen?</Link>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group mt-2">
                                <p>Haben Sie noch keinen Benutzer?</p>
                                <Link className="btn btn-primary btn-rounded" to="/registerien" onClick={this.handleCloseLogin}>Registrieren</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
function mapStateToProps(state: any) {
    const { isLoggedIn } = state.auth;
    const { messages } = state;
    return {
        isLoggedIn,
        messages
    };
}
export default connect(mapStateToProps)(Login);