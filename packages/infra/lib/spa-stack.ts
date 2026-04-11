import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { AllowedMethods, CachedMethods, CachePolicy, Distribution, Function as CfFunction, FunctionCode, FunctionEventType, FunctionRuntime, HttpVersion, IDistribution, PriceClass, ResponseHeadersPolicy, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { join } from 'path';

export interface SpaStackProps extends StackProps {
    domainName: string;
    hostedZone: IHostedZone;
}

export class SpaStack extends Stack {
    public readonly distribution: IDistribution;
    constructor(scope: Construct, id: string, props: SpaStackProps) {
        super(scope, id, props);

        const spaBucket = this.createBucket('Spa');

        // SSL
        const certificate = new Certificate(this, 'Certificate', {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(props.hostedZone),
        });

        const manualsBucket = this.createBucket('Manuals');

        const ogMetaFunction = new CfFunction(this, 'OgMetaFunction', {
            code: FunctionCode.fromFile({ filePath: join(__dirname, 'functions', 'og-meta-function.js') }),
            runtime: FunctionRuntime.JS_2_0,
            comment: 'Returns OG meta tags for crawlers, passes through for browsers',
        });

        // CloudFront distribution
        this.distribution = new Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(spaBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: CachedMethods.CACHE_GET_HEAD,
                compress: true,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
                responseHeadersPolicy: ResponseHeadersPolicy.SECURITY_HEADERS,
                functionAssociations: [
                    {
                        function: ogMetaFunction,
                        eventType: FunctionEventType.VIEWER_REQUEST,
                    },
                ],
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

        // Add manuals behavior to CloudFront
        (this.distribution as Distribution).addBehavior('manuals/*', S3BucketOrigin.withOriginAccessControl(manualsBucket), {
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: CachedMethods.CACHE_GET_HEAD,
            compress: true,
            cachePolicy: CachePolicy.CACHING_OPTIMIZED,
            responseHeadersPolicy: ResponseHeadersPolicy.SECURITY_HEADERS,
        });

        // Deploy manuals to S3
        new BucketDeployment(this, 'DeployManuals', {
            sources: [Source.asset(join(__dirname, 'manuals'))],
            destinationBucket: manualsBucket,
            destinationKeyPrefix: 'manuals',
            distribution: this.distribution,
            distributionPaths: ['/manuals/*'],
        });

        // Deploy built SPA assets to S3 and invalidate CloudFront
        new BucketDeployment(this, 'DeployAssets', {
            sources: [Source.asset(join(__dirname, '../../app/dist'))],
            destinationBucket: spaBucket,
            distribution: this.distribution,
            distributionPaths: ['/*'],
            memoryLimit: 4096,
            cacheControl: [
                CacheControl.setPublic(),
                CacheControl.maxAge(Duration.hours(1)),
                CacheControl.sMaxAge(Duration.days(7)),
            ],
        });

        const subdomainReplaced = props.domainName.replaceAll(`.${props.hostedZone.zoneName}`, '');

        const subdomain = subdomainReplaced === '' ? undefined : subdomainReplaced;

        new ARecord(this, 'ARecord', {
            zone: props.hostedZone,
            recordName: subdomain,
            target: RecordTarget.fromAlias(
                new CloudFrontTarget(this.distribution),
            ),
        })

        // Outputs
        new CfnOutput(this, 'BucketName', { value: spaBucket.bucketName });
        new CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId });
        new CfnOutput(this, 'DistributionDomainName', { value: this.distribution.distributionDomainName });
    }

    private createBucket(id: string): Bucket {
        return new Bucket(this, `${id}Bucket`, {
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
    }
}
