import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Incidents from './page';

describe('Incidents Component', () => {
  test('renders Header component', () => {
    render(<Incidents />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders SideNav component', () => {
    render(<Incidents />);
    const sideNavElement = screen.getByRole('navigation');
    expect(sideNavElement).toBeInTheDocument();
  });

  test('renders GridComponent', () => {
    render(<Incidents />);
    const gridElement = screen.getByRole('grid');
    expect(gridElement).toBeInTheDocument();
  });
});