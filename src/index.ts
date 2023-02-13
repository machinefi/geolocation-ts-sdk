import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { Signer } from 'ethers';
import { SiweMessage } from 'siwe';
import axios from 'axios';
import merge from 'lodash/merge';
import { URL } from 'url';
import globalShim from 'globalthis/shim'
globalShim()

export interface Location {
  from: number;
  to: number;
  scaled_latitude: number;
  scaled_longitude: number;
  distance: number;
  imei?: string
}

export interface StreamServer {
  api: {
    pol: string;
    mockPol: string
  };
  host: string;
}

export class Pol {
  sdk: GeostreamSDK;
  constructor({ sdk }: { sdk: GeostreamSDK }) {
    this.sdk = sdk;
  }

  private get _polUrl() {
    return new URL(
      this.sdk.streamServer.api.pol,
      this.sdk.streamServer.host
    ).toString();
  }

  private get _mockPolUrl() {
    return new URL(
      this.sdk.streamServer.api.mockPol,
      this.sdk.streamServer.host
    ).toString();
  }

  private _createSiweMessage({
    owner,
    locations,
  }: {
    owner: string;
    locations: Location[];
  }) {
    const signText = locations.reduce((agg, location) => {
      return (
        agg +
        ',' +
        `from ${location.from} to ${location.to} within ${
          location.distance
        } meter from [${new BigNumber(location.scaled_latitude.toString())
          .div(1e6)
          .toNumber()}, ${new BigNumber(location.scaled_longitude.toString())
          .div(1e6)
          .toNumber()}]`
      );
    }, '');
    const message = new SiweMessage({
      // domain: 'stake.iotex.io',
      domain: globalThis.location.host,
      address: owner,
      statement: `Sign in Location Based NFT The application will know if you were located in one of the following regions in the time range below:locations:${signText}`,
      uri: globalThis.location.origin,
      // uri: "https://stake.iotex.io",
      version: '1',
      chainId: this.sdk.chain.chainId,
      expirationTime: dayjs()
        .add(1, 'minutes')
        .toISOString(),
    });
    return message.prepareMessage();
  }
  private async _getProofFromRemote({
    signature,
    message,
    owner,
    locations,
  }: {
    signature: string;
    message: string;
    owner: string;
    locations: Location[];
  }) {
    const res = await axios.post(this._polUrl, {
      signature,
      message,
      owner,
      locations,
    });
    return res.data.result.data
  }
  async getMockProof({
    owner,
    locations,
  }: {
    owner: string;
    locations: Location[];
  }) {
    const res = await axios.post(this._mockPolUrl, {
      owner,
      locations,
    });
    return res.data.result.data
  }
  async getProof({
    owner,
    locations,
  }: {
    owner: string;
    locations: Location[];
  }) {
    const message = this._createSiweMessage({
      owner,
      locations,
    });
    const signature = await this.sdk.signer.signMessage(message);
    return this._getProofFromRemote({
      signature,
      message,
      owner,
      locations,
    })
  }
}

export class GeostreamSDK {
  pol: Pol;
  mode: 'dev' | 'prod';
  signer: Signer;
  chain: {
    chainId: number;
  };
  adminToken?: string;
  streamServer: StreamServer;
  get isDev() {
    return this.mode === 'dev';
  }


  constructor({
    signer,
    mode = 'dev',
    streamServer = {},
  }: {
    signer: Signer;
    adminToken?: string
    mode?: 'dev' | 'prod';
    streamServer?: {
      api?: {
        pol?: string;
      };
      host?: string;
    };
  }) {
    this.mode = mode;
    this.signer = signer;
    this.chain = {
      chainId: mode === 'dev' ? 4690 : 4689,
    };
    this.streamServer = merge(
      {
        api: {
          pol: '/api/pol',
          mockPol: '/api/pol_mock'
        },
        host:
          mode === 'dev'
            ? 'https://geo-test.w3bstream.com/'
            : 'https://geo.w3bstream.com/',
      },
      streamServer
    );
    this.pol = new Pol({
      sdk: this,
    });
  }
}