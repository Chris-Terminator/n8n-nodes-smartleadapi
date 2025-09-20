import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SmartleadApi implements ICredentialType {
	name = 'smartleadApi';
	displayName = 'Smartlead API';
	documentationUrl = 'https://help.smartlead.ai/API-Documentation-a0d223bdd3154a77b3735497aad9419f';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Smartlead API Key. You can find this in your account settings.',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				'api_key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://server.smartlead.ai/api/v1',
			url: '/campaigns',
		},
	};
}
