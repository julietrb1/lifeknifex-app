import {Link} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Divider, Header, Icon, Image, Label} from 'semantic-ui-react';
import * as constants from '../../constants';
import {APP_TITLE} from '../../constants';
import {getAccount} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';

class Home extends RequestComponent {
    componentDidMount() {
        getAccount(this.cancelToken)
            .then(res => {
                if (!res) {
                    this.props.history.replace('/login');
                }
            });
    }

    comingSoonBadge = <Card.Meta><Label><Icon name='gem'/> Coming Soon</Label></Card.Meta>;
    alphaBadge = <Card.Meta><Label size='small'><Icon name='bug'/> Alpha</Label></Card.Meta>;
    betaBadge = <Card.Meta><Label size='small'><Icon name='bug'/> Beta</Label></Card.Meta>;

    render() {
        document.title = `Home - ${APP_TITLE}`;
        return <div>
            <Header
                as='h2'
                content='LifeKnifeX'
                subheader='The swiss army knife of personal order'
            />
            <Divider hidden/>
            <Card.Group centered>
                <Card color={constants.COLOR_NUTRITION}>
                    <Card.Content>
                        <Image src='/img/home_cover_nutrition.svg'/>
                        <Card.Header>Nutrition</Card.Header>
                        <Card.Meta>{this.betaBadge}</Card.Meta>
                        <Card.Description>
                            Logging what you eat and drink is the first step to becoming healthier, little by little.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button as={Link} to='/nutrition' color={constants.COLOR_NUTRITION}>Visit</Button>
                        <Button as={Link} to='/nutrition/log' basic>Log</Button>
                        <Button as={Link} to='/nutrition/library' basic>Library</Button>
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_GOALS}>
                    <Card.Content>
                        <Image src='/img/home_cover_goals.svg'/>
                        <Card.Header>Goals</Card.Header>
                        <Card.Description>
                            If you have an aspiration to achieve something big in life, start here. Every bit counts.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_CAREER}>
                    <Card.Content>
                        <Image src='/img/home_cover_career.svg'/>
                        <Card.Header>Career</Card.Header>
                        <Card.Description>
                            If you don&apos;t track how well you&apos;re doing in your job, how will you see
                            improvement? Start here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_MOOD}>
                    <Card.Content>
                        <Image src='/img/home_cover_mood.svg'/>
                        <Card.Header>Mood</Card.Header>
                        <Card.Description>
                            If there&apos;s one thing that counts more than emotions, it&apos;s your mood. Don&apos;t
                            let it run you over.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_SCORE}>
                    <Card.Content>
                        <Image src='/img/home_cover_score.svg'/>
                        <Card.Header>Score</Card.Header>
                        <Card.Description>
                            There&apos;s no reason why organisation shouldn&apos;t be fun! Keep track of your progress
                            and success here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_ACCOUNT}>
                    <Card.Content>
                        <Image src='/img/home_cover_account.svg'/>
                        <Card.Header>Account</Card.Header>
                        <Card.Meta>{this.alphaBadge}</Card.Meta>
                        <Card.Description>
                            Need to log out, or manage your account? Get all of your paperwork and maintenance done
                            here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button as={Link} to='/account' color={constants.COLOR_ACCOUNT}>Visit</Button>
                    </Card.Content>
                </Card>
            </Card.Group>
        </div>;
    }
}

Home.propTypes = {
    history: PropTypes.object
};

export default Home;