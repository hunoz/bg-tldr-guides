import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { AllowedMethods, CachedMethods, CachePolicy, Distribution, HttpVersion, PriceClass, ResponseHeadersPolicy, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { join } from 'path';

export interface SpaStackProps extends StackProps {
    domainName: string;
    hostedZone: IHostedZone;
}

export class SpaStack extends Stack {
    constructor(scope: Construct, id: string, props: SpaStackProps) {
        super(scope, id, props);

        // KMS key for S3 encryption
        const kmsKey = new Key(this, 'S3KmsKey', {
            description: 'KMS key for SPA S3 bucket encryption',
            enableKeyRotation: true,
        });
        kmsKey.addAlias(`${this.stackName}-spa-key`);

        // Grant CloudFront service principal KMS decrypt
        kmsKey.addToResourcePolicy(new PolicyStatement({
            actions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            resources: ['*'],
            conditions: {
                StringLike: {
                    'aws:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/*`,
                },
            },
        }));

        // SPA hosting bucket
        const spaBucket = new Bucket(this, 'SpaBucket', {
            encryption: BucketEncryption.KMS,
            encryptionKey: kmsKey,
            bucketKeyEnabled: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // SSL
        const certificate = new Certificate(this, 'Certificate', {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(props.hostedZone),
        })

        // CloudFront distribution
        const distribution = new Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(spaBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: CachedMethods.CACHE_GET_HEAD,
                compress: true,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                responseHeadersPolicy: ResponseHeadersPolicy.SECURITY_HEADERS,
            },
            defaultRootObject: 'index.html',
            httpVersion: HttpVersion.HTTP2_AND_3,
            priceClass: PriceClass.PRICE_CLASS_100,
            domainNames: [props.domainName],
            enableLogging: true,
            certificate,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
                { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(10) },
                { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(10) },
            ],
        });

        // Deploy built SPA assets to S3 and invalidate CloudFront
        new BucketDeployment(this, 'DeployAssets', {
            sources: [Source.asset(join(__dirname, '../../web/dist'))],
            destinationBucket: spaBucket,
            distribution,
            distributionPaths: ['/*'],
        });

        const subdomainReplaced = props.domainName.replaceAll(`.${props.hostedZone.zoneName}`, '');

        const subdomain = subdomainReplaced === '' ? undefined : subdomainReplaced;

        new ARecord(this, 'ARecord', {
            zone: props.hostedZone,
            recordName: subdomain,
            target: RecordTarget.fromAlias(
                new CloudFrontTarget(distribution),
            ),
        })

        // Outputs
        new CfnOutput(this, 'BucketName', { value: spaBucket.bucketName });
        new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
        new CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
        new CfnOutput(this, 'KmsKeyArn', { value: kmsKey.keyArn });
    }
}
