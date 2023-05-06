# Geocoding

Modern TypeScript library that allows geocoding and reverse geocoding through the OpenStreetMap Nominatim API

## Installation:
Install using your favourite package manager:

```
npm install @priorit/geocoding
```

```
pnpm add @priorit/geocoding
```

```
yarn add @priorit/geocoding
```

## Usage:

```
import { Geocoding } from "@priorit/geocoding";

// Regular queries
const response = await Geocoding.search("prior-it hq");
console.log(response.display_name);

// Reverse geocoding
const response = await Geocoding.reverse(51.0195611619683, 3.68261385663317);
console.log(response.address.name);
```
