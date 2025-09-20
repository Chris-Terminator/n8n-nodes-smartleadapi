import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
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
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Email Account',
						value: 'emailAccount',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
					{
						name: 'Client',
						value: 'client',
					},
				],
				default: 'campaign',
			},

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all campaigns',
						action: 'Get all campaigns',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new campaign',
						action: 'Create a campaign',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a campaign',
						action: 'Delete a campaign',
					},
					{
						name: 'Get Sequence Analytics',
						value: 'getSequenceAnalytics',
						description: 'Get sequence analytics for a campaign',
						action: 'Get sequence analytics',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['lead'],
					},
				},
				options: [
					{
						name: 'List All By Campaign',
						value: 'listAllByCampaign',
						description: 'List all leads by campaign ID',
						action: 'List all leads by campaign',
					},
					{
						name: 'Add To Campaign',
						value: 'addToCampaign',
						description: 'Add leads to a campaign',
						action: 'Add leads to a campaign',
					},
					{
						name: 'Delete From Campaign',
						value: 'deleteFromCampaign',
						description: 'Delete a lead from a campaign',
						action: 'Delete a lead from a campaign',
					},
				],
				default: 'listAllByCampaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['emailAccount'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an email account',
						action: 'Create an email account',
					},
					{
						name: 'Remove From Campaign',
						value: 'removeFromCampaign',
						description: 'Remove an email account from a campaign',
						action: 'Remove an email account from a campaign',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
					},
				},
				options: [
					{
						name: 'Fetch By Campaign',
						value: 'fetchByCampaign',
						description: 'Fetch webhooks by campaign ID',
						action: 'Fetch webhooks by campaign',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a campaign webhook',
						action: 'Delete a webhook',
					},
				],
				default: 'fetchByCampaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['client'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add a client to the system',
						action: 'Add a client',
					},
					{
						name: 'Delete API Key',
						value: 'deleteApiKey',
						description: 'Delete a client API key',
						action: 'Delete a client API key',
					},
					{
						name: 'Reset API Key',
						value: 'resetApiKey',
						description: 'Reset a client API key',
						action: 'Reset a client API key',
					},
				],
				default: 'add',
			},

			// Properties
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign', 'lead', 'emailAccount', 'webhook'],
						operation: ['delete', 'getSequenceAnalytics', 'listAllByCampaign', 'addToCampaign', 'deleteFromCampaign', 'removeFromCampaign', 'fetchByCampaign', 'delete'],
					},
				},
				description: 'The ID of the campaign',
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign', 'client'],
						operation: ['create', 'add', 'deleteApiKey', 'resetApiKey'],
					},
				},
				description: 'The ID of the client',
			},
			{
				displayName: 'Campaign Name',
				name: 'campaignName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'The name of the campaign',
			},
			{
				displayName: 'Lead List',
				name: 'leadList',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['addToCampaign'],
					},
				},
				description: 'An array of lead objects to add to the campaign',
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['deleteFromCampaign'],
					},
				},
				description: 'The ID of the lead to delete',
			},
			{
				displayName: 'Email Account ID',
				name: 'emailAccountId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['emailAccount'],
						operation: ['removeFromCampaign'],
					},
				},
				description: 'The ID of the email account to remove',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['webhook'],
						operation: ['delete'],
					},
				},
				description: 'The ID of the webhook to delete',
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

				let responseData;

				if (resource === 'campaign') {
					if (operation === 'getAll') {
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'GET',
							url: '/campaigns',
						});
					} else if (operation === 'create') {
						const campaignName = this.getNodeParameter('campaignName', i) as string;
						const clientId = this.getNodeParameter('clientId', i) as string;
						const body: any = { name: campaignName };
						if (clientId) {
							body.client_id = clientId;
						}
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'POST',
							url: '/campaigns/create',
							body,
						});
					} else if (operation === 'delete') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'DELETE',
							url: `/campaigns/${campaignId}`,
						});
					} else if (operation === 'getSequenceAnalytics') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'GET',
							url: `/campaigns/${campaignId}/sequence-analytics`,
						});
					}
				} else if (resource === 'lead') {
					if (operation === 'listAllByCampaign') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'GET',
							url: `/campaigns/${campaignId}/leads`,
						});
					} else if (operation === 'addToCampaign') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const leadList = this.getNodeParameter('leadList', i) as string;
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'POST',
							url: `/campaigns/${campaignId}/leads`,
							body: { lead_list: JSON.parse(leadList) },
						});
					} else if (operation === 'deleteFromCampaign') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const leadId = this.getNodeParameter('leadId', i) as string;
						responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', {
							method: 'DELETE',
							url: `/campaigns/${campaignId}/leads/${leadId}`,
						});
					}
				}
				// ... other resources and operations would be implemented here

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
