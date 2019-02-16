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
import {getFoods} from "../../Backend";
import axios from 'axios';
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import './NutritionLibrary.scss';

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library'}
];

class NutritionLibrary extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            isArchivedVisible: false,
            isLoading: false,
            foods: {}
        };
    }

    componentDidMount() {
        this.loadFoods();
    }

    loadFoods() {
        this.setState({
            isLoading: true
        });
        getFoods(this.cancelToken, null, this.state.isArchivedVisible)
            .then(foods => {
                this.setState({
                    foods: foods,
                    isLoading: false
                });
            });
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

    handleChangeArchived = (e, {checked}) => {
        this.setState({isArchivedVisible: checked, foods: {}}, () => this.loadFoods());
    };

    PageContent = () => {
        if (this.state.foods.results && this.state.foods.results.length) {
            return <div>
                <FoodList foods={this.state.foods.results}/>
                <Divider hidden/>
                <this.LoadMoreButton/>
            </div>;
        } else if (this.state.isLoading) {
            return <PlaceholderSet/>;
        } else {
            return <NutritionLibraryEmpty isArchivedVisible={this.state.isArchivedVisible}/>;
        }
    };

    LoadMoreButton = () => {
        if (!this.state.isLoading && this.state.foods && this.state.foods.next) {
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
        } else if (this.state.isLoading && this.state.foods && this.state.foods.results && this.state.foods.results.length) {
            return <PlaceholderSet/>;
        } else {
            return <div className="load-more-container"><Button disabled basic>All Foods loaded</Button></div>;
        }
    };

    handleLoadMore = () => {
        if (this.state.isLoading) {
            return;
        }

        this.setState({isLoading: true});

        axios.get(this.state.foods.next)
            .then(res => this.setState(prevState => ({
                isLoading: false,
                foods: {
                    ...res.data,
                    results: [
                        ...prevState.foods.results,
                        ...res.data.results
                    ]
                }
            })));
    };

    NewButton = () => {
        if (this.state.isLoading || this.state.isArchivedVisible || (this.state.foods.results && this.state.foods.results.length)) {
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

export default NutritionLibrary;
