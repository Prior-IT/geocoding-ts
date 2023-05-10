/**
 * Search for a location by a structured or unstructured query.
 */
export async function search(
  query: string | AddressQuery,
  options: SearchOptions = DefaultSearchOptions
): Promise<Place[]> {
  const queryOptions = parseOptions(options);
  const queryString = parseQuery(query);
  const result = await fetch(
    `https://nominatim.openstreetmap.org/search.php?${queryString}&format=jsonv2${queryOptions}`
  );
  return (await result.json()) as Promise<Place[]>;
}

/**
 * Reverse geocode coordinates to get a location.
 */
export async function reverse(
  lat: number | string,
  lon: number | string,
  options: ReverseOptions = DefaultReverseOptions
): Promise<Place | GeocodingError> {
  const queryOptions = parseOptions(options);
  const result = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lon}&format=jsonv2${queryOptions}`
  );
  const json = await result.json();
  if ("error" in json) {
    json.is_error = true;
    return json as GeocodingError;
  } else {
    json.is_error = false;
    return json as Place;
  }
}

// INTERNAL: UTILITY FUNCTIONS

function parseOptions(opt: SearchOptions | ReverseOptions): string {
  let options = [] as string[];
  if (opt.languages) {
    options.push(`accept-language=${opt.languages.join(",")}`);
  }
  if (opt.dedupeResults !== undefined) {
    options.push(`dedupe=${opt.dedupeResults ? 1 : 0}`);
  }
  if (opt.countryCodes !== undefined) {
    options.push(`countrycodes=${opt.countryCodes.join(",")}`);
  }

  // @TODO:
  // geoJson?: boolean;
  // kml?: boolean;
  // svg?: boolean;
  // wkt?: boolean;

  if ((opt as SearchOptions) !== undefined) {
    const o = opt as SearchOptions;
    if (o.fullAddress) {
      options.push("addressdetails=1");
    }
    if (o.limit) {
      options.push(`limit=${o.limit}`);
    }
    if (o.boundingBox) {
      options.push(`viewbox=${o.boundingBox.join(",")}`);
      options.push(`bounded=1`);
    }
  } else if ((opt as ReverseOptions) !== undefined) {
    const o = opt as ReverseOptions;
    if (o.zoomlevel) {
      options.push(`zoomlevel=${o.zoomlevel}`);
    }
  }

  const result = options.join("&");
  if (result.length > 0) {
    return `&${result}`;
  }
  return "";
}

function parseQuery(query: string | AddressQuery): string {
  if (typeof query === "string") {
    return `q=${query}`;
  } else {
    return "";
  }
}

// INPUT TYPES

type Options = {
  /**
   * The language to retrieve results in
   */
  languages?: string[];
  /**
   * Limit the results to the specified countries. Codes should follow the ISO 3155-1alpha2 code (2 letters)
   */
  countryCodes?: string[];
  /**
   * Try to dedupe results that identify the same real-world place or object but are duplicated in OSM to model different characteristics
   */
  dedupeResults?: boolean;
  /**
   * Output geometry in geojson format
   */
  // geoJson?: boolean;
  /**
   * Output geometry in kml format (keyhole markup language)
   */
  // kml?: boolean;
  /**
   * Output geometry in svg format (scalable vector graphics)
   */
  // svg?: boolean;
  /**
   * Output geometry as a wkt (well-known text)
   */
  // wkt?: boolean;
};

const DefaultOptions = {
  dedupeResults: true,
} as const;

type SearchOptions = {
  /**
   * If set to true, the full address will be added in the address field
   */
  fullAddress?: boolean;
  /**
   * Limit the number of returned results
   */
  limit?: number;
  /**
   * The area in which to find search results
   */
  boundingBox?: [number, number, number, number];
} & Options;

const DefaultSearchOptions = {
  limit: 10,
  ...DefaultOptions,
} as const;

type ReverseOptions = {
  /*
   * Level of detail required. Between 0 (countries) and 18 (buildings). Defaults to 18.
   */
  zoomlevel?: number;
} & Options;

const DefaultReverseOptions = {
  ...DefaultOptions,
} as const;

type AddressQuery = {
  street?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  postal_code?: string;
};

// OUTPUT TYPES

export type Place = {
  is_error?: false;
  place_id: number;
  licence: string;
  osm_type: "way" | "node" | "relation";
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  icon?: string;
  addresstype?: string;
  extratags?: Record<string, string>;
  namedetails?: Record<string, string>;
  // @TODO: These fields should only be set if the appropriate option was set
  address?: Address; // @TODO: On option, or always on reverse
  name?: string | null; // @TODO: Only on reverse, not optional there
  // geojson?: any; // @TODO: specify
  // geokml?: string;
  // svg?: string;
  // geotext?: string;
};

export type GeocodingError = {
  is_error: true;
  error: string;
};

export type Address = {
  name?: string;
  road?: string;
  house_number?: string;
  suburb?: string;
  village?: string;
  pedestrian?: string;
  neighborhood?: string;
  hamlet?: string;
  town?: string;
  city?: string;
  county?: string;
  region?: string;
  state_district?: string;
  "ISO3166-2-lvl6"?: string;
  state?: string;
  "ISO3166-2-lvl4"?: string;
  postcode?: string;
  country: string;
  country_code: string;
};
