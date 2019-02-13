import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Button, Confirm, Divider, Dropdown, Form, Input, Message, Search} from 'semantic-ui-react';
import _ from 'lodash';
import './ConsumptionForm.scss';
import {withRouter} from 'react-router-dom';
import {extractError, healthStrings} from '../../../Utils';
import {createConsumption, deleteConsumption, getConsumption, updateConsumption} from '../../../Backend';
import RequestComponent from '../RequestComponent/RequestComponent';
import {TIME_FORMAT_STRING} from '../../../constants';
import {foodsFetchAll} from "../../../actions/foods";

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

class ConsumptionForm extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...generateConsumptionInfo(),
            foods: [],
            foodResults: [],
            currentFoodSearch: '',
            searchLoading: false,
            loading: false,
            submissionMessage: ''
        };
    }

    componentDidMount() {
        this.resetSearch();
        if (!this.props.consumptionId) {
            return;
        }

        this.setState({
            loading: true
        });

        getConsumption(this.cancelToken, this.props.consumptionId)
            .then(consumption => {
                this.setState({
                    consumption: {
                        ...consumption,
                        food: consumption.food.id
                    },
                    currentFoodSearch: consumption.food.name
                });
            })
            .finally(() => {
                this.setState({
                    loading: false
                });
            });
    }

    SubmissionMessage = () => this.state.submissionMessage ?
        <Message header='Consumption Logged'
                 content={this.state.submissionMessage}
                 onDismiss={() => this.setState({submissionMessage: ''})}/> :
        null;

    FoodField = () => {
        if (this.props.consumptionId) {
            return <Input
                value={this.state.currentFoodSearch}
                disabled={true}
            />;
        } else {
            return <Search
                autoFocus
                loading={this.state.searchLoading}
                onResultSelect={this.handleFoodChange}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
                results={this.state.foodResults}
                value={this.state.currentFoodSearch}
            />;
        }
    };

    HourField = () => {
        if (this.props.consumptionId) {
            return <Input disabled value={moment(this.state.consumption.date).format(TIME_FORMAT_STRING)}/>;
        } else {
            return <Dropdown
                selection
                options={this.state.availableHours}
                onChange={this.handleHourChange}
                value={this.state.consumption.date}
                disabled={!!this.props.consumptionId}/>;
        }
    };

    render() {
        return <div>
            <Form
                error={!!this.state.submissionError}
                loading={this.state.loading}
                onSubmit={this.handleFormSubmit}>
                <Message error header='Problem While Logging' content={this.state.submissionError}/>
                <this.SubmissionMessage/>
                <Form.Field>
                    <label>Food</label>
                    <this.FoodField/>

                </Form.Field>
                <Form.Field>
                    <label>Hour</label>
                    <this.HourField/>
                </Form.Field>
                <Form.Field>
                    <label>Quantity</label>
                    <Dropdown
                        selection
                        options={quantities}
                        onChange={this.handleQuantityChange}
                        value={this.state.consumption.quantity}/>
                </Form.Field>
                <Divider hidden/>
                <Button.Group>
                    <Button type='button' onClick={this.props.history.goBack}>Back</Button>
                    <Button.Or/>
                    <Button positive type="submit" disabled={!this.state.consumption.food}>
                        {this.props.consumptionId ? 'Save Log' : 'Submit Log'}
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

    DeleteButton = () => {
        return this.props.consumptionId ?
            <Button type='button' basic floated='right' color='red'
                    onClick={() => this.setState({isDeleteVisible: true})}>Delete</Button>
            : null;
    };

    handleDelete = () => {
        this.setState({
            loading: true,
            isDeleteVisible: false
        });

        deleteConsumption(this.cancelToken, this.props.consumptionId)
            .then(this.props.history.goBack)
            .catch(err => this.setState({submissionError: extractError(err)}))
            .finally(() => this.setState({loading: false}));
    };

    handleFormSubmit = () => {
        this.setState({loading: true});

        const backEndFunction = this.props.consumptionId ? updateConsumption : createConsumption;
        backEndFunction(this.cancelToken, this.state.consumption)
            .then(() => {
                if (this.props.consumptionId) {
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
            .finally(() => this.setState({loading: false}));
    };

    handleFoodChange = (e, data) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                food: data.result.id
            },
            currentFoodSearch: data.result.title
        }));
    };

    handleQuantityChange = (e, {value}) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                quantity: value
            }
        }));
    };

    handleHourChange = (e, {value}) => {
        this.setState(prevState => ({
            consumption: {
                ...prevState.consumption,
                date: value
            }
        }));
    };

    handleSearchChange = (e, {value}) => {
        this.setState(prev => ({
            searchLoading: true,
            currentFoodSearch: value,
            consumption: {
                ...prev.consumption,
                food: ''
            }
        }));

        setTimeout(() => {
            if (this.state.currentFoodSearch.length < 1) {
                return this.resetSearch();
            }

            foodsFetchAll(this.cancelToken, this.state.currentFoodSearch).then(foods => {
                this.setState({
                    searchLoading: false,
                    foodResults: foods.map(food => ({
                        title: food.name,
                        id: food.id,
                        description: healthStrings[food.healthIndex - 1]
                    }))
                });
            }, 300);
        });
    };

    resetSearch = () => this.setState({searchLoading: false, foodResults: [], currentFoodSearch: ''});
}

ConsumptionForm.propTypes = {
    history: PropTypes.object.isRequired,
    consumptionId: PropTypes.string
};

export default withRouter(ConsumptionForm);