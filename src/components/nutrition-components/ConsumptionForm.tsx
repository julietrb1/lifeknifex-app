import React, {SyntheticEvent, useEffect, useState} from 'react';
import axios from "axios";
import moment from 'moment';
import {
    Button,
    CheckboxProps,
    Confirm,
    Divider,
    Dropdown,
    DropdownProps,
    Form,
    Input,
    Message,
    Radio,
    Search,
    SearchProps
} from 'semantic-ui-react';
import './ConsumptionForm.scss';
import {useHistory, useParams} from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {healthStrings} from '../../Utils';
import {TIME_FORMAT_STRING} from '../../constants';
import {useDispatch, useSelector} from "react-redux";
import {selectFoodsLoading} from "../../features/foods/foodSelectors";
import {
    selectConsumptionById,
    selectConsumptionLoadedById,
    selectConsumptionsLoading
} from "../../features/consumptions/consumptionSelectors";
import {RootState} from "../../redux/rootReducer";
import IFood from "../../models/IFood";
import {
    createConsumption,
    deleteConsumption,
    fetchConsumption,
    updateConsumption
} from "../../features/consumptions/consumptionSlice";
import HeaderBar from "../common-components/HeaderBar";
import BreadcrumbSet from "../common-components/BreadcrumbSet";
import {getFoods} from "../../backend";

interface IConsumptionFormMatchParams {
    consumptionId?: string;
}

const generateHours = () => {
    const hours = [];
    for (let i = 0; i < moment().get('hour') + 1; i++) {
        const dateForTime = moment()
            .set('hour', i)
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0);
        hours.push({
            text: dateForTime.format(TIME_FORMAT_STRING),
            value: dateForTime.format(),
            key: i
        });
    }

    return hours;
};

const quantities = [
    {text: 'Small', value: 1},
    {text: 'Medium', value: 2},
    {text: 'Large', value: 3},
    {text: 'Extra Large', value: 4}
];

const ConsumptionForm: React.FC<IConsumptionFormMatchParams> = () => {
    const cancelToken = axios.CancelToken.source();
    const dispatch = useDispatch();
    const {consumptionId} = useParams();
    const consumptionLoaded = useSelector((state: RootState) => selectConsumptionLoadedById(state, consumptionId));
    const consumption = useSelector((state: RootState) => selectConsumptionById(state, consumptionId));
    const [availableHours, setAvailableHours] = useState<{ text: string, value: string, key: number }[]>(generateHours());
    const generateBlankConsumption = () => ({
        date: availableHours[availableHours.length - 1].value,
        quantity: 1,
        food: '',
        food_name: '',
        food_icon: '',
        id: 0,
        url: ''
    });
    const [draftConsumption, setDraftConsumption] = useState(consumption || generateBlankConsumption());
    const {goBack} = useHistory();
    const foodsLoading = useSelector(selectFoodsLoading);
    const consumptionsLoading = useSelector(selectConsumptionsLoading);
    const isLoading = foodsLoading || consumptionsLoading;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [currentFoodSearch, setCurrentFoodSearch] = useState('');
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const sections = [
        {name: 'Nutrition', href: '/nutrition'},
        {name: consumptionId ? 'Edit' : 'Log Consumption'}
    ];

    const [foodResults, setFoodResults] = useState<IFood[]>();


    useEffect(() => {
        if (consumptionId && !consumptionLoaded && !consumption) {
            dispatch(fetchConsumption(consumptionId));
        } else if (!isSubmitting || isLoading) return;

        if (consumptionId) {
            goBack();
        } else {
            setSubmissionError('');
            setAvailableHours(generateHours());
            setDraftConsumption(generateBlankConsumption());
            setSubmissionMessage(`Well done! Your consumption of ${currentFoodSearch} at ${moment(consumption.date).format(TIME_FORMAT_STRING)} has been logged.`);
            resetSearch();
        }
    }, [consumptionId, consumptionLoaded, consumption, isSubmitting, isLoading, dispatch, goBack, availableHours, currentFoodSearch]);

    const callSearch = AwesomeDebouncePromise((search: string) => getFoods(cancelToken, search), 500);

    const SubmissionMessage = () => submissionMessage ?
        <Message header='Consumption Logged'
                 content={submissionMessage}
                 onDismiss={() => setSubmissionMessage('')}/> :
        null;

    const FoodField = () => {
        const {consumptionId} = useParams();
        if (consumptionId) {
            return <Input
                value={currentFoodSearch}
                disabled={true}
            />;
        } else {
            return <Search
                autoFocus
                loading={isSearchLoading}
                onResultSelect={handleFoodChange}
                onSearchChange={handleSearchChange}
                results={foodResults}
                value={currentFoodSearch}
            />;
        }
    };

    const HourField = () => {
        const {consumptionId} = useParams();
        if (consumptionId) {
            return <Input disabled value={moment(draftConsumption.date).format(TIME_FORMAT_STRING)}/>;
        } else {
            return <Dropdown
                selection
                options={availableHours}
                onChange={handleHourChange}
                value={draftConsumption.date}
                disabled={!!consumptionId}/>;
        }
    };

    const handleDelete = () => {
        if (!consumption) return;
        dispatch(deleteConsumption(consumption));
    };

    const handleFormSubmit = () => {
        if (isLoading) return;
        setSubmissionMessage('');
        setIsSubmitting(true);

        if (consumptionId) dispatch(updateConsumption(draftConsumption));
        else dispatch(createConsumption(draftConsumption));
    }

    const handleFoodChange = (e: SyntheticEvent, data: any) => {
        setCurrentFoodSearch(data.result.title);
        setDraftConsumption({...draftConsumption, food: data.result.url});
    };

    const handleQuantityChange = (e: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => {
        setDraftConsumption({...draftConsumption, quantity: Number(value)});
    };

    const handleHourChange = (event: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
        setDraftConsumption({...draftConsumption, date: String(value)});
    };

    const resetSearch = () => setCurrentFoodSearch('');

    const handleSearchChange = (event: React.MouseEvent<HTMLElement>, {value}: SearchProps) => {
        const newFoodSearch = value ? value.toString() : '';
        setDraftConsumption({...draftConsumption, food: ''});
        setCurrentFoodSearch(newFoodSearch);
        if (newFoodSearch.length < 1) return resetSearch();
        if (!isSearchLoading) setIsSearchLoading(true);
        return performSearch();
    };

    const performSearch = async () => {
        const foods = await callSearch(currentFoodSearch);
        setIsSearchLoading(false);
        setFoodResults(foods.results.map((food: any) => ({
            title: food.name,
            id: food.id,
            description: healthStrings[food.health_index - 1],
            url: food.url,
            image: food.icon ? `/img/food_icons/${food.icon}.svg` : null
        })));
    }

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title={consumptionId ? 'Edit Consumption' : 'Log Consumption'} icon='nutrition'/>
        <Form
            error={!!submissionError}
            loading={isLoading}
            onSubmit={handleFormSubmit}>
            <Message error header='Problem While Logging' list={[submissionError]}/>
            <SubmissionMessage/>
            <Form.Field>
                <label>Food</label>
                <FoodField/>

            </Form.Field>
            <Form.Field>
                <label>When</label>
                <HourField/>
            </Form.Field>
            <Form.Field>
                <label>Quantity</label>
            </Form.Field>
            {quantities.map(qty =>
                <Form.Field key={qty.value}>
                    <Radio
                        label={qty.text}
                        name='quantity'
                        value={qty.value}
                        checked={draftConsumption.quantity === qty.value}
                        onChange={handleQuantityChange}
                    />
                </Form.Field>)}
            <Divider hidden/>
            <Button.Group>
                <Button type='button' onClick={goBack}>Back</Button>
                <Button.Or/>
                <Button positive type="submit" disabled={!draftConsumption.food}>
                    {consumptionId ? 'Save Log' : 'Submit Log'}
                </Button>
            </Button.Group>
            {consumptionId ?
                <Button type='button' basic floated='right' color='red'
                        onClick={() => setIsDeleteVisible(false)}>Delete</Button>
                : null}
        </Form>
        <Confirm
            open={isDeleteVisible}
            onCancel={() => setIsDeleteVisible(false)}
            onConfirm={handleDelete}
            header='Delete Consumption?'
            content={'This consumption will no longer appear in your history. However, you can add it back later, and points awarded as a result of this Consumption will remain. Please note that the calculation of future points will not take this deletion into account, and will still take it into account.'}/>
    </div>;
};

export default ConsumptionForm;