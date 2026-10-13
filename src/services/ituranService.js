const axios = require('axios');
const xml2js = require('xml2js');

const ITURAN_URL = 'https://www.worldfleetlog.com/WebFleetStationServices/Online.asmx';
const USERNAME = 'wslangostino';
const PASSWORD = 'Ws123456!';
const COMPANY = 'Langostino';

const parser = new xml2js.Parser({
  explicitArray: false,
  ignoreAttrs: true,
  tagNameProcessors: [xml2js.processors.stripPrefix],
});

async function getCarsInfoIturan() {
  const soapXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <LoginInfo xmlns="http://tempuri.org/">
      <Username>${USERNAME}</Username>
      <Password>${PASSWORD}</Password>
      <Company>${COMPANY}</Company>
    </LoginInfo>
  </soap:Header>
  <soap:Body>
    <GetCarsInfoNew xmlns="http://tempuri.org/">
      <DeviceID></DeviceID>
    </GetCarsInfoNew>
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await axios.post(ITURAN_URL, soapXml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '"http://tempuri.org/GetCarsInfoNew"',
      },
      timeout: 30000,
    });

    const result = await parser.parseStringPromise(response.data);

    // Los prefijos soap, soap12, etc. ya se han eliminado.
    const body = result?.Envelope?.Body;

    if (!body) {
      throw new Error('La respuesta no contiene Envelope.Body');
    }

    if (body.Fault) {
      throw new Error(
        'Error SOAP: ' + JSON.stringify(body.Fault)
      );
    }

    const responseNode = body.GetCarsInfoNewResponse;

    if (!responseNode) {
      throw new Error(
        'No se encontró GetCarsInfoNewResponse: ' +
        JSON.stringify(body)
      );
    }

    const resultNode = responseNode.GetCarsInfoNewResult;

    // No asumimos todavía que los vehículos estén dentro de V.
    return resultNode;

  } catch (error) {
    console.error(
      'ERROR ITURAN:',
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = { getCarsInfoIturan };