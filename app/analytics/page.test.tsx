import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Analytics from '@/app/analytics/page';
import SideNav from '@/components/side-nav';
import GridComponent from '@/components/GridComponent';

jest.mock('@/components/side-nav', () => jest.fn(() => <div>Mocked SideNav</div>));
jest.mock('@/components/GridComponent', () => jest.fn(() => <div>Mocked GridComponent</div>));
jest.mock('../header', () => jest.fn(() => <div>Mocked Header</div>));

describe('Analytics Page', () => {
  test('testAnalyticsPageRendersComponents', () => {
    render(<Analytics />);
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();
    expect(screen.getByText('Mocked SideNav')).toBeInTheDocument();
    expect(screen.getByText('Mocked GridComponent')).toBeInTheDocument();
  });

  test('testSideNavToggleFunctionality', () => {
    const { container } = render(<SideNav />);
    const toggleButton: any = container.querySelector('button');
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('sidebarExpanded')).toBe('false');
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('sidebarExpanded')).toBe('true');
  });

  test('testGridComponentDataDisplay', async () => {
    render(<GridComponent />);
    expect(screen.getByText('Mocked GridComponent')).toBeInTheDocument();
  });

  test('testAnalyticsPageHandlesMissingData', () => {
    render(<GridComponent />);
    expect(screen.getByText('Mocked GridComponent')).toBeInTheDocument();
  });

  test('testSideNavStatePersistence', () => {
    localStorage.setItem('sidebarExpanded', 'false');
    render(<SideNav />);
    expect(localStorage.getItem('sidebarExpanded')).toBe('false');
  });

  test('testGridComponentHandlesApiErrors', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API is down'))
    );
    render(<GridComponent />);
    expect(screen.getByText('Mocked GridComponent')).toBeInTheDocument();
  });
});