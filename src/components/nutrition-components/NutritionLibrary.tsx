import React, {useEffect} from 'react';
import HeaderBar from "../common-components/HeaderBar";
import {Button, Checkbox, Divider} from "semantic-ui-react";
import BreadcrumbSet from "../common-components/BreadcrumbSet";
import {Link} from "react-router-dom";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import NutritionLibraryEmpty from "./NutritionLibraryEmpty";
import FoodList from "./FoodList";
import {COLOR_NUTRITION} from "../../constants";
import PlaceholderSet from "../common-components/PlaceholderSet";
import './NutritionLibrary.scss';
import {useDispatch, useSelector} from "react-redux";
import {
    selectAllFoods,
    selectFoodResponse,
    selectFoodsLoaded,
    selectFoodsLoading
} from "../../features/foods/foodSelectors";
import {fetchAllFoods} from "../../features/foods/foodSlice";
import {RootState} from "../../redux/rootReducer";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library'}
];

const NutritionLibrary: React.FC = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectFoodsLoading);
    const [isArchivedVisible, setIsArchivedVisible] = React.useState(false);
    const foods = useSelector((state: RootState) => selectAllFoods(state, isArchivedVisible));
    const foodResponse = useSelector(selectFoodResponse);
    const areFoodsLoaded = useSelector(selectFoodsLoaded);

    useEffect(() => {
        if (!areFoodsLoaded) dispatch(fetchAllFoods());
    }, [dispatch, areFoodsLoaded]);

    const PageContent = () => {
        if (isLoading) {
            return <PlaceholderSet/>;
        } else if (foods.length) {
            return <div>
                <FoodList foods={foods}/>
                <Divider hidden/>
                <LoadMoreButton/>
            </div>;
        } else {
            return <NutritionLibraryEmpty isArchivedVisible={isArchivedVisible}/>;
        }
    };

    const LoadMoreButton = () => {
        if (!isLoading && foodResponse?.next) {
            return <div className="load-more-container">
                <Button basic
                        onClick={handleLoadMore}
                        animated='vertical'>
                    <Button.Content visible>Load More</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow down'/>
                    </Button.Content>
                </Button>
            </div>;
        } else if (isLoading) {
            return <PlaceholderSet/>;
        } else {
            return <div className="load-more-container"><Button disabled basic>All Foods loaded</Button></div>;
        }
    };

    const handleLoadMore = () => {
        if (isLoading) return;
        // TODO: Fetch more through redux
    };

    const NewButton = () => {
        if (isLoading || isArchivedVisible || foods.length) {
            return <Button
                floated='right'
                color={COLOR_NUTRITION}
                as={Link}
                to='/nutrition/library/new'
                animated='vertical'>
                <Button.Content visible>New Food</Button.Content>
                <Button.Content hidden>
                    <Icon name='plus'/>
                </Button.Content>
            </Button>;
        } else {
            return null;
        }
    };

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title='Food Library' icon='nutrition'/>
        <Divider hidden/>
        <Checkbox
            toggle
            label='Show archived'
            onChange={() => setIsArchivedVisible(prevState => !prevState)}
            checked={isArchivedVisible}/>
        <NewButton/>
        <Divider hidden/>
        <PageContent/>
    </div>;
};

export default NutritionLibrary;
