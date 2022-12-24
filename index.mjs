import {InfluxDB, Point} from '@influxdata/influxdb-client'
import {url, token, org, bucket, token_coinmarket} from './env.mjs'
import axios from 'axios';
import cron from 'node-cron';

const config = {
  method: 'get',
  url: 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?convert=IDR&slug=solana',
  headers: { 
    'X-CMC_PRO_API_KEY': token_coinmarket
  }
};

cron.schedule('*/5 * * * *', async () => {
  try {
    const writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns')
    const response = await axios.request(config);

    const point1 = new Point('solana')
      .tag('currency', 'idr')
      .floatField('price', response.data['data']['5426']['quote']['IDR']['price'])
      .timestamp(new Date)
    writeApi.writePoint(point1)
    
    await writeApi.close()

    console.log('Solana price is $'+response.data['data']['5426']['quote']['IDR']['price']+' success to write at ' + new Date());
  } catch (error) {
    console.error(error);
  }
})


