# n8n-nodes-smartleadai

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node that lets you use [Smartlead.ai](https://smartlead.ai) in your n8n workflows.

Smartlead.ai is a platform for sending cold emails at scale, with features for campaign management, lead tracking, and analytics.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-smartleadai` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

## Operations

This node supports a wide range of operations for managing your Smartlead.ai account:

* **Campaign Management**
    * Get all campaigns
    * Create a new campaign
    * Delete a campaign
    * Get sequence analytics for a campaign

* **Lead Management**
    * List all leads in a campaign
    * Add leads to a campaign
    * Delete a lead from a campaign

* **Email Accounts**
    * Create an email account
    * Remove an email account from a campaign

* **Webhooks**
    * Fetch all webhooks for a campaign
    * Delete a campaign webhook

* **Client Management**
    * Add a new client
    * Delete a client's API key
    * Reset a client's API key

## Credentials

To use this node, you need a Smartlead.ai API key.

1.  Log in to your [Smartlead.ai account](https://app.smartlead.ai/).
2.  Navigate to the **Settings** section.
3.  Click on **Activate API** to get your API key.
4.  Enter this key into the Smartlead API credentials in n8n.

## Compatibility

-   Minimum n8n version: **1.0.0**

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Smartlead.ai API Documentation](https://help.smartlead.ai/API-Documentation-a0d223bdd3154a77b3735497aad9419f)

## License

[MIT](https://github.com/Chris-Terminator/n8n-nodes-smartleadai/blob/master/LICENSE.md)
