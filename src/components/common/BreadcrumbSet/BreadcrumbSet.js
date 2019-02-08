import React from 'react';
import PropTypes from 'prop-types';
import {Breadcrumb} from "semantic-ui-react";
import {Link} from "react-router-dom";

const homeBreadcrumb = <Breadcrumb.Section as={Link} to='/' key='/'>Home</Breadcrumb.Section>;

const BreadcrumbSet = props => {
    const suiSections = [homeBreadcrumb];
    props.sections.forEach(section => {
        if (section.href) {
            suiSections.push(<Breadcrumb.Section key={section.href} as={Link} to={section.href}>{section.name}</Breadcrumb.Section>);
        } else {
            suiSections.push(<Breadcrumb.Section key={'active'} active={true}>{section.name}</Breadcrumb.Section>);
        }
    });

    return <Breadcrumb sections={suiSections}/>;
};

BreadcrumbSet.propTypes = {
    sections: PropTypes.array.isRequired
};

export default BreadcrumbSet;