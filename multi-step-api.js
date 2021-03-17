
var synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanaryBlueprint = async function () {
    
    // Handle validation for positive scenario
    const validatePositiveCase = async function(res) {
        return new Promise((resolve, reject) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                throw res.statusCode + ' ' + res.statusMessage;
            }
     
            let responseBody = '';
            res.on('data', (d) => {
                responseBody += d;
            });
     
            res.on('end', () => {
                // Add validation on 'responseBody' here if required. For ex, your status code is 200 but data might be empty
                resolve();
            });
        });
    };
    
    // Handle validation for negative scenario
    const validateNegativeCase = async function(res) {
        return new Promise((resolve, reject) => {
            if (res.statusCode < 400) {
                throw res.statusCode + ' ' + res.statusMessage;
            }
        });
    };
    
    let requestOptionsStep1 = {
        'hostname': 'myproductsEndpoint.com',
        'method': 'GET',
        'path': '/test/product/validProductName',
        'port': 443,
        'protocol': 'https:'
    };
    
    let headers = {};
    headers['User-Agent'] = [synthetics.getCanaryUserAgentString(), headers['User-Agent']].join(' ');
    
    requestOptionsStep1['headers'] = headers;

    // By default headers, post data and response body are not included in the report for security reasons. 
    // Change the configuration at global level or add as step configuration for individual steps
    let stepConfig = {
        includeRequestHeaders: true, 
        includeResponseHeaders: true,
        restrictedHeaders: ['X-Amz-Security-Token', 'Authorization'], // Restricted header values do not appear in report generated.
        includeRequestBody: true,
        includeResponseBody: true
    };
       

    await synthetics.executeHttpStep('Verify GET products API with valid name', requestOptionsStep1, validatePositiveCase, stepConfig);
    
    let requestOptionsStep2 = {
        'hostname': ‘myproductsEndpoint.com',
        'method': 'GET',
        'path': '/test/canary/InvalidName(',
        'port': 443,
        'protocol': 'https:'
    };
    
    headers = {};
    headers['User-Agent'] = [synthetics.getCanaryUserAgentString(), headers['User-Agent']].join(' ');
    
    requestOptionsStep2['headers'] = headers;

    // By default headers, post data and response body are not included in the report for security reasons. 
    // Change the configuration at global level or add as step configuration for individual steps
    stepConfig = {
        includeRequestHeaders: true, 
        includeResponseHeaders: true,
        restrictedHeaders: ['X-Amz-Security-Token', 'Authorization'], // Restricted header values do not appear in report generated.
        includeRequestBody: true,
        includeResponseBody: true
    };
    
    await synthetics.executeHttpStep('Verify GET products API with invalid name', requestOptionsStep2, validateNegativeCase, stepConfig);
    
};

exports.handler = async () => {
    return await apiCanaryBlueprint();
};