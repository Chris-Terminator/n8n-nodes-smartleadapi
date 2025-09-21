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
			// Resources
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

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['campaign'] } },
				options: [
					{ name: 'Add Email Account', value: 'addEmailAccount', description: 'Add an email account to a campaign', action: 'Add an email account to a campaign' },
					{ name: 'Create', value: 'create', description: 'Create a new campaign', action: 'Create a campaign' },
					{ name: 'Delete', value: 'delete', description: 'Delete a campaign', action: 'Delete a campaign' },
					{ name: 'Get', value: 'get', description: 'Get a campaign by ID', action: 'Get a campaign' },
					{ name: 'Get Email Accounts', value: 'getEmailAccounts', description: 'List all email accounts for a campaign', action: 'Get a campaign s email accounts' },
					{ name: 'Get Many', value: 'getAll', description: 'Get many campaigns', action: 'Get many campaigns' },
					{ name: 'Get Sequences', value: 'getSequences', description: 'Fetch sequences for a campaign', action: 'Get a campaign s sequences' },
					{ name: 'Remove Email Account', value: 'removeEmailAccount', description: 'Remove an email account from a campaign', action: 'Remove an email account from a campaign' },
					{ name: 'Save Sequence', value: 'saveSequence', description: 'Save a campaign sequence', action: 'Save a campaign sequence' },
					{ name: 'Update Schedule', value: 'updateSchedule', description: 'Update a campaign\'s schedule', action: 'Update a campaign s schedule' },
					{ name: 'Update Settings', value: 'updateSettings', description: 'Update a campaign\'s settings', action: 'Update a campaign s settings' },
					{ name: 'Update Status', value: 'updateStatus', description: 'Update a campaign\'s status', action: 'Update a campaign s status' },
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['lead'] } },
				options: [
					{ name: 'Add To Campaign', value: 'addToCampaign', description: 'Add leads to a campaign', action: 'Add leads to a campaign' },
					{ name: 'Add To Global Block List', value: 'addToGlobalBlockList', description: 'Add a lead or domain to the global block list', action: 'Add to global block list' },
					{ name: 'Delete From Campaign', value: 'deleteFromCampaign', description: 'Delete a lead from a campaign', action: 'Delete a lead from a campaign' },
					{ name: 'Get By Email', value: 'getByEmail', description: 'Fetch a lead by their email address', action: 'Get a lead by email' },
					{ name: 'Get Campaigns', value: 'getCampaigns', description: 'Fetch all campaigns a specific lead belongs to', action: 'Get a lead s campaigns' },
					{ name: 'Get Categories', value: 'getCategories', description: 'Fetch all available lead categories', action: 'Get lead categories' },
					{ name: 'List All By Campaign', value: 'listAllByCampaign', description: 'List all leads by campaign ID', action: 'List all leads by campaign' },
					{ name: 'Pause In Campaign', value: 'pauseInCampaign', description: 'Pause a lead in a campaign', action: 'Pause a lead in a campaign' },
					{ name: 'Resume In Campaign', value: 'resumeInCampaign', description: 'Resume a lead in a campaign', action: 'Resume a lead in a campaign' },
					{ name: 'Unsubscribe From All Campaigns', value: 'unsubscribeFromAll', description: 'Unsubscribe a lead from all campaigns', action: 'Unsubscribe a lead from all campaigns' },
					{ name: 'Unsubscribe From Campaign', value: 'unsubscribeFromCampaign', description: 'Unsubscribe a lead from a campaign', action: 'Unsubscribe a lead from a campaign' },
					{ name: 'Update', value: 'update', description: 'Update a lead\'s information', action: 'Update a lead' },
					{ name: 'Update Category', value: 'updateCategory', description: 'Update a lead’s category within a campaign', action: 'Update a lead s category' },
				],
				default: 'listAllByCampaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['emailAccount'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create an email account', action: 'Create an email account' },
					{ name: 'Get', value: 'get', description: 'Fetch an email account by ID', action: 'Get an email account' },
					{ name: 'Get Many', value: 'getAll', description: 'Fetch many email accounts', action: 'Get many email accounts' },
					{ name: 'Get Warmup Stats', value: 'getWarmupStats', description: 'Fetch warmup stats for an email account', action: 'Get an email account s warmup stats' },
					{ name: 'Reconnect Failed Accounts', value: 'reconnectFailed', description: 'Bulk reconnect disconnected email accounts', action: 'Reconnect failed email accounts' },
					{ name: 'Update', value: 'update', description: 'Update an existing email account', action: 'Update an email account' },
					{ name: 'Update Warmup Settings', value: 'updateWarmup', description: 'Add or update warmup settings for an email account', action: 'Update an email account s warmup settings' },
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['campaignStatistics'] } },
				options: [
					{ name: 'Export Leads', value: 'exportLeads', description: 'Export all leads from a campaign as a CSV file', action: 'Export campaign leads' },
					{ name: 'Get Analytics', value: 'getAnalytics', description: 'Fetch top-level analytics for a campaign', action: 'Get campaign analytics' },
					{ name: 'Get Analytics By Date', value: 'getAnalyticsByDate', description: 'Fetch campaign statistics within a date range', action: 'Get campaign analytics by date' },
					{ name: 'Get By Campaign', value: 'getByCampaign', description: 'Fetch detailed statistics for a campaign', action: 'Get campaign statistics' },
				],
				default: 'getByCampaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['masterInbox'] } },
				options: [
					{ name: 'Get Message History', value: 'getMessageHistory', description: 'Fetch message history for a lead in a campaign', action: 'Get a lead s message history' },
					{ name: 'Reply To Thread', value: 'replyToThread', description: 'Reply to a lead from the Master Inbox', action: 'Reply to a lead s email thread' },
				],
				default: 'getMessageHistory',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['webhook'] } },
				options: [
					{ name: 'Create or Update', value: 'createOrUpdate', description: 'Add or update a webhook for a campaign', action: 'Create or update a webhook' },
					{ name: 'Delete', value: 'delete', description: 'Delete a campaign webhook', action: 'Delete a webhook' },
					{ name: 'Get Many By Campaign', value: 'getByCampaign', description: 'Fetch many webhooks by campaign', action: 'Get many webhooks by campaign' },
				],
				default: 'getByCampaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['client'] } },
				options: [
					{ name: 'Add', value: 'add', description: 'Add a new client to the system', action: 'Add a client' },
					{ name: 'Get Many', value: 'getAll', description: 'Fetch many clients', action: 'Get many clients' },
				],
				default: 'getAll',
			},

			// Fields
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign', 'campaignStatistics', 'lead', 'emailAccount', 'webhook', 'masterInbox'],
						operation: ['get', 'delete', 'updateSchedule', 'updateSettings', 'updateStatus', 'getSequences', 'getEmailAccounts', 'addEmailAccount', 'removeEmailAccount', 'getByCampaign', 'getAnalytics', 'getAnalyticsByDate', 'exportLeads', 'listAllByCampaign', 'addToCampaign', 'deleteFromCampaign', 'removeFromCampaign', 'createOrUpdate', 'getMessageHistory', 'replyToThread'],
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
						resource: ['lead', 'masterInbox'],
						operation: ['update', 'deleteFromCampaign', 'pauseInCampaign', 'resumeInCampaign', 'unsubscribeFromCampaign', 'updateCategory', 'getCampaigns', 'unsubscribeFromAll', 'getMessageHistory', 'replyToThread'],
					},
				},
				description: 'The ID of the lead',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['emailAccount'],
						operation: ['get', 'update', 'updateWarmup', 'getWarmupStats'],
					},
				},
				description: 'The ID of the email account',
			},
			{
				displayName: 'JSON Parameters',
				name: 'jsonParameters',
				type: 'boolean',
				default: false,
				description: 'Whether to use a JSON object to specify all body or query parameters',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'json',
				displayOptions: {
					show: {
						jsonParameters: [true],
					},
				},
				default: '{}',
				description: 'The JSON object to use as the request body or query string',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;
				let campaignId, leadId, accountId, body, qs;

				if (this.getNodeParameter('jsonParameters', i)) {
					const parameters = JSON.parse(this.getNodeParameter('parameters', i, '{}') as string);
					body = parameters;
					qs = parameters;
				}

				switch (resource) {
					case 'campaign':
						campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'create':
								body = body ?? {
									name: this.getNodeParameter('campaignName', i) as string,
									client_id: this.getNodeParameter('clientId', i, undefined),
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: '/campaigns/create', body });
								break;
							case 'getAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: '/campaigns' });
								break;
							case 'get':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}` });
								break;
							case 'delete':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `/campaigns/${campaignId}` });
								break;
							case 'updateSchedule':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/schedule`, body });
								break;
							case 'updateSettings':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/settings`, body });
								break;
							case 'updateStatus':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/status`, body });
								break;
							case 'getSequences':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/sequences` });
								break;
							case 'saveSequence':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/sequences`, body });
								break;
							case 'getEmailAccounts':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/email-accounts` });
								break;
							case 'addEmailAccount':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/email-accounts`, body });
								break;
							case 'removeEmailAccount':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `/campaigns/${campaignId}/email-accounts`, body });
								break;
						}
						break;
					case 'lead':
						campaignId = this.getNodeParameter('campaignId', i, '') as string;
						leadId = this.getNodeParameter('leadId', i, '') as string;
						switch (operation) {
							case 'addToCampaign':
								body = body ?? { lead_list: JSON.parse(this.getNodeParameter('leadList', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads`, body });
								break;
							case 'listAllByCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/leads`, qs });
								break;
							case 'update':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads/${leadId}`, body });
								break;
							case 'deleteFromCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `/campaigns/${campaignId}/leads/${leadId}` });
								break;
							case 'pauseInCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads/${leadId}/pause` });
								break;
							case 'resumeInCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads/${leadId}/resume` });
								break;
							case 'unsubscribeFromCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads/${leadId}/unsubscribe` });
								break;
							case 'updateCategory':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/leads/${leadId}/category`, body });
								break;
							case 'getByEmail':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: '/leads', qs });
								break;
							case 'getCategories':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: '/leads/fetch-categories' });
								break;
							case 'getCampaigns':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/leads/${leadId}/campaigns` });
								break;
							case 'unsubscribeFromAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/leads/${leadId}/unsubscribe` });
								break;
							case 'addToGlobalBlockList':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: '/leads/add-domain-block-list', body });
								break;
						}
						break;
					case 'emailAccount':
						accountId = this.getNodeParameter('accountId', i, '') as string;
						switch (operation) {
							case 'getAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: '/email-accounts' });
								break;
							case 'create':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: '/email-accounts/save', body });
								break;
							case 'get':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/email-accounts/${accountId}` });
								break;
							case 'update':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/email-accounts/${accountId}`, body });
								break;
							case 'updateWarmup':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/email-accounts/${accountId}/warmup`, body });
								break;
							case 'getWarmupStats':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/email-accounts/${accountId}/warmup-stats` });
								break;
							case 'reconnectFailed':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: '/email-accounts/reconnect-failed-email-accounts' });
								break;
						}
						break;
					case 'campaignStatistics':
						campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'getByCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/statistics`, qs });
								break;
							case 'getAnalytics':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/analytics` });
								break;
							case 'getAnalyticsByDate':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/analytics-by-date`, qs });
								break;
							case 'exportLeads':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/leads-export`, qs });
								break;
						}
						break;
					case 'masterInbox':
						campaignId = this.getNodeParameter('campaignId', i, '') as string;
						leadId = this.getNodeParameter('leadId', i, '') as string;
						switch (operation) {
							case 'getMessageHistory':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/leads/${leadId}/message-history` });
								break;
							case 'replyToThread':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/reply-email-thread`, body });
								break;
						}
						break;
					case 'webhook':
						campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'getByCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `/campaigns/${campaignId}/webhooks` });
								break;
							case 'createOrUpdate':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `/campaigns/${campaignId}/webhooks`, body });
								break;
							case 'delete':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `/campaigns/${campaignId}/webhooks`, body });
								break;
						}
						break;
					case 'client':
						switch (operation) {
							case 'getAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: '/client' });
								break;
							case 'add':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: '/client/save', body });
								break;
						}
						break;
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