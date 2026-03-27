#!/usr/bin/env node
import 'source-map-support/register';
import { SpaStack } from '../lib/spa-stack';
import { DnsStack } from '../lib/dns-stack';
import { App } from 'aws-cdk-lib';

const app = new App();

function checkEnvironmentVariable(envVar: string): string {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} environment variable is required`);
    }

    return process.env[envVar];
}

const zoneId = checkEnvironmentVariable('ZONE_ID');
const zoneName = checkEnvironmentVariable('ZONE_NAME');
const domainName = checkEnvironmentVariable('ZONE_NAME');
const account = checkEnvironmentVariable('AWS_ACCOUNT');
const region = checkEnvironmentVariable('AWS_REGION');

const env = {
    account,
    region,
}

const dnsStack = new DnsStack(app, 'DnsStack', {
    env,
    zoneName,
    zoneId,
})

new SpaStack(app, 'SpaStack', {
    env,
    domainName,
    hostedZone: dnsStack.zone,
});
