import React from 'react';
import PropTypes from 'prop-types';
import './ModifyFoodForm.scss';
import {createFood, getFood, updateFood} from '../../../Backend';
import {Link, withRouter} from 'react-router-dom';
import {extractError, healthStrings} from '../../../Utils';
import {Button, Confirm, Divider, Form, Radio} from 'semantic-ui-react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import RequestComponent from '../RequestComponent/RequestComponent';
import {APP_TITLE} from '../../../constants';

const URL_NUTRITION_LIBRARY = '/nutrition/library';

class ModifyFoodForm extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            food: {
                name: '',
                healthIndex: 1
            },
            loading: false,
            submissionError: '',
            isArchiveVisible: false,
            isUnarchiveVisible: false
        };
    }

    componentDidMount() {
        if (this.props.foodId) {
            this.setState({
                loading: true
            });

            getFood(this.cancelToken, this.props.foodId)
                .then(food => this.setState({
                    food: food,
                }))
                .catch(err => this.setState({
                    submissionError: extractError(err)
                }))
                .finally(() => this.setState({
                    loading: false
                }));
        }
    }

    render() {
        return <div><Form onSubmit={this.handleSave} loading={this.state.loading} error={!!this.state.submissionError}>
            <ErrorMessage header='Problem While Saving Food' content={this.state.submissionError}/>
            <Form.Field>
                <label>Name</label>
                <Form.Input autoFocus value={this.state.food.name} onChange={this.handleNameChange}/>
            </Form.Field>
            <Form.Field>
                <label>Quality</label>
            </Form.Field>
            {
                healthStrings.map((label, index) =>
                    <Form.Field key={label}>
                        <Radio
                            label={label}
                            name='healthRadios'
                            value={index + 1}
                            checked={this.state.food.healthIndex === index + 1}
                            onChange={this.handleHealthChange}
                        />
                    </Form.Field>
                )
            }
            <Divider hidden/>
            <Button.Group>
                <Button as={Link} to={URL_NUTRITION_LIBRARY}>Cancel</Button>
                <Button.Or/>
                <Button positive type="submit">Save Food</Button>
            </Button.Group>
            <this.SetArchivedButton/>
        </Form>
            <Confirm
                open={this.state.isArchiveVisible}
                onCancel={() => this.setState({isArchiveVisible: false})}
                onConfirm={this.handleToggleArchive}
                header='Archive Food?'
                content={`Archived foods do not show in searches for consumptions. Previous consumptions will remain unaffected. Archiving food does not delete it from ${APP_TITLE}, and you can restore it from the archive at any time.`}/>
            <Confirm
                open={this.state.isUnarchiveVisible}
                onCancel={() => this.setState({isUnarchiveVisible: false})}
                onConfirm={this.handleToggleArchive}
                header='Unarchive Food?'
                content={'This food will appear in your list of available foods when logging consumption. You can archive this food again at any time.'}/>
        </div>;
    }

    SetArchivedButton = () => {
        if (this.state.food.id && !this.state.food.isArchived) {
            return <Button type='button' basic floated='right' color='red'
                           onClick={() => this.setState({isArchiveVisible: true})}>Archive</Button>;
        } else if (this.state.food.id && this.state.food.isArchived) {
            return <Button type='button' basic floated='right' primary
                           onClick={() => this.setState({isUnarchiveVisible: true})}>Unarchive</Button>;
        } else {
            return null;
        }
    };

    handleToggleArchive = () => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                isArchived: !prevState.food.isArchived,
                isArchiveVisible: false
            }
        }), this.handleSave);
    };

    handleNameChange = (e, {value}) => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                name: value
            }
        }));
    };

    handleHealthChange = (e, {value}) => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                healthIndex: value
            }
        }));
    };

    handleSave = () => {
        this.setState({
            loading: true
        });

        const backendFunction = this.props.foodId ? updateFood : createFood;

        backendFunction(this.cancelToken, this.state.food)
            .then(this.props.history.goBack)
            .catch(err => this.setState({
                submissionError: extractError(err)
            })).finally(() => this.setState({
            loading: false
        }));

    };
}

ModifyFoodForm.propTypes = {
    foodId: PropTypes.string,
    history: PropTypes.object.isRequired
};

export default withRouter(ModifyFoodForm);