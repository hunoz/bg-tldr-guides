import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface SpaStackProps extends cdk.StackProps {
    domainName?: string;
    certificateArn?: string;
}

export class SpaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: SpaStackProps) {
        super(scope, id, props);

        // KMS key for S3 encryption
        const kmsKey = new kms.Key(this, 'S3KmsKey', {
            description: 'KMS key for SPA S3 bucket encryption',
            enableKeyRotation: true,
        });
        kmsKey.addAlias(`${this.stackName}-spa-key`);

        // Grant CloudFront service principal KMS decrypt
        kmsKey.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            resources: ['*'],
            conditions: {
                StringLike: {
                    'aws:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/*`,
                },
            },
        }));

        // SPA hosting bucket
        const spaBucket = new s3.Bucket(this, 'SpaBucket', {
            encryption: s3.BucketEncryption.KMS,
            encryptionKey: kmsKey,
            bucketKeyEnabled: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // CloudFront distribution
        const certificate = props?.certificateArn
            ? acm.Certificate.fromCertificateArn(this, 'Cert', props.certificateArn)
            : undefined;

        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(spaBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
                compress: true,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
            },
            defaultRootObject: 'index.html',
            httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            domainNames: props?.domainName ? [props.domainName] : undefined,
            certificate,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
                { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(10) },
                { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.seconds(10) },
            ],
        });

        // Deploy built SPA assets to S3 and invalidate CloudFront
        new s3deploy.BucketDeployment(this, 'DeployAssets', {
            sources: [s3deploy.Source.asset(path.join(__dirname, '../../web/dist'))],
            destinationBucket: spaBucket,
            distribution,
            distributionPaths: ['/*'],
        });

        // Outputs
        new cdk.CfnOutput(this, 'BucketName', { value: spaBucket.bucketName });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        new cdk.CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
        new cdk.CfnOutput(this, 'KmsKeyArn', { value: kmsKey.keyArn });
    }
}
