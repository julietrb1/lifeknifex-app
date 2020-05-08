import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import {Button, Checkbox, Divider} from "semantic-ui-react";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import {Link} from "react-router-dom";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import NutritionLibraryEmpty from "./NutritionLibraryEmpty/NutritionLibraryEmpty";
import FoodList from "./FoodList/FoodList";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import {COLOR_NUTRITION} from "../../constants";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import './NutritionLibrary.scss';
import {IFoodSlice} from "../../reducers/foods";
import {connect} from "react-redux";
import {foodsFetchAll} from "../../actions/foods";
import {INutritionLibraryStateProps} from "./INutritionLibraryStateProps";
import {INutritionLibraryDispatchProps} from "./INutritionLibraryDispatchProps";
import {INutritionLibraryState} from "./INutritionLibraryState";
import {MyThunkDispatch} from "../../store/configure-store";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library'}
];

type Props = INutritionLibraryStateProps & INutritionLibraryDispatchProps;

class NutritionLibrary extends RequestComponent<Props, INutritionLibraryState> {
    state = {
        isArchivedVisible: false,
        isLoading: false
    };

    componentDidMount() {
        if (!Object.values(this.props.foods).length) {
            this.props.fetchFoods();
        }
    }

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title='Food Library' icon='nutrition'/>
            <Divider hidden/>
            <p>{this.state.isArchivedVisible}</p>
            <Checkbox
                toggle
                label='Show archived'
                onChange={this.handleChangeArchived}
                checked={this.state.isArchivedVisible}/>
            <this.NewButton/>
            <Divider hidden/>
            <this.PageContent/>
        </div>;
    }

    handleChangeArchived = () => {
        // TODO: Load archived from redux
        // this.setState(prevState => ({isArchivedVisible: !prevState.isArchivedVisible, foods: {}}),
        //     () => this.loadFoods());
    };

    PageContent = () => {
        const foods = Object.values(this.props.foods);
        if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else if (foods.length) {
            return <div>
                <FoodList foods={foods}/>
                <Divider hidden/>
                <this.LoadMoreButton/>
            </div>;
        } else {
            return <NutritionLibraryEmpty isArchivedVisible={this.state.isArchivedVisible}/>;
        }
    };

    LoadMoreButton = () => {
        if (!this.props.isLoading && this.props.foodResponse.next) {
            return <div className="load-more-container">
                <Button basic
                        onClick={this.handleLoadMore}
                        animated='vertical'>
                    <Button.Content visible>Load More</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow down'/>
                    </Button.Content>
                </Button>
            </div>;
        } else if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else {
            return <div className="load-more-container"><Button disabled basic>All Foods loaded</Button></div>;
        }
    };

    handleLoadMore = () => {
        if (this.state.isLoading) {
            return;
        }

        // this.setState({isLoading: true});

        // TODO: Fetch more through redux
        // axios.get(String(this.state.food.next))
        //     .then(res => this.setState(prevState => update(prevState, {
        //         isLoading: {$set: false},
        //         foods: {
        //             results: {$push: res.data.results}
        //         }
        //     })));
    };

    NewButton = () => {
        if (this.props.isLoading || this.state.isArchivedVisible || Object.values(this.props.foods).length) {
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
}

const mapStateToProps = (state: IFoodSlice) => {
    return ({
        foods: state.foods,
        isLoading: state.foodsIsLoading,
        foodResponse: state.foodResponse
    });
};

const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
    fetchFoods: () => dispatch(foodsFetchAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(NutritionLibrary);
