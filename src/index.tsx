import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { mergeStyles } from 'office-ui-fabric-react';

// Inject some global styles
mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100vh',
      background: '#ffffff',
      marginBottom: "200px",
      marginTop: "25px"
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
