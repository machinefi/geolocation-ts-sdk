## Installation
```bash
pnpm i @w3bstream/geolocation
```

## Guide

```js
import { GeolocationSDK } from "@w3bstream/geolocation";
import ethers from 'ethers';

// if you want to use wallet signer, you can use this, and you need to set YourPrivateKey, please store your private key locally and don't expose it to the public, in online deployment, you can inject it from environment variables
const signer = new ethers.Wallet(YourPrivateKey);
// if your private key is stored by wallet software, such as metamask, you can use this
// const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();


const sdk = new GeolocationSDK({
  mode: "dev", //"dev" | "prod", it's optional, default is 'dev'
  signer, // signer extends ethers.Signer
});
const proof = await sdk.pol.getProof({
  locations: [
    {
      from: 1676879793, // The start of the time range of interest (Unix timestamp).
      to: 1676015793, // The end of the time range of interest (Unix timestamp).
      scaled_latitude: 30400000, // The GPS latitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
      scaled_longitude: 120520000, // The GPS longitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
      distance: 1000, // The maximum distance from the GPS location you allow the user to be (integer, meters)
    },
  ],
});
// if you want to use mock api, you can use this
const proof = await sdk.pol.getMockProof({
  locations: [
    {
      imei: "123456789012345", // The imei of the device, you can set any value you want
      from: 1676879793, // The start of the time range of interest (Unix timestamp).
      to: 1676015793, // The end of the time range of interest (Unix timestamp).
      scaled_latitude: 30400000, // The GPS latitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
      scaled_longitude: 120520000, // The GPS longitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
      distance: 1000, // The maximum distance from the GPS location you allow the user to be (integer, meters)
    },
  ],
});

```

