import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import {Button, Checkbox, Divider, Placeholder} from "semantic-ui-react";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import {Link} from "react-router-dom";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import NutritionLibraryEmpty from "./NutritionLibraryEmpty/NutritionLibraryEmpty";
import FoodList from "./FoodList/FoodList";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import {COLOR_NUTRITION} from "../../constants";
import {connect} from "react-redux";
import {foodsFetchAll} from "../../actions/foods";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library'}
];

class NutritionLibrary extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            isArchivedVisible: false
        };
    }

    componentDidMount() {
        this.props.fetchData();
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
        this.setState({isArchivedVisible: checked}, () => this.props.fetchData(checked));
    };

    PageContent = () => {
        if (!this.props.isLoading && this.props.foods.length) {
            return <FoodList foods={this.props.foods}/>;
        } else if (this.props.isLoading) {
            return <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line/>
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line/>
                </Placeholder.Paragraph>
                <Placeholder.Header>
                    <Placeholder.Line/>
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line/>
                </Placeholder.Paragraph>
            </Placeholder>;
        } else {
            return <NutritionLibraryEmpty/>;
        }
    };

    NewButton = () => {
        if (this.props.isLoading || this.props.foods.length) {
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
    }
}

const mapStateToProps = (state) => {
    return {
        foods: state.foods,
        hasErrored: state.foodsHasErrored,
        isLoading: state.foodsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: isArchived => dispatch(foodsFetchAll(null, isArchived))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NutritionLibrary);