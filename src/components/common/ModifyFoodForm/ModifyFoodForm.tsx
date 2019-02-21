import React from 'react';
import './ModifyFoodForm.scss';
import {createFood, getFood, updateFood} from '../../../Backend';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import {extractError, healthStrings} from '../../../Utils';
import {
    Button,
    CheckboxProps,
    Confirm,
    Divider,
    Dropdown,
    DropdownProps,
    Form,
    InputOnChangeData,
    Radio
} from 'semantic-ui-react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import RequestComponent from '../RequestComponent/RequestComponent';
import {APP_TITLE, foodIcons} from '../../../constants';

const URL_NUTRITION_LIBRARY = '/nutrition/library';

interface IModifyFoodFormProps extends RouteComponentProps {
    foodId: number;
}

interface IModifyFoodFormState {
    isLoading: boolean;
    food: any;
    submissionError: string;
    isArchiveVisible: boolean;
    isUnarchiveVisible: boolean;
}

class ModifyFoodForm extends RequestComponent<IModifyFoodFormProps, IModifyFoodFormState> {
    state = {
        food: {
            id: undefined,
            is_archived: undefined,
            name: '',
            health_index: 1,
            icon: ''
        },
        isLoading: false,
        submissionError: '',
        isArchiveVisible: false,
        isUnarchiveVisible: false
    };

    componentDidMount() {
        if (this.props.foodId) {
            this.setState({
                isLoading: true
            });

            getFood(this.cancelToken, this.props.foodId)
                .then(food => this.setState({
                    food: food,
                }))
                .catch(err => this.setState({
                    submissionError: extractError(err)
                }))
                .finally(() => this.setState({
                    isLoading: false
                }));
        }
    }

    render() {
        return <div><Form onSubmit={this.handleSave} loading={this.state.isLoading}
                          error={!!this.state.submissionError}>
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
                            checked={this.state.food.health_index === index + 1}
                            onChange={this.handleHealthChange}
                        />
                    </Form.Field>
                )
            }
            <Form.Field>
                <label>Icon</label>
                <Dropdown search clearable
                          selection
                          options={foodIcons}
                          onChange={this.handleIconChange}
                          value={this.state.food.icon}/>
            </Form.Field>
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
        if (this.state.food.id && !this.state.food.is_archived) {
            return <Button type='button' basic floated='right' color='red'
                           onClick={() => this.setState({isArchiveVisible: true})}>Archive</Button>;
        } else if (this.state.food.id && this.state.food.is_archived) {
            return <Button type='button' basic floated='right'
                           onClick={() => this.setState({isUnarchiveVisible: true})}>Unarchive</Button>;
        } else {
            return null;
        }
    };

    handleToggleArchive = () => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                is_archived: !prevState.food.is_archived
            }
        }), this.handleSave);
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                name: value
            }
        }));
    };

    handleIconChange = (event: React.SyntheticEvent<HTMLElement>, {value}: DropdownProps) => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                icon: value
            }
        }));
    };

    handleHealthChange = (event: React.FormEvent<HTMLInputElement>, {value}: CheckboxProps) => {
        this.setState(prevState => ({
            food: {
                ...prevState.food,
                health_index: value
            }
        }));
    };

    handleSave = () => {
        this.setState({
            isLoading: true
        });

        const backendFunction = this.props.foodId ? updateFood : createFood;

        backendFunction(this.cancelToken, this.state.food)
            .then(this.props.history.goBack)
            .catch(err => this.setState({
                submissionError: extractError(err)
            })).finally(() => this.setState({
            isLoading: false
        }));

    };
}

export default withRouter(ModifyFoodForm);