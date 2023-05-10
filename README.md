# Geocoding

Modern TypeScript library that allows geocoding and reverse geocoding through the OpenStreetMap Nominatim API

## Installation:
Install using your favourite package manager:

```
npm install @prior-it/geocoding
```

```
pnpm add @prior-it/geocoding
```

```
yarn add @prior-it/geocoding
```

## Requirements:
This library will only work with NodeJS 18 or later.


## Usage:

```ts
import { Geocoding } from "@prior-it/geocoding";

// Regular queries
const response = await Geocoding.search("prior-it hq", { fullAddress: true });
console.log(response.display_name);

// Reverse geocoding
const response = await Geocoding.reverse(51.0195611619683, 3.68261385663317, { zoomlevel: 18 });
console.log(response.address.name);
```
