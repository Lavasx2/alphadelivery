import { useEffect, useRef } from "react";

type LatLng = { lat: number; lng: number };

declare global {
  interface Window {
    google?: unknown;
    __crustMapsInit?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!key) {
      reject(new Error("NO_MAPS_KEY"));
      return;
    }
    window.__crustMapsInit = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__crustMapsInit${
      channel ? `&channel=${channel}` : ""
    }`;
    s.async = true;
    s.onerror = () => reject(new Error("MAPS_LOAD_FAILED"));
    document.head.appendChild(s);
  });
  return loadPromise;
}

export default function MapPicker({
  center,
  value,
  onPick,
}: {
  center: LatLng;
  value: LatLng | null;
  onPick: (p: LatLng) => void;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    let cancelled = false;
    void loadMaps()
      .then(() => {
        if (cancelled || !divRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google.maps;
        const map = new g.Map(divRef.current, {
          center: value ?? center,
          zoom: value ? 16 : 13,
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        const marker = new g.Marker({
          position: value ?? center,
          map,
          draggable: true,
        });
        markerRef.current = marker;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emit = (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          onPickRef.current({ lat, lng });
        };
        map.addListener("click", emit);
        marker.addListener("dragend", emit);
      })
      .catch(() => {
        /* map unavailable */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value && markerRef.current) markerRef.current.setPosition(value);
  }, [value]);

  return <div ref={divRef} className="h-64 w-full rounded-lg bg-secondary" />;
}
