import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AnymailFinderApi implements ICredentialType {
	name = 'anymailFinderApi';

	displayName = 'Anymailfinder API';

	documentationUrl = 'https://anymailfinder.com/email-finder-api/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Anymailfinder API Key. You can find this in your account settings under API section.',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.anymailfinder.com',
			url: '/v5.0/meta/account.json',
			method: 'GET',
		},
	};
}
