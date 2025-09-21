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
					{ name: 'Add Email Account', value: 'addEmailAccount' },
					{ name: 'Create', value: 'create' },
					{ name: 'Delete', value: 'delete' },
					{ name: 'Get', value: 'get' },
					{ name: 'Get Email Accounts', value: 'getEmailAccounts' },
					{ name: 'Get Many', value: 'getAll' },
					{ name: 'Get Sequences', value: 'getSequences' },
					{ name: 'Remove Email Account', value: 'removeEmailAccount' },
					{ name: 'Save Sequence', value: 'saveSequence' },
					{ name: 'Update Schedule', value: 'updateSchedule' },
					{ name: 'Update Settings', value: 'updateSettings' },
					{ name: 'Update Status', value: 'updateStatus' },
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
					{ name: 'Add To Campaign', value: 'addToCampaign' },
					{ name: 'Add To Global Block List', value: 'addToGlobalBlockList' },
					{ name: 'Delete From Campaign', value: 'deleteFromCampaign' },
					{ name: 'Get By Email', value: 'getByEmail' },
					{ name: 'Get Campaigns', value: 'getCampaigns' },
					{ name: 'Get Categories', value: 'getCategories' },
					{ name: 'List All By Campaign', value: 'listAllByCampaign' },
					{ name: 'Pause In Campaign', value: 'pauseInCampaign' },
					{ name: 'Resume In Campaign', value: 'resumeInCampaign' },
					{ name: 'Unsubscribe From All Campaigns', value: 'unsubscribeFromAll' },
					{ name: 'Unsubscribe From Campaign', value: 'unsubscribeFromCampaign' },
					{ name: 'Update', value: 'update' },
					{ name: 'Update Category', value: 'updateCategory' },
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
					{ name: 'Create', value: 'create' },
					{ name: 'Get', value: 'get' },
					{ name: 'Get Many', value: 'getAll' },
					{ name: 'Get Warmup Stats', value: 'getWarmupStats' },
					{ name: 'Reconnect Failed Accounts', value: 'reconnectFailed' },
					{ name: 'Update', value: 'update' },
					{ name: 'Update Warmup Settings', value: 'updateWarmup' },
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
					{ name: 'Export Leads', value: 'exportLeads' },
					{ name: 'Get Analytics', value: 'getAnalytics' },
					{ name: 'Get Analytics By Date', value: 'getAnalyticsByDate' },
					{ name: 'Get By Campaign', value: 'getByCampaign' },
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
					{ name: 'Get Message History', value: 'getMessageHistory' },
					{ name: 'Reply To Thread', value: 'replyToThread' },
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
					{ name: 'Create or Update', value: 'createOrUpdate' },
					{ name: 'Delete', value: 'delete' },
					{ name: 'Get Many By Campaign', value: 'getByCampaign' },
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
					{ name: 'Add', value: 'add' },
					{ name: 'Get Many', value: 'getAll' },
				],
				default: 'getAll',
			},

			// ####################################################################
			//                                IDs
			// ####################################################################
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign', 'campaignStatistics', 'lead', 'webhook', 'masterInbox'],
						operation: ['get', 'delete', 'updateSchedule', 'updateSettings', 'updateStatus', 'getSequences', 'saveSequence', 'getEmailAccounts', 'addEmailAccount', 'removeEmailAccount', 'getByCampaign', 'getAnalytics', 'getAnalyticsByDate', 'exportLeads', 'listAllByCampaign', 'addToCampaign', 'update', 'deleteFromCampaign', 'pauseInCampaign', 'resumeInCampaign', 'unsubscribeFromCampaign', 'updateCategory', 'getMessageHistory', 'replyToThread', 'getByCampaign', 'createOrUpdate', 'delete',],
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
						operation: ['update', 'deleteFromCampaign', 'pauseInCampaign', 'resumeInCampaign', 'unsubscribeFromCampaign', 'updateCategory', 'getCampaigns', 'unsubscribeFromAll', 'getMessageHistory',],
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

			// ####################################################################
			//                          Campaign Fields
			// ####################################################################
			{
				displayName: 'Campaign Name',
				name: 'campaignName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['campaign'], operation: ['create'] } },
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'America/Los_Angeles',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				description: 'E.g., America/New_York',
			},
			{
				displayName: 'Days Of The Week',
				name: 'daysOfTheWeek',
				type: 'multiOptions',
				options: [
					{ name: 'Monday', value: 1 }, { name: 'Tuesday', value: 2 }, { name: 'Wednesday', value: 3 }, { name: 'Thursday', value: 4 }, { name: 'Friday', value: 5 }, { name: 'Saturday', value: 6 }, { name: 'Sunday', value: 7 },
				],
				default: [1, 2, 3, 4, 5],
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'string',
				default: '09:00',
				required: true,
				placeholder: 'HH:MM',
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'string',
				default: '18:00',
				required: true,
				placeholder: 'HH:MM',
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
			},
			{
				displayName: 'Tracking Settings',
				name: 'trackSettings',
				type: 'multiOptions',
				options: [
					{ name: "Don't Track Email Open", value: 'DONT_TRACK_EMAIL_OPEN' },
					// Add other potential options from API docs if available
				],
				default: [],
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSettings'] } },
			},
			{
				displayName: 'Stop Lead On',
				name: 'stopLeadSettings',
				type: 'options',
				options: [
					{ name: 'Reply to an Email', value: 'REPLY_TO_AN_EMAIL' },
					// Add other potential options from API docs if available
				],
				default: 'REPLY_TO_AN_EMAIL',
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSettings'] } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Start', value: 'START' },
					{ name: 'Paused', value: 'PAUSED' },
					{ name: 'Stopped', value: 'STOPPED' },
				],
				default: 'PAUSED',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateStatus'] } },
			},
			{
				displayName: 'Sequences',
				name: 'sequences',
				type: 'json',
				default: '[{ "id": 1234, "seq_number": 1 }]',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['saveSequence'] } },
				description: 'JSON array of sequence objects',
			},
			{
				displayName: 'Email Account IDs',
				name: 'emailAccountIds',
				type: 'json',
				default: '[]',
				placeholder: '[2907, 2908]',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['addEmailAccount', 'removeEmailAccount'] } },
				description: 'A JSON array of email account IDs',
			},

			// ####################################################################
			//                            Lead Fields
			// ####################################################################
			{
				displayName: 'Lead List',
				name: 'leadList',
				type: 'json',
				default: '[{"email": "john.doe@example.com", "first_name": "John"}]',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['addToCampaign'] } },
				description: 'A JSON array of lead objects to add',
			},
			{
				displayName: 'Additional Fields',
				name: 'leadUpdateFields',
				type: 'json',
				default: '{"company_name": "New Company Inc."}',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['update'] } },
				description: 'JSON object with fields to update on the lead',
			},
			{
				displayName: 'Resume Delay (Days)',
				name: 'resumeDelay',
				type: 'number',
				default: 10,
				displayOptions: { show: { resource: ['lead'], operation: ['resumeInCampaign'] } },
				description: 'Number of days to delay before resuming the lead',
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['updateCategory'] } },
			},
			{
				displayName: 'Pause Lead',
				name: 'pauseLead',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['lead'], operation: ['updateCategory'] } },
				description: 'Whether to pause the lead when updating the category',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['getByEmail'] } },
			},
			{
				displayName: 'Domain Block List',
				name: 'domainBlockList',
				type: 'json',
				default: '["blocked.com"]',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['addToGlobalBlockList'] } },
				description: 'JSON array of domains to add to the block list',
			},

			// ####################################################################
			//                      Email Account Fields
			// ####################################################################
			{
				displayName: 'Email Account Details',
				name: 'emailAccountDetails',
				type: 'json',
				default: '{"from_name": "Ramesh", "from_email": "ramesh@example.com"}',
				required: true,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['create', 'update'] } },
				description: 'JSON object containing the email account details',
			},
			{
				displayName: 'Enable Warmup',
				name: 'warmupEnabled',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['updateWarmup'] } },
			},
			{
				displayName: 'Total Warmups Per Day',
				name: 'totalWarmups',
				type: 'number',
				default: 35,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['updateWarmup'] } },
			},


			// ####################################################################
			//                         Statistics Fields
			// ####################################################################
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaignStatistics'], operation: ['getAnalyticsByDate'] } },
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaignStatistics'], operation: ['getAnalyticsByDate'] } },
			},
			{
				displayName: 'Additional Options',
				name: 'statisticsOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['campaignStatistics', 'lead', 'emailAccount'],
						operation: ['getByCampaign', 'listAllByCampaign', 'getAll'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'The number of results to return',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'The starting index for pagination',
					},
					{
						displayName: 'Email Sequence Number',
						name: 'emailSequenceNumber',
						type: 'number',
						default: 1,
						description: 'Filter by sequence number (e.g., 1, 2)',
					},
					{
						displayName: 'Email Status',
						name: 'emailStatus',
						type: 'options',
						options: [
							{ name: 'Opened', value: 'opened' },
							{ name: 'Clicked', value: 'clicked' },
							{ name: 'Replied', value: 'replied' },
						],
						default: 'opened',
						description: 'Filter by status',
					},
				],
			},

			// ####################################################################
			//                        Master Inbox Fields
			// ####################################################################
			{
				displayName: 'Email Stats ID',
				name: 'emailStatsId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['masterInbox'], operation: ['replyToThread'] } },
			},
			{
				displayName: 'Email Body',
				name: 'emailBody',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				displayOptions: { show: { resource: ['masterInbox'], operation: ['replyToThread'] } },
			},

			// ####################################################################
			//                           Webhook Fields
			// ####################################################################
			{
				displayName: 'Webhook Details',
				name: 'webhookDetails',
				type: 'json',
				default: '{"id": 217, "name": "Updated Webhook", "webhook_url": "https://example.com/hook"}',
				required: true,
				displayOptions: { show: { resource: ['webhook'], operation: ['createOrUpdate'] } },
				description: 'JSON object containing the full webhook details',
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { resource: ['webhook'], operation: ['delete'] } },
			},

			// ####################################################################
			//                            Client Fields
			// ####################################################################
			{
				displayName: 'Client Details',
				name: 'clientDetails',
				type: 'json',
				default: '{"name": "New Client", "email": "client@example.com"}',
				required: true,
				displayOptions: { show: { resource: ['client'], operation: ['add'] } },
				description: 'JSON object containing the new client details',
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let returnData: INodeExecutionData[] = [];
		const baseURL = 'https://server.smartlead.ai/api/v1';

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;
				const campaignId = this.getNodeParameter('campaignId', i, '') as string;
				const leadId = this.getNodeParameter('leadId', i, '') as string;
				const accountId = this.getNodeParameter('accountId', i, '') as string;

				switch (resource) {
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                       Campaign
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'campaign':
						switch (operation) {
							case 'create': {
								const body = {
									name: this.getNodeParameter('campaignName', i) as string,
									client_id: this.getNodeParameter('clientId', i) as number,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/create`, body });
								break;
							}
							case 'getAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns` });
								break;
							case 'get':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}` });
								break;
							case 'delete':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}` });
								break;
							case 'updateSchedule': {
								const body = {
									timezone: this.getNodeParameter('timezone', i) as string,
									days_of_the_week: this.getNodeParameter('daysOfTheWeek', i) as number[],
									start_hour: this.getNodeParameter('startTime', i) as string,
									end_hour: this.getNodeParameter('endTime', i) as string,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/schedule`, body });
								break;
							}
							case 'updateSettings': {
								const body = {
									track_settings: this.getNodeParameter('trackSettings', i) as string[],
									stop_lead_settings: this.getNodeParameter('stopLeadSettings', i) as string,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/settings`, body });
								break;
							}
							case 'updateStatus': {
								const body = { status: this.getNodeParameter('status', i) as string };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/status`, body });
								break;
							}
							case 'getSequences':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/sequences` });
								break;
							case 'saveSequence': {
								const body = { sequences: JSON.parse(this.getNodeParameter('sequences', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/sequences`, body });
								break;
							}
							case 'getEmailAccounts':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/email-accounts` });
								break;
							case 'addEmailAccount': {
								const body = { email_account_ids: JSON.parse(this.getNodeParameter('emailAccountIds', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/email-accounts`, body });
								break;
							}
							case 'removeEmailAccount': {
								const body = { email_account_ids: JSON.parse(this.getNodeParameter('emailAccountIds', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/email-accounts`, body });
								break;
							}
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                       Lead
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'lead':
						switch (operation) {
							case 'addToCampaign': {
								const body = { lead_list: JSON.parse(this.getNodeParameter('leadList', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads`, body });
								break;
							}
							case 'listAllByCampaign': {
								const { limit, offset } = this.getNodeParameter('statisticsOptions', i) as { limit?: number; offset?: number; };
								const qs = { limit, offset };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads`, qs });
								break;
							}
							case 'update': {
								const body = JSON.parse(this.getNodeParameter('leadUpdateFields', i) as string);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}`, body });
								break;
							}
							case 'deleteFromCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}` });
								break;
							case 'pauseInCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/pause` });
								break;
							case 'resumeInCampaign': {
								const body = { resume_lead_with_delay_days: this.getNodeParameter('resumeDelay', i) as number };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/resume`, body });
								break;
							}
							case 'unsubscribeFromCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/unsubscribe` });
								break;
							case 'updateCategory': {
								const body = {
									category_id: this.getNodeParameter('categoryId', i) as number,
									pause_lead: this.getNodeParameter('pauseLead', i) as boolean,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/category`, body });
								break;
							}
							case 'getByEmail': {
								const qs = { email: this.getNodeParameter('email', i) as string };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads`, qs });
								break;
							}
							case 'getCategories':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads/fetch-categories` });
								break;
							case 'getCampaigns':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/leads/${leadId}/campaigns` });
								break;
							case 'unsubscribeFromAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/leads/${leadId}/unsubscribe` });
								break;
							case 'addToGlobalBlockList': {
								const body = { domain_block_list: JSON.parse(this.getNodeParameter('domainBlockList', i) as string) };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/leads/add-domain-block-list`, body });
								break;
							}
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                   Email Account
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'emailAccount':
						switch (operation) {
							case 'getAll': {
								const { limit, offset } = this.getNodeParameter('statisticsOptions', i) as { limit?: number; offset?: number; };
								const qs = { limit, offset };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts`, qs });
								break;
							}
							case 'create': {
								const body = JSON.parse(this.getNodeParameter('emailAccountDetails', i) as string);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/save`, body });
								break;
							}
							case 'get':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts/${accountId}` });
								break;
							case 'update': {
								const body = JSON.parse(this.getNodeParameter('emailAccountDetails', i) as string);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/${accountId}`, body });
								break;
							}
							case 'updateWarmup': {
								const body = {
									warmup_enabled: this.getNodeParameter('warmupEnabled', i) as boolean,
									total_warmup_per_day: this.getNodeParameter('totalWarmups', i) as number,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/${accountId}/warmup`, body });
								break;
							}
							case 'getWarmupStats':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/email-accounts/${accountId}/warmup-stats` });
								break;
							case 'reconnectFailed':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/email-accounts/reconnect-failed-email-accounts` });
								break;
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                Campaign Statistics
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'campaignStatistics':
						switch (operation) {
							case 'getByCampaign': {
								const options = this.getNodeParameter('statisticsOptions', i) as { limit?: number; offset?: number; emailSequenceNumber?: number, emailStatus?: string };
								const qs = {
									limit: options.limit,
									offset: options.offset,
									email_sequence_number: options.emailSequenceNumber,
									email_status: options.emailStatus,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/statistics`, qs });
								break;
							}
							case 'getAnalytics':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/analytics` });
								break;
							case 'getAnalyticsByDate': {
								const qs = {
									start_date: this.getNodeParameter('startDate', i) as string,
									end_date: this.getNodeParameter('endDate', i) as string,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/analytics-by-date`, qs });
								break;
							}
							case 'exportLeads':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads-export`, resolveWithFullResponse: true, encoding: null });
								break;
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                    Master Inbox
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'masterInbox':
						switch (operation) {
							case 'getMessageHistory':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/leads/${leadId}/message-history` });
								break;
							case 'replyToThread': {
								const body = {
									email_stats_id: this.getNodeParameter('emailStatsId', i) as string,
									email_body: this.getNodeParameter('emailBody', i) as string,
								};
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/reply-email-thread`, body });
								break;
							}
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                      Webhook
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'webhook':
						switch (operation) {
							case 'getByCampaign':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/campaigns/${campaignId}/webhooks` });
								break;
							case 'createOrUpdate': {
								const body = JSON.parse(this.getNodeParameter('webhookDetails', i) as string);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/campaigns/${campaignId}/webhooks`, body });
								break;
							}
							case 'delete': {
								const body = { id: this.getNodeParameter('webhookId', i) as number };
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}/webhooks`, body });
								break;
							}
						}
						break;
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//                                       Client
					// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					case 'client':
						switch (operation) {
							case 'getAll':
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'GET', url: `${baseURL}/client` });
								break;
							case 'add': {
								const body = JSON.parse(this.getNodeParameter('clientDetails', i) as string);
								responseData = await this.helpers.requestWithAuthentication.call(this, 'smartleadApi', { method: 'POST', url: `${baseURL}/client/save`, body });
								break;
							}
						}
						break;
				}

				if (typeof responseData === 'string') {
					try {
						responseData = JSON.parse(responseData);
					} catch (e) {
						// Not a JSON string, leave it as is
					}
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