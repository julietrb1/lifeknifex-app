import React from 'react';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalCreateAnswer, goalsFetchAll, goalUpdateAnswer} from "../../actions/goals";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {BACKEND_DATE_FORMAT} from "../../constants";
import GoalAnswerEmpty from "./GoalAnswerEmpty/GoalAnswerEmpty";
import AnswerPre from "./AnswerPre/AnswerPre";
import AnswerPost from "./AnswerPost/AnswerPost";
import {firstCase} from "../../Utils";
import {RouteComponentProps} from "react-router";
import {IGoal, IGoalSlice, IGoalsStoreState} from "../../reducers/goals";
import {IAnswerSlice} from "../../reducers/answers";
import {MyThunkDispatch} from "../../store/configure-store";

interface IGoalAnswerDispatchProps {
    fetchGoals: () => any;
    updateAnswer: (goal: any, value: number) => any;
    createAnswer: (goal: any, value: number) => any;
}

interface IGoalAnswerStateProps {
    goals: IGoalsStoreState;
    hasErrored: boolean;
    isLoading: boolean;

}

interface IGoalAnswerMatchParams {
    goalId: string;
}

type Props = IGoalAnswerStateProps & IGoalAnswerDispatchProps & RouteComponentProps<IGoalAnswerMatchParams>;

interface IGoalAnswerState {
    currentGoalUrl: string;
    goalIndex: number;
    done: boolean;
    candidateValue: number;
    isPostMode: boolean;
    filteredGoals: IGoal[];
}

class GoalAnswer extends RequestComponent<Props, IGoalAnswerState> {
    state = {
        currentGoalUrl: '',
        goalIndex: -1,
        done: false,
        candidateValue: 0,
        isPostMode: new URLSearchParams(this.props.location.search).get('mode') === 'post',
        filteredGoals: []
    };

    componentDidMount() {
        if (!Object.keys(this.props.goals).length) {
            this.props.fetchGoals();
        } else {
            this.goToGoal();
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (!Object.keys(prevProps.goals).length && Object.keys(this.props.goals).length) {
            this.goToGoal();
        }
    }

    render() {
        const sections = [
            {name: 'Goals', href: '/goals'},
            {name: 'Answer'}
        ];
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title='Answer Goals' icon='goals'/>
            <this.PageContent/>
        </div>;
    }

    PageContent = () => {
        const currentGoalUrl: string = String(this.state.currentGoalUrl);
        if (this.state.done) {
            return <GoalAnswerEmpty/>;
        } else {
            const loading = this.props.isLoading || !this.state.filteredGoals;
            return <Form loading={loading} onSubmit={this.handleSubmit}>
                <Header>
                    {this.state.currentGoalUrl ?
                        `Did I ${firstCase(this.props.goals[currentGoalUrl].question)}?` :
                        'Loading Goal...'}
                    <this.GoalProgressCount/>
                </Header>
                <this.FormContent/>
            </Form>;
        }
    };

    GoalProgressCount = () => {
        if (this.props.match.params.goalId) {
            return null;
        }

        const currentGoalIndex = (this.state.filteredGoals || []).findIndex((goal: any) => goal.url === this.state.currentGoalUrl) + 1 ||
            '--';

        const filteredGoalLength = (this.state.filteredGoals || []).length || '--';
        return <Header.Subheader>{currentGoalIndex} / {filteredGoalLength}</Header.Subheader>;
    };

    handleSubmit = () => {
        this.handleFormAction();
    };

    handleGoBack = () => this.handleFormAction(-1);

    FormContent = () => {
        if (this.props.isLoading || !this.state.currentGoalUrl) {
            return <PlaceholderSet/>;
        } else if (this.state.isPostMode || this.props.match.params.goalId) {
            return <AnswerPost goal={this.props.goals[this.state.currentGoalUrl]} onAnswer={this.handleChangePostAnswer}
                               checkedValue={this.state.candidateValue}
                               mode={this.state.isPostMode ? 'post' : 'single'}
                               isStart={this.state.goalIndex === 0}
                               isEnd={this.state.filteredGoals &&
                               this.state.goalIndex === this.state.filteredGoals.length - 1}
                               goBack={this.handleGoBack}/>;
        } else {
            return <AnswerPre goal={this.props.goals[this.state.currentGoalUrl]} onAnswer={this.handlePreAnswer}/>;
        }
    };

    handleChangePostAnswer = (candidateValue: number) => this.setState({candidateValue});

    handlePreAnswer = (answerValue: number) => {
        this.props.createAnswer(this.props.goals[this.state.currentGoalUrl], answerValue);
        this.goToGoal();
    };

    goToGoal = (increment: number = 1) => {
        if (!Object.keys(this.props.goals).length) {
            throw new Error('No goals');
        }

        const goalIdParam = Number(this.props.match.params.goalId);
        const today = moment().format(BACKEND_DATE_FORMAT);
        const filteredGoals = this.filterGoals(goalIdParam, today);
        const newGoalIndex = this.state.goalIndex + increment;
        if (newGoalIndex < Object.values(filteredGoals || []).length) {
            const filteredUrl = String(filteredGoals[newGoalIndex].url);
            const candidateValue = this.props.goals[filteredUrl].todays_answer_value || 0;
            return this.setState({
                goalIndex: newGoalIndex,
                currentGoalUrl: filteredUrl,
                candidateValue
            });
        }

        if (goalIdParam) {
            this.props.history.replace('/goals');
        } else {
            this.setState({done: true});
        }
    };

    filterGoals(goalIdParam: number, today: string) {
        let filteredGoals: IGoal[];
        if (!Object.values(this.state.filteredGoals).length) {
            filteredGoals = Object.values(this.props.goals).filter(goal => {
                const shouldStopPre = !goalIdParam && goal.last_answered !== today;
                const shouldStopPost = this.state.isPostMode || (goalIdParam && goal.id === Number(goalIdParam));
                return shouldStopPost || shouldStopPre;
            });
            this.setState({filteredGoals});
        } else {
            filteredGoals = this.state.filteredGoals;
        }
        return filteredGoals;
    }

    private handleFormAction(increment: number = 1) {
        const haveSingleGoal = !!this.props.match.params.goalId;
        const currentGoalUrl = String(this.state.currentGoalUrl);
        const goalAnswered = !!this.props.goals[currentGoalUrl].todays_answer;
        const candidateValue = Number(this.state.candidateValue);
        if ((haveSingleGoal && goalAnswered) || this.state.isPostMode) {
            this.props.updateAnswer(this.props.goals[currentGoalUrl], candidateValue);
            if (this.state.isPostMode) {
                this.goToGoal(increment);
            } else {
                this.props.history.goBack();
            }
        } else if (haveSingleGoal) {
            this.props.createAnswer(this.props.goals[currentGoalUrl], candidateValue);
            this.props.history.goBack();
        }
    }
}

const mapStateToProps = (state: IGoalSlice & IAnswerSlice) => ({
    hasErrored: state.goalsHasErrored || state.answersHasErrored,
    isLoading: state.goalsIsLoading || state.answersIsLoading,
    goals: state.goals,
});

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
    fetchGoals: () => dispatch(goalsFetchAll()),
    updateAnswer: (goal: any, value: number) => dispatch(goalUpdateAnswer(goal, value)),
    createAnswer: (goal: any, value: number) => dispatch(goalCreateAnswer(goal, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalAnswer);