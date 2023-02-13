## Guide

```js
 const sdk = new GeostreamSDK({
    mode: 'dev' | 'prod', //Optional, default is 'dev'
    signer: ethers.Signer, // signer extends ethers.Signer
  });
  const proof = await sdk.pol.getProof({
    owner: '0x6457cb57dAF5DB29adbE7a137904b2042652E4bA', // The wallet address of the user of which you want to prove the location. This must be the IoTeX wallet address that the user associated to Metapebble.
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
    owner: '0x6457cb57dAF5DB29adbE7a137904b2042652E4bA', // The wallet address of the user of which you want to prove the location. This must be the IoTeX wallet address that the user associated to Metapebble.
    locations: [
      {
        imei: '123456789012345', // The imei of the device, you can set any value you want
        from: 1676879793, // The start of the time range of interest (Unix timestamp).
        to: 1676015793, // The end of the time range of interest (Unix timestamp).
        scaled_latitude: 30400000, // The GPS latitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
        scaled_longitude: 120520000, // The GPS longitude where the user is supposed to be. tip:(4.131637, 10.168213) => (4131637, 10168213)
        distance: 1000, // The maximum distance from the GPS location you allow the user to be (integer, meters)
      },
    ],
  });
```

# geostream-ts-sdk
# geostream-ts-sdk
