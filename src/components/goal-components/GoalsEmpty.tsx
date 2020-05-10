import React from 'react';
import {Button, Icon, Image, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {COLOR_GOALS} from "../../constants";
// import PropTypes from 'prop-types';

const GoalsEmpty = () =>
    <Segment textAlign='center' placeholder>
        <Image className="placeholder-image" src='/img/undraw_i_can_fly_7egl.svg' size='medium'/>
        <h3>You don&apos;t have any Goals yet.</h3>
        <Button animated='vertical' as={Link} to='/goals/new' color={COLOR_GOALS}>
            <Button.Content visible>Let&apos;s Create One</Button.Content>
            <Button.Content hidden>
                <Icon name='plus'/>
            </Button.Content>
        </Button>
    </Segment>;

GoalsEmpty.propTypes = {};

export default GoalsEmpty;