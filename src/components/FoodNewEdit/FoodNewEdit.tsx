import React, {useEffect, useState} from 'react';
import './FoodNewEdit.scss';
import {Link, useHistory, useParams} from 'react-router-dom';
import {healthStrings} from '../../Utils';
import {Button, Confirm, Divider, Dropdown, Form, Radio} from 'semantic-ui-react';
import ErrorMessage from '../common/ErrorMessage/ErrorMessage';
import {APP_TITLE, foodIcons} from '../../constants';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/rootReducer";
import {selectFoodById} from "../../features/foods/foodSelectors";
import IFood from "../../models/IFood";

const URL_NUTRITION_LIBRARY = '/nutrition/library';

const FoodNewEdit = () => {
    const {foodId} = useParams();
    const history = useHistory();
    const [isArchiveVisible, setIsArchiveVisible] = useState(false);
    const [isUnarchiveVisible, setIsUnarchiveVisible] = useState(false);
    const {isLoading} = useSelector((state: RootState) => state.foodState);
    const food: IFood | undefined = useSelector((state: RootState) => selectFoodById(state, foodId));
    const [draftFood, setDraftFood] = useState<IFood>(food || {} as IFood);
    const [submissionError, setSubmissionError] = useState('');

    useEffect(() => {
        //TODO: Load food by ID
    });

    const handleSave = () => {
        if (!foodId) {
            // createFood(cancelToken, food)
            //     .then(props.history.goBack)
            //     .catch((err: Error) => setState({
            //         submissionError: extractError(err)
            //     })).finally(() => setState({
            //     isLoading: false
            // })); // TODO: Replace createFood with redux-toolkit
        } else {
            // props.updateFood(food); // TODO: Replace updateFood with redux-toolkit
            history.goBack();
        }

    };

    const SetArchivedButton = () => {
        if (food?.id && !food.is_archived) {
            return <Button type='button' basic floated='right' color='red'
                           onClick={() => setIsArchiveVisible(true)}>Archive</Button>;
        } else if (food?.id && food.is_archived) {
            return <Button type='button' basic floated='right'
                           onClick={() => setIsUnarchiveVisible(true)}>Unarchive</Button>;
        } else {
            return null;
        }
    };

    const toggleArchived = () => setDraftFood({...draftFood, is_archived: !draftFood.is_archived});

    return <div>
        <Form onSubmit={handleSave} loading={isLoading}
              error={!!submissionError}>
            <ErrorMessage header='Problem While Saving Food' content={submissionError}/>
            <Form.Field>
                <label>Name</label>
                <Form.Input autoFocus value={food?.name}
                            onChange={e => setDraftFood({...draftFood, name: e.target.value})}/>
            </Form.Field>
            <Form.Field>
                <label>Quality</label>
            </Form.Field>
            {
                healthStrings.map((label: string, index: number) =>
                    <Form.Field key={label}>
                        <Radio
                            label={label}
                            name='healthRadios'
                            value={index + 1}
                            checked={food?.health_index === index + 1}
                            onChange={(e, d) => setDraftFood({...draftFood, health_index: d.value as number})}
                        />
                    </Form.Field>
                )
            }
            <Form.Field>
                <label>Icon</label>
                <Dropdown search clearable
                          selection
                          options={foodIcons}
                          onChange={(e, d) => setDraftFood({...draftFood, icon: d.value as string})}
                          value={food?.icon}/>
            </Form.Field>
            <Divider hidden/>
            <Button.Group>
                <Button as={Link} to={URL_NUTRITION_LIBRARY}>Cancel</Button>
                <Button.Or/>
                <Button positive type="submit">Save Food</Button>
            </Button.Group>
            <SetArchivedButton/>
        </Form>
        <Confirm
            open={isArchiveVisible}
            onCancel={() => setIsArchiveVisible(false)}
            onConfirm={toggleArchived}
            header='Archive Food?'
            content={`Archived foods do not show in searches for consumptions. Previous consumptions will remain unaffected. Archiving food does not delete it from ${APP_TITLE}, and you can restore it from the archive at any time.`}/>
        <Confirm
            open={isUnarchiveVisible}
            onCancel={() => setIsUnarchiveVisible(false)}
            onConfirm={toggleArchived}
            header='Unarchive Food?'
            content={'This food will appear in your list of available foods when logging consumption. You can archive this food again at any time.'}/>
    </div>;
};

export default FoodNewEdit;