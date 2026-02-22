import { render, fireEvent } from '@testing-library/react';
import { LayerControls } from '../LayerControls';

const mockLayers = [
  { id: 'fire', label: 'Fire Detection', visible: true, color: '#FF6400' },
  { id: 'deforestation', label: 'Deforestation', visible: false, color: '#8B5A2B' },
];

test('renders all layer toggles', () => {
  const { getByText } = render(
    <LayerControls layers={mockLayers} onToggle={() => {}} />
  );
  expect(getByText('Fire Detection')).toBeTruthy();
  expect(getByText('Deforestation')).toBeTruthy();
});

test('calls onToggle with layer id when clicked', () => {
  const onToggle = jest.fn();
  const { getByText } = render(
    <LayerControls layers={mockLayers} onToggle={onToggle} />
  );
  fireEvent.click(getByText('Fire Detection'));
  expect(onToggle).toHaveBeenCalledWith('fire');
});
