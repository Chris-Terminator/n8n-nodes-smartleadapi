import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class AnymailFinder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Anymailfinder',
		name: 'anymailFinder',
		icon: 'file:anymailfinder.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Find and verify email addresses using Anymailfinder API',
		defaults: {
			name: 'Anymailfinder',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'anymailFinderApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.anymailfinder.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account Info',
						value: 'accountInfo',
						description: 'Get account details and credits',
					},
					{
						name: 'Company Email',
						value: 'companyEmail',
						description: 'Find all emails at a company',
					},
					{
						name: 'Decision Maker',
						value: 'decisionMaker',
						description: 'Find decision maker\'s email',
					},
					{
						name: 'Email Verification',
						value: 'emailVerification',
						description: 'Verify if an email is valid',
					},
					{
						name: 'LinkedIn Email',
						value: 'linkedinEmail',
						description: 'Find email by LinkedIn URL',
					},
					{
						name: 'Person Email',
						value: 'personEmail',
						description: 'Find a person\'s email address',
					},
				],
				default: 'personEmail',
			},
			// Person Email Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['personEmail'],
					},
				},
				options: [
					{
						name: 'Find Email',
						value: 'findEmail',
						description: 'Find a person\'s email by name and company',
						action: 'Find a person\'s email',
					},
				],
				default: 'findEmail',
			},
			// Company Email Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['companyEmail'],
					},
				},
				options: [
					{
						name: 'Find Emails',
						value: 'findEmails',
						description: 'Find all emails at a company (up to 20)',
						action: 'Find company emails',
					},
				],
				default: 'findEmails',
			},
			// Decision Maker Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['decisionMaker'],
					},
				},
				options: [
					{
						name: 'Find Email',
						value: 'findEmail',
						description: 'Find decision maker\'s email',
						action: 'Find decision maker email',
					},
				],
				default: 'findEmail',
			},
			// LinkedIn Email Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['linkedinEmail'],
					},
				},
				options: [
					{
						name: 'Find Email',
						value: 'findEmail',
						description: 'Find email by LinkedIn profile URL',
						action: 'Find email by LinkedIn URL',
					},
				],
				default: 'findEmail',
			},
			// Email Verification Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['emailVerification'],
					},
				},
				options: [
					{
						name: 'Verify Email',
						value: 'verifyEmail',
						description: 'Verify if an email address is valid',
						action: 'Verify email address',
					},
				],
				default: 'verifyEmail',
			},
			// Account Info Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['accountInfo'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get account details and remaining credits',
						action: 'Get account information',
					},
				],
				default: 'getInfo',
			},

			// =================== PERSON EMAIL PARAMETERS ===================
			{
				displayName: 'Name Input Method',
				name: 'nameInputMethod',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
					},
				},
				options: [
					{
						name: 'Full Name',
						value: 'fullName',
						description: 'Enter the person\'s full name',
					},
					{
						name: 'First & Last Name',
						value: 'firstLast',
						description: 'Enter first and last name separately',
					},
				],
				default: 'fullName',
				description: 'Choose how to provide the person\'s name',
			},
			{
				displayName: 'Full Name',
				name: 'fullName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
						nameInputMethod: ['fullName'],
					},
				},
				default: '',
				description: 'The full name of the person (e.g., "John Doe")',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
						nameInputMethod: ['firstLast'],
					},
				},
				default: '',
				description: 'The person\'s first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
						nameInputMethod: ['firstLast'],
					},
				},
				default: '',
				description: 'The person\'s last name',
			},
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
					},
				},
				default: '',
				description: 'Company domain (e.g., "microsoft.com"). Use either domain or company name.',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['personEmail'],
						operation: ['findEmail'],
					},
				},
				default: '',
				description: 'Company name (e.g., "Microsoft"). Domain is preferred for better accuracy.',
			},

			// =================== COMPANY EMAIL PARAMETERS ===================
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['companyEmail'],
						operation: ['findEmails'],
					},
				},
				default: '',
				description: 'Company domain (e.g., "microsoft.com"). Use either domain or company name.',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['companyEmail'],
						operation: ['findEmails'],
					},
				},
				default: '',
				description: 'Company name (e.g., "Microsoft"). Domain is preferred for better accuracy.',
			},

			// =================== DECISION MAKER PARAMETERS ===================
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['decisionMaker'],
						operation: ['findEmail'],
					},
				},
				default: '',
				description: 'Company domain (e.g., "microsoft.com"). Use either domain or company name.',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['decisionMaker'],
						operation: ['findEmail'],
					},
				},
				default: '',
				description: 'Company name (e.g., "Microsoft"). Domain is preferred for better accuracy.',
			},
			{
				displayName: 'Decision Maker Category',
				name: 'decisionMakerCategory',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['decisionMaker'],
						operation: ['findEmail'],
					},
				},
				options: [
					{
						name: 'CEO / Owner / President / Founder',
						value: 'ceo',
					},
					{
						name: 'Engineering',
						value: 'engineering',
					},
					{
						name: 'Finance',
						value: 'finance',
					},
					{
						name: 'Human Resources (HR)',
						value: 'hr',
					},
					{
						name: 'Information Technology (IT)',
						value: 'it',
					},
					{
						name: 'Logistics',
						value: 'logistics',
					},
					{
						name: 'Marketing',
						value: 'marketing',
					},
					{
						name: 'Operations / Administration',
						value: 'operations',
					},
				],
				default: 'ceo',
				description: 'The department or role category to search for',
			},

			// =================== LINKEDIN EMAIL PARAMETERS ===================
			{
				displayName: 'LinkedIn URL',
				name: 'linkedinUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['linkedinEmail'],
						operation: ['findEmail'],
					},
				},
				default: '',
				placeholder: 'https://www.linkedin.com/in/username/',
				description: 'LinkedIn profile URL of the person',
			},

			// =================== EMAIL VERIFICATION PARAMETERS ===================
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				displayOptions: {
					show: {
						resource: ['emailVerification'],
						operation: ['verifyEmail'],
					},
				},
				default: '',
				description: 'Email address to verify',
			},

			// =================== ADDITIONAL OPTIONS ===================
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['personEmail', 'companyEmail', 'decisionMaker', 'linkedinEmail', 'emailVerification'],
					},
				},
				options: [
					{
						displayName: 'Webhook URL',
						name: 'webhookUrl',
						type: 'string',
						default: '',
						description: 'URL to receive webhook callback when result is ready (instead of waiting for response)',
					},
					{
						displayName: 'Timeout (seconds)',
						name: 'timeout',
						type: 'number',
						default: 180,
						description: 'Request timeout in seconds. Recommended: 180 seconds for searches.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

				let responseData;
				let requestOptions: any = {
					json: true,
					timeout: (additionalOptions.timeout || 180) * 1000,
				};

				// Add webhook header if provided
				if (additionalOptions.webhookUrl) {
					requestOptions.headers = {
						'x-webhook-url': additionalOptions.webhookUrl,
					};
				}

				if (resource === 'personEmail' && operation === 'findEmail') {
					const nameInputMethod = this.getNodeParameter('nameInputMethod', i) as string;
					const domain = this.getNodeParameter('domain', i, '') as string;
					const companyName = this.getNodeParameter('companyName', i, '') as string;

					if (!domain && !companyName) {
						throw new NodeOperationError(this.getNode(), 'Either domain or company name must be provided', {
							itemIndex: i,
						});
					}

					const body: any = {};

					if (nameInputMethod === 'fullName') {
						const fullName = this.getNodeParameter('fullName', i) as string;
						body.full_name = fullName;
					} else {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						body.first_name = firstName;
						body.last_name = lastName;
					}

					if (domain) body.domain = domain;
					if (companyName) body.company_name = companyName;

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'POST',
							url: 'https://api.anymailfinder.com/v5.0/search/person.json',
							body,
							...requestOptions,
						},
					);

				} else if (resource === 'companyEmail' && operation === 'findEmails') {
					const domain = this.getNodeParameter('domain', i, '') as string;
					const companyName = this.getNodeParameter('companyName', i, '') as string;

					if (!domain && !companyName) {
						throw new NodeOperationError(this.getNode(), 'Either domain or company name must be provided', {
							itemIndex: i,
						});
					}

					const body: any = {};
					if (domain) body.domain = domain;
					if (companyName) body.company_name = companyName;

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'POST',
							url: 'https://api.anymailfinder.com/v5.1/find-email/company',
							body,
							...requestOptions,
						},
					);

				} else if (resource === 'decisionMaker' && operation === 'findEmail') {
					const domain = this.getNodeParameter('domain', i, '') as string;
					const companyName = this.getNodeParameter('companyName', i, '') as string;
					const decisionMakerCategory = this.getNodeParameter('decisionMakerCategory', i) as string;

					if (!domain && !companyName) {
						throw new NodeOperationError(this.getNode(), 'Either domain or company name must be provided', {
							itemIndex: i,
						});
					}

					const body: any = {
						decision_maker_category: decisionMakerCategory,
					};
					if (domain) body.domain = domain;
					if (companyName) body.company_name = companyName;

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'POST',
							url: 'https://api.anymailfinder.com/v5.0/search/decision-maker.json',
							body,
							...requestOptions,
						},
					);

				} else if (resource === 'linkedinEmail' && operation === 'findEmail') {
					const linkedinUrl = this.getNodeParameter('linkedinUrl', i) as string;

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'POST',
							url: 'https://api.anymailfinder.com/v5.0/search/linkedin-url.json',
							body: { linkedin_url: linkedinUrl },
							...requestOptions,
						},
					);

				} else if (resource === 'emailVerification' && operation === 'verifyEmail') {
					const email = this.getNodeParameter('email', i) as string;

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'POST',
							url: 'https://api.anymailfinder.com/v5.1/verify-email',
							body: { email },
							...requestOptions,
						},
					);

				} else if (resource === 'accountInfo' && operation === 'getInfo') {
					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'anymailFinderApi',
						{
							method: 'GET',
							url: 'https://api.anymailfinder.com/v5.1/account',
							...requestOptions,
						},
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
