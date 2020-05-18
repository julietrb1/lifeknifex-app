import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const homeBreadcrumb = <Breadcrumb.Section as={Link} to="/" key="/">Home</Breadcrumb.Section>;

interface IBreadcrumbSetProps {
  sections: { href?: string, name: string }[]
}

const BreadcrumbSet: React.FC<IBreadcrumbSetProps> = ({ sections }: IBreadcrumbSetProps) => {
  const suiSections = [homeBreadcrumb];
  sections.forEach((section) => {
    if (section.href) {
      suiSections.push((
        <Breadcrumb.Section
          key={section.href}
          as={Link}
          to={section.href}
        >
          {section.name}
        </Breadcrumb.Section>
      ));
    } else {
      suiSections.push(<Breadcrumb.Section key="active" active>{section.name}</Breadcrumb.Section>);
    }
  });

  return <div />; // TODO: Consider how to replace breadcrumbs (or if at all)
};

export default BreadcrumbSet;
