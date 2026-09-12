import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

// Restaurant coordinates (Crust Tebessa)
const ORIGIN = { latitude: 35.4066917, longitude: 8.1204584 };

/** Farthest deliverable point: Commune of El Hammamet, Tébessa */
export const MAX_DELIVERY_KM = 16;
export const MIN_FEE = 150;
export const MAX_FEE = 350;

export function feeForDistance(km: number) {
  const ratio = Math.min(1, Math.max(0, km / MAX_DELIVERY_KM));
  const raw = MIN_FEE + (MAX_FEE - MIN_FEE) * ratio;
  return Math.round(raw / 10) * 10;
}

function haversineKm(lat: number, lng: number) {
  const R = 6371;
  const dLat = ((lat - ORIGIN.latitude) * Math.PI) / 180;
  const dLng = ((lng - ORIGIN.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((ORIGIN.latitude * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const quoteDelivery = createServerFn({ method: "POST" })
  .inputValidator((input: { lat: number; lng: number }) => {
    const lat = Number(input?.lat);
    const lng = Number(input?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("INVALID_LOCATION");
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error("INVALID_LOCATION");
    }
    return { lat, lng };
  })
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];

    let km = haversineKm(data.lat, data.lng) * 1.3; // fallback: road factor
    let source: "routes" | "estimate" = "estimate";

    if (lovableKey && mapsKey) {
      try {
        const res = await fetch(`${GATEWAY_URL}/routes/directions/v2:computeRoutes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": mapsKey,
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
          },
          body: JSON.stringify({
            origin: { location: { latLng: ORIGIN } },
            destination: {
              location: { latLng: { latitude: data.lat, longitude: data.lng } },
            },
            travelMode: "DRIVE",
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as {
            routes?: { distanceMeters?: number }[];
          };
          const meters = json.routes?.[0]?.distanceMeters;
          if (typeof meters === "number" && meters > 0) {
            km = meters / 1000;
            source = "routes";
          }
        } else {
          console.error(
            `Maps gateway failed [${res.status}]: ${await res.text()}`
          );
        }
      } catch (e) {
        console.error("Maps gateway error", e);
      }
    }

    const distanceKm = Math.round(km * 10) / 10;
    return {
      distanceKm,
      fee: feeForDistance(distanceKm),
      outOfRange: distanceKm > MAX_DELIVERY_KM,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`,
      source,
    };
  });
