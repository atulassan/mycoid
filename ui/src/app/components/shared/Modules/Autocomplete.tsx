import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export class Autocomplete extends Component<any, any> {
  
  static propTypes = {
      options: PropTypes.instanceOf(Array).isRequired
  };

  constructor(props: any) {
    super(props);
    this.state = {
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: '',
      branchId: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { savedValue } = this.props;
    if(savedValue) {
      this.setState({userInput: savedValue});  
    }
  }

  async handleChange(e:any) {
    console.log('onChanges');

    const { options } = this.props;
    const userInput = e.currentTarget.value;

    const filteredOptions = options.filter((optionName:any, idx:any) => {
      let branchName:any = optionName.branchName.toLowerCase();
        return branchName.indexOf(userInput.toLowerCase()) > -1;
      });

    await this.setState({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value
    });
  };

  async handleClick(e:any, branchId:any) {
   await this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText,
      branchId: branchId
    });

    this.props.sendData(this.state.branchId);

    console.log(this.state.branchId);
  };

  handleKeyDown = (e:any) => {

    const { activeOption, filteredOptions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: filteredOptions[activeOption]
      });
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
      this.setState({ activeOption: activeOption - 1 });
    } else if (e.keyCode === 40) {
      if (activeOption === filteredOptions.length - 1) {
        console.log(activeOption);
        return;
      }
      this.setState({ activeOption: activeOption + 1 });
    }
  };

  render() {
    const { activeOption, filteredOptions, showOptions, userInput }:any = this.state;
    let optionList:any;
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
            <ul className="options">
              {filteredOptions.map((optionName:any, index:any) => {
                let className;
                if (index === activeOption) {
                  className = 'option-active';
                }
                return (
                    <li className={className} key={optionName.branchId} onClick={event => this.handleClick(event, optionName.branchId)}>
                      {optionName.branchName}
                    </li>
                );
              })}
            </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <em>No Branches Available this name</em>
          </div>
        );
      }
    }
    return (
      <Fragment>
        <div className="ac-view">
          <input type="text" className="search-box" onChange={this.handleChange} onFocus={this.handleChange} value={userInput} />
          {/* <input type="text" className="search-box" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={userInput} /> <input type="submit" value="" className="search-btn" /> */}
          <div className="ac-list">
            {optionList}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Autocomplete;