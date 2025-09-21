import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	INodePropertyOptions,
} from 'n8n-workflow';

export class Smartlead implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Smartlead',
		name: 'smartlead',
		icon: 'file:Smartlead.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Smartlead.ai API',
		defaults: {
			name: 'Smartlead',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'smartleadApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://server.smartlead.ai/api/v1',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ====================================================================
			// 		 					RESOURCES & OPERATIONS
			// ====================================================================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Campaign Statistic', value: 'campaignStatistics' },
					{ name: 'Client', value: 'client' },
					{ name: 'Email Account', value: 'emailAccount' },
					{ name: 'Lead', value: 'lead' },
					{ name: 'Master Inbox', value: 'masterInbox' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'campaign',
			},
			{
				displayName: 'Operation Name or ID',
				name: 'operation',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'campaign',
							'campaignStatistics',
							'client',
							'emailAccount',
							'lead',
							'masterInbox',
							'webhook',
						],
					},
				},
				// The options are loaded dynamically based on the resource selected
				typeOptions: {
					loadOptionsMethod: 'loadOperations',
				},
				default: '',
			},

			// ====================================================================
			// 		 					   COMMON FIELDS
			// ====================================================================
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'campaign',
							'campaignStatistics',
							'lead',
							'webhook',
							'masterInbox',
						],
					},
					hide: {
						resource: [
							'campaign',
						],
						operation: [
							'create',
							'getAll',
						],
					},
				},
				description: 'The ID of the campaign',
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'lead',
							'masterInbox',
						],
					},
					hide: {
						resource: [
							'lead',
						],
						operation: [
							'addToCampaign',
							'listAllByCampaign',
							'getByEmail',
							'getCategories',
							'addToGlobalBlockList',
						]
					}
				},
				description: 'The ID of the lead',
			},
			{
				displayName: 'Email Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'emailAccount',
						],
						operation: [
							'get',
							'update',
							'updateWarmup',
							'getWarmupStats'
						],
					},
				},
				description: 'The ID of the email account',
			},
			{
				displayName: 'Limit',
				name: 'leadLimit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				displayOptions: {
					show: { resource: ['lead'], operation: ['listAllByCampaign'] }
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'leadOffset',
				type: 'number',
				default: 0,
				displayOptions: {
					show: { resource: ['lead'], operation: ['listAllByCampaign'] }
				},
				description: 'The starting index for pagination',
			},
			{
				displayName: 'Limit',
				name: 'emailAccountLimit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				displayOptions: {
					show: { resource: ['emailAccount'], operation: ['getAll'] }
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'emailAccountOffset',
				type: 'number',
				default: 0,
				displayOptions: {
					show: { resource: ['emailAccount'], operation: ['getAll'] }
				},
				description: 'The starting index for pagination',
			},

			// ====================================================================
			// 		 				  SPECIFIC FIELDS
			// ====================================================================

			{
				displayName: 'Campaign Name',
				name: 'campaignName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
				description: 'The name of the new campaign',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
				description: 'The ID of the client to associate with the campaign (optional)',
			},
			// ... other specific fields would continue here
		],
	};

	async loadOperations(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		switch (resource) {
			case 'campaign':
				return [
					{ name: 'Add Email Account', value: 'addEmailAccount' }, { name: 'Create', value: 'create' },
					{ name: 'Delete', value: 'delete' }, { name: 'Get', value: 'get' },
					{ name: 'Get Email Accounts', value: 'getEmailAccounts' }, { name: 'Get Many', value: 'getAll' },
					{ name: 'Get Sequences', value: 'getSequences' }, { name: 'Remove Email Account', value: 'removeEmailAccount' },
					{ name: 'Save Sequence', value: 'saveSequence' }, { name: 'Update Schedule', value: 'updateSchedule' },
					{ name: 'Update Settings', value: 'updateSettings' }, { name: 'Update Status', value: 'updateStatus' },
				];
			case 'lead':
				return [
					{ name: 'Add To Campaign', value: 'addToCampaign' }, { name: 'Add To Global Block List', value: 'addToGlobalBlockList' },
					{ name: 'Delete From Campaign', value: 'deleteFromCampaign' }, { name: 'Get By Email', value: 'getByEmail' },
					{ name: 'Get Campaigns', value: 'getCampaigns' }, { name: 'Get Categories', value: 'getCategories' },
					{ name: 'List All By Campaign', value: 'listAllByCampaign' }, { name: 'Pause In Campaign', value: 'pauseInCampaign' },
					{ name: 'Resume In Campaign', value: 'resumeInCampaign' }, { name: 'Unsubscribe From All Campaigns', value: 'unsubscribeFromAll' },
					{ name: 'Unsubscribe From Campaign', value: 'unsubscribeFromCampaign' }, { name: 'Update', value: 'update' },
					{ name: 'Update Category', value: 'updateCategory' },
				];
			// ... add other cases for other resources
			default:
				return [];
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('smartleadApi');
		const apiKey = credentials.apiKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;
				const body: any = {};
				const qs: any = { api_key: apiKey };
				const baseURL = 'https://server.smartlead.ai/api/v1';

				switch (resource) {
					case 'campaign': {
						switch (operation) {
							case 'create': {
								// No ID needed
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/create`, body });
								break;
							}
							case 'getAll': {
								// No ID needed
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns` });
								break;
							}
							case 'get': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}` });
								break;
							}
							// ... apply this pattern to all other campaign operations
						}
						break;
					}
					case 'lead': {
						switch (operation) {
							case 'listAllByCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								qs.limit = this.getNodeParameter('leadLimit', i, 50);
								qs.offset = this.getNodeParameter('leadOffset', i, 0);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads`, qs });
								break;
							}
							case 'update': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}`, body });
								break;
							}
							// ... apply this pattern to all other lead operations
						}
						break;
					}
					// ... other resource cases
				}

				if (typeof responseData === 'string') {
					responseData = JSON.parse(responseData);
				}

				const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
				returnData = returnData.concat(executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
					returnData = returnData.concat(executionErrorData);
					continue;
				}
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}