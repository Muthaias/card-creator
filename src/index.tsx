import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { mergeStyles, registerIcons, loadTheme } from '@fluentui/react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlusCircle, faEdit, faSave, faFolderOpen, faFile, faFileExport, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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

registerIcons({
  icons: {
      'EntitlementRedemption': <Icon icon={faFile} />,
      'ChangeEntitlements': <Icon icon={faFileExport} />,
      'Add': <Icon icon={faPlusCircle} />,
      'Trash': <Icon icon={faTrashAlt} />,
      'Edit': <Icon icon={faEdit} />,
      'Save': <Icon icon={faSave} />,
      'OpenFile': <Icon icon={faFolderOpen} />,
      'Cancel': <Icon icon={faTimes} />,
      'chevrondown': <Icon icon={faChevronDown} />,
  },
});

loadTheme({
  defaultFontStyle: {
      fontFamily: 'Selawik, Verdana, Arial'
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
