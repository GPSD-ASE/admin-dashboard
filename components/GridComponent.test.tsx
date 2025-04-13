import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GridComponent from './GridComponent';
import { API_CONSTANTS } from '@/constants/ApiConstants';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true,
  })
) as jest.Mock;

describe('GridComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the grid component', () => {
    render(<GridComponent />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('fetches and displays data', async () => {
    const mockData = [
      {
        incidentId: '1',
        incidentType: 'Fire',
        severityLevel: 'High',
        incidentStatus: 'Open',
        injuredCount: 2,
        affectedCount: 5,
        radius: 10,
        geoName: 'Location A',
        username: 'User1',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:00:00Z',
        notes: 'Test note',
      },
    ];

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
      })
    );

    render(<GridComponent />);
    await waitFor(() => expect(screen.getByText('Fire')).toBeInTheDocument());
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Location A')).toBeInTheDocument();
  });

  test('opens popover on row double-click', async () => {
    const mockData = [
      {
        incidentId: '1',
        incidentType: 'Fire',
        severityLevel: 'High',
        incidentStatus: 'Open',
        injuredCount: 2,
        affectedCount: 5,
        radius: 10,
        geoName: 'Location A',
        username: 'User1',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:00:00Z',
        notes: 'Test note',
      },
    ];

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
      })
    );

    render(<GridComponent />);
    await waitFor(() => expect(screen.getByText('Fire')).toBeInTheDocument());

    const row = screen.getByText('Fire');
    fireEvent.doubleClick(row);

    expect(screen.getByText('Modify Incident')).toBeInTheDocument();
  });

  test('submits form and updates incident status', async () => {
    const mockData = [
      {
        incidentId: '1',
        incidentType: 'Fire',
        severityLevel: 'High',
        incidentStatus: 'Open',
        injuredCount: 2,
        affectedCount: 5,
        radius: 10,
        geoName: 'Location A',
        username: 'User1',
        createdAt: '2023-10-01T12:00:00Z',
        updatedAt: '2023-10-01T12:00:00Z',
        notes: 'Test note',
      },
    ];

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
      })
    );

    render(<GridComponent />);
    await waitFor(() => expect(screen.getByText('Fire')).toBeInTheDocument());

    const row = screen.getByText('Fire');
    fireEvent.doubleClick(row);

    const select = screen.getByPlaceholderText('Select Type of Incident');
    fireEvent.mouseDown(select);
    const option = screen.getByText('Resolved');
    fireEvent.click(option);

    const button = screen.getByText('Report');
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenCalledWith(
      API_CONSTANTS.PATCH_INCIDENT('1') + 'Resolved',
      expect.any(Object)
    );
  });
});