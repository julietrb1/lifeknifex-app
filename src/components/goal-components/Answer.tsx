import React, {useEffect, useState} from 'react';
import BreadcrumbSet from "../common-components/BreadcrumbSet";
import HeaderBar from "../common-components/HeaderBar";
import {useDispatch, useSelector} from "react-redux";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common-components/PlaceholderSet";
import moment from "moment";
import {BACKEND_DATE_FORMAT} from "../../constants";
import AnswerEmpty from "./AnswerEmpty";
import AnswerPre from "./AnswerPre";
import AnswerPost from "./AnswerPost";
import {firstCase} from "../../Utils";
import IGoal from "../../models/IGoal";
import {createAnswer, fetchAllGoals, updateAnswer} from "../../features/goals/goalSlice";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {selectAllGoals, selectGoalsLoaded, selectGoalsLoading} from "../../features/goals/goalSelectors";

const sections = [
    {name: 'Goals', href: '/goals'},
    {name: 'Answer'}
];

const Answer: React.FC = () => {
    const dispatch = useDispatch();
    const {search} = useLocation();
    const {goalId} = useParams();
    const history = useHistory();
    const goals = useSelector(selectAllGoals);
    const isLoading = useSelector(selectGoalsLoading);
    const isLoaded = useSelector(selectGoalsLoaded);
    const [goalIndex, setGoalIndex] = useState(-1);
    const currentGoal = goals[goalIndex];
    const [done, setDone] = useState(false);
    const [candidateValue, setCandidateValue] = useState(0);
    const isPostMode = new URLSearchParams(search).get('mode') === 'post';
    const [filteredGoals, setFilteredGoals] = useState<IGoal[] | null>(null);

    useEffect(() => {
        if (!isLoaded) dispatch(fetchAllGoals());
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && !filteredGoals) filterGoals();
    }, [goals]);

    useEffect(() => {
        if (filteredGoals) goToGoal();
    }, [filteredGoals]);

    const PageContent = () => {
        if (done) {
            return <AnswerEmpty/>;
        } else {
            const loading = isLoading || !filteredGoals;
            return <Form loading={loading} onSubmit={handleFormAction}>
                <Header>
                    {currentGoal ?
                        `Did I ${firstCase(currentGoal.question)}?` :
                        'Loading Goal...'}
                    <GoalProgressCount/>
                </Header>
                <FormContent/>
            </Form>;
        }
    };

    const handlePreAnswer = async (answerValue: number) => {
        await dispatch(createAnswer(currentGoal, answerValue));
        goToGoal();
    };

    const FormContent = () => {
        if (isLoading || !currentGoal) {
            return <PlaceholderSet/>;
        } else if (isPostMode || goalId) {
            return <AnswerPost goal={currentGoal} onAnswer={setCandidateValue}
                               checkedValue={candidateValue}
                               mode={isPostMode ? 'post' : 'single'}
                               isStart={goalIndex === 0}
                               isEnd={filteredGoals &&
                               goalIndex === filteredGoals.length - 1}
                               goBack={() => handleFormAction(-1)}/>;
        } else {
            return <AnswerPre goal={currentGoal} onAnswer={handlePreAnswer}/>;
        }
    };

    const filterGoals = () => {
        if (!filteredGoals) {
            setFilteredGoals(goals.filter(goal => {
                const shouldStopPre = !goalId && goal.last_answered !== moment().format(BACKEND_DATE_FORMAT);
                const shouldStopPost = isPostMode || (goalId && goal.id === Number(goalId));
                return shouldStopPost || shouldStopPre;
            }));
        }
    };

    const goToGoal = (increment: number = 1) => {
        if (!goals.length || !filteredGoals) {
            throw new Error('No goals');
        }

        const newGoalIndex = goalIndex + increment;
        if (newGoalIndex < filteredGoals.length) {
            setGoalIndex(newGoalIndex);
            return;
        }

        if (goalId) {
            history.replace('/goals');
        } else {
            setDone(true);
        }
    };

    const GoalProgressCount = () => {
        if (goalId) {
            return null;
        }

        const filteredGoalLength = filteredGoals?.length || '--';
        return <Header.Subheader>{goalIndex + 1} / {filteredGoalLength}</Header.Subheader>;
    };

    const handleFormAction = async (increment: any) => {
        const parsedIncrement = typeof increment === "number" ? increment as number : 1;
        const haveSingleGoal = !!goalId;
        const todaysAnswer = currentGoal.todays_answer;
        if ((haveSingleGoal || isPostMode) && todaysAnswer) {
            console.log(candidateValue);
            await dispatch(updateAnswer(currentGoal, candidateValue));
            if (isPostMode) {
                goToGoal(parsedIncrement);
            } else {
                history.goBack();
            }
        } else if (haveSingleGoal) {
            await dispatch(createAnswer(currentGoal, candidateValue));
            history.goBack();
        }
    };

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title='Answer Goals' icon='goals'/>
        <PageContent/>
    </div>;
};

export default Answer;