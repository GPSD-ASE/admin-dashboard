import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './page';
import Header from '../header';
import SideNav from '@/components/side-nav';
import Map from '@/components/ui/Map';

jest.mock('../header', () => () => <div>Header Component</div>);
jest.mock('@/components/side-nav', () => () => <div>SideNav Component</div>);
jest.mock('@/components/ui/Map', () => () => <div>Map Component</div>);

describe('Home Component', () => {
  test('renders Header component', () => {
    render(<Home />);
    expect(screen.getByText('Header Component')).toBeInTheDocument();
  });

  test('renders SideNav component', () => {
    render(<Home />);
    expect(screen.getByText('SideNav Component')).toBeInTheDocument();
  });

  test('renders Map component', () => {
    render(<Home />);
    expect(screen.getByText('Map Component')).toBeInTheDocument();
  });

  test('has correct layout structure', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.flex')).toBeInTheDocument();
    expect(container.querySelector('.w-full')).toBeInTheDocument();
    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument();
  });
});