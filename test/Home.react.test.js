import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../src/components/Home/Home';

test('Home renders', () => {
    const component = renderer.create(
        <Home/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});