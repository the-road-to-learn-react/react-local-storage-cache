import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { query: '', hits: [] };
  }

  onChange = event => {
    this.setState({ query: event.target.value });
  };

  onSearch = event => {
    event.preventDefault();

    const { query } = this.state;

    if (query === '') {
      return;
    }

    const cachedHits = localStorage.getItem(query);

    if (cachedHits) {
      this.setState({ hits: JSON.parse(cachedHits) });
    } else {
      fetch('https://hn.algolia.com/api/v1/search?query=' + query)
        .then(response => response.json())
        .then(result => this.onSetResult(result, query));
    }
  };

  onSetResult = (result, key) => {
    localStorage.setItem(key, JSON.stringify(result.hits));

    this.setState({ hits: result.hits });
  };

  render() {
    return (
      <div>
        <h1>Search Hacker News with Local Storage</h1>
        <p>
          There shouldn't be a second network request, when you search
          for a keyword twice.
        </p>

        {/* Search Input */}
        <form onSubmit={this.onSearch}>
          <input type="text" onChange={this.onChange} />
          <button type="submit">Search</button>
        </form>

        {/* Result */}
        {this.state.hits.map(item => (
          <div key={item.objectID}>{item.title}</div>
        ))}
      </div>
    );
  }
}

export default App;
