import { handleCampaignUnsubscribeRequest } from './_shared/campaign-unsubscribe.mjs';

export default async (request, context) =>
  handleCampaignUnsubscribeRequest(request, { leadId: context.params.id });

export const config = {
  path: '/abmelden/:id',
};
