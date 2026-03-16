export interface Station {
  id: number;
  name: string;
}

export interface ViaRoute {
  id: number;
  station: Station;
}

export interface RouteStationsSource {
  fromStation?: Station;
  toStation?: Station;
  viaRoute?: ViaRoute[];
}

export const buildStations = (route?: RouteStationsSource) => {
  const stations: Station[] = [];
  const pushUnique = (station?: Station) => {
    if (!station) return;
    if (!stations.some((s) => s.id === station.id)) {
      stations.push(station);
    }
  };

  pushUnique(route?.fromStation);
  route?.viaRoute?.forEach((v) => pushUnique(v.station));
  pushUnique(route?.toStation);

  return stations;
};

export const buildPairs = (stations: Station[]) => {
  const pairs: { from: Station; to: Station }[] = [];
  for (let i = 0; i < stations.length; i++) {
    for (let j = i + 1; j < stations.length; j++) {
      pairs.push({ from: stations[i], to: stations[j] });
    }
  }
  return pairs;
};
