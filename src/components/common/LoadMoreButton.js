import React from 'react';
import {Button, Icon} from "semantic-ui-react";
import PlaceholderSet from "./PlaceholderSet/PlaceholderSet";

const LoadMoreButton = props => {
    if (!props.isLoading && props.resultSet && props.resultSet.next) {
        return <div className="load-more-container">
            <Button basic
                    onClick={this.handleLoadMore}
                    animated='vertical'>
                <Button.Content visible>Load More</Button.Content>
                <Button.Content hidden>
                    <Icon name='arrow down'/>
                </Button.Content>
            </Button>
        </div>;
    } else if (props.isLoading && props.resultSet && props.resultSet.results && props.resultSet.results.length) {
        return <PlaceholderSet/>;
    } else {
        return <div className="load-more-container"><Button disabled basic>All loaded</Button></div>;
    }
};

export default LoadMoreButton;