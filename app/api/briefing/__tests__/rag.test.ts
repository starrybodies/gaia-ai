import { buildSpatialContext, formatBriefingPrompt } from '@/lib/rag';

test('buildSpatialContext returns structured context string', async () => {
  const context = await buildSpatialContext(
    { lat: -3.5, lon: -52.0 },
    ['fire', 'deforestation'],
    { mockMode: true }
  );
  expect(typeof context).toBe('string');
  expect(context.length).toBeGreaterThan(0);
});

test('formatBriefingPrompt includes location and signal types', () => {
  const prompt = formatBriefingPrompt(
    { lat: -3.5, lon: -52.0, name: 'Pará, Brazil' },
    ['fire', 'deforestation'],
    'CRITICAL alert: CI=12.5',
    'Relevant news: Amazon fire...'
  );
  expect(prompt).toContain('Pará, Brazil');
  expect(prompt).toContain('fire');
  expect(prompt).toContain('CRITICAL');
});
