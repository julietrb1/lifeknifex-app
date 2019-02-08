import React from "react";
import axios from "axios";

class RequestComponent extends React.Component {
    cancelToken = axios.CancelToken.source();

    componentWillUnmount() {
        this.cancelToken.cancel('Component unmounted');
    }
}

export default RequestComponent;