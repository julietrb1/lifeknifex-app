import React from 'react';
import axios from 'axios';

class RequestComponent<P = {}, S = {}> extends React.Component<P, S> {
  cancelToken = axios.CancelToken.source();

  componentWillUnmount() {
    this.cancelToken.cancel('Component unmounted');
  }
}

export default RequestComponent;
