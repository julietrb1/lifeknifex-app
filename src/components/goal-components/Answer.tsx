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
import {RootState} from "../../redux/rootReducer";
import {fetchAllGoals} from "../../features/goals/goalSlice";
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {selectAllGoals, selectGoalByUrl, selectGoalsLoading} from "../../features/goals/goalSelectors";

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
    const [currentGoalUrl, setCurrentGoalUrl] = useState('');
    const currentGoal = useSelector((state: RootState) => selectGoalByUrl(state, currentGoalUrl));
    const [goalIndex, setGoalIndex] = useState(-1);
    const [done, setDone] = useState(false);
    const [candidateValue, setCandidateValue] = useState(0);
    const [isPostMode, setIsPostMode] = useState(new URLSearchParams(search).get('mode') === 'post');
    const [filteredGoals, setFilteredGoals] = useState<IGoal[]>([]);
    useEffect(() => {
        if (!goals.length) dispatch(fetchAllGoals());
    });

    const PageContent = () => {
        if (done) {
            return <AnswerEmpty/>;
        } else {
            const loading = isLoading || !filteredGoals;
            return <Form loading={loading} onSubmit={handleFormAction}>
                <Header>
                    {currentGoalUrl ?
                        `Did I ${firstCase(currentGoal.question)}?` :
                        'Loading Goal...'}
                    <GoalProgressCount/>
                </Header>
                <FormContent/>
            </Form>;
        }
    };

    const handlePreAnswer = (answerValue: number) => {
        // createAnswer(goals.find(g => g.url === currentGoalUrl), answerValue); TODO: Submit answer creation
        goToGoal();
    };

    const FormContent = () => {
        if (isLoading || !currentGoalUrl) {
            return <PlaceholderSet/>;
        } else if (isPostMode || goalId) {
            return <AnswerPost goal={goals.find(g => g.url === currentGoalUrl)} onAnswer={setCandidateValue}
                               checkedValue={candidateValue}
                               mode={isPostMode ? 'post' : 'single'}
                               isStart={goalIndex === 0}
                               isEnd={filteredGoals &&
                               goalIndex === filteredGoals.length - 1}
                               goBack={() => handleFormAction(-1)}/>;
        } else {
            return <AnswerPre goal={goals.find(g => g.url === currentGoalUrl)} onAnswer={handlePreAnswer}/>;
        }
    };

    const filterGoals = (goalIdParam: number, today: string) => {
        if (!Object.values(filteredGoals).length) {
            setFilteredGoals(Object.values(goals).filter(goal => {
                const shouldStopPre = !goalIdParam && goal.last_answered !== today;
                const shouldStopPost = isPostMode || (goalIdParam && goal.id === Number(goalIdParam));
                return shouldStopPost || shouldStopPre;
            }));
        }
    };

    const goToGoal = (increment: number = 1) => {
        if (!Object.keys(goals).length) {
            throw new Error('No goals');
        }

        const goalIdParam = Number(goalId);
        const today = moment().format(BACKEND_DATE_FORMAT);
        filterGoals(goalIdParam, today);
        const newGoalIndex = goalIndex + increment;
        if (newGoalIndex < Object.values(filteredGoals).length) {
            const filteredUrl = filteredGoals.find(g => g.url === currentGoalUrl)?.url ?? '';
            const candidateValue = goals.find(g => g.url === currentGoalUrl)?.todays_answer_value || 0;
            setGoalIndex(newGoalIndex);
            setCurrentGoalUrl(filteredUrl);
            setCandidateValue(candidateValue);
        }

        if (goalIdParam) {
            history.replace('/goals');
        } else {
            setDone(true);
        }
    };

    const GoalProgressCount = () => {
        if (goalId) {
            return null;
        }

        const currentGoalIndex = (filteredGoals || []).findIndex((goal: any) => goal.url === currentGoalUrl) + 1 ||
            '--';

        const filteredGoalLength = (filteredGoals || []).length || '--';
        return <Header.Subheader>{currentGoalIndex} / {filteredGoalLength}</Header.Subheader>;
    };

    const handleFormAction = (increment: any) => {
        const parsedIncrement = typeof increment === "number" ? increment as number : 1;
        const haveSingleGoal = !!goalId;
        const answered = !!goals.find(g => g.url === currentGoalUrl)?.todays_answer;
        if ((haveSingleGoal && answered) || isPostMode) {
            // updateAnswer(goals.find(g => g.url === currentGoalUrl), candidateValue); TODO: Implement redux-toolkit operation
            if (isPostMode) {
                goToGoal(parsedIncrement);
            } else {
                history.goBack();
            }
        } else if (haveSingleGoal) {
            // createAnswer(goals.find(g => g.url === currentGoalUrl), candidateValue); // TODO: Implement redux-toolkit operation
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