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
			// ... (All operations with their dedicated fields will be defined below)

			// CAMPAIGN OPERATIONS
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

			// LEAD OPERATIONS
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

			// ... (Other resource operations here)

			// GENERIC FIELDS (IDs, etc.)
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign', 'campaignStatistics', 'lead', 'webhook', 'masterInbox'],
						operation: ['get', 'delete', 'updateSchedule', 'updateSettings', 'updateStatus', 'getSequences', 'getEmailAccounts', 'addEmailAccount', 'removeEmailAccount', 'getByCampaign', 'getAnalytics', 'getAnalyticsByDate', 'exportLeads', 'listAllByCampaign', 'addToCampaign', 'deleteFromCampaign', 'update', 'pauseInCampaign', 'resumeInCampaign', 'unsubscribeFromCampaign', 'updateCategory', 'createOrUpdate', 'getMessageHistory', 'replyToThread'],
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

			// DEDICATED FIELDS FOR EACH OPERATION

			// Campaign -> Create
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
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
				description: 'The ID of the client to associate with the campaign',
			},

			// Campaign -> Update Schedule
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'America/Los_Angeles',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				description: 'The timezone for the schedule',
			},
			{
				displayName: 'Days of the Week',
				name: 'daysOfWeek',
				type: 'multiOptions',
				options: [
					{ name: 'Sunday', value: 0 }, { name: 'Monday', value: 1 }, { name: 'Tuesday', value: 2 },
					{ name: 'Wednesday', value: 3 }, { name: 'Thursday', value: 4 }, { name: 'Friday', value: 5 }, { name: 'Saturday', value: 6 },
				],
				default: [1, 2, 3, 4, 5],
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
			},
			{
				displayName: 'Start Hour',
				name: 'startHour',
				type: 'string',
				default: '09:00',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				description: 'The start hour in HH:MM format',
			},
			{
				displayName: 'End Hour',
				name: 'endHour',
				type: 'string',
				default: '18:00',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				description: 'The end hour in HH:MM format',
			},

			// ... And so on for every single parameter of every endpoint...
		],
	};

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
				let body: any = {};
				let qs: any = { api_key: apiKey };
				const baseURL = 'https://server.smartlead.ai/api/v1';

				if (this.getNodeParameter('jsonParameters', i)) {
					const parameters = JSON.parse(this.getNodeParameter('parameters', i, '{}') as string);
					body = parameters;
					qs = { ...qs, ...parameters };
				}

				switch (resource) {
					case 'campaign': {
						switch (operation) {
							case 'create': {
								body = body ?? {
									name: this.getNodeParameter('campaignName', i) as string,
									client_id: this.getNodeParameter('clientId', i, undefined),
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/create`, body });
								break;
							}
							case 'getAll': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns` });
								break;
							}
							case 'get': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}` });
								break;
							}
							case 'delete': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}` });
								break;
							}
							case 'updateSchedule': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/schedule`, body });
								break;
							}
							case 'updateSettings': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/settings`, body });
								break;
							}
							case 'updateStatus': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/status`, body });
								break;
							}
							case 'getSequences': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/sequences` });
								break;
							}
							case 'saveSequence': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/sequences`, body });
								break;
							}
							case 'getEmailAccounts': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/email-accounts` });
								break;
							}
							case 'addEmailAccount': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/email-accounts`, body });
								break;
							}
							case 'removeEmailAccount': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/email-accounts`, body });
								break;
							}
						}
						break;
					}
					case 'lead': {
						switch (operation) {
							case 'addToCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								body = body ?? { lead_list: JSON.parse(this.getNodeParameter('leadList', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads`, body });
								break;
							}
							case 'listAllByCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads`, qs });
								break;
							}
							case 'update': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}`, body });
								break;
							}
							case 'deleteFromCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}` });
								break;
							}
							case 'pauseInCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/pause` });
								break;
							}
							case 'resumeInCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/resume` });
								break;
							}
							case 'unsubscribeFromCampaign': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/unsubscribe` });
								break;
							}
							case 'updateCategory': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/category`, body });
								break;
							}
							case 'getByEmail': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads`, qs });
								break;
							}
							case 'getCategories': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads/fetch-categories` });
								break;
							}
							case 'getCampaigns': {
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads/${leadId}/campaigns` });
								break;
							}
							case 'unsubscribeFromAll': {
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/leads/${leadId}/unsubscribe` });
								break;
							}
							case 'addToGlobalBlockList': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/leads/add-domain-block-list`, body });
								break;
							}
						}
						break;
					}
					case 'emailAccount': {
						switch (operation) {
							case 'getAll': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts` });
								break;
							}
							case 'create': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/save`, body });
								break;
							}
							case 'get': {
								const accountId = this.getNodeParameter('accountId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts/${accountId}` });
								break;
							}
							case 'update': {
								const accountId = this.getNodeParameter('accountId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/${accountId}`, body });
								break;
							}
							case 'updateWarmup': {
								const accountId = this.getNodeParameter('accountId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/${accountId}/warmup`, body });
								break;
							}
							case 'getWarmupStats': {
								const accountId = this.getNodeParameter('accountId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts/${accountId}/warmup-stats` });
								break;
							}
							case 'reconnectFailed': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/reconnect-failed-email-accounts` });
								break;
							}
						}
						break;
					}
					case 'campaignStatistics': {
						const campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'getByCampaign': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/statistics`, qs });
								break;
							}
							case 'getAnalytics': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/analytics` });
								break;
							}
							case 'getAnalyticsByDate': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/analytics-by-date`, qs });
								break;
							}
							case 'exportLeads': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads-export`, qs });
								break;
							}
						}
						break;
					}
					case 'masterInbox': {
						switch (operation) {
							case 'getMessageHistory': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								const leadId = this.getNodeParameter('leadId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/message-history` });
								break;
							}
							case 'replyToThread': {
								const campaignId = this.getNodeParameter('campaignId', i, '') as string;
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/reply-email-thread`, body });
								break;
							}
						}
						break;
					}
					case 'webhook': {
						const campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'getByCampaign': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/webhooks` });
								break;
							}
							case 'createOrUpdate': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/webhooks`, body });
								break;
							}
							case 'delete': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/webhooks`, body });
								break;
							}
						}
						break;
					}
					case 'client': {
						switch (operation) {
							case 'getAll': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/client` });
								break;
							}
							case 'add': {
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/client/save`, body });
								break;
							}
						}
						break;
					}
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