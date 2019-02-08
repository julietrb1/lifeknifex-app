import {Link} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {Card, Divider, Header} from 'semantic-ui-react';
import * as constants from '../../constants';
import {APP_TITLE} from '../../constants';
import {getAccount} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';

class Home extends RequestComponent {
    componentDidMount() {
        getAccount(this.cancelToken)
            .then(account => {
                if (!account) {
                    this.props.history.replace('/login');
                }
            });
    }

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
                <Card
                    header='Nutrition'
                    image='/img/home_cover_nutrition.svg'
                    description='Logging what you eat and drink is the first step to becoming healthier, little by little.'
                    color={constants.COLOR_NUTRITION}
                    to='/nutrition'
                    as={Link}
                />
                <Card
                    header='Goals'
                    image='/img/home_cover_goals.svg'
                    description='If you have an aspiration to achieve something big in life, start here. Every bit counts.'
                    color={constants.COLOR_GOALS}
                    to='/goals'
                    as={Link}
                />
                <Card
                    header='Career'
                    image='/img/home_cover_career.svg'
                    description="If you don't track how well you're doing in your job, how will you see improvement? Start here."
                    color={constants.COLOR_CAREER}
                    to='/career'
                    as={Link}
                />
                <Card
                    header='Mood'
                    image='/img/home_cover_mood.svg'
                    description="If there's one thing that counts more than emotions, it's your mood. Don't let it run you over."
                    color={constants.COLOR_MOOD}
                    to='/mood'
                    as={Link}
                />
                <Card
                    header='Score'
                    image='/img/home_cover_score.svg'
                    description="There's no reason why organisation shouldn't be fun! Keep track of your progress and success here."
                    color={constants.COLOR_SCORE}
                    to='/score'
                    as={Link}
                />
                <Card
                    header='Account'
                    image='/img/home_cover_account.svg'
                    description="Need to log out, or manage your account? Get all of your paperwork and maintenance done here."
                    color={constants.COLOR_ACCOUNT}
                    to='/account'
                    as={Link}
                />
            </Card.Group>
        </div>;
    }
}

Home.propTypes = {
    history: PropTypes.object
};

export default Home;