import { Component } from 'react';
import Search from './components/Search';
import Results from './components/Results';
import './App.css';

class App extends Component {
  state = {
    searchTerm: '',
    hasError: false,
  };

  handleSearch = (searchTerm: string) => {
    this.setState({ searchTerm });
  };

  handleThrowError = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error("Test Error");
    }

    return (
        <div className="container">
          <Search onSearch={this.handleSearch} />
          <Results searchTerm={this.state.searchTerm} />
          <button className="error-button" onClick={this.handleThrowError}>
            Throw Error
          </button>
        </div>
    );
  }
}

export default App;
