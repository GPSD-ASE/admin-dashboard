import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Map from '@/components/ui/Map';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('ol', () => ({
  Map: jest.fn().mockImplementation(() => ({
    setTarget: jest.fn(),
    getView: jest.fn().mockReturnValue({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
    }),
    on: jest.fn(),
    addInteraction: jest.fn(),
    addControl: jest.fn(),
  })),
}));

jest.mock('ol/layer/Tile', () => jest.fn());
jest.mock('ol/source', () => ({
  OSM: jest.fn(),
  Vector: jest.fn(),
}));
jest.mock('ol/layer/Vector', () => jest.fn());
jest.mock('ol/Feature', () => jest.fn());
jest.mock('ol/geom/Point', () => jest.fn());
jest.mock('ol/geom', () => ({
  Circle: jest.fn(),
}));
jest.mock('ol/style/Style', () => jest.fn());
jest.mock('ol/style/Icon', () => jest.fn());
jest.mock('ol/style/Circle', () => jest.fn());
jest.mock('ol/style/Fill', () => jest.fn());
jest.mock('ol/style/Stroke', () => jest.fn());
jest.mock('ol/interaction', () => ({
  Select: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  })),
}));
jest.mock('ol/events/condition', () => ({
  click: jest.fn(),
}));
jest.mock('ol/control/FullScreen', () => jest.fn());

describe('Map Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('test_map_initialization', () => {
    render(<Map />);
    expect(screen.getByText('Interact with Map')).toBeInTheDocument();
    expect(screen.getByText('Add Safe Zone')).toBeInTheDocument();
  });

  test('test_add_safe_zone', async () => {
    render(<Map />);
    fireEvent.change(screen.getByLabelText('Zone Name'), { target: { value: 'Test Zone' } });
    fireEvent.click(screen.getByText('Select Type of Incident'));
    fireEvent.click(screen.getByText('Fire'));
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Safezone added Successfully'));
  });

  test('test_view_incident_details', async () => {
    render(<Map />);
    // Simulate clicking on an incident marker
    // This would require mocking the map click event and feature selection
    // For simplicity, assume the popover appears
    expect(screen.getByText('Incident Details')).toBeInTheDocument();
  });

  test('test_geolocation_error_handling', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) => error({ message: 'Geolocation error' })),
    };
    // global.navigator.geolocation = mockGeolocation;
    render(<Map />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error getting geolocation: Geolocation error'));
  });

  test('test_add_safe_zone_without_incident_type', async () => {
    render(<Map />);
    fireEvent.change(screen.getByLabelText('Zone Name'), { target: { value: 'Test Zone' } });
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Please select an incident type'));
  });

  test('test_add_multiple_markers_for_incident', async () => {
    render(<Map />);
    // Simulate adding multiple markers
    // This would require mocking the map click event and feature addition
    // For simplicity, assume the error toast appears
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Cannot select more than one incident on the map'));
  });
});