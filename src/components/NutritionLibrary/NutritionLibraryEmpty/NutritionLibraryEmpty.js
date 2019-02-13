import React from 'react';
import {Button, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {COLOR_NUTRITION} from "../../../constants";

const NutritionLibraryEmpty = () =>
    <Segment placeholder>
    <Header icon>
        <Icon name='flag outline' />
        You don&apos;t have any foods yet.
    </Header>
        <Button animated='vertical' as={Link} to='/nutrition/library/new' color={COLOR_NUTRITION}>
        <Button.Content visible>Let&apos;s Create One</Button.Content>
        <Button.Content hidden>
            <Icon name='plus'/>
        </Button.Content>
    </Button>
</Segment>;

export default NutritionLibraryEmpty;