import * as http from 'http';
import * as https from 'https';
import { RequestOptions } from 'https';
import { parse as parseQueryString } from 'querystring';
import { parse as parseURL } from 'url';

/**
 * Executes a GET request and returns the
 * response as a JSON-parsed object
 * @param address {string} The url
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {unknown}
 */
export async function getRequestJSON(
  address: string,
  headers?: Record<string, unknown>,
): Promise<unknown> {
  const string = await getRequestString(address, headers);
  if (string?.length) {
    return JSON.parse(string);
  }
}

/**
 * Executes a GET request and returns the
 * response as a string
 * @param address {string} The url
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {String}
 */
export async function getRequestString(
  address: string,
  headers?: Record<string, unknown>,
): Promise<string> {
  const buffer = await getRequestBuffer(address, headers);
  return buffer?.toString();
}

/**
 * Executes a GET request and returns the
 * response as a Buffer
 * @param address {string} The url
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {Buffer}
 */
export async function getRequestBuffer(
  address: string,
  headers?: Record<string, unknown>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const parsed = parseURL(address);
    const options = <RequestOptions>{
      host: parsed.hostname,
      path: parsed.path,
      port: parsed.port || (address.startsWith('https') ? 443 : 80),
      method: 'GET',
      headers,
    };
    const protocol = address.startsWith('https') ? https : http;
    const request = protocol.request(options, (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        if (chunks?.length) {
          const body = Buffer.concat(chunks);
          return resolve(body);
        }
        return resolve(undefined);
      });
    });
    request.on('error', (error) => {
      return reject(error);
    });
    return request.end();
  });
}

/**
 * Executes a POST request and returns the
 * response as a Buffer
 * @param address {string} The url
 * @param body {string | Record<string, unknown>} optional POST data
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {Record<unknown>}
 */
export async function postRequestJSON(
  address: string,
  body: string | Record<string, unknown>,
  headers?: Record<string, unknown>,
): Promise<unknown> {
  const string = await postRequestString(address, body, headers);
  if (string?.length) {
    return JSON.parse(string);
  }
}

/**
 * Executes a POST request and returns the
 * response as a Buffer
 * @param address {string} The url
 * @param body {string | Record<string, unknown>} optional POST data
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {string}
 */
export async function postRequestString(
  address: string,
  body: string | Record<string, unknown>,
  headers?: Record<string, unknown>,
): Promise<string> {
  const buffer = await postRequestBuffer(address, body, headers);
  return buffer?.toString();
}

/**
 * Executes a POST request and returns the
 * response as a Buffer
 * @param address {string} The url
 * @param body {string | Record<string, unknown>} optional POST data
 * @param headers {Record<string, unknown>} optional HTTP headers
 * @returns {Buffer}
 */
export async function postRequestBuffer(
  address: string,
  body: string | Record<string, unknown>,
  headers?: Record<string, unknown>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const parsed = parseURL(address);
    const options = <RequestOptions>{
      host: parsed.hostname,
      path: parsed.path,
      port: parsed.port || (address.startsWith('https') ? 443 : 80),
      method: 'POST',
      headers,
    };
    if (address.indexOf('?') > -1) {
      (<Record<string, unknown>>options).query = parseQueryString(
        address.substring(address.indexOf('?') + 1),
      );
    }
    const protocol = address.startsWith('https') ? https : http;
    const request = protocol.request(options, (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        if (chunks.length) {
          const body = Buffer.concat(chunks);
          return resolve(body);
        }
        return resolve(undefined);
      });
    });
    request.on('error', (error) => {
      return reject(error);
    });
    if (typeof body === 'string') {
      request.write(body);
    } else {
      const postData = [];
      for (const key in body) {
        postData.push(`${key}=${body[key]}`);
      }
      request.write(postData.join('&'));
    }
    return request.end();
  });
}
