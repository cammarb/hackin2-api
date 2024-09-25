export type StripeAccountBody = {
  accountId: string
}

export type StripePaymentBody = {
  paymentId: string
  userId: string
  bountyId: string
  companyId: string
  memberId: string
  amount: string
  pentesterStripeAccountId: string
  companyStripeAccountId: string
}
