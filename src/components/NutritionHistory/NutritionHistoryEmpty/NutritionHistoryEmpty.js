import React from 'react';
import {Button, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

const NutritionHistoryEmpty = () =>
    <Segment placeholder>
    <Header icon>
        <Icon name='flag outline' />
        You haven&apos;t logged any consumption yet.
    </Header>
    <Button animated='vertical' as={Link} to='/nutrition/log' primary>
        <Button.Content visible>Get Logging</Button.Content>
        <Button.Content hidden>
            <Icon name='plus'/>
        </Button.Content>
    </Button>
</Segment>;

export default NutritionHistoryEmpty;