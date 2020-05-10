import React, {SyntheticEvent, useEffect, useState} from 'react';
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
import HeaderBar from "../common-components/HeaderBar";
import BreadcrumbSet from "../common-components/BreadcrumbSet";
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
import {fetchAllFoods} from "../../features/foods/foodSlice";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Edit'}
];

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
    const dispatch = useDispatch();
    const {consumptionId} = useParams();
    const consumptionLoaded = useSelector((state: RootState) => selectConsumptionLoadedById(state, consumptionId));
    const consumption = useSelector((state: RootState) => selectConsumptionById(state, consumptionId));
    const [draftConsumption, setDraftConsumption] = useState(consumption);
    const {goBack} = useHistory();
    const isLoading = useSelector(selectFoodsLoading) || useSelector(selectConsumptionsLoading);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState('');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [currentFoodSearch, setCurrentFoodSearch] = useState('');
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [availableHours, setAvailableHours] = useState<{ text: string, value: string, key: number }[]>([]);
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
            setDraftConsumption({
                date: availableHours[availableHours.length - 1].value,
                quantity: 1,
                food: '',
                food_name: '',
                food_icon: '',
                id: 0,
                url: ''
            });
            setSubmissionMessage(`Well done! Your consumption of ${currentFoodSearch} at ${moment(consumption.date).format(TIME_FORMAT_STRING)} has been logged.`);
            resetSearch();
        }
    });

    const callSearch = AwesomeDebouncePromise((search: string) => dispatch(fetchAllFoods(search)), 500);

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
                loading={isLoading}
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
            return <Input disabled value={moment(consumption.date).format(TIME_FORMAT_STRING)}/>;
        } else {
            return <Dropdown
                selection
                options={availableHours}
                onChange={handleHourChange}
                value={consumption.date}
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
        setDraftConsumption({...consumption, food: data.result.url});
    };

    const handleQuantityChange = (e: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => {
        setDraftConsumption({...consumption, quantity: Number(value)});
    };

    const handleHourChange = (event: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
        setDraftConsumption({...consumption, date: String(value)});
    };

    const resetSearch = () => setCurrentFoodSearch('');

    const handleSearchChange = (event: React.MouseEvent<HTMLElement>, {value}: SearchProps) => {
        const newFoodSearch = value ? value.toString() : '';
        setDraftConsumption({...consumption, food: ''});
        setCurrentFoodSearch(newFoodSearch);

        if (newFoodSearch.length < 1) return resetSearch();
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
        <HeaderBar title="Edit Consumption" icon='nutrition'/>
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
                        checked={consumption.quantity === qty.value}
                        onChange={handleQuantityChange}
                    />
                </Form.Field>)}
            <Divider hidden/>
            <Button.Group>
                <Button type='button' onClick={goBack}>Back</Button>
                <Button.Or/>
                <Button positive type="submit" disabled={!consumption.food}>
                    {consumptionId ? 'Save Log' : 'Submit Log'}
                </Button>
            </Button.Group>
            consumptionId ?
            <Button type='button' basic floated='right' color='red'
                    onClick={() => setIsDeleteVisible(false)}>Delete</Button>
            : null;
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