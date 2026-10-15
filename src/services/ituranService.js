const axios = require('axios');
const xml2js = require('xml2js');
const { config } = require('../config/config')

const CACHE_TTL = 60_000; // 60 segundos

let cachedData = null;
let cacheTimestamp = 0;
let pendingRequest = null;

const parser = new xml2js.Parser({
  explicitArray: false,
  ignoreAttrs: true,
  tagNameProcessors: [xml2js.processors.stripPrefix],
});

async function fetchCarsInfoIturan() {
  const soapXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <LoginInfo xmlns="http://tempuri.org/">
      <Username>${config.ituranUser}</Username>
      <Password>${config.ituranPassword}</Password>
      <Company>${config.ituranCompany}</Company>
    </LoginInfo>
  </soap:Header>
  <soap:Body>
    <GetCarsInfoNew xmlns="http://tempuri.org/">
      <DeviceID></DeviceID>
    </GetCarsInfoNew>
  </soap:Body>
</soap:Envelope>`;

  const response = await axios.post(config.ituranUrl, soapXml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: '"http://tempuri.org/GetCarsInfoNew"',
    },
    timeout: 30000,
  });

  const result = await parser.parseStringPromise(response.data);
  const body = result?.Envelope?.Body;

  if (!body) {
    throw new Error('La respuesta no contiene Envelope.Body');
  }

  if (body.Fault) {
    throw new Error('Error SOAP: ' + JSON.stringify(body.Fault));
  }

  const responseNode = body.GetCarsInfoNewResponse;

  if (!responseNode) {
    throw new Error(
      'No se encontró GetCarsInfoNewResponse: ' +
      JSON.stringify(body)
    );
  }

  return responseNode.GetCarsInfoNewResult;
}

async function getCarsInfoIturan() {
  // Si la caché sigue vigente, todos reciben los mismos datos.
  if (
    cachedData !== null &&
    Date.now() - cacheTimestamp < CACHE_TTL
  ) {
    return cachedData;
  }

  // Si ya existe una consulta en curso, los demás esperan su resultado.
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = fetchCarsInfoIturan()
    .then((data) => {
      cachedData = data;
      cacheTimestamp = Date.now();
      return data;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}

module.exports = { getCarsInfoIturan };