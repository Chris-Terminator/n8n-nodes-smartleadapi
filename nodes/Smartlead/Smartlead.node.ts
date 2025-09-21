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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				// The options are now loaded dynamically based on the resource selected
				typeOptions: {
					loadOptionsMethod: 'loadOperations',
				},
				default: 'getAll',
			},

			// ====================================================================
			// 		 					   COMMON FIELDS
			// ====================================================================
			// CONSOLIDATED CAMPAIGN ID
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					// Show this field if the resource is ANY of these
					show: {
						resource: [
							'campaign',
							'campaignStatistics',
							'lead',
							'webhook',
							'masterInbox',
						],
					},
					// BUT, hide it for these specific operations that don't need an ID
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
			// CONSOLIDATED LEAD ID
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
			// CONSOLIDATED EMAIL ACCOUNT ID
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
			// CONSOLIDATED LIMIT
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				displayOptions: {
					show: [
						{
							resource: [
								'lead',
							],
							operation: [
								'listAllByCampaign',
							],
						},
						{
							resource: [
								'emailAccount',
							],
							operation: [
								'getAll',
							],
						},
					],
				},
				description: 'Max number of results to return',
			},
			// CONSOLIDATED OFFSET
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				displayOptions: {
					show: [
						{
							resource: [
								'lead',
							],
							operation: [
								'listAllByCampaign',
							],
						},
						{
							resource: [
								'emailAccount',
							],
							operation: [
								'getAll',
							],
						},
					],
				},
				description: 'The starting index for pagination',
			},

			// ====================================================================
			// 		 				  SPECIFIC FIELDS
			// ====================================================================

			// --------------------------------------------------------------------
			// 		 					CAMPAIGN
			// --------------------------------------------------------------------
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
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'America/Los_Angeles',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				placeholder: 'America/New_York',
				description: 'The timezone for the schedule (e.g., America/Los_Angeles)',
			},
			{
				displayName: 'Days of the Week',
				name: 'daysOfWeek',
				type: 'multiOptions',
				options: [
					{ name: 'Sunday', value: 0 },
					{ name: 'Monday', value: 1 },
					{ name: 'Tuesday', value: 2 },
					{ name: 'Wednesday', value: 3 },
					{ name: 'Thursday', value: 4 },
					{ name: 'Friday', value: 5 },
					{ name: 'Saturday', value: 6 },
				],
				default: [1, 2, 3, 4, 5],
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				description: 'The days of the week to send emails',
			},
			{
				displayName: 'Start Hour',
				name: 'startHour',
				type: 'string',
				default: '09:00',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				placeholder: '09:00',
				description: 'The start hour in HH:MM format',
			},
			{
				displayName: 'End Hour',
				name: 'endHour',
				type: 'string',
				default: '18:00',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSchedule'] } },
				placeholder: '18:00',
				description: 'The end hour in HH:MM format',
			},
			{
				displayName: 'Track Settings',
				name: 'trackSettings',
				type: 'multiOptions',
				options: [
					{ name: "Don't Track Email Open", value: 'DONT_TRACK_EMAIL_OPEN' },
					{ name: "Don't Track Link Click", value: 'DONT_TRACK_LINK_CLICK' },
				],
				default: [],
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSettings'] } },
				description: 'Email tracking settings',
			},
			{
				displayName: 'Stop Lead Settings',
				name: 'stopLeadSettings',
				type: 'options',
				options: [
					{ name: 'Reply to an Email', value: 'REPLY_TO_AN_EMAIL' },
					{ name: 'Click on a Link', value: 'CLICK_ON_A_LINK' },
					{ name: 'Open an Email', value: 'OPEN_AN_EMAIL' },
				],
				default: 'REPLY_TO_AN_EMAIL',
				displayOptions: { show: { resource: ['campaign'], operation: ['updateSettings'] } },
				description: 'When to stop sending emails to a lead',
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
				description: 'The new status for the campaign',
			},
			{
				displayName: 'Sequences',
				name: 'sequences',
				type: 'json',
				default: '[{"id": 1234, "seq_number": 1}]',
				required: true,
				displayOptions: { show: { resource: ['campaign'], operation: ['saveSequence'] } },
				description: 'Array of sequence objects with ID and seq_number',
			},
			{
				displayName: 'Email Account IDs',
				name: 'emailAccountIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['addEmailAccount', 'removeEmailAccount']
					}
				},
				placeholder: '2907,2908',
				description: 'Comma-separated list of email account IDs',
			},
			// --------------------------------------------------------------------
			// 		 					LEAD
			// --------------------------------------------------------------------
			{
				displayName: 'Lead List',
				name: 'leadList',
				type: 'json',
				default: '[{"email": "john.doe@example.com", "first_name": "John", "last_name": "Doe"}]',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['addToCampaign'] } },
				description: 'JSON array of lead objects to add to the campaign',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['getByEmail'] } },
				placeholder: 'john.doe@example.com',
				description: 'The email address of the lead to fetch',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['lead'], operation: ['update'] } },
				options: [
					{
						displayName: 'Company Name',
						name: 'company_name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Custom Fields',
						name: 'custom_fields',
						type: 'json',
						default: '{}',
						description: 'Any additional custom fields as JSON',
					},
				],
			},
			{
				displayName: 'Resume Lead With Delay Days',
				name: 'resumeLeadWithDelayDays',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['lead'], operation: ['resumeInCampaign'] } },
				description: 'Number of days to wait before resuming the lead',
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { resource: ['lead'], operation: ['updateCategory'] } },
				description: 'The ID of the category to assign to the lead',
			},
			{
				displayName: 'Pause Lead',
				name: 'pauseLead',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['lead'], operation: ['updateCategory'] } },
				description: 'Whether to pause the lead after updating category',
			},
			{
				displayName: 'Block Type',
				name: 'blockType',
				type: 'options',
				options: [
					{ name: 'Domain', value: 'domain' },
					{ name: 'Email', value: 'email' },
				],
				default: 'domain',
				displayOptions: { show: { resource: ['lead'], operation: ['addToGlobalBlockList'] } },
				description: 'Whether to block a domain or specific email',
			},
			{
				displayName: 'Domain Block List',
				name: 'domainBlockList',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['addToGlobalBlockList'],
						blockType: ['domain']
					}
				},
				placeholder: 'blocked.com,spam.com',
				description: 'Comma-separated list of domains to block',
			},
			{
				displayName: 'Email Block List',
				name: 'emailBlockList',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['addToGlobalBlockList'],
						blockType: ['email']
					}
				},
				placeholder: 'spam@example.com,blocked@test.com',
				description: 'Comma-separated list of email addresses to block',
			},
			// --------------------------------------------------------------------
			// 		 					EMAIL ACCOUNT
			// --------------------------------------------------------------------
			{
				displayName: 'Email Account',
				name: 'emailAccountData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				required: true,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['create'] } },
				options: [
					{ displayName: 'From Email', name: 'from_email', type: 'string', default: '', placeholder: 'name@email.com' },
					{ displayName: 'From Name', name: 'from_name', type: 'string', default: '' },
					{
						displayName: 'IMAP Encryption', name: 'imap_encryption', type: 'options',
						options: [{ name: 'SSL', value: 'SSL' }, { name: 'TLS', value: 'TLS' }, { name: 'None', value: 'NONE' }], default: 'SSL'
					},
					{ displayName: 'IMAP Host', name: 'imap_host', type: 'string', default: '' },
					{ displayName: 'IMAP Port', name: 'imap_port', type: 'number', default: 993 },
					{ displayName: 'Max Email Per Day', name: 'max_email_per_day', type: 'number', default: 100 },
					{ displayName: 'Password', name: 'password', type: 'string', typeOptions: { password: true }, default: '' },
					{
						displayName: 'SMTP Encryption', name: 'smtp_encryption', type: 'options',
						options: [{ name: 'TLS', value: 'TLS' }, { name: 'SSL', value: 'SSL' }, { name: 'None', value: 'NONE' }], default: 'TLS'
					},
					{ displayName: 'SMTP Host', name: 'smtp_host', type: 'string', default: '' },
					{ displayName: 'SMTP Port', name: 'smtp_port', type: 'number', default: 587 },
					{ displayName: 'Total Warmup Per Day', name: 'total_warmup_per_day', type: 'number', default: 20 },
					{ displayName: 'Username', name: 'username', type: 'string', default: '' },
					{ displayName: 'Warmup Enabled', name: 'warmup_enabled', type: 'boolean', default: false },
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['emailAccount'], operation: ['update'] } },
				options: [
					{ displayName: 'Max Email Per Day', name: 'max_email_per_day', type: 'number', default: 100 },
					{ displayName: 'From Name', name: 'from_name', type: 'string', default: '' },
					{ displayName: 'Signature', name: 'signature', type: 'string', typeOptions: { rows: 5 }, default: '' },
				],
			},
			{
				displayName: 'Warmup Enabled',
				name: 'warmupEnabled',
				type: 'boolean',
				default: true,
				required: true,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['updateWarmup'] } },
				description: 'Whether warmup is enabled for this account',
			},
			{
				displayName: 'Total Warmup Per Day',
				name: 'totalWarmupPerDay',
				type: 'number',
				default: 35,
				displayOptions: { show: { resource: ['emailAccount'], operation: ['updateWarmup'] } },
				description: 'Number of warmup emails to send per day',
			},
			// --------------------------------------------------------------------
			// 		 					CAMPAIGN STATISTICS
			// --------------------------------------------------------------------
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['campaignStatistics'], operation: ['getByCampaign'] } },
				options: [
					{ displayName: 'Email Sequence Number', name: 'email_sequence_number', type: 'number', default: 1, description: 'Filter by sequence number (e.g., 1, 2)' },
					{
						displayName: 'Email Status', name: 'email_status', type: 'options',
						options: [{ name: 'Opened', value: 'opened' }, { name: 'Clicked', value: 'clicked' }, { name: 'Replied', value: 'replied' }], default: 'opened', description: 'Filter by email status'
					},
					{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, description: 'Max number of results to return' },
					{ displayName: 'Offset', name: 'offset', type: 'number', default: 0, description: 'The starting index for pagination' },
				],
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaignStatistics'], operation: ['getAnalyticsByDate'] } },
				placeholder: '2024-01-01',
				description: 'The start date in YYYY-MM-DD format',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['campaignStatistics'], operation: ['getAnalyticsByDate'] } },
				placeholder: '2024-12-31',
				description: 'The end date in YYYY-MM-DD format',
			},
			// --------------------------------------------------------------------
			// 		 					MASTER INBOX
			// --------------------------------------------------------------------
			{
				displayName: 'Email Stats ID',
				name: 'emailStatsId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['masterInbox'], operation: ['replyToThread'] } },
				description: 'The ID of the email stats for the thread',
			},
			{
				displayName: 'Email Body',
				name: 'emailBody',
				type: 'string',
				typeOptions: { rows: 10 },
				default: '',
				required: true,
				displayOptions: { show: { resource: ['masterInbox'], operation: ['replyToThread'] } },
				description: 'The body of the reply email',
			},
			// --------------------------------------------------------------------
			// 		 					WEBHOOK
			// --------------------------------------------------------------------
			{
				displayName: 'Webhook Configuration',
				name: 'webhookConfig',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				required: true,
				displayOptions: { show: { resource: ['webhook'], operation: ['createOrUpdate'] } },
				options: [
					{ displayName: 'Webhook ID', name: 'id', type: 'number', default: 0, description: 'The webhook ID (leave empty to create new)' },
					{ displayName: 'Name', name: 'name', type: 'string', default: '', required: true, description: 'The name of the webhook' },
					{ displayName: 'Webhook URL', name: 'webhook_url', type: 'string', default: '', required: true, description: 'The URL to send webhook events to' },
					{
						displayName: 'Events', name: 'events', type: 'multiOptions',
						options: [
							{ name: 'Email Bounced', value: 'EMAIL_BOUNCED' }, { name: 'Email Clicked', value: 'EMAIL_CLICKED' },
							{ name: 'Email Opened', value: 'EMAIL_OPENED' }, { name: 'Email Replied', value: 'EMAIL_REPLIED' },
							{ name: 'Email Sent', value: 'EMAIL_SENT' }, { name: 'Email Unsubscribed', value: 'EMAIL_UNSUBSCRIBED' },
						], default: ['EMAIL_OPENED'], description: 'The events that trigger the webhook'
					},
				],
			},
			{
				displayName: 'Webhook ID',
				name: 'webhookId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { resource: ['webhook'], operation: ['delete'] } },
				description: 'The ID of the webhook to delete',
			},
			// --------------------------------------------------------------------
			// 		 					CLIENT
			// --------------------------------------------------------------------
			{
				displayName: 'Client Details',
				name: 'clientDetails',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				required: true,
				displayOptions: { show: { resource: ['client'], operation: ['add'] } },
				options: [
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@email.com' },
					{ displayName: 'Company', name: 'company', type: 'string', default: '', description: 'The company name of the client' },
					{ displayName: 'Phone', name: 'phone', type: 'string', default: '', description: 'The phone number of the client' },
				],
			},
		],
	};

	// Method to dynamically load operations based on the selected resource
	async loadOperations(this: IExecuteFunctions): Promise<INodePropertyOptions[]> {
		const resource = this.getNodeParameter('resource', 0, '') as string;
		if (resource === 'campaign') {
			return [
				{ name: 'Add Email Account', value: 'addEmailAccount', description: 'Add an email account to a campaign' },
				{ name: 'Create', value: 'create', description: 'Create a new campaign' },
				{ name: 'Delete', value: 'delete', description: 'Delete a campaign' },
				{ name: 'Get', value: 'get', description: 'Get a campaign by ID' },
				{ name: 'Get Email Accounts', value: 'getEmailAccounts', description: 'List all email accounts for a campaign' },
				{ name: 'Get Many', value: 'getAll', description: 'Get many campaigns' },
				{ name: 'Get Sequences', value: 'getSequences', description: 'Fetch sequences for a campaign' },
				{ name: 'Remove Email Account', value: 'removeEmailAccount', description: 'Remove an email account from a campaign' },
				{ name: 'Save Sequence', value: 'saveSequence', description: 'Save a campaign sequence' },
				{ name: 'Update Schedule', value: 'updateSchedule', description: 'Update a campaign schedule' },
				{ name: 'Update Settings', value: 'updateSettings', description: 'Update campaign settings' },
				{ name: 'Update Status', value: 'updateStatus', description: 'Update campaign status' },
			];
		}
		if (resource === 'lead') {
			return [
				{ name: 'Add To Campaign', value: 'addToCampaign', description: 'Add leads to a campaign' },
				{ name: 'Add To Global Block List', value: 'addToGlobalBlockList', description: 'Add a lead or domain to the global block list' },
				{ name: 'Delete From Campaign', value: 'deleteFromCampaign', description: 'Delete a lead from a campaign' },
				{ name: 'Get By Email', value: 'getByEmail', description: 'Fetch a lead by their email address' },
				{ name: 'Get Campaigns', value: 'getCampaigns', description: 'Fetch all campaigns a specific lead belongs to' },
				{ name: 'Get Categories', value: 'getCategories', description: 'Fetch all available lead categories' },
				{ name: 'List All By Campaign', value: 'listAllByCampaign', description: 'List all leads by campaign ID' },
				{ name: 'Pause In Campaign', value: 'pauseInCampaign', description: 'Pause a lead in a campaign' },
				{ name: 'Resume In Campaign', value: 'resumeInCampaign', description: 'Resume a lead in a campaign' },
				{ name: 'Unsubscribe From All Campaigns', value: 'unsubscribeFromAll', description: 'Unsubscribe a lead from all campaigns' },
				{ name: 'Unsubscribe From Campaign', value: 'unsubscribeFromCampaign', description: 'Unsubscribe a lead from a campaign' },
				{ name: 'Update', value: 'update', description: 'Update lead information' },
				{ name: 'Update Category', value: 'updateCategory', description: 'Update lead category within a campaign' },
			];
		}
		if (resource === 'emailAccount') {
			return [
				{ name: 'Create', value: 'create', description: 'Create a new email account' },
				{ name: 'Get', value: 'get', description: 'Get an email account by ID' },
				{ name: 'Get Many', value: 'getAll', description: 'Get many email accounts' },
				{ name: 'Get Warmup Stats', value: 'getWarmupStats', description: 'Get warmup stats for an email account' },
				{ name: 'Reconnect Failed', value: 'reconnectFailed', description: 'Reconnect failed email accounts' },
				{ name: 'Update', value: 'update', description: 'Update an email account' },
				{ name: 'Update Warmup', value: 'updateWarmup', description: 'Update warmup settings' },
			];
		}
		if (resource === 'campaignStatistics') {
			return [
				{ name: 'Export Leads', value: 'exportLeads', description: 'Export all leads from a campaign as CSV' },
				{ name: 'Get Analytics', value: 'getAnalytics', description: 'Get top-level analytics for a campaign' },
				{ name: 'Get Analytics By Date', value: 'getAnalyticsByDate', description: 'Get campaign statistics within a date range' },
				{ name: 'Get By Campaign', value: 'getByCampaign', description: 'Get detailed statistics for a campaign' },
			];
		}
		if (resource === 'masterInbox') {
			return [
				{ name: 'Get Message History', value: 'getMessageHistory', description: 'Get message history for a lead' },
				{ name: 'Reply To Thread', value: 'replyToThread', description: 'Reply to a lead from the Master Inbox' },
			];
		}
		if (resource === 'webhook') {
			return [
				{ name: 'Create Or Update', value: 'createOrUpdate', description: 'Add or update a webhook for a campaign' },
				{ name: 'Delete', value: 'delete', description: 'Delete a webhook from a campaign' },
				{ name: 'Get By Campaign', value: 'getByCampaign', description: 'Get all webhooks for a campaign' },
			];
		}
		if (resource === 'client') {
			return [
				{ name: 'Add', value: 'add', description: 'Add a new client' },
				{ name: 'Get Many', value: 'getAll', description: 'Get many clients' },
			];
		}
		return [];
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
				let body: any = {};
				let qs: any = { api_key: apiKey };
				const baseURL = 'https://server.smartlead.ai/api/v1';

				switch (resource) {
					case 'campaign':
						const campaignId = this.getNodeParameter('campaignId', i, '') as string;
						switch (operation) {
							case 'create':
								body = { name: this.getNodeParameter('campaignName', i) as string };
								const clientId = this.getNodeParameter('clientId', i, 0) as number;
								if (clientId > 0) body.client_id = clientId;
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/create`, body, qs, json: true });
								break;
							case 'getAll':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns`, qs, json: true });
								break;
							case 'get':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${campaignId}`, qs, json: true });
								break;
							case 'delete':
								responseData = await this.helpers.request({ method: 'DELETE', url: `${baseURL}/campaigns/${campaignId}`, qs, json: true });
								break;
							case 'updateSchedule':
								body = {
									timezone: this.getNodeParameter('timezone', i) as string,
									days_of_the_week: this.getNodeParameter('daysOfWeek', i) as number[],
									start_hour: this.getNodeParameter('startHour', i) as string,
									end_hour: this.getNodeParameter('endHour', i) as string,
								};
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${campaignId}/schedule`, body, qs, json: true });
								break;
							case 'updateSettings':
								body = {
									track_settings: this.getNodeParameter('trackSettings', i, []) as string[],
									stop_lead_settings: this.getNodeParameter('stopLeadSettings', i) as string,
								};
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${campaignId}/settings`, body, qs, json: true });
								break;
							case 'updateStatus':
								body = { status: this.getNodeParameter('status', i) as string };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${campaignId}/status`, body, qs, json: true });
								break;
							case 'getSequences':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${campaignId}/sequences`, qs, json: true });
								break;
							case 'saveSequence':
								body = { sequences: JSON.parse(this.getNodeParameter('sequences', i) as string) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${campaignId}/sequences`, body, qs, json: true });
								break;
							case 'getEmailAccounts':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${campaignId}/email-accounts`, qs, json: true });
								break;
							case 'addEmailAccount':
							case 'removeEmailAccount':
								body = { email_account_ids: (this.getNodeParameter('emailAccountIds', i) as string).split(',').map(id => parseInt(id.trim())) };
								const method = operation === 'addEmailAccount' ? 'POST' : 'DELETE';
								responseData = await this.helpers.request({ method, url: `${baseURL}/campaigns/${campaignId}/email-accounts`, body, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Campaign resource.`, { itemIndex: i });
						}
						break;

					case 'lead':
						const leadCampaignId = this.getNodeParameter('campaignId', i, '') as string;
						const leadId = this.getNodeParameter('leadId', i, '') as string;
						switch (operation) {
							case 'addToCampaign':
								body = { lead_list: JSON.parse(this.getNodeParameter('leadList', i) as string) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads`, body, qs, json: true });
								break;
							case 'listAllByCampaign':
								qs.limit = this.getNodeParameter('limit', i, 50) as number;
								qs.offset = this.getNodeParameter('offset', i, 0) as number;
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${leadCampaignId}/leads`, qs, json: true });
								break;
							case 'update':
								const updateFields = this.getNodeParameter('updateFields', i) as any;
								body = { ...updateFields };
								if (updateFields.custom_fields) {
									body = { ...body, ...JSON.parse(updateFields.custom_fields) };
									delete body.custom_fields;
								}
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}`, body, qs, json: true });
								break;
							case 'deleteFromCampaign':
								responseData = await this.helpers.request({ method: 'DELETE', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}`, qs, json: true });
								break;
							case 'pauseInCampaign':
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}/pause`, qs, json: true });
								break;
							case 'resumeInCampaign':
								const resumeDelay = this.getNodeParameter('resumeLeadWithDelayDays', i, 0) as number;
								if (resumeDelay > 0) body.resume_lead_with_delay_days = resumeDelay;
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}/resume`, body, qs, json: true });
								break;
							case 'unsubscribeFromCampaign':
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}/unsubscribe`, qs, json: true });
								break;
							case 'updateCategory':
								body = {
									category_id: this.getNodeParameter('categoryId', i) as number,
									pause_lead: this.getNodeParameter('pauseLead', i, false) as boolean,
								};
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${leadCampaignId}/leads/${leadId}/category`, body, qs, json: true });
								break;
							case 'getByEmail':
								qs.email = this.getNodeParameter('email', i) as string;
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/leads`, qs, json: true });
								break;
							case 'getCategories':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/leads/fetch-categories`, qs, json: true });
								break;
							case 'getCampaigns':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/leads/${leadId}/campaigns`, qs, json: true });
								break;
							case 'unsubscribeFromAll':
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/leads/${leadId}/unsubscribe`, qs, json: true });
								break;
							case 'addToGlobalBlockList':
								const blockType = this.getNodeParameter('blockType', i) as string;
								if (blockType === 'domain') {
									body = { domain_block_list: (this.getNodeParameter('domainBlockList', i) as string).split(',').map(d => d.trim()) };
								} else {
									body = { email_block_list: (this.getNodeParameter('emailBlockList', i) as string).split(',').map(e => e.trim()) };
								}
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/leads/add-domain-block-list`, body, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Lead resource.`, { itemIndex: i });
						}
						break;

					case 'emailAccount':
						const accountId = this.getNodeParameter('accountId', i, '') as string;
						switch (operation) {
							case 'getAll':
								qs.limit = this.getNodeParameter('limit', i, 50) as number;
								qs.offset = this.getNodeParameter('offset', i, 0) as number;
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/email-accounts`, qs, json: true });
								break;
							case 'create':
								body = { id: null, ...(this.getNodeParameter('emailAccountData', i) as any) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/email-accounts/save`, body, qs, json: true });
								break;
							case 'get':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/email-accounts/${accountId}`, qs, json: true });
								break;
							case 'update':
								body = { ...(this.getNodeParameter('updateFields', i) as any) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/email-accounts/${accountId}`, body, qs, json: true });
								break;
							case 'updateWarmup':
								body = {
									warmup_enabled: this.getNodeParameter('warmupEnabled', i) as boolean,
									total_warmup_per_day: this.getNodeParameter('totalWarmupPerDay', i, 35) as number,
								};
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/email-accounts/${accountId}/warmup`, body, qs, json: true });
								break;
							case 'getWarmupStats':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/email-accounts/${accountId}/warmup-stats`, qs, json: true });
								break;
							case 'reconnectFailed':
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/email-accounts/reconnect-failed-email-accounts`, body: {}, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Email Account resource.`, { itemIndex: i });
						}
						break;

					case 'campaignStatistics':
						const statsCampaignId = this.getNodeParameter('campaignId', i) as string;
						switch (operation) {
							case 'getByCampaign':
								const filters = this.getNodeParameter('filters', i, {}) as any;
								if (filters.email_sequence_number) qs.email_sequence_number = filters.email_sequence_number;
								if (filters.email_status) qs.email_status = filters.email_status;
								if (filters.limit) qs.limit = filters.limit;
								if (filters.offset) qs.offset = filters.offset;
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${statsCampaignId}/statistics`, qs, json: true });
								break;
							case 'getAnalytics':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${statsCampaignId}/analytics`, qs, json: true });
								break;
							case 'getAnalyticsByDate':
								qs.start_date = this.getNodeParameter('startDate', i) as string;
								qs.end_date = this.getNodeParameter('endDate', i) as string;
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${statsCampaignId}/analytics-by-date`, qs, json: true });
								break;
							case 'exportLeads':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${statsCampaignId}/leads-export`, qs, json: false, encoding: 'utf8' });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Campaign Statistics resource.`, { itemIndex: i });
						}
						break;

					case 'masterInbox':
						const inboxCampaignId = this.getNodeParameter('campaignId', i) as string;
						const inboxLeadId = this.getNodeParameter('leadId', i, '') as string;
						switch (operation) {
							case 'getMessageHistory':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${inboxCampaignId}/leads/${inboxLeadId}/message-history`, qs, json: true });
								break;
							case 'replyToThread':
								body = {
									email_stats_id: this.getNodeParameter('emailStatsId', i) as string,
									email_body: this.getNodeParameter('emailBody', i) as string,
								};
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${inboxCampaignId}/reply-email-thread`, body, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Master Inbox resource.`, { itemIndex: i });
						}
						break;

					case 'webhook':
						const webhookCampaignId = this.getNodeParameter('campaignId', i) as string;
						switch (operation) {
							case 'getByCampaign':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/campaigns/${webhookCampaignId}/webhooks`, qs, json: true });
								break;
							case 'createOrUpdate':
								body = { ...(this.getNodeParameter('webhookConfig', i) as any) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/campaigns/${webhookCampaignId}/webhooks`, body, qs, json: true });
								break;
							case 'delete':
								body = { id: this.getNodeParameter('webhookId', i) as number };
								responseData = await this.helpers.request({ method: 'DELETE', url: `${baseURL}/campaigns/${webhookCampaignId}/webhooks`, body, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Webhook resource.`, { itemIndex: i });
						}
						break;

					case 'client':
						switch (operation) {
							case 'getAll':
								responseData = await this.helpers.request({ method: 'GET', url: `${baseURL}/client`, qs, json: true });
								break;
							case 'add':
								body = { ...(this.getNodeParameter('clientDetails', i) as any) };
								responseData = await this.helpers.request({ method: 'POST', url: `${baseURL}/client/save`, body, qs, json: true });
								break;
							default:
								throw new NodeOperationError(this.getNode(), `The operation '${operation}' is not supported for the Client resource.`, { itemIndex: i });
						}
						break;

					default:
						throw new NodeOperationError(this.getNode(), `The resource '${resource}' is not supported.`, { itemIndex: i });
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } }
				);
				returnData = returnData.concat(executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } }
					);
					returnData = returnData.concat(executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}
		
		return [returnData];
	}
}