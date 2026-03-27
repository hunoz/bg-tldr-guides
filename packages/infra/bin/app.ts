#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SpaStack } from '../lib/spa-stack';

const app = new cdk.App();

new SpaStack(app, 'CobGuideSpa', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
    domainName: app.node.tryGetContext('domainName'),
    certificateArn: app.node.tryGetContext('certificateArn'),
});
