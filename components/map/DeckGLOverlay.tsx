"use client";

import { useEffect, useRef } from 'react';
import { Deck, type Layer } from '@deck.gl/core';
import type maplibregl from 'maplibre-gl';

interface DeckGLOverlayProps {
  map: maplibregl.Map | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layers: Layer<any>[];
  onHover?: (info: { object?: unknown }) => void;
  onClick?: (info: { object?: unknown }) => void;
}

export function DeckGLOverlay({ map, layers, onHover, onClick }: DeckGLOverlayProps) {
  const deckRef = useRef<Deck | null>(null);
  const onHoverRef = useRef(onHover);
  const onClickRef = useRef(onClick);
  onHoverRef.current = onHover;
  onClickRef.current = onClick;

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    map.getContainer().appendChild(canvas);

    const center = map.getCenter();
    const deck = new Deck({
      canvas,
      width: '100%',
      height: '100%',
      initialViewState: {
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
      },
      controller: false,
      onHover: (info) => onHoverRef.current?.(info as { object?: unknown }),
      onClick: (info) => onClickRef.current?.(info as { object?: unknown }),
    });

    const syncCamera = () => {
      const c = map.getCenter();
      deck.setProps({
        viewState: {
          longitude: c.lng,
          latitude: c.lat,
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        },
      });
    };

    map.on('move', syncCamera);
    deckRef.current = deck;

    return () => {
      map.off('move', syncCamera);
      deck.finalize();
      canvas.remove();
      deckRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    deckRef.current?.setProps({ layers });
  }, [layers]);

  return null; // Canvas is appended directly to map container
}
