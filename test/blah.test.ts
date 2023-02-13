import { Wallet } from 'ethers';
import { GeostreamSDK } from '../src';

describe('getProof', () => {
  it('works', async () => {
    const sdk = new GeostreamSDK({
      signer: new Wallet(process.env.PRIVATE_KEY!),
    });
    const proof = await sdk.pol.getProof({
      owner: '0x6457cb57dAF5DB29adbE7a137904b2042652E4bA',
      locations: [
        {
           from: 1676879793,
           to: 1676015793,
           scaled_latitude: 30400000,
           scaled_longitude: 120520000,
           distance: 1000,
           imei: "12131313"
        }
      ],
    });
  });
});
