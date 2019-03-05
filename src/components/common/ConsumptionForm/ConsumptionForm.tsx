import React, {SyntheticEvent} from 'react';
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
import {RouteComponentProps, withRouter} from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {extractError, healthStrings} from '../../../Utils';
import {
    createConsumption,
    deleteConsumption,
    getConsumption,
    getFood,
    getFoods,
    updateConsumption
} from '../../../Backend';
import RequestComponent from '../RequestComponent/RequestComponent';
import {TIME_FORMAT_STRING} from '../../../constants';
import {IConsumptionFormState} from "./IConsumptionFormState";
import HeaderBar from "../../HeaderBar/HeaderBar";
import BreadcrumbSet from "../BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Edit'}
];

interface IConsumptionNewEditMatchParams {
    consumptionId: string;
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

const generateConsumptionInfo = () => {
    const availableHours = generateHours();
    return {
        consumption: {
            date: availableHours[availableHours.length - 1].value,
            quantity: 1,
            food: ''
        },
        availableHours
    };
};

interface IConsumptionNewEditDispatchProps {
    
}

interface IConsumptionNewEditStateProps {
    
}

type Props = IConsumptionNewEditStateProps & IConsumptionNewEditDispatchProps & RouteComponentProps<IConsumptionNewEditMatchParams>;

class ConsumptionForm extends RequestComponent<Props, IConsumptionFormState> {
    state = {
        ...generateConsumptionInfo(),
        currentFoodSearch: '',
        submissionMessage: '',
        isLoading: false,
        foodResults: [],
        submissionError: '',
        isDeleteVisible: false,
        searchLoading: false
    };
    callSearch = AwesomeDebouncePromise((search: string) => getFoods(this.cancelToken, search), 500);

    SubmissionMessage = () => this.state.submissionMessage ?
        <Message header='Consumption Logged'
                 content={this.state.submissionMessage}
                 onDismiss={() => this.setState({submissionMessage: ''})}/> :
        null;

    FoodField = () => {
        if (this.props.match.params.consumptionId) {
            return <Input
                value={this.state.currentFoodSearch}
                disabled={true}
            />;
        } else {
            return <Search
                autoFocus
                loading={this.state.isLoading}
                onResultSelect={this.handleFoodChange}
                onSearchChange={this.handleSearchChange}
                results={this.state.foodResults}
                value={this.state.currentFoodSearch}
            />;
        }
    };

    HourField = () => {
        if (this.props.match.params.consumptionId) {
            return <Input disabled value={moment(this.state.consumption.date).format(TIME_FORMAT_STRING)}/>;
        } else {
            return <Dropdown
                selection
                options={this.state.availableHours}
                onChange={this.handleHourChange}
                value={this.state.consumption.date}
                disabled={!!this.props.match.params.consumptionId}/>;
        }
    };

    componentDidMount() {
        this.resetSearch();
        if (!this.props.match.params.consumptionId && !this.props.location.search) {
            return;
        }

        this.setState({isLoading: true});

        if (this.props.match.params.consumptionId) {
            // getConsumption(this.cancelToken, this.props.match.params.consumptionId)
            //     .then(consumption => {
            //         this.setState({consumption});
            //         return consumption;
            //     })
            //     .then(consumption => axios.get(consumption.food))
            //     .then(res => this.setState({
            //         food: res.data,
            //         isLoading: false,
            //         currentFoodSearch: res.data.name
            //     }));
            // if (this.props.consumptions)
        } else {
            const params = new URLSearchParams(this.props.location.search);
            const foodId = Number(params.get('food'));
            if (!foodId) {
                return;
            }
            getFood(this.cancelToken, foodId)
                .then(food => this.setState(prevState => ({
                    currentFoodSearch: food.name,
                    isLoading: false,
                    consumption: {
                        ...prevState.consumption,
                        food: food.url
                    }
                })));
        }
    }

    DeleteButton = () => {
        return this.props.match.params.consumptionId ?
            <Button type='button' basic floated='right' color='red'
                    onClick={() => this.setState({isDeleteVisible: true})}>Delete</Button>
            : null;
    };

    handleDelete = () => {
        if (this.props.match.params.consumptionId === undefined) {
            return;
        }

        this.setState({
            isLoading: true,
            isDeleteVisible: false
        });

        deleteConsumption(this.cancelToken, Number(this.props.match.params.consumptionId))
            .then(this.props.history.goBack)
            .catch(err => this.setState({submissionError: extractError(err)}))
            .finally(() => this.setState({isLoading: false}));
    };

    handleFormSubmit = () => {
        if (this.state.isLoading) {
            return;
        }

        this.setState({
            isLoading: true,
            submissionMessage: ''
        });

        const backEndFunction = this.props.match.params.consumptionId ? updateConsumption : createConsumption;
        backEndFunction(this.cancelToken, this.state.consumption)
            .then(() => {
                if (this.props.match.params.consumptionId) {
                    this.props.history.goBack();
                } else {
                    this.setState(prevState => ({
                        submissionError: '',
                        ...generateConsumptionInfo(),
                        submissionMessage: `Well done! Your consumption of ${prevState.currentFoodSearch} at ${moment(prevState.consumption.date).format(TIME_FORMAT_STRING)} has been logged.`
                    }));
                    this.resetSearch();
                }
            })
            .catch(err => this.setState({submissionError: extractError(err)}))
            .finally(() => this.setState({isLoading: false}));
    };

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Edit Consumption" icon='nutrition'/>
            <Form
                error={!!this.state.submissionError}
                loading={this.state.isLoading}
                onSubmit={this.handleFormSubmit}>
                <Message error header='Problem While Logging' list={[this.state.submissionError]}/>
                <this.SubmissionMessage/>
                <Form.Field>
                    <label>Food</label>
                    <this.FoodField/>

                </Form.Field>
                <Form.Field>
                    <label>When</label>
                    <this.HourField/>
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
                            checked={this.state.consumption.quantity === qty.value}
                            onChange={this.handleQuantityChange}
                        />
                    </Form.Field>)}
                <Divider hidden/>
                <Button.Group>
                    <Button type='button' onClick={this.props.history.goBack}>Back</Button>
                    <Button.Or/>
                    <Button positive type="submit" disabled={!this.state.consumption.food}>
                        {this.props.match.params.consumptionId ? 'Save Log' : 'Submit Log'}
                    </Button>
                </Button.Group>
                <this.DeleteButton/>
            </Form>
            <Confirm
                open={this.state.isDeleteVisible}
                onCancel={() => this.setState({isDeleteVisible: false})}
                onConfirm={this.handleDelete}
                header='Delete Consumption?'
                content={'This consumption will no longer appear in your history. However, you can add it back later, and points awarded as a result of this Consumption will remain. Please note that the calculation of future points will not take this deletion into account, and will still take it into account.'}/>
        </div>;
    }

    handleFoodChange = (e: SyntheticEvent, data: any) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                food: data.result.url
            },
            currentFoodSearch: data.result.title
        }));
    };

    handleQuantityChange = (e: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                quantity: value
            }
        }));
    };

    handleHourChange = (event: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                date: value
            }
        }));
    };

    handleSearchChange = (event: React.MouseEvent<HTMLElement>, {value}: SearchProps) => {
        const currentFoodSearch = value ? value.toString() : '';
        this.setState(prev => ({
            currentFoodSearch: currentFoodSearch,
            consumption: {
                ...prev.consumption,
                food: ''
            }
        }));

        if (currentFoodSearch.length < 1) {
            return this.resetSearch();
        }

        return this.performSearch();
    };

    async performSearch() {
        const foods = await this.callSearch(this.state.currentFoodSearch);
        this.setState({
            searchLoading: false,
            foodResults: foods.results.map((food: any) => ({
                title: food.name,
                id: food.id,
                description: healthStrings[food.health_index - 1],
                url: food.url,
                image: food.icon ? `/img/food_icons/${food.icon}.svg` : null
            }))
        });
    }

    resetSearch = () => this.setState({currentFoodSearch: ''});
}

export default withRouter(ConsumptionForm);